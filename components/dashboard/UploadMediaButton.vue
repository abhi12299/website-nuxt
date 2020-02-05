<template>
  <div class="media-upload-container">
    <client-only>
      <ImageCropper
        :show="!!imageBlob"
        :blob="imageBlob"
        :onClose="closeImageCropper"
        :onComplete="handleImageCrop"
        :onCancel="handleImageCropCancel"
      />
    </client-only>
    <label class="media-upload-label my-auto">
      <input
        ref="uploadInput"
        @input="handleMedia"
        type="file"
        class="media-upload"
        accept="image/*, video/*"
      />
      <span ref="uploadStatusRef">Upload</span>
    </label>
  </div>
</template>

<script>
import utils from '../../utils'
import { showToast } from '../../utils/toasts'
import ImageCropper from './ImageCropper'
import baseURL from '~/server/constants/apiURL'

export default {
  components: {
    ImageCropper
  },
  props: {
    onUploadComplete: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isMediaUploading: false,
      imageBlob: '',
      filename: ''
    }
  },
  methods: {
    handleImageCropCancel() {
      showToast('Upload cancelled!', 'info')
      this.$refs.uploadInput.value = ''
    },
    handleImageCrop(blob) {
      this.upload(blob, this.filename)
    },
    closeImageCropper() {
      this.imageBlob = ''
    },
    handleMedia(e) {
      const { files } = e.target
      if (files && files.length > 0) {
        const file = files[0]
        const type = utils.checkfileType(file)
        this.filename = file.name
        switch (type) {
          case 'image-svg':
          case 'image-gif':
            this.upload(file, this.filename)
            break
          case 'image':
            let url
            if (URL) {
              url = URL.createObjectURL(file)
              this.imageBlob = url
            } else if (FileReader) {
              const reader = new FileReader()
              reader.onload = function(e) {
                url = reader.result
                this.imageBlob = url
              }
              reader.readAsDataURL(file)
            }
            break
          case 'video':
            const fileSizeInMB = file.size * 1e-6
            if (fileSizeInMB >= 20) {
              showToast('File size too large!', 'error')
              return
            }
            this.upload(file, this.filename)
            break
          default:
            showToast('Unknown file type!', 'error')
        }
      }
    },
    upload(blob, filename) {
      if (blob) {
        const blobSizeInMB = blob.size * 1e-6
        // imageCropper onComplete calls it directly
        // hence the check
        if (this.isBlobImage(blob) && blobSizeInMB >= 2) {
          showToast('File size too large!', 'error')
          this.$refs.uploadInput.value = ''
          return
        }
        this.isMediaUploading = true
        utils.uploadMedia(blob, filename, {
          cbOnProgress: this.handleUploadProgress,
          cbOnComplete: this.handleUploadComplete,
          cbOnError: this.handleUploadError
        })
      } else {
        showToast('Something went wrong!', 'error')
      }
    },
    isBlobImage(blob) {
      const mimeType = blob.type
      return /^image\/.*/i.test(mimeType)
    },
    handleUploadProgress(e) {
      const percent = (e.loaded / e.total) * 100
      const progress = Math.round(percent)
      this.$refs.uploadStatusRef.textContent = `${progress}% done`
    },
    handleUploadComplete(resp) {
      if (!resp.error) {
        const { path } = resp
        utils.copyToClipboard(baseURL + path)
        showToast('Upload successful! Link copied!', 'success')
      } else {
        showToast('Upload successful! Link could not be copied', 'info')
      }
      this.$props.onUploadComplete()

      this.$refs.uploadStatusRef.textContent = 'Upload'
      this.$refs.uploadInput.value = ''
      this.isMediaUploading = false
    },
    handleUploadError() {
      showToast('Upload failed!', 'error')
      this.$refs.uploadStatusRef.textContent = 'Upload'
      this.$refs.uploadInput.value = ''
      this.isMediaUploading = false
    }
  }
}
</script>

<style scoped>
.media-upload-label {
  border: 2px solid black;
  border-radius: 2px;
  padding: 4px 8px;
  display: inline-block;
}

.media-upload {
  position: absolute;
  top: -10000px;
}
</style>
