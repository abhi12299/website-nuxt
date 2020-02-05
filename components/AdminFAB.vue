<template>
  <div id="adminFAB">
    <div @click="goToDashboard">
      <div class="button-4 links adminDashboard">
        <div class="eff-4" />
        <span>
          <font-awesome-icon :icon="['fas', 'user']" /> &nbsp;&nbsp; Dashboard
        </span>
      </div>
    </div>
    <div @click="handleLogout">
      <div class="button-4 links adminLogout">
        <div class="eff-4" />
        <span>
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" /> &nbsp;&nbsp;
          Logout
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      xDown: null,
      yDown: null
    }
  },
  mounted() {
    document.addEventListener('touchstart', this.handleTouchStart, false)
    document.addEventListener('touchmove', this.handleTouchMove, false)

    this.xDown = null
    this.yDown = null
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    handleLogout() {
      this.logout().then(() => {
        this.$router.push('/')
      })
    },
    goToDashboard() {
      this.$router.push('/dashboard')
    },
    getTouches(evt) {
      return evt.touches || evt.originalEvent.touches
    },
    handleTouchStart(evt) {
      const firstTouch = this.getTouches(evt)[0]
      this.xDown = firstTouch.clientX
      this.yDown = firstTouch.clientY
    },
    handleTouchMove(evt) {
      if (!this.xDown || !this.yDown) {
        return
      }

      const xUp = evt.touches[0].clientX
      const yUp = evt.touches[0].clientY

      const xDiff = this.xDown - xUp
      const yDiff = this.yDown - yUp

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          // open both sidebars
          document.querySelectorAll('#adminFAB .links').forEach((elem) => {
            elem.classList.add('opened')
            elem.classList.remove('closed')
          })
        } else {
          // close both sidebars
          document.querySelectorAll('#adminFAB .links').forEach((elem) => {
            elem.classList.add('closed')
            elem.classList.remove('opened')
          })
        }
      }
      this.xDown = null
      this.yDown = null
    }
  }
}
</script>

<style scoped>
@media (min-width: 767px) {
  #adminFAB .links {
    transition: 0.3s;
  }
  #adminFAB .links:hover {
    right: -35px;
    color: white;
  }
}

@media (max-width: 767px) {
  #adminFAB .opened span {
    color: white;
  }
}

#adminFAB .links span:hover {
  color: white !important;
}

#adminFAB .links:hover,
#adminFAB .links:active {
  color: black !important;
}

#adminFAB .links {
  position: fixed;
  z-index: 1000;
  right: -132px;
  text-align: left;
  padding-left: 15px;
  border-radius: 20px;
  background-color: white;
}

#adminFAB .opened {
  animation: slideLeft 0.3s forwards;
}

#adminFAB .opened .eff-4 {
  left: 0;
}

#adminFAB .closed .eff-4 {
  left: -180px;
}

#adminFAB .closed {
  animation: slideRight 0.3s ease-in-out;
}

@keyframes slideLeft {
  100% {
    right: -35px;
    color: white;
  }
}

@keyframes slideRight {
  100% {
    right: -132px;
    background-color: white;
  }
}

#adminFAB .adminLogout {
  bottom: 20px;
}

#adminFAB .adminDashboard {
  bottom: 80px;
}
</style>
