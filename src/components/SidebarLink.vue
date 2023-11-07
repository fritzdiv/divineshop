<template>
    <router-link :to="routeObj">
        <div class="sidebar-link row q-px-lg q-py-sm justify-between"
             :class="active ? 'bg-active-menu' : ''">
            <div class="row items-center">
                <span class="material-icons left-icon md-36">{{ icon }}</span>
                <div class="text-weight-bold q-pl-md menu-title">{{ title }}</div>
            </div>
            <span class="material-icons md-24">chevron_right</span>
        </div>
    </router-link>
</template>

<script>
export default {
    name: "SidebarLink",
    props: {
        routeName: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: "",
        },
    },
    computed: {
        routeObj() {
            return this.routeName ? { name: this.routeName } : null;
        },
        active() {
            return this.routeName === this.$route.name;
        }
    },
};
</script>
<style lang="scss" scoped>
.left-icon {
    font-size: 29px;
    @media screen and (min-width: 362px){
        font-size: 34px;
    }
}
.menu-title {
    font-size: 12px;
    @media screen and (min-width: 362px){
        font-size: 14px;
    }
}
.sidebar-link {
    margin-bottom: 1em;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    background: rgba(238, 238, 238, 0.9);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
}

.material-icons.left-icon {
    color: var(--q-primary);
}

.bg-active-menu, .bg-active-menu .material-icons.left-icon {
    color: #f6f6f6 !important;
}
.bg-active-menu {
    background: rgb(36,0,4);
    background: linear-gradient(90deg, #328732 0%, #17bc17 24%, #26f626 100%);
}
</style>
