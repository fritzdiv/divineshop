import { useRouter } from 'vue-router';
import { useCart } from "./useCart";
import { useApi } from "./useApi";

export function useSecurity() {
    const router = useRouter();

    const api = useApi();
    const { tsQuery } = api;

    const userCart = useCart()
    const { clearCart } = userCart;

    const logout = () => {
        localStorage.clear();
        clearCart();
        router.push({name: 'login'});
    }

    function updatePassword(code, password) {
        return tsQuery({
            query: `
                mutation UpdatePassword($Code: String!, $Password: String!){
                  UpdatePasswordByCode(Code:, $Code, Password: $Password)
                }
            `,
            variables: `
                {
                  "Code" : "${code}",
                  "Password" : "${password}"
                }
            `
        });
    }

    // param is either phone or email
    function sendSecurityCode(param) {
        return tsQuery({
            query: `mutation SendSecurityCode($Param: String!) {
                      SendSecurityCode(Param: $Param)
                    }
            `,
            variables: `
                {
                  "Param" : "${param}"
                }
            `
        });
    }

    return {
        updatePassword,
        sendSecurityCode,
        logout
    }
}
