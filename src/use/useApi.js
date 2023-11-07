import { api } from "boot/axios";
import { LocalStorage } from 'quasar';

export function useApi() {
    function tsQuery(data) {
        return api({
            baseURL: process.env.API,
            headers: {
                'Authorization': "Bearer " + LocalStorage.getItem('token')
            },
            method: 'post',
            data: data,
        })
    }

    return {
        tsQuery
    };
}
