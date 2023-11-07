<template>
    <q-dialog ref="orderSuccessForm" @hide="onDialogHide" persistent>
        <q-card class="q-dialog-plugin">
            <q-card-section>
                <q-icon name="task_alt" color="primary"
                        size="xl"
                        class="absolute"
                        style="top: 12px; right: 12px;">
                </q-icon>
                <div class="row no-wrap items-center">
                    <div class="col text-h6 ellipsis">Success!</div>
                    <hr/>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <p>Thank you for submitting your order!</p>
                <p>
                    Confirmation Number:
                    <span class="text-weight-bold">
                        {{ cartStore.submitOrderResult.Data.OrderConfirmationNumber }}
                    </span>
                </p>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right" class="q-px-md">
                <q-btn color="primary" label="OK" @click="onOKClick" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { useCartStore } from 'src/stores/cart';

export default {
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
    setup() {
        const cartStore = useCartStore();
        return {
            cartStore,
        };
    },
    emits: [
        'ok', 'hide'
    ],
    methods: {
        show() {
            this.$refs.orderSuccessForm.show();
        },
        hide() {
            this.$refs.orderSuccessForm.hide();
            this.$router.push('/');
        },
        onDialogHide() {
            this.$emit('hide');
        },
        onOKClick() {
            this.hide();
        }
    }
};
</script>

<style scoped>

</style>
