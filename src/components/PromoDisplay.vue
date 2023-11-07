<template>
    <div class="q-pa-sm">
        <div class="bg-grey-3">
            <q-item v-if="promotion.Link" clickable tag="a" target="_blank" :href="promotion.Link" class="q-pa-none">
                <q-img :src="promotion.Image"
                       style="max-width: 100%;" fit="fill">
                    <div v-if="showName" class="absolute-bottom text-subtitle1 text-center caption">
                        {{ promotion.Name }}
                    </div>
                </q-img>
            </q-item>
            <q-img v-else :src="promotion.Image"
                   style="max-width: 100%;" fit="fill">
                <div v-if="showName" class="absolute-bottom text-subtitle1 text-center caption">
                    {{ promotion.Name }}
                </div>
            </q-img>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        promotion: {
            type: Object,
            default: () => null,
        },
        height: {
            type: String,
            default: '60px',
        },
        showName: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped>
    .caption {
        padding: 5px !important;
    }
</style>
