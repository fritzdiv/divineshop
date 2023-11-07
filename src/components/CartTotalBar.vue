<template>
    <div id="cartTotalBar" class="row q-pa-sm">
        <div class="col-12 text-center">
            <q-chip outline clickable text-color="dark" icon="shopping_cart" @click="goToCart">
                <label class="q-mr-md text-blue-9">Total amount</label>
                <strong class="text-black">{{ total }}</strong>
            </q-chip>
        </div>
    </div>
</template>
<script>
import { useAppStore } from 'src/stores/app';
import { useCartStore } from 'src/stores/cart';
import { useFormatter } from "src/use/useFormatter";

export default {
    setup() {
        const appStore = useAppStore();
        const cartStore = useCartStore();
        return {
            appStore,
            cartStore,
        };
    },
    computed: {
        total() {
            const { formatCurrency } = useFormatter();
            return formatCurrency(this.cartStore.totalsBreakdown.subTotal);
        }
    },
    methods: {
        goToCart() {
            this.$router.push("/cart");
        }
    }
}
</script>
<style scoped>
    .row {
        background-color: white;
        color: #555555;
    }
</style>
<style lang="scss">
    #cartTotalBar {
        .q-icon {
            font-size: 25px;
            border: 1px mediumvioletred solid;
            border-radius: 50px;
            color: white;
            background-color: mediumvioletred;
            margin-left: -30px;
            padding:3px;
        }
    }
</style>
