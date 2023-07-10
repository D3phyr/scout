<template>
    <div :class="$style.headerContainer">
        <header>
            <div :class="$style.logo">
                <v-icon @click="backToMenu" :name="themeWhite ? 'logoInverted' : 'logo'"></v-icon>
                <v-image @click="changeTheme" :name="themeWhite ? 'moon' : 'sun'" :class="[$style.changeTheme, $style.mouseScale]"></v-image>
                <div :class="$style.headerElements">
                    <v-image
                    v-if="path === 'id' && roleId === 2 && $props.stage !== 3"
                    @click="$emit('deleteEvent')"
                    :class="[$style.iconBack,$props.buttonActive && $style.mouseScale, (!$props.socketConnect || $props.lastDeletableEventIndex === null || !$props.stage) && $style.buttonDisabled]"
                    :name="'backToMenu'"></v-image>
                    <!-- <v-image
                    v-if="path === 'id' && roleId === 2"
                    @click="$emit('refreshFile'); swapBatters = !swapBatters"
                    :name="'replace'"
                    :class="[$style.protocolImage, $style.swapBatters, swapBatters && $style.swapBattersRotate]"></v-image> -->
                </div>
            </div>
            <div :class="$style.headerElements">
                <div v-if="path === 'id' && roleId === 2 && $props.stage !== 3" @click="$emit('openPopupWidget')" :class="[$style.userName]">Виджеты</div>
                <v-image
                v-if="path === 'id' && roleId === 2 && $props.stage !== 3"
                @click="$emit('openPopupMatchLinkChange')"
                :name="'mic'"
                :class="[$style.protocolImage, $style.mouseScale, (!$props.socketConnect || !$props.stage) && $style.buttonDisabled]"></v-image>
                <v-image
                v-if="path === 'id' && roleId === 2 && $props.stage !== 3"
                :class="[$style.protocolImage, $style.mouseScale, (!$props.socketConnect || !$props.stage) && $style.buttonDisabled]"
                @click="$emit('changeControlPanel')"
                :name="$props.freeButtonMovement ? 'done' : 'freemove'"></v-image>
                <v-image
                v-if="path === 'id' && roleId === 2 && $props.stage !== 3"
                :class="[$style.protocolImage, $style.mouseScale, (!$props.socketConnect || !$props.stage) && $style.buttonDisabled]"
                @click="$emit('endGame')"
                :name="'close'"></v-image>
                <div v-if="path === 'id' && lazyToken && $props.stage !== 3" :class="[$style.userName]">{{$props.token}}</div>
                <div v-if="path === 'id' && $props.token && !lazyToken && $props.stage !== 3" @click="saveToken" :class="[$style.userName]">TOKEN</div>
                <!-- <div v-if="path === 'id'" :class="[$style.userName]">operator ID: {{userId}}</div> -->
                <v-image
                v-if="path !== 'login'"
                :class="[$style.iconProfile]"
                :name="'profile'"></v-image>
                <div v-if="path !== 'login'" :class="[$style.userName]">{{name}}</div>
                <v-image
                v-if="path === 'id'"
                :name="'protocol'"
                @click="$emit('downloadProtocol')"
                :class="[$style.protocolImage, $props.stage !== 3 && $style.buttonDisabled]"></v-image>
                <v-image
                v-if="path !== 'login'"
                @click="logout"
                :class="[$style.iconProfile, $style.mouseScale]"
                :name="'logout'"></v-image>
            </div>
        </header>
    </div>
</template>

<script>
import {
    ref, computed, onMounted,
    } from '@vue/composition-api'
import Vue from 'vue'

export default {
  name: 'v-matchHeader',
   props: {
        socketConnect: {
            type: Boolean,
            default: false,
        },
        token: {
            type: String,
            default: '',
        },
        stage: {
            type: Number,
            default: 0,
        },
        lastDeletableEventIndex: {
            type: Number,
            default: 0,
        },
        freeButtonMovement: {
            type: Boolean,
            default: false,
        },
    },
  setup(props, context) {
    const router = context.root.$router
    const store = context.root.$store
    // const emit = context.emit
    const path = computed(() => context.root.$route.name)
    const name = computed(() => context.root.$store.state.name)
    const userId = computed(() => context.root.$store.state.userId)
    const roleId = computed(() => store?.state?.roleId)
    const themeWhite = computed(() => context.root.$store.state.whiteTheme)

    const swapBatters = ref(false)
    const lazyToken = ref(false)

    const saveToken = () => {
        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(props.token)
            Vue.$toast.success('Токен скопирован в буфер обмена', {
                position: 'bottom-right',
            })
        } else {
            lazyToken.value = true
        }
    }

    const logout = async () => {
        await store.dispatch('logout')
        router.push('/login')
    }
    const backToMenu = () => {
        router.push('/')
    }
    const changeTheme = () => {
        const root = document.documentElement
        store.commit('changeTheme')
        if (themeWhite.value) {
            root.style.setProperty('--white', '#222222')
            root.style.setProperty('--black', '#FFFFFF')
            root.style.setProperty('--background', '#FFFFFF')
            root.style.setProperty('--yellow', '#FFBE16')
            root.style.setProperty('--grey', 'rgba(0, 0, 0, 0.1)')
            root.style.setProperty('--greenLight', '#67FF64')
            root.style.setProperty('--buttonBackColor', 'rgba(242,242,242,0.5)')
            root.style.setProperty('--matchInfoUnderlineColor', 'rgba(34,34,34,0.2)')
            root.style.setProperty('--inputBackColor', 'rgba(0, 0, 0, 0.05)')
            root.style.setProperty('--inputHoverColor', 'rgba(0, 0, 0, 0.15)')
            localStorage.setItem('theme', 'white')
        } else {
            root.style.setProperty('--white', '#FFFFFF')
            root.style.setProperty('--black', '#000000')
            root.style.setProperty('--background', 'linear-gradient(180deg, #242424 0%, #121212 100%)')
            root.style.setProperty('--yellow', '#FFF616')
            root.style.setProperty('--grey', 'rgba(255, 255, 255, 0.1)')
            root.style.setProperty('--greenLight', '#64FF99')
            root.style.setProperty('--buttonBackColor', 'rgba(0,0,0,0.5)')
            root.style.setProperty('--matchInfoUnderlineColor', 'rgba(255,255,255,0.2)')
            root.style.setProperty('--inputBackColor', 'rgba(255, 255, 255, 0.05)')
            root.style.setProperty('--inputHoverColor', 'rgba(255, 255, 255, 0.15)')
            localStorage.removeItem('theme')
        }
    }

    const checkTheme = () => {
        if (localStorage.getItem('theme') === 'white') {
            changeTheme()
        }
    }

    onMounted(() => {
        checkTheme()
    })

    return {
        logout,
        path,
        name,
        userId,
        backToMenu,
        changeTheme,
        themeWhite,
        roleId,
        checkTheme,
        saveToken,
        swapBatters,
        lazyToken,
    }
  },
}
</script>

<style lang="scss" module src="./style.scss"></style>
