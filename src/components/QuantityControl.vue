<template>
    <div v-if="!isActive" class="row qtyControl justify-end q-pt-none">
        <q-icon name="add_circle_outline" color="black" size="sm" ripple @click.stop.prevent="activate"/>
    </div>
    <div v-else class="row qtyControl justify-end q-pt-none">
        <div class="col-2">
            <q-icon name="delete_outline" size="sm" class="text-red" @click.stop.prevent="deleteFromCart"/>
        </div>
        <div class="col-10">
            <q-input v-model.number="item.Qty" min="1" :max="100" maxlength="4" size="4" input-class="text-center bg-grey-4 q-pt-none" rounded dense outlined>
                <template v-slot:prepend>
                    <q-icon :name="item.Qty == 1 ? 'cancel' : 'remove_circle_outline'" color="black" size="sm" ripple @click.stop.prevent="updateItemQty(-1)"/>
                </template>
                <template v-slot:append>
                    <q-icon name="add_circle_outline" color="black" size="sm" ripple @click.stop.prevent="updateItemQty(1)"/>
                </template>
            </q-input>
        </div>
    </div>
</template>
<script>
import { useCartStore } from 'src/stores/cart';
import { useProductsStore } from 'src/stores/products';
import _ from 'lodash';

export default {
    props: {
        product: {
            type: Object,
            default: () => null,
        },
        min: {
            type: Number,
            default: 1,
        },
        max: {
            type: Number,
            default: 100,
        },
    },
    data() {
        return {
            item: null,
            isActive: false,
            isItemInCart: false,
        };
    },
    setup() {
        const cartStore = useCartStore();
        const productsStore = useProductsStore();
        return {
            cartStore,
            productsStore
        };
    },
    mounted() {
        this.updateProduct();
    },
    computed: {
        qty() {
            return this.item ? this.item.Qty : 0;
        },
    },
    watch: {
        product(newVal) {
            console.log('PRODUCT CHANGED in qty control', newVal);
            this.updateProduct();
        },
        qty(newVal) {
            console.log('ITEM QTY CHANGED', newVal);
            if (this.isActive) {
                if (newVal < this.min) {
                    this.item.Qty = this.min;
                    this.isActive = false;
                    // this.$emit("change", 0);
                    // this.$emit("delete");
                } else if (newVal >= this.min && newVal <= this.max) {
                    this.item.Qty = newVal;
                    // this.$emit("change", newVal);
                } else {
                    this.item.Qty = this.max;
                }
                this.cartStore.updateItemInCart(this.item);
            }
        },
    },
    methods: {
        async activate() {
            console.log('ACTIVATE', this.cartStore.items);
            this.item.Qty = this.min;
            await this.productsStore.getStockQty([this.product.ID]);
            this.isActive = true;
            this.cartStore.addItemToCart(this.item);
            this.isItemInCart = true;
        },
        updateProduct() {
            let cartItem = _.find(this.cartStore.items, {ID: this.product.ID});
            if (cartItem) {
                this.item = _.clone(cartItem);
                this.isItemInCart = true;
                this.isActive = true;
            } else {
                this.item = _.clone(this.product);
                this.item.Qty = 0;
            }
        },
        updateItemQty(changeBy) {
            this.item.Qty += changeBy;
            console.log('NEW QTY', this.item);
            this.cartStore.updateItemInCart(this.item);
        },
        deleteFromCart() {
            this.item.Qty = 0;
            this.cartStore.removeItemFromCart(this.item.ID);
        },
    },
};
</script>
