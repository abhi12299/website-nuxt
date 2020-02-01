<template>
  <div>
    Custom error page
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    statusCode: {
      type: Number,
      default: 500
    },
    errorMessage: {
      type: String,
      default: 'Something went wrong!'
    }
  },
  computed: {
    ...mapState({
      initiateForceLogout: (state) => state.auth.initiateForceLogout
    })
  },
  mounted() {
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
