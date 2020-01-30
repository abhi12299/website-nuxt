<template>
  <div>
    <IntroHeader v-if="showIntroHeader" />
    <Header />
    <div class="main-body-content">
      <nuxt />
    </div>
  </div>
</template>

<script>
import IntroHeader from '~/components/IntroHeader'
import Header from '~/components/Header'

export default {
  components: {
    IntroHeader,
    Header
  },
  data() {
    return {
      showIntroHeader: this.checkShowIntroHeader()
    }
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
