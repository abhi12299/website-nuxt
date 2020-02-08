<template>
  <transition name="fade">
    <div v-if="show" class="cookiealert">
      <div class="row container mx-auto">
        <div class="col-9 cookietext">
          The website uses cookies 🍪. If you continue to use the website, I
          assume you are okay with it.
        </div>
        <div @click="handleAcceptCookies" class="cookie-btn col-3">
          I agree
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  mounted() {
    const isAccepted = localStorage.getItem('cookieAccepted')
    this.show = !isAccepted
  },
  methods: {
    handleAcceptCookies() {
      this.show = false
      localStorage.setItem('cookieAccepted', true)
    }
  }
}
</script>

<style scoped>
.cookiealert {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0 !important;
  z-index: 9999;
  border-radius: 0px;
  background-color: rgba(12, 12, 12, 0.85);
}
.cookietext {
  margin: 5px 0px;
  color: white;
  font-size: 14px;
  align-self: center;
}

.cookie-btn {
  color: white;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  text-align: center;
  align-self: center;
}

@media (min-width: 991px) {
  .cookietext {
    margin: 15px 0px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
