<template>
    <q-layout v-if="isReady" view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar class="q-px-none q-py-sm">
                <q-btn v-if="appStore.isLoggedIn" flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer"/>
                <q-toolbar-title>
                    <label class="q-pl-md text-weight-bold">Divine Shop</label>
                    <!--<img src="/images/logo.png" alt="Logo" height="28" class="q-mt-sm q-ml-sm" />-->
                </q-toolbar-title>
                <div class="float-right">
                    <q-input v-show="isSearchActive === true" v-model="searchString" rounded dense outlined clearable
                             bg-color="white" class="q-pr-sm"
                             @focus="isSearchActive = true"
                             @blur="checkSearchReset"></q-input>
                    <q-btn v-show="isSearchActive === false" flat round dense icon="search" class="q-mr-xs" @click="isSearchActive = true"/>
                </div>
            </q-toolbar>
            <!--
            <div v-if="appStore.primaryPromo" class="row">
                <div class="col-12">
                    <promo-display :promotion="appStore.primaryPromo" height="150px" :show-name="true"></promo-display>
                </div>
            </div>
            -->
        </q-header>
        <q-drawer v-if="appStore.isLoggedIn" v-model="leftDrawerOpen" show-if-above bordered>
            <div class="row justify-left items-center q-pt-lg q-pb-sm">
                <q-item v-ripple clickable @click='$router.push({name:"account"})'>
                    <q-item-section side>
                        <q-avatar rounded size="30px">
                            <q-avatar color="active-menu"></q-avatar>
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="text-h6 text-green-8 text-weight-bold">{{ appStore.memberFullName }}</q-item-label>
                        <q-item-label class="text-subtitle2">{{ appStore.member.Email }}</q-item-label>
                    </q-item-section>
                </q-item>
            </div>
            <q-separator color="orange" inset/>
            <div class="row">
                <div class="col q-pt-lg q-px-md">
                    <q-list>
                        <sidebar-link v-for="link in sidebarLinks"
                                      :key="link.title"
                                      :title="link.title"
                                      :route-name="link.routeName"
                                      :icon="link.icon" />
                    </q-list>
                    <div style="position: absolute; bottom:30px; right:25px">
                        <div class="col text-center align-center">
                            <q-btn color="grey-6" label="Log out" icon-right="logout" @click="logout()" rounded ripple no-caps />
                        </div>
                    </div>
                </div>
            </div>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
        <q-footer>
            <cart-total-bar />
        </q-footer>
    </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import SidebarLink from 'components/SidebarLink.vue';
import CartTotalBar from 'components/CartTotalBar.vue';
// import PromoDisplay from 'components/PromoDisplay.vue';
import { useAppStore } from 'src/stores/app';
import { useCartStore } from 'src/stores/cart';
import { useProductsStore } from 'stores/products';
import _ from 'lodash';

const linksList = [
    {
        title: 'Home',
        icon: 'home',
        routeName: 'home'
    },
    {
        title: 'Cart',
        icon: 'shopping_cart',
        routeName: 'cart'
    },
];

export default defineComponent({
    name: "MainLayout",
    components: {
        CartTotalBar,
        SidebarLink,
        // PromoDisplay
    },
    data() {
        return {
            searchString: '',
            isSearchActive: false,
        }
    },
    async created() {
        console.log('GETTING App General Settings');
        this.appStore.getAppGeneralSettings();
    },
    setup() {
        const isReady = ref(false);
        const leftDrawerOpen = ref(false);
        const appStore = useAppStore();
        const cartStore = useCartStore();
        const productStore = useProductsStore();

        return {
            appStore,
            cartStore,
            productStore,
            sidebarLinks: linksList,
            isReady,
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value;
            },
        };
    },
    async mounted() {
        console.log('MOUNTING MAINLAYOUT');
        /*
        if (!this.appStore.member) {
            console.log('WALA');
            await this.appStore.getMemberInfo();
        }
         */
        this.isReady = true;
    },
    watch: {
        searchString(newVal) {
            this.productStore.setSearchString(newVal);
        },
    },
    methods: {
        checkSearchReset() {
            if (this.searchString == '' || _.isNull(this.searchString)) {
                this.isSearchActive = false;
            }
        },
        logout() {
            this.appStore.logout();
            this.cartStore.clearCart();
            setTimeout( () => { this.$router.push({name: 'login'}) },1000);
        }
    },
});
</script>
