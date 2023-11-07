import { ref } from "vue";
import { useCartStore } from 'src/stores/cart';
import { useApi } from "../use/useApi";

export function useCart() {
    const availableItems = ref([]);
    const unAvailableItems = ref([]);
    const remainingStocks = ref([]);
    const cartStore = useCartStore();
    const { tsQuery } = useApi();

    const clearCart = () => {
        cartStore.clearCart();
    }

    const getAvailableItems = () => {
        const items = cartStore.items;
        const orders = items.map(item => {
            return {
                ID: parseInt(item.ID),
                Quantity: parseInt(item.Qty)
            }
        });

        return tsQuery({
            query: `query AvailableProductsIDs($OrderQuantity: [InputOrderQuantity]) {
                  AvailableProductsIDs(OrderQuantity: $OrderQuantity)
                }`,
            variables: {
                OrderQuantity: orders
            }
        }).then(res => {
            let availableProductsIDs = res.data.data.AvailableProductsIDs;
            availableItems.value = items.filter(item => {
                if(availableProductsIDs.includes(item.ID)) {
                    return item;
                }
            });

            return availableItems.value;
        });
    }

    // To get the unavailable items. You must Use it before calling replaceCartItems from cart action. replaceCartItems action overwrites the state so this function will not return the desired result when use after.
    const getUnAvailableItems = () => {
        const items = store.getters["cart/items"];
        const orders = items.map(item => {
            return {
                ID: parseInt(item.ID),
                Quantity: parseInt(item.Qty)
            }
        });

        return tsQuery({
            query: `query NotAvailableProductsIDs($OrderQuantity: [InputOrderQuantity]) {
                  NotAvailableProductsIDs(OrderQuantity: $OrderQuantity)
                }`,
            variables: {
                OrderQuantity: orders
            }
        }).then(res => {
            unAvailableItems.value = items.filter(item => {
                let unAvailableIDs = res.data.data.NotAvailableProductsIDs;
                if(unAvailableIDs.length !== 0) {
                    if(unAvailableIDs.includes(item.ID)) {
                        return item;
                    }
                }
            });

            return unAvailableItems.value;
        });
    }

    const getAvailableItemsByCartItems = (items) => {

        const orders = items.map(item => {
            return {
                ID: parseInt(item.ID),
                Quantity: parseInt(item.Qty)
            }
        });

        return tsQuery({
            query: `query AvailableProductsIDs($OrderQuantity: [InputOrderQuantity]) {
                  AvailableProductsIDs(OrderQuantity: $OrderQuantity)
                }`,
            variables: {
                OrderQuantity: orders
            }
        }).then(res => {
            let availableProductsIDs = res.data.data.AvailableProductsIDs;

            availableItems.value = items.filter(item => {
                if(availableProductsIDs.includes(item.ID)) {
                    return item;
                }
            });
            return availableItems.value;
        });
    }

    const checkStockForOrder = (items) => {
        const orders = items.map(item => {
            return {
                ID: parseInt(item.ID),
                Quantity: parseInt(item.Qty)
            }
        });

        return tsQuery({
            query: `query CheckRemainingStockForOrder($OrderQuantity: [InputOrderQuantity]) {
                  CheckRemainingStockForOrder(OrderQuantity: $OrderQuantity) {
                        ID
                        CanCover
                        Stock
                        IsOutOfStock
                        Message
                  }
                }`,
            variables: {
                OrderQuantity: orders
            }
        }).then(res => {
            let remainingStockForOrder = res.data.data.CheckRemainingStockForOrder;
            remainingStocks.value = remainingStockForOrder;
            return remainingStocks.value;
        });
    }

    return {
        availableItems,
        unAvailableItems,
        remainingStocks,
        clearCart,
        getAvailableItems,
        getUnAvailableItems,
        getAvailableItemsByCartItems,
        checkStockForOrder
    }
}
