<template>
    <q-header elevated>
        <q-toolbar class="q-px-none q-py-sm">
            <span @click="back" class="material-icons text-h5 q-ml-sm">
                arrow_back
            </span>
            <q-toolbar-title> </q-toolbar-title>
            <div class="float-right q-px-sm">
                <button-home />
            </div>
        </q-toolbar>
    </q-header>
    <q-page v-if="info" class="bg-grey-3">
        <div style="position: sticky; z-index: 1">
            <div class="col">
                <div class="bg-grey-1 flex items-center justify-center" >
                    <q-img
                        :src="info.LargeImage"
                        spinner-color="dark"
                        spinner-size="82px"
                        fit="contain"
                        width="100%"
                        height="30vh"
                    />
                </div>
                <p v-if="discount" class="text-h5 discountBadge shadow-3">
                    {{ discount }}%
                </p>
            </div>
            <div class="col q-px-md q-py-sm bg-white">
                <div class="text-weight-bold text-subtitle1" style="line-height: 1.2rem">
                    {{ info.Description }}
                </div>
                <div class="row flex justify-start">
                    <div class="col">
                        <span class="text-uppercase text-grey-8 ">{{ info.SecondCollectionName }}</span>
                    </div>
                    <div class="col text-right">
                        <label  v-if="stock.IsOutOfStock">Out of Stock</label>
                        <label v-else>In Stock {{ stockQty }}</label>
                    </div>
                </div>
            </div>
            <div class="col-12 bg-amber-1">
                <div class="row q-px-md q-py-sm">
                    <div class="col">
                        <div>Price : ${{ displayDiscountedPrice }}</div>
                        <div>Subtotal: {{ subTotal }}</div>
                    </div>
                    <div class="col">
                        <quantity-control :product="product"></quantity-control>
                    </div>
                </div>
            </div>
            <!--
            <div class="col-12 bg-amber-1">
                <div v-if="relatedProducts.length" class="flex justify-between q-py-sm q-px-md items-center">
                    <div class="text-weight-medium text-subtitle1">Related Products</div>
                    <p v-if="relatedProducts.length > 3" class="text-red-8" @click="goToAllRelatedProducts">See All</p>
                </div>
            </div>
            -->
        </div>

        <div class="col-12 q-mt-md">
            <div class="row">
                <div v-for="(item, id) in relatedProducts" :key="id" class="col-sm-4 col-6 q-px-sm q-pb-md">
                    <item :info="item" class="full-height" @click="goToProduct(item) "/>
                </div>
            </div>
        </div>
        <q-footer>
            <cart-total-bar />
        </q-footer>
    </q-page>
</template>

<script>
import Item from "src/components/Item.vue";
import QuantityControl from "src/components/QuantityControl.vue";
import CartTotalBar from 'src/components/CartTotalBar.vue';
import ButtonHome from 'src/components/ButtonHome.vue';
import { Notify } from 'quasar';
import _ from 'lodash';
import { useProductsStore } from 'src/stores/products';
import { useCartStore } from 'src/stores/cart';
import { useFormatter } from "../use/useFormatter";

export default {
    name: "Product",
    components: {
        Item,
        QuantityControl,
        CartTotalBar,
        ButtonHome,
    },
    data() {
        return {
            addToCartDialog: false,
            itemQuantity: 0,
            stock: {},
            totalPrice: 0.00,
        };
    },
    setup() {
        const productsStore = useProductsStore();
        const cartStore = useCartStore();
        const { formatCurrency } = useFormatter();
        return {
            productsStore,
            cartStore,
            formatCurrency,
        };
    },
    async mounted() {
        await this.productsStore.getStockQty([this.productId]);
        console.log('PRODUCT', this.product);
        this.itemQuantity = this.product.Qty === undefined ? 0 : parseInt(this.product.Qty);
        if (!this.info) {
            this.$router.push('/');
        }
    },
    watch: {
        info(newVal, oldVal) {
            if (newVal) {
                // if the item is not equal to current the selected item and not in cart
                if (newVal.ID !== oldVal.ID) {
                    this.itemQuantity = 1;
                } else {
                    this.itemQuantity = this.product.Qty === undefined ? 1 : parseInt(this.product.Qty);
                }
            }
        },
        itemQuantity(newVal) {
            if (this.itemQuantity > this.currentProduct.RemainingQty) {
                this.$q.notify({
                    color: 'negative',
                    position: 'top',
                    message: "Low on stocks.",
                    timeout : 500,
                    badgeStyle: "opacity: 0"
                });
                this.itemQuantity = this.stock.Stock;
            }
        }
    },
    computed: {
        productId() {
            return parseInt(this.$route.params.id);
        },
        currentProduct() {
            return this.productsStore.currentProduct;
        },
        stockQty() {
            return this.currentProduct ? this.currentProduct.RemainingQty : 0;
        },
        // Product cart item details
        product() {
            let prod = null;
            if (this.cartStore.items.length) {
                prod = _.find(this.cartStore.items, {ID: Number(this.productId)});
            }
            if (!prod) {
                prod = _.find(this.productsStore.products, {ID: Number(this.productId)});
            }
            return prod;
        },
        info() {
            const prod = _.find(this.productsStore.products, {ID: Number(this.productId)});
            if (prod) {
                return {...prod, ...this.stock};
            }
            return null;
        },
        relatedProducts() {
            let items = null;
            if (this.info) {
                const collectionName2nd = this.info.SecondCollectionName;
                const categoryProducts = _.filter(this.productsStore.products, {'SecondCollectionName': collectionName2nd});
                items = _.filter(categoryProducts, (o) => {
                    return o.ProductCollectionID === this.info.ProductCollectionID && o.ID != this.info.ID;
                });
                if (items.length < 5) {
                    _.forEach(categoryProducts, (v) => {
                        if (!items.includes(v)) {
                            items.push(v);
                        }
                        if (items.length >= 5) {
                            return false;
                        }
                    });
                }
            }
            return items;
        },
        discount() {
            return this.info.PromoDiscount && this.info.PromoValid ? parseFloat(100 * this.info.PromoDiscount).toFixed(0) : 0;
        },
        displayRegularPrice() {
            return this.info.DefaultPrice;
        },
        displayDiscountedPrice() {
            return `${this.info.DiscountedDefaultPrice} per ${this.info.SaleOuM}`;
        },
        displayRegularPriceSF() {
            return this.info.SFPrice;
        },
        displayDiscountedPriceSF() {
            return `${this.info.DiscountedSFPrice} per SF`;
        },
        classRegularPrice() {
            return this.info.SFPrice ? 'text-dark font-weight-bold' : 'text-red-8 text-weight-bold';
        },
        subTotal() {
            console.log('SUBTOTAL', this.info.DiscountedDefaultPrice);
            return _.has(this.product, 'Qty') ?
                this.formatCurrency(parseInt(this.product.Qty) * parseFloat(this.info.DiscountedDefaultPrice)) :
                '$0.00';
        },
    },
    methods: {
        isOutOfstock() {
            return this.currentProduct.RemainingQty <= 0;
        },
        goToProduct(item) {
            this.$router.push("/product/" + item.ID);
        },
        goToAllRelatedProducts() {
            this.setSearchString(this.info.SecondCollectionName);
            const allCategoryIds = _.map(this.categories, (o) => {
                return o.ID;
            });
            this.setSearchCategories(allCategoryIds);
            this.$router.push('/all-products');
        },
        back() {
            this.$router.go(-1);
        },
    },
};
</script>
<style lang="scss" scoped>
:deep(.q-field__native) {
    text-align: center;
}

:deep(.q-tab__label) {
    font-size: 10px;
    @media screen and (min-width: 362px){
        font-size: 14px;
    }
}
</style>
