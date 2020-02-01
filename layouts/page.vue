<template>
  <div>
    <transition name="fade">
      <IntroHeader v-if="showIntroHeader" />
    </transition>
    <Header />
    <div class="main-body-content">
      <AdminFAB v-if="admin" />
      <nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import IntroHeader from '~/components/IntroHeader'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import AdminFAB from '~/components/AdminFAB'

export default {
  components: {
    IntroHeader,
    Header,
    Footer,
    AdminFAB
  },
  data() {
    return {
      showIntroHeader: this.checkShowIntroHeader()
    }
  },
  computed: {
    ...mapState({
      admin: (state) => state.auth.admin
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

<style>
.page-enter-active {
  transition: opacity 0.25s ease-out;
}

.page-leave-active {
  transition: opacity 0.25s ease-in;
}

.page-enter,
.page-leave-active {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
