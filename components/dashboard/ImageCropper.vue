<template>
  <Modal
    :title="'Crop Image'"
    :show="show"
    :promptBeforeClose="true"
    :onNegativeAction="onCancel"
    :onPositiveAction="handleCropImage"
    :onClose="handleCloseCropper"
    :positiveActionButtonName="'Crop'"
    :negativeActionButtonName="'Cancel'"
  >
    <div class="img-container">
      <vue-cropper
        ref="cropper"
        v-if="show"
        :src="blob"
        alt="Source Image"
      ></vue-cropper>
    </div>
  </Modal>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import Modal from '../Modal'

export default {
  components: {
    Modal,
    VueCropper
  },
  props: {
    show: {
      type: Boolean
    },
    blob: {
      type: String,
      default: ''
    },
    onComplete: {
      type: Function,
      default: () => {}
    },
    onCancel: {
      type: Function,
      default: () => {}
    },
    onClose: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    handleCloseCropper() {
      this.$props.onClose()
    },
    handleCropImage() {
      const canvas = this.$refs.cropper.getCroppedCanvas()
      canvas.toBlob((blob) => {
        this.$props.onComplete(blob)
      })
    }
  }
}
</script>

<style scoped>
.img-container {
  text-align: center;
}
</style>
