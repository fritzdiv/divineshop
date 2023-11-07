<template>
    <q-list class="bg-page-grey2-radial">
        <q-slide-item draggable="false" right-color="slide-item" class="q-mb-xs" @right="deleteCartItem(info.ID)" :key="info.ID">
            <template v-slot:right>
                <q-icon name="delete"/>
            </template>
            <q-item>
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
                                    <div class="text-weight-bold" style="line-height: 1rem">{{ info.Description }}</div>
                                    <!-- <div class="text-grey-8">{{ sizeCodeLabel }}</div> -->
                                </div>
                            </div>
                            <div>
                                <div class="row justify-end q-pt-xs">
                                    <div class="col" >
                                        <quantity-control :product="info"></quantity-control>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="row q-mt-sm">
                                    <div class="col-12 flex justify-between">
                                        <div class="text-black">${{ priceDefault }} per {{ info.SaleOuM }}</div>
                                        <div class="text-weight-bold">
                                            <span v-if="info.Taxable" class="text-italic">({{ formatCurrency(lineTotalBeforeTax)}} + {{tax}}% tax)</span>
                                            {{ lineTotal }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-item-section>
            </q-item>
        </q-slide-item>
    </q-list>
</template>

<script>
import QuantityControl from "src/components/QuantityControl.vue";
import { useCartStore } from 'src/stores/cart';
import { useAppStore } from 'src/stores/app';
import { useFormatter } from "../use/useFormatter";


export default {
    name: "CartItem",
    components: {
        QuantityControl,
    },
    props: {
        info: {
            type: Object,
            default: () => {
                return {};
            },
        },
        editable: {
            type: Boolean,
            default: true,
        },
        stock: {
            type: Object,
            default: () => {
                return {};
            },
        },

    },
    data() {
        return {
            qty: 0,
        };
    },
    setup() {
        const cartStore = useCartStore();
        const appStore = useAppStore();

        const { formatCurrency } = useFormatter();
        return {
            cartStore,
            appStore,
            formatCurrency,
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
        tax() {
            return this.appStore.memberData.Tax;
        },
        lineTotalBeforeTax() {
            return parseFloat(this.info.Qty * this.priceDefault);
        },
        lineTotal() {
            let v;
            if (this.info.Taxable) {
                v = this.lineTotalBeforeTax + (this.lineTotalBeforeTax * this.appStore.memberData.Tax / 100);
            } else {
                v = this.lineTotalBeforeTax;
            }
            return this.formatCurrency(v);
        },
    },
    mounted() {
        this.qty = this.info.Qty;
    },
    watch: {
        qty(newVal) {
            const newQty = parseInt(newVal);
            if (newQty > 0) {
                this.qty = newQty;
            } else {
                this.qty = 1;
            }

            // Check for entered qty and reset qty remaining stocks if not enough
            if (this.qty > this.$props.stock.Stock) {
                this.$q.notify({
                    color: 'negative',
                    position: 'top',
                    message: "Low on stocks.",
                    timeout : 300,
                    badgeStyle: "opacity: 0"
                });
                this.qty = this.$props.stock.Stock;
            }
            this.cartStore.updateItemInCart(this.updateParam(parseInt(this.qty)));
        },
    },
    methods: {
        updateParam(newQty) {
            return {
                'ID': this.info.ID,
                'Qty': newQty,
            };
        },
        updateItemQty(changeBy) {
            this.qty = this.info.Qty + changeBy;
        },
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
:deep(.q-field__native) {
    text-align: center;
}
</style>
