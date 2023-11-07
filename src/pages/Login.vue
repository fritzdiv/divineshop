<template>
    <q-page class="fixed-center">
        <q-page-container id="loginScreen">
            <div :class="!appStore.isLoggedIn" class="row text-center">
                <div class="col-12 q-pt-xl q-mt-xl">
                    <h3 class="text-weight-bold text-white">Divine Shop</h3>
                    <!--<img src="/images/logo.png" alt="image" height="65" />-->
                </div>
                <div class="col-12">
                    <div class="row">
                        <label class="text-h6 text-orange-7 text-center col-12">online store</label>
                    </div>
                </div>
            </div>
            <div v-if="!appStore.isLoggedIn" class="row q-mt-xl">
                <div class="col-12">
                    <input v-model="email" type="text" :class="textFieldClass" placeholder="Email or Phone"/>
                </div>
                <div class="col-12">
                    <input v-model="password" type="password" :class="textFieldClass" placeholder="Password"/>
                </div>
                <div class="col-12">
                    <q-btn class="btnLogin full-width q-mt-sm" label="Login" no-caps ripple @click="startLogin"/>
                </div>
                <div class="col-12">
                    <label class="text-weight-bold full-width text-center text-white block q-mt-lg"  @click="showForgotPasswordDialog">Forgot Password?</label>
                </div>
                <div class="col-12 q-mt-md">
                    <q-separator spaced size="md" color="orange"/>
                </div>
                <div class="row">
                    <div class="col-12">
                        <q-btn class="q-mt-md" rounded style="background-color: #fff; color: #000;display:inline-block;width: 80vw" @click="state.customerDialog = true" :disable="state.registrationDisabled">
                            <span style="display: inline-block;margin-bottom: -30px">Register as Customer?</span>
                        </q-btn>
                    </div>
                    <div class="col-12">
                        <q-btn class="q-mt-md" rounded outline style="color: #fff;display:inline-block;width: 80vw" @click="this.$router.push({name:'home'})">
                            <span style="display: inline-block;margin-bottom: -30px">Continue browsing</span>
                        </q-btn>
                    </div>
                </div>
            </div>
            <!--
            <div v-else class="flex text-center justify-between">
                <q-spinner-grid color="white" size="5em" />
            </div>
            -->
        </q-page-container>

        <!-- Forgot Password Dialog -->
        <q-dialog v-model="state.forgotPasswordDialog" position="bottom" ok-dialog>
            <q-card class="q-dialog-plugin text-white q-pb-md q-px-lg" style="border-top-left-radius: 30px; border-top-right-radius: 30px">
                <template v-if="!isCodeSend">
                    <div class="row justify-end q-mt-md q-mb-sm">
                        <q-icon name="close" size="md" color="white" @click="closeForgotPassword"/>
                    </div>
                    <div class="row justify-center text-weight-bold q-mb-md text-h5 text-deep-orange">
                        Reset Password
                    </div>
                    <div class="text-center q-pt-xs">
                        <form>
                            <input v-model="state.recoverEmail" type="text" :class="textFieldClass" placeholder="Email or Phone Number"/>
                            <input v-model="state.recoverPassword" type="password" :class="textFieldClass" placeholder="New Password"/>
                        </form>
                    </div>
                    <div class="text-center q-py-md">
                        <q-btn class="btnLogin full-width" label="Confirm" no-caps ripple @click="checkMember()"/>
                    </div>
                </template>
                <template v-else-if="isCodeSend">
                    <div class="row justify-start items-center q-mt-md q-mb-sm">
                        <q-icon name="chevron_left" size="md" color="white" @click="isCodeSend = false"/> <span class="md-18">Back</span>
                    </div>
                    <div class="row justify-center text-weight-bold q-mb-lg q-mt-lg text-h5">
                        Enter Security Code
                    </div>
                    <div class="text-center q-pt-xs">
                        <form>
                            <input v-model="state.securityCode" type="password" :class="textFieldClass" class="text-center text-black q-mb-md t-rounded-[15px]" placeholder="Security Code"/>
                        </form>
                    </div>
                    <div class="text-center q-py-md">
                        <q-btn class="full-width" color="black" label="Reset Password" no-caps ripple @click="confirmUpdatePassword()"/>
                    </div>
                </template>
            </q-card>
        </q-dialog>

        <q-dialog v-model="state.customerDialog" position="bottom" ok-dialog>
            <q-card class="q-dialog-plugin text-white q-pb-md q-px-lg" style="border-top-left-radius: 30px; border-top-right-radius: 30px; width: 96% !important">
                <div class="row justify-end q-mt-md q-mb-sm">
                    <q-icon name="close" size="md" color="white" @click="state.customerDialog = false"/>
                </div>
                <div class="row justify-center text-weight-bold q-mb-md text-h5 text-blue-9">
                    Customer Registration
                </div>
                <div class="text-center q-pt-xs">
                    <form>
                        <q-input v-model="memberFields.FirstName"
                                 :rules="newMemberRules.name"
                                 filled bottom-slots
                                 ref="firstNameRef"
                                 label="First Name">
                            <template v-slot:prepend>
                                <q-icon name="man" />
                            </template>
                        </q-input>
                        <q-input v-model="memberFields.LastName"
                                 :rules="newMemberRules.name"
                                 ref="lastNameRef"
                                 filled bottom-slots
                                 label="Last Name">
                            <template v-slot:prepend>
                                <q-icon name="man" />
                            </template>
                        </q-input>
                        <q-input v-model="memberFields.BusinessName"
                                 filled bottom-slots
                                 label="Name of Business">
                            <template v-slot:prepend>
                                <q-icon name="store" />
                            </template>
                        </q-input>
                        <q-input v-model="memberFields.Email"
                                 :rules="newMemberRules.email"
                                 :lazy-rules="true"
                                 ref="emailRef"
                                 filled bottom-slots
                                 label="Email">
                            <template v-slot:prepend>
                                <q-icon name="email" />
                            </template>
                        </q-input>
                        <q-input v-model="memberFields.Phone"
                                 :rules="newMemberRules.phone"
                                 :lazy-rules="true"
                                 filled bottom-slots
                                 label="Phone"
                                 mask="###-###-####">
                            <template v-slot:prepend>
                                <q-icon name="phone" />
                            </template>
                        </q-input>
                        <q-input v-model="memberFields.Password" filled bottom-slots
                                 :type="state.displayPassword ? 'text' : 'password'"
                                 :rules="newMemberRules.password"
                                 :lazy-rules="true"
                                 ref="passwordRef"
                                 label="Password">
                            <template v-slot:prepend>
                                <q-icon name="password" />
                            </template>
                            <template v-slot:append>
                                <q-icon
                                    :name="state.displayPassword ? 'visibility' : 'visibility_off'"
                                    class="cursor-pointer"
                                    @click="state.displayPassword = !state.displayPassword"
                                />
                            </template>
                        </q-input>
                        <q-input v-model="memberFields.PasswordConfirm" filled bottom-slots
                                 :type="state.displayPassword ? 'text' : 'password'"
                                 :rules="newMemberRules.confirmPassword"
                                 :lazy-rules="true"
                                 ref="confirmPasswordRef"
                                 label="Confirm Password">
                            <template v-slot:prepend>
                                <q-icon name="password" />
                            </template>
                        </q-input>
                    </form>
                </div>
                <div class="text-center q-py-md">
                    <q-btn class="btnLogin full-width" label="Submit" no-caps ripple @click="registerMember()"/>
                </div>
            </q-card>
        </q-dialog>

        <!-- Moved this to components -->
        <q-dialog v-model="isSendingCode" persistent seamless ok-dialog>
            <q-card class="row justify-center q-dialog-plugin q-pa-md">
                <div class="col">
                    <div class="row justify-center">
                        <q-spinner color="white" size="lg"/>
                    </div>
                </div>
            </q-card>
        </q-dialog>

        <q-dialog v-model="isLoggingIn" class="bg-transparent" persistent seamless ok-dialog>
            <div class="row justify-center q-dialog-plugin q-pa-md bg-transparent">
                <div class="col">
                    <div class="row justify-center items-center">
                        <q-spinner color="white" size="lg"/>
                    </div>
                </div>
            </div>
        </q-dialog>

    </q-page>
</template>

<script>
import {defineComponent, reactive, ref} from 'vue';
import { useAppStore } from 'stores/app';
import { useMember } from 'src/use/useMember';
import {Dialog, useQuasar} from 'quasar';
import { graphql as graphQLApi } from 'src/api';
import _ from 'lodash';

export default defineComponent({
    name: "PageIndex",
    setup() {
        const $q = useQuasar();
        const {
            memberExistsQuery,
            sendSecurityCode,
            updatePassword
        } = useMember();

        const appStore = useAppStore();
        const isSendingCode = ref(false);
        const isCodeSend = ref(false);
        const memberExist = ref(false);
        const isLoggingIn = ref(false);

        const state = reactive({
            recoverEmail: '',
            recoverPassword: '',
            forgotPasswordDialog: false,
            customerDialog: false,
            securityCode: null,
            displayPassword: false,
        });

        const memberFields = reactive({
            FirstName: '',
            LastName: '',
            BusinessName: '',
            Email: '',
            Phone: '',
            Password: '',
            PasswordConfirm: '',
        });

        const firstNameRef = ref(null);
        const lastNameRef = ref(null);
        const emailRef = ref(null);
        const passwordRef = ref(null);
        const confirmPasswordRef = ref(null);

        const memberRefs = [
            firstNameRef,
            lastNameRef,
            emailRef,
            passwordRef,
            confirmPasswordRef,
        ];

        const newMemberRules = {
            name: [ (val) => (val && val.length > 0) || 'First and Last names are required' ],
            email: [ (val, rules) => rules.email(val) || 'Please enter a valid email address' ],
            phone: [ (val) => (val && val.length > 0) || 'Please enter a valid cellphone number' ],
            password: [ (val) => (val && val.length > 5) || 'Password must be more than 5 characters long' ],
            confirmPassword: [ (val) => val === memberFields.Password || 'Passwords do not match' ],
        };

        const closeForgotPassword = () => {
            state.forgotPasswordDialog = false;
        }

        const showForgotPasswordDialog = () => {
            resetForgotPasswordState();
            state.forgotPasswordDialog = true;
        }

        function sendCode(param) {
            // Show loader
            isSendingCode.value = true;
            return sendSecurityCode(param).then(res => {
                setTimeout(() => {
                    isSendingCode.value = false; // Hide loader
                    isCodeSend.value = res.data.data.SendSecurityCode;

                    if(!isCodeSend.value) {
                        $q.notify({
                            color: 'negative',
                            position: 'top',
                            message: "There was a problem sending the reset code. Try again later."
                        });
                    }
                } , 1500);
            })
        }

        function checkMember() {
            let email = state.recoverEmail.trim();
            let password = state.recoverPassword.trim();

            if (email.length && password.length) {
                memberExistsQuery(email).then(res => {
                    const exist = res.data.data.MemberExist;
                    if (exist) {
                        // If member exist send the reset code
                        sendCode(email)
                            .catch(error => {
                                isSendingCode.value = false;
                                isCodeSend.value = false;

                                $q.notify({
                                    color: 'negative',
                                    position: 'top',
                                    message: "Something went wrong. Please try again later"});
                            })
                    } else {
                        $q.notify({
                            color: 'negative',
                            position: 'top',
                            message: 'Member not found.'
                        });
                    }
                })
            } else {
                $q.notify({
                    color: 'negative',
                    position: 'top',
                    message: 'Email/phone and password fields are required.',
                });
            }
        }

        function confirmUpdatePassword() {
            updatePassword(state.securityCode.trim(), state.recoverPassword.trim()).then(res => {
                let success = res.data.data.UpdatePasswordByCode;
                // reset all for security reasons
                resetForgotPasswordState();

                if(!success) {
                    $q.notify({
                        color: 'negative',
                        position: 'top',
                        message: "Invalid Code. Please try again."
                    });

                    return false;
                }

                $q.notify({
                    position: 'top',
                    message: "Success. Your password has been updated."
                });
            })
        }

        const resetForgotPasswordState = () => {
            state.forgotPasswordDialog = false; // hide forgot password dialog
            state.recoverEmail = '';
            state.recoverPassword = '';
            state.securityCode = null;
        }

        const registerMember = async () => {
            let accept = true;
            _.forEach(memberRefs, (r) => {
                r.value.validate();
                if (r.value.hasError) {
                    console.log('ERROR', r.value.label);
                    accept = false;
                }
            });
            if (accept) {
                const processDialog = Dialog.create({
                    title: "Processing...",
                    ok: false,
                    persistent: true,
                });
                // register the member
                let memberData = _.clone(memberFields);
                delete memberData.PasswordConfirm;
                const result = await graphQLApi.postRequest('addMember', { NewMemberData: memberData });
                processDialog.hide();
                console.log(result);
                const data = result.data.data.AddMember;
                if (data) {
                    if(data.Status === 'failed') {
                        Dialog.create({
                            title: "Registration Failed",
                            message: data.Message,
                            ok: true,
                        });
                    } else {
                        Dialog.create({
                            title: "Registration Process",
                            message: data.Message,
                            ok: true,
                        });

                        state.registrationDisabled = true;
                    }

                    state.customerDialog = false;
                } else {
                    Dialog.create({
                        title: "Registration Process",
                        message: 'An error was encountered during registration.  Please check your entries and try again.',
                        ok: true,
                    });
                }
            }
        }

        return {
            state,
            memberFields,
            newMemberRules,
            firstNameRef,
            lastNameRef,
            emailRef,
            passwordRef,
            confirmPasswordRef,
            memberRefs,
            appStore,
            isCodeSend,
            isSendingCode,
            isLoggingIn,
            checkMember,
            confirmUpdatePassword,
            closeForgotPassword,
            showForgotPasswordDialog,
            registerMember,
        };
    },
    data() {
        return {
            email: '',
            password: '',
            textFieldClass: 'q-mt-sm full-width text-center q-pa-sm',
        }
    },
    computed: {
    },
    mounted() {
        // todo: clean all local storage. useSecurity logout seems retaining the vuex key. Investigate when have time
        console.log('MOUNTING, local storage', localStorage.getItem('userId'));
        if (!this.appStore.isLoggedIn) {
            localStorage.clear();
        } else {
            this.goToHome();
        }
        this.checkLoginStatus();
    },
    methods: {
        async startLogin() {
            let loader = null;
            const hideLoader = () => {
                loader = setTimeout(() => {
                    this.isLoggingIn = false
                    clearTimeout(loader);
                }, 1500);
            }

            if (this.email && this.password) {
                console.log('EMAIL AND PASSWORD', this.email, this.password);
                this.isLoggingIn = true;
                await this.appStore.login({
                    Email: this.email,
                    Password: this.password,
                })
                    .then(async (success) => {
                        if (success) {
                            console.log('WILL GET MEMBER INFO');
                            const member = await this.appStore.getMemberInfo();
                            console.log('HAS MEMBER INFO', this.appStore.isLoggedIn);

                            if (this.appStore.isLoggedIn) {
                                this.goToHome();
                            }
                        }
                        hideLoader();
                    })
                    .catch(() => hideLoader())

                this.checkLoginStatus();
            }
        },
        checkLoginStatus() {
            console.log('CHECKING LOGIN STATUS');
            let loggedIn = this.appStore.isLoggedIn;
            console.log('LOGGED IN?', loggedIn);
            if (loggedIn) {
                console.log('USER IS LOGGED IN');
                if (!this.member) {
                    this.appStore.getMemberInfo();
                } else {
                    this.goToHome();
                }
            } else {
                console.log('USER IS NOT LOGGED IN');
            }
        },
        goToHome() {
            this.$router.push("/");
        },
    },
});
</script>

<style scoped>
.btnLogin {
    color: #ffffff;
    font-weight: 800;
    text-transform: uppercase;
    background: rgb(36,0,4);
    background: linear-gradient(90deg, #325087 0%, #44b9f8 24%, #325087 100%);
}
:deep(.q-card__section.q-dialog__progress) {
    display: flex !important;
    justify-content: center !important;
}
.q-dialog-plugin {
    width:auto !important;
}
</style>
