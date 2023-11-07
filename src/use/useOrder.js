import { useFormatter } from '../use/useFormatter';
import { useApi } from '../use/useApi';
import { ref } from "vue";
const { formatDateSimple } = useFormatter();

export function useOrder() {

    const { tsQuery } = useApi();
    const orderLoading = ref(true);

    function discountedPrice(price, discount) {
        return parseFloat(price - (price * (discount / 100))).toFixed(2);
    }

    const handoverMessage= (order) => {
        const ship = order.ShippingInstruction;
        const shipDate = formatDateSimple(ship.ShippingDate);

        if(!ship.ShippingTimeFrom && !ship.ShippingTimeTo) {
            return ``;
        }

        if(order.ShippingInstruction.Type === 'pickedup') {
            if(ship.ShippingDate === null) {
                return `Pickup from ${order.Warehouse} location (to be notified).`;
            }
            return `Pickup from ${order.Warehouse} location on ${shipDate} between ${ship.ShippingTimeFrom} to ${ship.ShippingTimeTo}`;
        } else {
            return `Delivery Date: ${shipDate} between ${ship.ShippingTimeFrom} to ${ship.ShippingTimeTo}`;
        }
    }

    const orderMember = ref({});
    const openOrders = ref([]);
    const completedOrders = ref([]);
    const cancelledOrders = ref([]);
    const ordersQuery = () => {
        return `
            query {
              Member {
                DefaultAddress
                Tax
              }

              OpenOrders:Orders(OpenOrdersOnly: true) {
                ID
                Created
                OrderNum
                Status
                IsFullyPaid
                OrderStatus
                Warehouse
                ShippingInstruction {
                  ID
                  Type
                  PickupNow
                  OrderFor
                  ShippingDate
                  ShippingTimeFrom
                  ShippingTimeTo
                }
                OrderItems {
                  ID
                  Price
                  Qty
                  Discount
                }
              }

              CompletedOrders:Orders(PaidAndShippedOnly: true) {
                ID
                Created
                InvoiceNum
                Status
                OrderStatus
                Warehouse
                ShippingInstruction {
                  ID
                  Type
                  OrderFor
                  ShippingDate
                  ShippingTimeFrom
                  ShippingTimeTo
                }
                OrderItems {
                  ID
                  Price
                  Qty
                  Discount
                }
              }

              CancelledOrders:Orders(CancelledOnly: true) {
                ID
                Created
                OrderNum
                Status
                OrderStatus
                Warehouse
                ShippingInstruction {
                  ID
                  Type
                  OrderFor
                  ShippingDate
                  ShippingTimeFrom
                  ShippingTimeTo
                }
                OrderItems {
                  ID
                  Price
                  Qty
                  Discount
                }
              }
            }`;
    }

    const getOrders = () => {
        tsQuery({query: ordersQuery(`OpenOrdersOnly: true`)}).then(res => {
            orderLoading.value = false;
            orderMember.value = res.data.data.Member;
            openOrders.value = res.data.data.OpenOrders;
            completedOrders.value = res.data.data.CompletedOrders;
            cancelledOrders.value = res.data.data.CancelledOrders;
        });
    }

    const orderSubtotal = (items) => {
        let subtotal = 0;
        if (items.length) {
            items.forEach(item => {
                const price = parseFloat(item.Price - (item.Price * (item.Discount / 100))).toFixed(2) ;
                subtotal += price * item.Qty;
            });
        }

        return parseFloat(subtotal).toFixed(2);
    }

    const orderTotal = (subtotal, member) => {
        const subTotal = Number(subtotal);
        return parseFloat(subTotal + (subTotal * (member.Tax / 100))).toFixed(2);
    }

    const orderQuery = () => {
        return `query getOrderByID($ID: Int!) {
                  Member {
                      TaxingScheme
                      Tax
                  }
                  Order(ID: $ID) {
                    ID
                    Created
                    OrderNum
                    Status
                    IsFullyPaid
                    OrderStatus
                    Warehouse
                    Transaction
                    ShippingInstruction {
                      ID
                      Type
                      PickupNow
                      OrderFor
                      ShippingDate
                      ShippingTimeFrom
                      ShippingTimeTo
                    }
                    OrderItems {
                      ID
                      SaleID
                      Qty
                      Price
                      Discount
                      UoM
                      Product {
                        ID
                        Code
                        ThumbNail
                        SaleOuM
                        Description
                        PromoDiscount
                        SFPrice
                        DiscountedDefaultPrice
                      }
                    }
                  }
                },
                `;
    }

    const order = ref({});
    const orderItems = ref([]);
    const orderByID = (id) => {
        return tsQuery({
            query: orderQuery(),
            variables: {
                "ID": Number(id)
            }}).then(res => {
            orderLoading.value = false;
            orderMember.value = res.data.data.Member;

            const orderData = res.data.data.Order;
            order.value = orderData;
            orderStatus.value = orderData.OrderStatus;
            orderItems.value = orderData.OrderItems;

            return orderData;
        }).then(res => {
            return res;
        });
    }

    const orderStatusQuery = (id) => {
        return `
            {
              Order(ID: ${Number(id)} ) {
                OrderStatus
              }
            }
        `;
    }

    const orderStatus = ref('');
    const getOrderStatus = (id) => {
        return tsQuery({
            query: orderStatusQuery(id),
        }).then(res => {
            const status = res.data.data.Order.OrderStatus
            orderStatus.value = status;
            return status;
        });
    }

    const cancelOrderQuery = (id) => {
        return tsQuery({
            query: `
              mutation {
                    CancelOrder(OrderID: ${Number(id)}) {
                    Status
                    Message
                 }
              }
            `
        });
    }

    return {
        order,
        orderItems,
        openOrders,
        completedOrders,
        cancelledOrders,
        orderMember,
        orderLoading,
        orderStatus,
        getOrderStatus,
        discountedPrice,
        handoverMessage,
        getOrders,
        orderSubtotal,
        orderTotal,
        orderByID,
        cancelOrderQuery
    }
}

