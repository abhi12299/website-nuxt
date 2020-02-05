<template>
  <div class="main-body-content">
    <section class="pad-75">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 ">
            <div class="notfound-wrapper pad-100 text-center">
              <h1>{{ error.statusCode }}</h1>
              <p>{{ error.errorMessage || error.message }}</p>

              <div class="d-flex justify-content-center col-sm-12">
                <div class="button-4">
                  <div class="eff-4"></div>
                  <span @click="goToHome">Back To Home</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  layout: 'page',
  props: {
    error: {
      type: Object,
      default: () => ({
        statusCode: 500,
        errorMessage: 'Something went wrong!',
        message: ''
      })
    }
  },
  computed: {
    ...mapState({
      initiateForceLogout: (state) => state.auth.initiateForceLogout
    }),
    title() {
      const { statusCode } = this.$props
      let t = 'Oops! Something went wrong.'
      switch (statusCode) {
        case 404:
          t = 'Oops! That page could not be found!'
          break

        case 500:
          t = 'Oops! There was some internal server error. Please try later.'
      }

      return t
    }
  },
  mounted() {
    if (this.initiateForceLogout) {
      this.logout().then(() => {
        this.$router.push('/')
        setTimeout(() => window.location.reload(), 0)
      })
    }
  },
  methods: {
    goToHome() {
      this.$router.replace('/')
    },
    ...mapActions({
      logout: 'auth/logout'
    })
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>

<style scoped>
.pad-75 {
  padding-top: 75px;
  padding-bottom: 75px;
}
.notfound-wrapper {
  background-image: url('../assets/png/bg-pattern-2.jpg');
  background-repeat: repeat;
}
.notfound-wrapper h1 {
  font-size: 180px;
  color: #999;
  letter-spacing: 5px;
  font-weight: bold;
  line-height: 140px;
  margin-bottom: 20px;
}
.notfound-wrapper p {
  color: #111;
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 30px;
  display: inline-block;
}

@media (max-width: 767px) {
  .pad-75 {
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .notfound-wrapper h1 {
    font-size: 120px;
    margin-bottom: 0;
    line-height: 1;
  }
}
</style>
