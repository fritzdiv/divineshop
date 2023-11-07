import { ref } from 'vue';
import { useAppStore } from 'src/stores/app';
import { graphql as graphQLApi } from "src/api";


export function useMember() {
    const appStore = useAppStore();
    const member = appStore.member;
    const memberRef = ref(member);

    function fullName() {
        const name = [];
        if (member.FirstName) {
            name.push(member.FirstName);
        }
        if (member.Surname) {
            name.push(member.Surname);
        }
        return name.join(' ').toUpperCase();
    }

    async function memberExistsQuery(params) {
        return await graphQLApi
            .postRequest('memberExists', `{"PhoneEmail" : "${params}"}`)
            .catch((error) => console.log("Error: ", error));
    }

    function sendSecurityCode(param) {
        return graphQLApi
            .postRequest('sendSecurityCode', `{"Param" : "${param}"}`)
            .catch((error) => console.log("Error: ", error));
    }

    function updatePassword(code, password) {
        const vars = `{
            'Code' : '${code}',
            'Password' : '${password}'
        }`;
        return graphQLApi
            .postRequest('updatePassword', vars)
            .catch((error) => console.log("Error: ", error));
    }

    return {
        fullName,
        member: memberRef,
        memberExistsQuery,
        sendSecurityCode,
        updatePassword,
    };
}
