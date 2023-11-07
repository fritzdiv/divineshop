<template>
    <q-dialog ref="addressForm" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card-section>
                <q-btn fab color="primary" icon="place" class="absolute" style="top: 12px; right: 12px;" />
                <div class="row no-wrap items-center">
                    <div class="col text-h6 ellipsis">New Address</div>
                    <hr/>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="flex q-gutter-sm">
                    <q-input filled class="col" v-model="aptNo" label="Apartment No" stack-label />
                    <q-input filled class="col" v-model="streetNo" label="Street No" stack-label />
                </div>
                <q-input filled class="q-my-sm" v-model="street" label="Street" stack-label />
                <q-input filled class="q-my-sm" v-model="city" label="City" stack-label />
                <q-input filled class="q-my-sm" v-model="province" label="Province" stack-label />
                <q-input filled class="q-my-sm" v-model="postalCode" label="Postal Code" stack-label />
                <q-input filled class="q-my-sm" v-model="country" label="Country" stack-label />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right" class="q-px-md">
                <q-btn v-close-popup flat color="primary" label="Cancel" />
                <q-btn color="primary" label="OK" @click="onOKClick" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { useAppStore } from 'src/stores/app';

export default {
    props: {
        address: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    setup() {
        const appStore = useAppStore();
        return {
            appStore,
        };
    },
    data() {
        return {
            aptNo: '',
            streetNo: '',
            street: '',
            city: '',
            province: '',
            country: 'Canada',
            postalCode: '',
        };
    },
    emits: [
        'ok', 'hide'
    ],
    methods: {
        show() {
            this.$refs.addressForm.show();
        },
        hide() {
            this.$refs.addressForm.hide();
        },
        onDialogHide() {
            this.$emit('hide');
        },
        async onOKClick() {
            const addr = {
                "AptNo": this.aptNo,
                "StreetNo": this.streetNo,
                "Street": this.street,
                "City": this.city,
                "Province": this.province,
                "Country": this.country,
                "PostalCode": this.postalCode,
            };
            await this.appStore.addAddress(addr);
            this.$emit('ok');
            this.hide();
        },
        onCancelClick() {
            this.hide();
        }
    }
};
</script>

<style scoped>

</style>
