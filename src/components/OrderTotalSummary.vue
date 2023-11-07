<template>
    <div>
        <div v-if="cartStore.totalsBreakdown.deliveryCharge" class="row justify-between">
            <div>Delivery charge <q-icon name="info" style="font-size: 20px" color="blue" @click="deliveryFeeDialog"/></div>
            <div>${{ cartStore.totalsBreakdown.deliveryCharge.toFixed(2) }}</div>
        </div>
        <div class="row justify-between">
            <div>Delivery tax</div>
            <div>{{!cartStore.totalsBreakdown.deliveryChargeTax ? 'Free' :`$${cartStore.totalsBreakdown.deliveryChargeTax?.toFixed(2)}`}}</div>
        </div>
        <div class="row justify-between text-weight-bold text-subtitle1 q-pt-sm">
            <div class="text-green-8">TOTAL</div>
            <div>{{ formatCurrency(cartStore.totalsBreakdown.total) }}</div>
        </div>
    </div>
</template>

<script>
import { useCartStore } from 'src/stores/cart';
import { useFormatter } from "../use/useFormatter";
import { Dialog } from "quasar";


export default {
    name: 'OrderTotalSummary',
    props: {
        message: {
            type: String,
            default:'',
        },
    },
    setup() {
        const cartStore = useCartStore();
        const { formatCurrency } = useFormatter();
        return {
            cartStore,
            formatCurrency
        };
    },
    methods: {
        deliveryFeeDialog() {
            Dialog.create({
                title: 'Delivery Charge',
                message: this.message,
                html: true
            }).onOk(() => {
                // console.log('OK')
            });
        }
    }
};
</script>
<style scoped>
</style>
