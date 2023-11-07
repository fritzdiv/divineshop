import { route } from "quasar/wrappers";
import {
    createRouter,
    createMemoryHistory,
    createWebHistory,
    createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { graphql as graphQLApi } from 'src/api';
import { useStorage } from "@vueuse/core";
import { useAppStore} from 'stores/app';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : process.env.VUE_ROUTER_MODE === "history"
            ? createWebHistory
            : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.VUE_ROUTER_BASE),
    });

    Router.beforeEach(async (to, from, next) => {
        const appStore = useAppStore();
        if (to.matched.some(record => record.meta.requiresAuth)) {
            let isAllowed = false;
            const result = await graphQLApi.postRequest('verifyToken').then((res) => {
                isAllowed = res.data.data.VerifyToken
            }).catch((error) => {
                isAllowed = false;
                console.log(error);
            });

            if (!isAllowed || !appStore.isLoggedIn) {
                localStorage.clear();
                useStorage('cart', []);
                next('/login')
            } else {
                next();
            }
        } else {
            next()
        }
    });

    return Router;
});
