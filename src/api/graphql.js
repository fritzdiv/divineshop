import {api} from 'boot/axios';
import {addJwtTokenToHeader} from 'boot/axios';
import {useAppStore} from "stores/app";

const queries = {
    /** auth and member-related queries */
    login: `query AppLogin($Email: String!, $Password: String!){
                  Login (Email: $Email, Password: $Password) {
                    success
                    message
                    token
                    expires
                  }
                }`,
    loginByID: `query MemberLoginByID($ID: Int!) {
                  LoginByID (ID: $ID) {
                    success
                    message
                    token
                    expires
                  }
                }`,
    loggedInMember: `query LoggedInMember {
                        Member {
                            ID
                            FirstName
                            Surname
                            Email
                            TelNo
                            MobileNo
                            Tax
                            RewardGroup
                            Address {
                                ID
                                AddressLine
                                IsDefault
                            }
                            DeliveryCharge {
                                From
                                To
                                Amount
                            }
                        }
                     }`,
    addAddress: `mutation AddAddress($Address: AddressInput){
                  AddAddress(Address: $Address) {
                    ID
                    AddressLine
                    IsDefault
                  }
                }`,
    deleteAddress: `mutation DeleteAddress($AddressID: Int!){
                  DeleteAddress(AddressID: $AddressID) {
                    ID
                    AddressLine
                    IsDefault
                  }
                }`,
    updateDefaultAddress: `mutation UpdateDefaultAddress($AddressID: Int!){
                  UpdateDefaultAddress(AddressID: $AddressID) {
                    ID
                    AddressLine
                    IsDefault
                  }
                }`,
    addMember: `mutation AddMember($NewMemberData: MemberData) {
                    AddMember(NewMemberData: $NewMemberData) {
                        Status
                        Message
                    }
                }`,
    memberExists: `query MemberExist($PhoneEmail: String!){
                  MemberExist(PhoneEmail: $PhoneEmail)
                }`,
    sendSecurityCode: `mutation SendSecurityCode($Param: String!) {
                      SendSecurityCode(Param: $Param)
                    }`,
    updatePassword: `mutation UpdatePassword($Code: String!, $Password: String!){
                  UpdatePasswordByCode(Code:, $Code, Password: $Password)
                }`,
    /** product and collection queries */
    categoryProducts: `query FindProductByRootCollectionID($CollectionID: Int!) {
                        Products(RootCollectionID: $CollectionID) {
                          ID
                          RootCollectionID
                          RootCollectionName
                          ProductCollectionID
                          SecondCollectionID
                          SecondCollectionName
                          ThirdCollectionName
                          Code
                          Description
                          Size
                          SaleOuM
                          SFPrice
                          DiscountedSFPrice
                          DefaultPrice
                          DiscountedDefaultPrice
                          Taxable
                          PromoValid
                          PromoDiscount
                          LargeImage
                          ThumbNail
                          DefaultUoMToSF
                          ThirdCollectionMemo
                        }
                      }`,
    categories: `query Categories {
                        ProductCollections(RootOnly:true) {
                            ID
                            Name
                        }
                    }`,
    specialOffers: `query SpecialPromo {
                       ProductCollections(WithSaleItemsOnly:true) {
                            ID
                            Name
                            SubCollections(WithSaleItemsOnly:true) {
                                ID
                                Products(OnSaleOnly:true) {
                                    ID
                                    RootCollectionID
                                    ProductCollectionID
                                    SecondCollectionName
                                    ThirdCollectionName
                                    Code
                                    SaleOuM
                                    Size
                                    Description
                                    SFPrice
                                    DiscountedSFPrice
                                    DefaultPrice
                                    DiscountedDefaultPrice
                                    PromoValid
                                    PromoDiscount
                                    LargeImage
                                    ThumbNail
                                    SaleOuM
                                    ThirdCollectionMemo
                                }
                            }
                       }
                    }`,
    product: `query ProductByID($ProductID: Int!) {
                        Product(ID: $ProductID) {
                            ID
                            RootCollectionID
                            ProductCollectionID
                            SecondCollectionName
                            ThirdCollectionName
                            Code
                            SaleOuM
                            Size
                            Description
                            PromoValid
                            PromoDiscount
                            SFPrice
                            DiscountedSFPrice
                            DefaultPrice
                            DiscountedDefaultPrice
                            LargeImage
                            ThumbNail
                            ThirdCollectionMemo
                        }
                    }`,
    productWarehouseQuantity: `query ProductQuantityAtWarehouse($WarehouseID: Int!, $ProductID: Int!) {
                        ProductQuantityAtWarehouse(WarehouseID: $WarehouseID, ProductID: $ProductID)
                    }`,
    productStockQuantity: `query CheckRemainingStocksForProducts($ProductIDs: [Int]) {
                        CheckRemainingStocksForProducts(ProductIDs: $ProductIDs) {
                              ID
                              Stock
                              IsOutOfStock
                        }
                      }`,
    /** order-related queries */
    warehouses: `query Warehouses {
                      Warehouses {
                        ID
                        Location
                        StreetName
                        City
                        Province
                        PostalCode
                        PhoneNumber
                        AllowPicking
                        PickupTimeLimits
                        PickupMessage
                        PickupHours
                        Status
                      }
                    }`,
    allOrders: `{
                  Orders {
                    ID
                    Created
                    OrderNum
                    Warehouse
                    OrderStatus
                    InvoiceNum
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
                      }
                    }
                  }prepOrderAndSubmit
                }`,
    submitOrder: `mutation ProcessOrder($CartItems: [CartItemInput], $ShippingInfo: ShippingInfoInput) {
                    ProcessOrder(CartItems: $CartItems, ShippingInfo: $ShippingInfo) {
                        Status
                        Message
                        Data {
                            OrderConfirmationNumber
                            QRcode
                            SaleID
                        }
                    }
                }`,
    verifyToken: `query { VerifyToken }`,
    appSettings: `query { AppSettings {
                    Promotions {
                        Name
                        Image
                        Link
                    }
                    DeliveryCharge
                  } }`,
};

export default {
    async postRequest (qry, vars = null) {
        const appStore = useAppStore();
        let result = null;

        if (qry != 'login' || appStore.isLoggedIn) {
            addJwtTokenToHeader();
        }
        if (queries[qry]) {
            const payload = {
                query: queries[qry],
                variables: vars,
            };

            api.defaults.baseURL = process.env.API,
            result = api.post('/', payload)
                .then((response) => {
                    return response;
                })
                // Move catch outside this code
                .catch((e) => {
                    console.log('Error on request', e);
                    return null;
                });
        }
        return result;
    },
};
