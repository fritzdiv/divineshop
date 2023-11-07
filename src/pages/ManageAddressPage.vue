<template>
    <q-header elevated>
        <q-toolbar class="q-px-none q-py-sm">
            <q-btn flat dense round icon="arrow_back" aria-label="Menu"  @click="$router.go(-1)"/>
            <q-toolbar-title>
                <div class="text-center">
                    Manage Addresses
                </div>
            </q-toolbar-title>
            <q-btn round outline dense
                   text-color="primary"
                   style="background: white !important;"
                   icon="add"
                   class="q-mr-sm"
                   @click="showAddressForm"
            />
        </q-toolbar>
    </q-header>
    <div class="col q-py-3" style="background-color: #fff;height: 100vh">
        <q-list class="q-p-3">
            <template v-for="address in addresses" :key="address.ID">
                <q-item>
                    <q-item-section>
                        <q-item-label lines="2">
                            {{address.AddressLine}}
                        </q-item-label>
                    </q-item-section>
                    <q-item-section  side @click="() => deleteAddress(address)"><q-icon name="delete" /></q-item-section>
                </q-item>
                <q-separator spaced inset />
            </template>

        </q-list>
    </div>
    <address-form ref="newAddress" @ok="refreshAddresses"></address-form>
</template>

<script setup>
import {ref, onBeforeMount, onMounted} from "vue";
import { useAppStore } from 'src/stores/app';
import { graphql as graphQLApi } from "src/api";
import { useQuasar } from "quasar";
import AddressForm from 'src/components/AddressForm.vue';

const $q = useQuasar();
const appStore = useAppStore();
const addresses = ref([]);
const newAddress = ref(null);

onBeforeMount(async () => {
    refreshAddresses();
})

onMounted(() => {
    console.log('ADDRESS', addresses.value);
    console.log('ADD NEW ADDRESS REf', newAddress.value);
})

const refreshAddresses = () => {
    addresses.value = appStore.member.Address;
}

const deleteAddress = (address) => {
    $q.dialog({
        title: 'Confirm',
        message: `Do you want to delete the following address? <br/><hr/><strong>${address.AddressLine}</strong><hr/>`,
        html: true,
        cancel: true,
        persistent: true
    }).onOk(async () => {
        const result = await graphQLApi.postRequest('deleteAddress',{AddressID : Number(address.ID)})
        const addressesResult = result.data.data.DeleteAddress;
        addresses.value = addressesResult;
        appStore.setMemberAddresses(addressesResult);
    });
    console.log(address)
}

const setAsDefaultAddress = (address) => {
    $q.dialog({
        title: 'Confirm',
        message: `Set the following address as default? <br/><br/>${address.AddressLine}`,
        html: true,
        cancel: true,
        persistent: true
    }).onOk(async () => {
        const result = await graphQLApi.postRequest('updateDefaultAddress',{AddressID : Number(address.ID)})
        const addressesResult = result.data.data.UpdateDefaultAddress;
        addresses.value = addressesResult;
        appStore.setMemberAddresses(addressesResult)
    });
}

const showAddressForm = () => {
    newAddress.value.show();
};

</script>

<style scoped>

</style>
