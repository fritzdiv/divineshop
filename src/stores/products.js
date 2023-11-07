import { graphql as graphQLApi } from "src/api";
import { defineStore } from "pinia";
import _ from "lodash";

export const useProductsStore = defineStore("products", {
    state: () => ({
        specialOffers: null,
        categoriesList: null,
        allProducts: [],
        currentCategory: 0,
        product: null,
        searchStr: "",
        searchCategories: [],
        lastProductRequest: null,
    }),
    getters: {
        categories: (state) => {
            let cats = [];
            if (state.allProducts.length) {
                cats = _.compact(
                    _.uniqBy(
                        state.allProducts.map((p) => {
                            if (!_.isNull(p.SecondCollectionID)) {
                                return {
                                    ID: p.SecondCollectionID,
                                    Name: p.SecondCollectionName,
                                };
                            }
                        }),
                        "ID"
                    )
                );
            }
            return cats;
        },
        products: (state) => state.allProducts,
        currentProduct: (state) => state.product,
        searchString: (state) => state.searchStr,
    },
    actions: {
        async getCategories() {
            const collectionName = "categories";
            const result = await graphQLApi
                .postRequest(collectionName, null)
                .catch((error) => console.log("Error: ", error));
            this.categoriesList = result.data.data.ProductCollections;
        },
        async getProducts() {
            const collectionName = "categoryProducts";
            const result = await graphQLApi
                .postRequest(collectionName, {
                    CollectionID: this.currentCategory,
                })
                .catch((error) => console.log("Error: ", error));
            // console.log("PRODUCTS STORE", result);
            this.allProducts = result.data.data.Products;
        },
        async getStockQty(prodIds) {
            let prod = null;
            const result = await graphQLApi
                .postRequest("productStockQuantity", { ProductIDs: prodIds })
                .catch((error) => console.log("Error: ", error));
            const stocks = result.data.data.CheckRemainingStocksForProducts;
            _.forEach(stocks, (s) => {
                prod = _.find(this.allProducts, { ID: s.ID });
                if (prod) {
                    prod.RemainingQty = s.Stock;
                }
            });
            // let's set the current product to the last item whose stock was retrieved.
            this.product = prod;
        },
        setCurrentProduct(product) {
            this.product = product;
        },
        setSearchString(str) {
            this.searchStr = str;
        },
    },
});
