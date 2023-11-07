<template>
    <template v-if="items.length > 0 || step === 'done'">
        <q-header v-if="items.length > 0 || step === 'done'" elevated>
            <q-toolbar class="q-px-none q-py-sm">
                <q-btn flat dense round icon="arrow_back" aria-label="Menu" @click="step == 'shippingInfo' ? $router.go(-1) : step = 'shippingInfo'"/>
                <q-toolbar-title>
                    <div class="text-center">
                        Shopping Cart
                        <span class="text-caption">( {{ items.length }} items )</span>
                    </div>
                </q-toolbar-title>
                <div class="float-right q-px-sm">
                    <button-home />
                </div>
            </q-toolbar>
        </q-header>
        <q-page v-if="step == 'shippingInfo'" class="bg-grey-2">
            <div>
                <div class="col-12">
                    <!-- cart product -->
                    <cart-item v-for="(item, index) in items" :key="index" :info="item" :stock="getStockByItemId(item.ID)"/>
                    <!-- cart product -->
                </div>
            </div>
            <q-footer class="bg-white t-z-auto" bordered>
                <div class="full-width">
                    <q-tabs v-model="shippingOption" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
                        <q-tab name="delivery" label="Delivery" />
                        <q-tab name="pickup" label="Pickup" />
                    </q-tabs>
                    <q-separator />
                    <q-tab-panels v-model="shippingOption" animated>
                        <q-tab-panel name="delivery" class="text-black">
                            <div class="row">
                                <div class="col-12">
                                    <q-select ref="shippingAddress"
                                              v-model="shippingAddress"
                                              :options="addresses"
                                              :rules="[val => !!val || 'Address is required']"
                                              filled outlined>
                                        <template v-slot:prepend>
                                            <q-icon name="place" color="primary" />
                                        </template>
                                    </q-select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="row col-6">
                                    <!-- <a style="text-decoration: underline" @click="gotoAddressPage">My addresses</a> -->
                                    <q-btn label="My Addresses" outline size="sm" color="dark" icon="house" @click="gotoAddressPage"></q-btn>
                                </div>
                                <div class="col-6 text-right">
                                    <q-btn label="New Address" outline size="sm" color="dark" icon="add" @click="showAddressForm"></q-btn>
                                </div>
                            </div>
                            <address-form ref="newAddress"></address-form>
                        </q-tab-panel>
                        <q-tab-panel name="pickup">
                            <div class="row q-gutter-md">
                                <div class="col">
                                    <div class="text-black q-px-sm q-pt-none">You will be notified by our staff when your order is ready for pickup.</div>
                                    <q-select ref="warehouse"
                                              v-model="warehouse"
                                              :options="pickupLocations"
                                              :rules="[val => !!val || 'Warehouse is required']"
                                              label="Pickup from warehouse" outlined filled
                                    />
                                </div>
                            </div>
                        </q-tab-panel>
                    </q-tab-panels>
                </div>
                <div class="text-black q-px-md q-py-sm" style="border-top: 2px solid green">
                    <order-total-summary></order-total-summary>
                    <q-btn glossy rounded size="sm" color="deep-orange"
                           class="float-right"
                           label="Proceed"
                           @click="checkAndProceedToConfirm">
                    </q-btn>
                </div>
            </q-footer>
        </q-page>
        <!-- Step 2: Purchase Confirmation -->
        <q-page v-else class="bg-grey-2">
            <div>
                <div class="bg-page-grey2-radial">
                    <cart-item-no-slide v-for="(item, index) in items" :key="index" :info="item" :editable="false"/>
                    <hr/>
                    <div class="text-black q-pa-md bg-amber-1">
                        <order-total-summary></order-total-summary>
                    </div>
                    <q-card flat>
                        <q-card-section v-if="shippingOption === 'pickup'">
                            <div class="col-12 text-bold q-mb-sm gg-grey-2">Shipment mode: Pickup</div>
                            <div class="col-12 q-mb-sm">You will be notified by out staff when to pick up the items you have purchased.</div>
                        </q-card-section>
                        <q-card-section v-else>
                            <div class="col-12 text-subtitle1 q-mb-sm gg-grey-2">Delivery Information</div>
                            <div class="row q-gutter-md q-pa-md">
                                <div class="col-1">
                                    <q-icon size="sm" color="black" name="place" />
                                </div>
                                <div class="col">
                                    {{ shippingAddress.label }}
                                </div>
                            </div>
                            <div class="row q-gutter-md q-px-md q-py-sm">
                                <div class="col text-italic">
                                    Our staff will contact you regarding the schedule of delivery.
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <q-footer class="bg-white flex justify-between" bordered>
                <div class="col q-pa-md text-right">
                    <q-btn glossy rounded size="sm" color="deep-orange"
                           class="float-right"
                           label="Place Order"
                           @click="prepOrderAndSubmit">
                    </q-btn>
                </div>
            </q-footer>
            <order-response ref="orderResponse"></order-response>
        </q-page>
    </template>
    <div v-else>
        <q-page class="justify-center flex-center bg-grey-3 q-py-xl q-px-lg text-center">
            <div class="q-pt-xl">
                <svg xmlns="http://www.w3.org/2000/svg" height="200px" viewBox="0 0 24 24" width="200px" fill="#9c9fac">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path
                        d="M1.41 1.13L0 2.54l4.39 4.39 2.21 4.66-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h7.46l1.38 1.38c-.5.36-.83.95-.83 1.62 0 1.1.89 2 1.99 2 .67 0 1.26-.33 1.62-.84L21.46 24l1.41-1.41L1.41 1.13zM7 15l1.1-2h2.36l2 2H7zM20 4H7.12l2 2h9.19l-2.76 5h-1.44l1.94 1.94c.54-.14.99-.49 1.25-.97l3.58-6.49C21.25 4.82 20.76 4 20 4zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/>
                </svg>
            </div>
            <div class="text-subtitle1 text-center text-weight-bold text-green-8">
                Your cart is empty
            </div>
            <p class="q-pt-lg text-center">Explore around to add items in your shopping cart</p>
            <q-btn class="glossy q-mt-xl" rounded color="deep-orange" label="Continue Shopping" @click="$router.push('/')"/>
        </q-page>
    </div>
</template>

<script>
import CartItem from "src/components/CartItem.vue";
import CartItemNoSlide from 'components/CartItemNoSlide.vue';
import OrderTotalSummary from 'components/OrderTotalSummary.vue';
import AddressForm from 'src/components/AddressForm.vue';
import OrderResponse from 'components/OrderResponse.vue';
import ButtonHome from 'src/components/ButtonHome.vue';
import { useAppStore } from 'src/stores/app';
import { useCartStore } from 'src/stores/cart';
import { useFormatter } from "../use/useFormatter";
import _ from 'lodash';
import { date } from 'quasar';

export default {
    components: {
        AddressForm,
        CartItemNoSlide,
        CartItem,
        OrderTotalSummary,
        OrderResponse,
        ButtonHome,
    },
    name: "ShoppingCart",
    setup() {
        const appStore = useAppStore();
        const cartStore = useCartStore();
        const { formatCurrency } = useFormatter();
        return {
            appStore,
            cartStore,
            formatCurrency,
        };
    },
    data() {
        return {
            step: 'shippingInfo',
            updatedItems: [],
            outOfStockItems: [],
            stocks: [],
            shippingOption: 'delivery',
            shippingAddress: null,
            warehouse: null,
        }
    },
    mounted() {
        this.warehouse = this.pickupLocations[0];
    },
    watch: {
        shippingOption(newVal) {
            this.cartStore.setShippingOption( newVal );
        },
    },
    computed: {
        items() {
            return this.cartStore.items;
        },
        member() {
            return this.appStore.member;
        },
        addresses() {
            const addr = _.map(this.member.Address, (v) => {
                return {
                    id: v.ID,
                    label: v.AddressLine,
                };
            });
            console.log('ADDRESS', addr);
            return addr;
        },
        shippingDateNice() {
            let result = 'To be scheduled';
            if (this.shippingDate) {
                const d = new Date(this.shippingDate);
                result = date.formatDate(d, 'MMMM DD, YYYY');
            }
            return result;
        },
        shipDate() {
            const d = new Date();
            return date.formatDate(d, 'YYYY-MM-DD');
        },
        orderIsSuccessful() {
            return _.has(this.cartStore.submitOrderResult, 'Data');
        },
        pickupLocations() {
            return _.map(_.filter(this.appStore.warehouses, {'Status': 'active', 'AllowPicking': true}), (loc) => {
                return {
                    ...loc,
                    label: loc.Location,
                    value: loc.ID,
                    FullAddress: `${loc.StreetName}, ${loc.City}, ${loc.Province} ${loc.PostalCode}`,
                    PickupHours: JSON.parse(loc.PickupHours),
                    PickupTimeLimits: JSON.parse(loc.PickupTimeLimits),
                }
            });
        },
    },
    methods: {
        gotoAddressPage() {
            this.$router.push("/manage-addresses");
        },
        getStockByItemId(id) {
            return this.stocks.find(stock => stock.ID === id);
        },
        getShippingInfo() {
            this.$router.push("shippinginfo");
        },
        showAddressForm() {
            this.$refs.newAddress.show();
        },
        checkAndProceedToConfirm() {
            if (this.shippingOption === 'delivery') {
                if (this.shippingAddress) {
                    this.step = 'confirm';
                } else {
                    console.log('TRIGGERING ADDRESS CLICK', this.$refs);
                    this.$refs.shippingAddress.showPopup();
                }
            } else {
                this.step = 'confirm';
            }
        },
        async prepOrderAndSubmit() {
            if (!this.submitButtonClicked) {
                this.submitButtonClicked = true;
                const CartItems = _.map(this.items, (o) => {
                    return {
                        ID: o.ID,
                        Quantity: o.Qty,
                    };
                });
                const ShippingInfo = {
                    "WarehouseID": this.warehouse ? this.warehouse.ID : 1,
                    "AddressID": this.shippingAddress ? this.shippingAddress.id : 0,
                    "Type": this.shippingOption.toLowerCase(),
                    "ShippingDate": this.shipDate,
                };
                console.log('ORDER PAYLOAD', {CartItems: CartItems, ShippingInfo: ShippingInfo});
                await this.cartStore.submitOrder({CartItems: CartItems, ShippingInfo: ShippingInfo});
                if (this.orderIsSuccessful) {
                    console.log('ORDER IS SUCCESSFUL');
                    this.step = 'done';
                    this.$refs.orderResponse.show();
                    this.cartStore.clearCart();
                }
            }
        },
    },
};
</script>
