<template>
  <div>
    <Preloader />
    <transition name="fade">
      <IntroHeader v-show="showIntroHeader && !initiateForceLogout" />
    </transition>
    <Header />
    <div class="main-body-content">
      <AdminFAB v-if="admin" />
      <nuxt />
    </div>
    <client-only>
      <CookieBanner />
    </client-only>
    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CookieBanner from '~/components/CookieBanner'
import IntroHeader from '~/components/IntroHeader'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import AdminFAB from '~/components/AdminFAB'
import Preloader from '~/components/Preloader'

export default {
  components: {
    IntroHeader,
    Header,
    Footer,
    AdminFAB,
    Preloader,
    CookieBanner
  },
  data() {
    return {
      showIntroHeader: this.checkShowIntroHeader()
    }
  },
  computed: {
    ...mapState({
      admin: (state) => state.auth.admin,
      initiateForceLogout: (state) => state.auth.initiateForceLogout
    })
  },
  watch: {
    $route() {
      this.showIntroHeader = this.checkShowIntroHeader()
    }
  },
  methods: {
    checkShowIntroHeader() {
      return this.$route.path === '/'
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
