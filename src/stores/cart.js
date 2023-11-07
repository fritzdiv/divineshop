import { defineStore } from 'pinia';
import { useStorage } from "@vueuse/core";
import { graphql as graphQLApi } from 'src/api';
import { useAppStore } from 'stores/app';
import _ from 'lodash';

const appStore = useAppStore();

export const useCartStore = defineStore('cart', {
    state: () => {
        return ({
            cartItems: useStorage('cart', []),
            hstTaxPercentage: 13,
            shippingOption: 'delivery',
            submitSalesOrderResult: null,
        });
    },
    getters: {
        items: (state) => state.cartItems,
        itemsCount: (state) => {
            return state.cartItems.length;
        },
        hstPercentage: (state) => state.hstTaxPercentage,
        itemsSubTotal: (state) => {
            const tax = appStore.memberData ? appStore.memberData.Tax : state.hstTaxPercentage;
            let subTotal = 0;
            _.forEach(state.items, (i) => {
                if(!i.Taxable) {
                    subTotal += i.Qty * i.DiscountedDefaultPrice;
                } else {
                    let total = i.Qty*i.DiscountedDefaultPrice;
                    let plusTax = total * (tax/100);
                    subTotal += total + plusTax;
                }
            });
            return subTotal;
        },
        deliveryCharge: (state) => {
            const itemsSubTotalBeforeTax = (state) => {
                const tax = appStore.memberData ? appStore.memberData.Tax : state.hstTaxPercentage;
                let subTotal = 0;
                _.forEach(state.items, (i) => {
                    subTotal += i.Qty * i.DiscountedDefaultPrice;
                });
                return subTotal;
            }
            let charge = 0;
            //let subTotal = state.itemsSubTotal;
            let subTotal = itemsSubTotalBeforeTax(state);
            if (state.shippingOption === 'delivery' && appStore.deliveryChargeScheme) {
                let rule = _.find(appStore.deliveryChargeScheme, (o) => {
                    return subTotal >= o.From && subTotal <= o.To;
                });
                charge = rule.Amount;
            }
            return charge;
        },
        totalsBreakdown: (state) => {
            const subTotal = state.itemsSubTotal;
            let total = subTotal;
            let breakdown = { subTotal,  total };
            if (state.shippingOption === 'delivery') {
                const deliveryCharge = state.deliveryCharge;
                const deliveryChargeTax = deliveryCharge <= 500 ? state.deliveryCharge * 0.13 : 0;
                total += deliveryCharge + deliveryChargeTax;
                breakdown = { subTotal, deliveryCharge, deliveryChargeTax, total };
            }
            return breakdown;
        },
        submitOrderResult: (state) => state.submitSalesOrderResult,
    },
    actions: {
        addItemToCart (item) {
            // check if the item is already in the cart
            const itemInCart = _.find(this.cartItems, {'ID': item.ID});
            item.WarehouseQty = [];
            if (itemInCart) {
                const itemInCart = _.find(this.cartItems, {'ID': item.ID});
                _.merge(itemInCart, item);
            } else {
                this.cartItems.push(item);
            }
        },
        updateItemInCart(item) {
            const itemInCart = _.find(this.cartItems, {'ID': item.ID});
            _.merge(itemInCart, item);
        },
        removeItemFromCart(itemID){
            const i = this.cartItems.map(item => item.ID).indexOf(itemID)
            this.cartItems.splice(i, 1)
        },
        clearCart() {
            this.cartItems = [];
        },
        async getProductWarehouseQuantity(payload) {
            //console.log('GETTING WAREHOUSE QUANTITIES STORE PAYLOAD', payload);
            let item = _.find(this.cartItems, (o) => {
                return o.ID == payload.ProductID;
            });
            if (item) {
                const result = await graphQLApi.postRequest('productWarehouseQuantity', payload);
                item.WarehouseQty[payload.WarehouseID] = result.data.data.ProductQuantityAtWarehouse;
            }
        },
        async submitOrder(payload) {
            //console.log('SUBMIT ORDER PAYLOAD', payload);
            const result = await graphQLApi.postRequest('submitOrder', payload);
            this.submitSalesOrderResult = result.data.data.ProcessOrder;
        },
        setShippingOption(method) {
            this.shippingOption = method;
        },
    }

});
