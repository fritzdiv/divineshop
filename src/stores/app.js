import { defineStore } from "pinia";
import { graphql as graphQLApi } from "src/api";
import { Dialog } from "quasar";
import { useStorage } from "@vueuse/core";
import _ from 'lodash';

export const useAppStore = defineStore("app", {
    state: () => ({
        busy: null,
        memberData: null,
        warehouseList: null,
        memberOrders: null,
        version: null,
        userId: useStorage("userId", null),
        token: useStorage("token", null),
        appSettings: null,
        messagingPermission: null,
        messagingToken: null,
    }),
    getters: {
        deliveryChargeScheme: (state) => state.memberData && !_.isNull(state.memberData.DeliveryCharge) ? state.memberData.DeliveryCharge : null,
        isLoggedIn: (state) => {
            console.log('IS LOGGED IN? LOCAL STORAGE', localStorage);
            console.log('IS LOGGED IN? STATE', state);
            return state.memberData && state.userId && state.token !== null;
        },
        member: (state) => state.memberData,
        memberFullName: (state) => {
            const name = [];
            if (state.memberData) {
                if (state.memberData.FirstName) {
                    name.push(state.memberData.FirstName);
                }
                if (state.memberData.Surname) {
                    name.push(state.memberData.Surname);
                }
            }
            return name.join(' ').toUpperCase();
        },
        warehouses: (state) => state.warehouseList,
        allOrders: (state) => state.allOrders,
        isBusy: (state) => state.busy,
        primaryPromo: (state) => {
            let promo = state.appSettings && state.appSettings.Promotions ? state.appSettings.Promotions[0] : null;
            return promo && promo.Name ? promo : null;
        },
        secondaryPromo: (state) => {
            let promo = state.appSettings && state.appSettings.Promotions && state.appSettings.Promotions.length > 1 ? state.appSettings.Promotions[1] : null;
            return promo && promo.Name ? promo : null;
        }
    },
    actions: {
        async getAppGeneralSettings() {
            const appSettings = await graphQLApi.postRequest('appSettings');
            console.log('RETRIEVED APP SETTINGS', appSettings);
            if (appSettings.data.data.AppSettings) {
                this.appSettings = appSettings.data.data.AppSettings;
            }
        },
        async login(vars) {
            console.log("LOGGING IN :", vars);
            const apiRequest = graphQLApi.postRequest("login", vars);
            console.log('LOGIN RESULT', apiRequest);
            if (
                apiRequest.catch((error) => {
                    if (error.response.status === 401) {
                        const dialog = Dialog.create({
                            title: "Login failed",
                            message: "Invalid username or password",
                            ok: false,
                        });

                        const timeout = setTimeout(() => {
                            dialog.hide();
                            clearTimeout(timeout);
                        }, 2500);

                        return false;
                    }
                })
            );

            const result = await apiRequest;
            console.log("login result", result);

            const loginResult = result.data.data.Login;
            if (loginResult) {
                if (loginResult.success) {
                    if (loginResult.token) {
                        this.token = loginResult.token;
                    }
                }
                return loginResult.success;
            } else {
                return false;
            }
        },
        logout() {
            this.userId = null;
            this.token = null;
            localStorage.clear();
        },
        async getMemberInfo() {
            const result = await graphQLApi.postRequest("loggedInMember");
            if (result) {
                const member = result.data.data.Member;
                console.log("MEMBER", member);
                this.userId = member.ID;
                console.log("MEMBER storage", localStorage);
                this.memberData = member;
            } else {
                console.log("Error getting  member info.");
                this.token = null;
            }
        },
        async addAddress(payload) {
            let vars = { 'Address': payload };
            const result = await graphQLApi.postRequest('addAddress', vars);
            this.memberData.Address = result.data.data.AddAddress;
        },
        async getWarehouses() {
            const result = await graphQLApi.postRequest('warehouses');
            this.warehouseList = result.data.data.Warehouses;
        },
        async setMemberAddresses(addresses) {
            this.memberData.Address = addresses;
        }
    },
});
