<template>
  <div>
    Custom error page
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    error: {
      type: Object,
      default: () => ({
        statusCode: 500,
        errorMessage: 'Something went wrong!'
      })
    }
  },
  computed: {
    ...mapState({
      initiateForceLogout: (state) => state.auth.initiateForceLogout
    })
  },
  mounted() {
    console.log(this.$props)
    if (this.initiateForceLogout) {
      this.logout().then(() => {
        this.$router.push('/')
      })
    }
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    })
  }
}
</script>
