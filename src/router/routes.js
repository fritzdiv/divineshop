const routes = [
    {
        path: "",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            { name: 'home', meta: {requiresAuth: false}, path: '', component: () => import('pages/IndexPage.vue') },
            { name: 'product', meta: {requiresAuth: false}, path: 'product/:id', component: () => import('pages/Product.vue') },
        ],
    },
    {
        path: "/",
        component: () => import("layouts/BlankLayout.vue"),
        children: [
            { name: "login", path: "login", component: () => import("pages/Login.vue") },
            { name: 'cart', meta: { title: 'Cart', requiresAuth: true}, path: 'cart', component: () => import('pages/ShoppingCart.vue') },
            { name: 'manage-addresses', meta: { title: 'Manage Addresses', requiresAuth: true}, path: 'manage-addresses', component: () => import('pages/ManageAddressPage.vue') },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
    },
];

export default routes;
