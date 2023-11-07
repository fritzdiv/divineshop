<template>
    <q-page>
        <div v-if="appStore.primaryPromo" class="row primaryPromo">
            <div class="col-12">
                <promo-display :promotion="appStore.primaryPromo" :show-name="true"></promo-display>
            </div>
        </div>
        <div class="row bg-page-grey-radial" style="position: sticky; z-index: 999" :style="this.$q.platform.is.ios ? 'top: 90px' : 'top: 40px'">
            <div id="categoriesHeader" class="col-12 bg-grey-1">
                <div class="row q-pl-md overflow-auto hide-scroll-bar no-wrap">
                    <template v-for="(category, index) in productCategories" :key="index">
                        <category-button
                            :active="currentCategory === category.ID"
                            :name="category.Name"
                            @click="currentCategory = category.ID"
                        />
                    </template>
                </div>
            </div>
        </div>
        <div v-if="appStore.secondaryPromo" class="row">
            <div class="col-12">
                <promo-display :promotion="appStore.secondaryPromo" height="150px"></promo-display>
            </div>
        </div>
        <div class="row">
            <div  class="col-12">
                <div v-if="!isLoadingProducts">
                    <div v-for="(cat, index) in categoryProducts" :key="index">
                        <div v-show="(currentCategory == 0 || cat.ID == currentCategory) && cat.Products.length">
                            <div class="row">
                                <div class="col q-mx-md q-pt-md">
                                    <label class="text-subtitle1 text-weight-bold text-blue-9">{{ cat.Name }}</label>
                                </div>
                            </div>
                            <div class="row" :class="categoryClass(cat.ID)">
                                <div v-for="(product, id) in cat.Products" :key="id" :class="itemWidthClass(cat.Products.length)" class="q-px-sm q-pb-md">
                                    <item :info="product"
                                          :show-cart-quantity-control="true"
                                          class="full-height"/>
                                </div>
                                <div v-if="!cat.Products.length" class="q-pa-xl text-center bg-white full-width" style="font-size: 16px">
                                    <p>No products found.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-else>
                    <div v-for="n in 9" :key="n" class="col-sm-4 col-6 q-px-sm q-pb-md">
                        <item-skeleton/>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script>
import { defineComponent } from "vue";
import CategoryButton from "src/components/CategoryButton.vue";
import Item from "src/components/Item.vue";
import ItemSkeleton from "src/components/ItemSkeleton.vue";
import PromoDisplay from 'components/PromoDisplay.vue';
import { useProductsStore } from 'stores/products';
import { useAppStore } from 'stores/app';
import _ from 'lodash';
import {
    FirebaseMessaging,
} from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";

export default defineComponent({
    name: "IndexPage",
    components: { CategoryButton, Item, ItemSkeleton, PromoDisplay },
    data() {
        return {
            currentCategory: 0,
            isLoadingProducts: true,
        };
    },
    setup() {
        /*
        FirebaseMessaging.addListener("notificationReceived", (event) => {
            console.log("notificationReceived: ", { event });
        });
        FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
            console.log("notificationActionPerformed: ", { event });
        });
         */

        const appStore = useAppStore();
        const productsStore = useProductsStore();
        return {
            appStore,
            productsStore
        };
    },
    async mounted() {
        console.log('MESSAGING TOKEN', this.appStore.$state['messagingToken']);

        // await this.productsStore.getCategories();
        // console.log('RETRIEVING PRODUCTS');
        await this.productsStore.getProducts();
        if (this.productsStore.categories.length) {
            // this.currentCategory = this.productsStore.categories[0].ID;
            this.isLoadingProducts = false;
        }
        await this.appStore.getWarehouses();

        // push notification messaging
        if (!this.appStore.$state['messagingToken']) {
            await this.requestPushNotificationPermissions();
        }
    },
    computed: {
        products() {
            let prods = this.productsStore.products;
            if (this.productsStore.products.length && this.productsStore.searchString) {
                const searchString = this.productsStore.searchString.toLowerCase();
                prods = this.productsStore.products.filter((p) => {
                    if (p.Description && p.SecondCollectionName) {
                        return p.Description.toString().toLowerCase().includes(searchString) ||
                            p.SecondCollectionName.toString().toLowerCase().includes(searchString);
                    }
                    return false;
                });
            }
            return prods;
        },
        categoryProducts() {
            let catProds = _.clone(this.productsStore.categories);
            if (catProds.length) {
                _.forEach(catProds, (c) => {
                    c.Products = this.products.filter((p) => {
                        return p.SecondCollectionID === c.ID;
                    });
                });
            }
            // console.log('CATEGORY PRODUCTS', catProds);
            return catProds;
        },
        productCategories() {
            let cats =_.clone(this.productsStore.categories);
            cats.push({
                ID: 0,
                Name: 'All'
            });
            return _.sortBy(cats, 'ID');
        },
        searchString() {
            return this.productsStore.searchString;
        },
    },
    watch: {
        searchString(newVal) {
            this.currentCategory = 0;
        },
    },
    methods: {
        categoryClass(catID) {
            return this.currentCategory === catID ? '' : 'overflow-auto hide-scroll-bar no-wrap';
        },
        itemWidthClass(productCount) {
            let c = 'col-sm-3 col-5 col-3-5';
            if (productCount === 1) {
                c = 'col col-sm-6';
            } else if (productCount === 2) {
                c = 'col-6 col-sm-3';
            } else if (this.currentCategory) {
                c = 'col-6 col-sm-4';
            }
            return c;
        },
        async requestPushNotificationPermissions() {
            const result = await FirebaseMessaging.requestPermissions();
            console.log('FIREBASE PERMISSION', result);
            this.messagingPermission = result.receive;
            this.appStore.$state['messagingPermission'] = result.receive;
            await this.getPushNotificationToken();
        },
        async getPushNotificationToken() {
            const result = await FirebaseMessaging.getToken();
            console.log('FIREBASE TOKEN', result);
            this.appStore.messagingToken = result.token;
            /*
            const options = {
                vapidKey: environment.firebase.vapidKey,
            };
            const { token } = await FirebaseMessaging.getToken(options);
            this.token = token;
             */
        }
    },
});
</script>

<style lang="scss" scoped>
.primaryPromo {
    background-color: $primary;
}

@media screen and (min-width: 768px){
    .col-3-5 {
        width: 30%;
    }
}
</style>
