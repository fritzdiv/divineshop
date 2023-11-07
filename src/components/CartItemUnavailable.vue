<template>
    <q-list class="bg-page-grey2-radial">
        <q-item class="bg-grey-2">
            <q-item-section avatar>
                <router-link :to="{name:'product', params: { id: info.ID } }">
                    <div class="imgWrap col-2 cursor-pointer bg-grey-1 q-px-sm">
                        <q-img class="t-rounded-xl"
                               :src="info.ThumbNail"
                               fit="contain"
                               height="100%"
                               width="100%"
                               no-spinner
                        />
                        <p v-if="info.PromoDiscount" class="discountBadgeThumbNail">
                            {{ discount }}%
                        </p>
                    </div>
                </router-link>
            </q-item-section>
            <q-item-section>
                <div class="row">
                    <div class="col q-pl-sm">
                        <div class="row">
                            <div class="col">
                                <div class="text-weight-bold">{{ info.Description }}</div>
                                <div class="text-grey-8">{{ sizeCodeLabel }}</div>
                            </div>
                        </div>
                        <div class="row justify-between q-py-sm text-red">
                            Out of Stock
                        </div>
                    </div>
                </div>
            </q-item-section>
        </q-item>
    </q-list>
</template>

<script>
import { useCartStore } from 'src/stores/cart';

export default {
    name: "CartItemUnavailable",
    props: {
        info: {
            type: Object,
            default: () => {
                return {};
            },
        }
    },
    data() {
        return {
            qty: 0,
        };
    },
    setup() {
        const cartStore = useCartStore();
        return {
            cartStore,
        };
    },
    computed: {
        discount() {
            return parseFloat(100 * this.info.PromoDiscount).toFixed(0);
        },
        sizeCodeLabel() {
            const label = [];
            if (this.info.Size && this.info.Size !== "0x0" && this.info.Size !== "x") {
                label.push('Size: ' + this.info.Size);
            }
            label.push('Item: ' + this.info.Code);
            return label.join(' | ');
        },
        priceDefault() {
            return this.info.DiscountedDefaultPrice;
        },
        priceSF() {
            return this.info.DiscountedSFPrice;
        },
        lineTotal() {
            const v = this.qty * this.priceDefault;
            return v.toLocaleString('en-CA')
        },
    },
    methods: {
        deleteCartItem(id) {
            this.cartStore.removeItemFromCart(id);
        },
    },
};
</script>
<style lang="scss" scoped>
.imgWrap {
    width: 5rem;
    height: 5rem;
    border-radius: 0.75rem;
    background-color: #eaeaea;
    position: relative;
}

.cartItemQty {
    font-size: 1.125rem;
    line-height: 1.75rem;
    text-align: center;
    height: 2rem;
    width: 4.35rem;
    border: 1px solid #cdcdcd;
    margin: 0.1rem;
}

.discountBadge {
    top: 0 !important;
    right: 0 !important;
}

:deep(.bg-slide-item) {
    background: rgb(131,58,180);
    background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%) !important;
}
</style>
