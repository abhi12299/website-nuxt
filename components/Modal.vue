<template>
  <div ref="customModal" class="custom-modal">
    <div :style="containerStyle" class="custom-modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ title }}</h5>
        <button @click="() => beforeClose(false)" type="button" class="close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div
        v-if="positiveActionButtonName || negativeActionButtonName"
        class="modal-footer"
      >
        <button @click="() => beforeClose(false)" class="btn btn-secondary">
          {{ negativeActionButtonName }}
        </button>
        <button @click="() => beforeClose(true, true)" class="btn btn-primary">
          {{ positiveActionButtonName }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Modal'
    },
    positiveActionButtonName: {
      type: String,
      default: ''
    },
    negativeActionButtonName: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean
    },
    onNegativeAction: {
      type: Function,
      default: () => {}
    },
    onPositiveAction: {
      type: Function,
      default: () => {}
    },
    promptBeforeClose: {
      type: Boolean
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    triggerActionOnDismiss: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    containerStyle() {
      const { maxWidth } = this.$props
      if (!maxWidth) return {}
      return {
        width: maxWidth
      }
    }
  },
  watch: {
    show: {
      handler() {
        if (this.show) {
          window.addEventListener('keydown', this.escapeKeyCloseModal, true)
          window.addEventListener('click', this.outsideClickCloseModal, true)
          this.openModal()
        } else {
          window.removeEventListener('click', this.outsideClickCloseModal, true)
          window.removeEventListener('keydown', this.escapeKeyCloseModal, true)
          this.closeModal()
        }
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('click', this.outsideClickCloseModal)
    window.removeEventListener('keydown', this.escapeKeyCloseModal)
  },
  methods: {
    escapeKeyCloseModal(e) {
      if (e.keyCode === 27) {
        const { triggerActionOnDismiss = true } = this.$props
        this.beforeClose(false, false, triggerActionOnDismiss)
      }
    },
    outsideClickCloseModal(e) {
      if (e.target === this.$refs.customModal) {
        const { triggerActionOnDismiss = true } = this.$props
        this.beforeClose(false, false, triggerActionOnDismiss)
      }
    },
    openModal() {
      this.$refs.customModal.style.display = 'block'
    },
    closeModal() {
      this.$refs.customModal.style.display = 'none'
    },
    beforeClose(
      isPositiveActionPerformed,
      forceClose = false,
      triggerActionOnDismiss = true
    ) {
      const { promptBeforeClose = false } = this.$props

      if (
        !forceClose &&
        promptBeforeClose &&
        !confirm('Are you sure you want to quit?')
      ) {
        return
      }

      if (triggerActionOnDismiss) {
        isPositiveActionPerformed
          ? this.$props.onPositiveAction && this.$props.onPositiveAction()
          : this.$props.onNegativeAction && this.$props.onNegativeAction()
      }
      this.$props.onClose()
    }
  }
}
</script>

<style scoped>
.custom-modal {
  z-index: 100;
  display: none;
  position: fixed;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

/* Modal Content */
.custom-modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
}

/* Add Animation */
@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}
</style>
