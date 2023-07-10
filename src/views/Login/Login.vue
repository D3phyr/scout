<template>
<div :class="$style.wrapper">
    <div :class="$style.authorizationContainer">
        <!-- Регистрация -->
        <template v-if="stage === 0">
                <div :class="$style.title">Регистрация</div>
                <div :class="$style.subtitle">Имя</div>
                <input @input="changeInput(1)" :class="regNameError && $style.error" type="text" v-model="regName">
                <div :class="$style.subtitle">Email</div>
                <input @input="changeInput(2)" :class="regMailError && $style.error" type="text" v-model="regMail">
                <div :class="$style.subtitle">Укажите ваш пароль</div>
                <input @input="changeInput(3)" :class="regFirstPassError && $style.error" type="password" v-model="regFirstPass">
                <div :class="$style.subtitle">Повторите пароль</div>
                <input @input="changeInput(3)" :class="regFirstPassError && $style.error" type="password" v-model="regSecondPass">
                <v-btn :color="'black'" @click="registration" :class="[$style.button, $style.buttonChangeStage]">Зарегистрироваться</v-btn>
                <v-btn :color="'grey'" :class="[$style.button]" @click="changeStage(1)">Уже зарегистрирован</v-btn>
        </template>
        <!-- Авторизация -->
        <template v-if="stage === 1">
                <div :class="$style.title">Авторизация</div>
                <div :class="$style.subtitle">Укажите вашу почту</div>
                <input @input="changeInput(4)" :class="authMailError && $style.error" type="text" v-model="authMail">
                <div :class="$style.subtitle">Укажите ваш пароль</div>
                <input @input="changeInput(5)" :class="authPassError && $style.error" type="password" v-model="authPass">
                <v-btn :color="'black'" :class="[$style.button, $style.buttonChangeStage]" @click="login">Войти</v-btn>
                <v-btn :color="'grey'" :class="[$style.button, $style.buttonChangeStage]" @click="changeStage(0)">Регистрация</v-btn>
                <v-btn :color="'grey'" :class="[$style.button]" @click="changeStage(2)">Забыл пароль</v-btn>
        </template>
        <!-- Восстановление пароля -->
        <template v-if="stage === 2">
            <div :class="$style.buttonBack">
                <v-image @click="changeStage(1)" :class="themeWhite && $style.invert" :name="'back'"></v-image>
            </div>
            <div :class="$style.title">Восстановление пароля</div>
            <div :class="$style.subtitle">Укажите вашу почту</div>
            <input @input="changeInput(6)" :class="recMailError && $style.error" type="text" v-model="recMail">
            <v-btn :color="'black'" @click="recovery" :class="[$style.button, $style.buttonChangeStage]">Восстановить пароль</v-btn>
        </template>
    </div>
</div>
</template>

<script>
import {
    ref, computed,
} from '@vue/composition-api'
import Vue from 'vue'

export default {
    name: 'Login',
    setup(props, context) {
        const router = context.root.$router
        const store = context.root.$store
        const themeWhite = computed(() => context.root.$store.state.whiteTheme)
        const stage = ref(1)
        const regName = ref()
        const regMail = ref()
        const regFirstPass = ref()
        const regSecondPass = ref()
        const authMail = ref()
        const authPass = ref()
        const recMail = ref()

        const regNameError = ref()
        const regMailError = ref()
        const regFirstPassError = ref()
        const authMailError = ref()
        const authPassError = ref()
        const recMailError = ref()

        const validateEmail = (email) => {
            console.log(email)
            return String(email)
                .toLowerCase()
                .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        }

        const validateName = (val) => {
            // console.log(val)
            if (val) {
                if (val.length < 4) {
                    Vue.$toast.error('Имя должно составлять не менее 4 символов', {
                        position: 'bottom-right',
                    })
                    return false
                }
                return String(val)
                    .toLowerCase()
                    .match(/^[a-zA-Z0-9]+$/)
            }
            return false
        }

        const validatePassowdReg = () => {
            if (regFirstPass.value && regSecondPass.value) {
                if (regFirstPass.value.length < 5) {
                    Vue.$toast.error('Пароль должен составлять не менее 4 символов', {
                        position: 'bottom-right',
                    })
                    return false
                }
                if (regFirstPass.value !== regSecondPass.value) {
                    Vue.$toast.error('Пароли должны совпадать', {
                        position: 'bottom-right',
                    })
                    return false
                }
                return (String(regFirstPass.value).toLowerCase().match(/^[a-zA-Z0-9`!@#$%^&*()_+\-={};':"|,.<>?~]+$/) && String(regSecondPass.value).toLowerCase().match(/^[a-zA-Z0-9]+$/))
            }
            Vue.$toast.error('Заполните оба поля для паролей', {
                position: 'bottom-right',
            })
            return false
        }

        const validatePassowdAuth = () => {
            if (authPass.value) {
                if (authPass.value.length < 5) {
                    Vue.$toast.error('Пароль должен составлять не менее 4 символов', {
                        position: 'bottom-right',
                    })
                    return false
                }
                return (String(authPass.value).toLowerCase().match(/^[a-zA-Z0-9`!@#$%^&*()_+\-={};':"|,.<>?~]+$/))
            }
            return false
        }

        const registration = async () => {
            if (regMail.value || regName.value || regFirstPass.value || regSecondPass.value) {
                if (!validateEmail(regMail.value)) {
                    regMailError.value = true
                    Vue.$toast.error('Проверьте написание вашей почты', {
                        position: 'bottom-right',
                    })
                }
                if (!validateName(regName.value)) {
                    regNameError.value = true
                    Vue.$toast.error('Имя может содержать только цифры и буквы Латинского алфавита', {
                        position: 'bottom-right',
                    })
                }
                if (!validatePassowdReg()) {
                    regFirstPassError.value = true
                    Vue.$toast.error('Пароль может содержать только цифры и буквы Латинского алфавита', {
                        position: 'bottom-right',
                    })
                }
                if (!regMailError.value && !regNameError.value && !regFirstPassError.value) {
                    const responseData = {
                        name: regName.value,
                        email: regMail.value,
                        password: regFirstPass.value,
                    }
                    const result = await store.dispatch('registration', responseData)
                    if (result.status === 400) {
                        Vue.$toast.error(result.data, {
                            position: 'bottom-right',
                        })
                    } else if (result.status === 200) {
                        stage.value = 1
                    }
                }
            } else {
                Vue.$toast.error('Все поля должны быть заполнены', {
                    position: 'bottom-right',
                })
            }
        }

        const changeStage = (val) => {
            stage.value = val
        }

        const login = async () => {
            if (authMail.value || authPass.value) {
                if (!validateEmail(authMail.value)) {
                    authMailError.value = true
                    Vue.$toast.error('Проверьте написание вашей почты', {
                        position: 'bottom-right',
                    })
                }
                if (!validatePassowdAuth()) {
                    authPassError.value = true
                    Vue.$toast.error('Пароль может содержать только цифры и буквы Латинского алфавита', {
                        position: 'bottom-right',
                    })
                }
                if (!authMailError.value && !authPassError.value) {
                    const responseData = {
                        email: authMail.value,
                        password: authPass.value,
                    }
                    const result = await store.dispatch('authorization', responseData)
                    if (result.token) {
                        router.push('/')
                    }
                }
            } else {
                Vue.$toast.error('Все поля должны быть заполнены', {
                    position: 'bottom-right',
                })
            }
        }

        const recovery = async () => {
            if (!validateEmail(recMail.value)) {
                Vue.$toast.error('Проверьте написание вашей почты', {
                    position: 'bottom-right',
                })
                recMailError.value = true
            }
            if (!recMailError.value) {
                const responseData = {
                    email: recMail.value,
                }
                const result = await store.dispatch('recovery', responseData)
                if (result) {
                    // console.log(result)
                    if (result === true) {
                        stage.value = 1
                        Vue.$toast.success('Письмо с паролем отправлено вам на почту', {
                            position: 'bottom-right',
                        })
                    }
                }
            }
        }

        const changeInput = (val) => {
            switch (val) {
                case 1: {
                    regNameError.value = false
                    break
                }
                case 2: {
                    regMailError.value = false
                    break
                }
                case 3: {
                    regFirstPassError.value = false
                    break
                }
                case 4: {
                    authMailError.value = false
                    break
                }
                case 5: {
                    authPassError.value = false
                    break
                }
                case 6: {
                    recMailError.value = false
                    break
                }
                default:
            }
        }

        return {
            stage,
            themeWhite,
            changeStage,
            login,
            regName,
            regMail,
            regFirstPass,
            regSecondPass,
            registration,
            authMail,
            authPass,
            recMail,
            recovery,
            regNameError,
            regMailError,
            regFirstPassError,
            authMailError,
            authPassError,
            recMailError,
            validateEmail,
            changeInput,
            validateName,
            validatePassowdReg,
            validatePassowdAuth,
        }
    },
}
</script>

<style lang="scss" module>
.wrapper {
    display: flex;
    height: 90vh;
    justify-content: center;
    align-items: center;

    .authorizationContainer {
        width: 32rem;
        display: flex;
        flex-direction: column;

        .title {
            width: 100%;
            font-weight: 700;
            @include teamName;
            color: var(--red);
            margin-bottom: 4rem;
            text-align: center;
        }

        .subtitle {
            font-weight: 400;
            @include text-small;
            color: var(--white);
            opacity: 0.5;
        }

        input {
            background: var(--inputBackColor);
            width: 100%;
            border-radius: var(--border-radius);
            outline: none;
            border: 0;
            height: 5rem;
            padding: 0 1.5rem;
            margin: 1rem 0 2rem;
            color: var(--white);
            font-weight: 400;
            @include text-small;
        }
        input:hover {
            background: var(--inputHoverColor);
        }
        input:focus {
            border: 2px solid var(--white);
        }
        .error {
            border: 2px solid var(--red);
            color: var(--red);
        }
        .error:focus {
            border: 2px solid var(--red);
        }

        .resendLetter {
            font-weight: 400;
            @include text-small;
            color: var(--white);
            opacity: 0.5;
            margin-top: 1.5rem;
            width: 100%;
            text-align: center;
        }

        .inputContainer {
            width: 100%;
            display: flex;
            gap: 1rem;
            margin: 1rem 0 2rem;

            .inputItem {
                background: var(--inputBackColor);
                width: 100%;
                border-radius: var(--border-radius);
                height: 5rem;
                display: flex;
                align-items: center;

                .inputNumber {
                    color: var(--white);
                    width: 100%;
                    text-align: center;
                    @include title;
                    font-weight: 400;
                }
            }
        }
        .sendLetter {
            margin-top: 1.5rem;
        }
        .buttonChangeStage {
            margin-bottom: 1rem;
        }
        .buttonBack {
            position: absolute;
            width: 3rem;
            height: 3rem;
            left: 3rem;
            top: 12.7rem;
        }
    }
}
.invert {
    filter: invert(1);
}
</style>
