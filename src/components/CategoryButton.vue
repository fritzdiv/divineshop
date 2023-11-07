<template>
    <span class="q-pr-sm q-my-md" style="flex:0 0 auto" :class="{'active-menu-shadow': active}">
        <q-btn :color="bgColor" no-caps rounded ripple style="line-height: 1rem;" :class="{'in-active-button': true}" class="q-py-xs q-px-md" ><span v-html="name"></span></q-btn>
    </span>
</template>
<script>
export default {
    name: "CategoryButton",
    props: {
        id: {
            type: Number,
        },
        name: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
        },
        activeMode: {
            type: String,
            default: 'outline',
        },
    },
    computed: {
        bgColor() {
            return this.active ? 'active-menu secondary' : 'dark';
        },
    },
    setup() {
        return {};
    },
};
</script>
<style scope lang="scss">
    .q-btn--actionable.q-btn--standard:before {
        box-shadow: none !important;
    }

    button.bg-active-menu, button.in-active-button {
        span {
            font-size:11px;
            @media screen and (min-width: 362px){
                font-size: 13px;
            }
            @media screen and (min-width: 400px){
                font-size: 14px;
            }
        }
    }

    button.bg-active-menu {
        span {
            color: $dark !important;
           }
    }

    .active-menu-shadow {
        filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.4));
    }

    .in-active-button {
        border: 1px solid $dark;
        box-shadow: none;
        span {
            color:white !important;
        }
    }
</style>

