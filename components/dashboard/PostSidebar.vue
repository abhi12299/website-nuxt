<template>
  <div class="col-lg-3 col-md-4 col-sm-12 sidebar-container">
    <div class="post-header-image-container">
      <input
        ref="headerImageInput"
        @blur="handleHeaderImageInputBlur"
        @input="handleHeaderImageURLChange"
        :value="headerImage"
        :disabled="imageLoading || saving"
        type="text"
        class="post-header-image-url"
        placeholder="Enter header image URL"
      />
      <div v-show="imageLoading" class="loader-wait">
        <LoadingSVG width="20px" height="20px" />
      </div>
      <small ref="headerImageError" class="errorText"></small>
      <div class="header-image-preview">
        <img :src="getHeaderImage" alt="header-image" class="header-img" />
      </div>
      <hr />
      <div class="post-meta-desc-container">
        <textarea
          ref="metaDescInput"
          :disabled="saving"
          @input="handleMetaDescriptionChange"
          :value="metaDescription || ''"
          @blur="handleMetaDescInputBlur"
          placeholder="Enter meta description here"
          class="post-meta-desc"
          maxLength="250"
        />
        <div class="counter">
          {{ metaDescription ? metaDescription.length : '--' }} / 250
        </div>
        <small ref="metaDescError" class="errorText"></small>
      </div>
      <div class="post-meta-keywords-container">
        <textarea
          ref="metaKeywordsInput"
          :disabled="saving"
          @input="handleMetaKeywordsChange"
          :value="metaKeywords || ''"
          @blur="handleMetaKeywordsBlur"
          placeholder="Enter meta keywords here (separated by comma)"
          class="post-meta-keywords-input"
          maxLength="300"
        />
        <div class="post-meta-keywords-view row mx-auto">
          <div
            v-for="(mk, idx) in metaKeywordsArray"
            :key="mk"
            @click="handleRemoveMetaKeyword(idx)"
            class="post-meta-keyword col-lg-4 col-md-4 col-4 my-1"
          >
            <span class="span-text">{{ mk }}</span>
            <span class="remove-keyword">&times;</span>
          </div>
        </div>
        <small ref="metaKeywordsError" class="errorText"></small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LoadingSVG from '../LoadingSVG'
import {
  validateHeaderImageURL,
  validateMetaDesc,
  validateMetaKeywords
} from '~/utils/validate'

export default {
  components: {
    LoadingSVG
  },
  props: {
    localStorageBackupKeyName: {
      type: String,
      default: 'tempSavePost'
    },
    saving: {
      type: Boolean
    },
    defaultHeaderImage: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'create'
    }
  },
  data() {
    return {
      imageLoading: false,
      isImageValid: false
    }
  },
  computed: {
    ...mapState({
      headerImage: (state) => state.dashboardPost.headerImageURL,
      metaDescription: (state) => state.dashboardPost.metaDescription,
      metaKeywords: (state) => state.dashboardPost.metaKeywords
    }),
    metaKeywordsArray() {
      const { metaKeywords } = this
      return (metaKeywords || '')
        .split(',')
        .filter((k) => k.trim().length > 0)
        .map((k) => k.trim())
    },
    getHeaderImage() {
      const { isImageValid, headerImage } = this
      const { defaultHeaderImage } = this.$props
      return isImageValid ? headerImage : defaultHeaderImage
    }
  },
  mounted() {
    const { type } = this.$props
    if (type === 'edit') {
      this.handleHeaderImageInputBlur()
      this.handleMetaDescInputBlur()
      this.handleMetaKeywordsBlur()
    }
  },
  methods: {
    ...mapActions({
      setHeaderImageURL: 'dashboardPost/setPostHeaderImage',
      setMetaDescription: 'dashboardPost/setPostMetaDesc',
      setMetaKeywords: 'dashboardPost/setPostMetaKeywords'
    }),
    handleRemoveMetaKeyword(i) {
      const mkArr = this.metaKeywordsArray.slice()
      mkArr.splice(i, 1)
      const newMetaKeywords = mkArr.join(',')
      this.setMetaKeywords({
        metaKeywords: newMetaKeywords,
        backupKeyName: this.$props.localStorageBackupKeyName
      })
      this.handleMetaKeywordsBlur()
    },
    handleHeaderImageURLChange(e) {
      this.setHeaderImageURL({
        headerImageURL: e.target.value,
        backupKeyName: this.$props.localStorageBackupKeyName
      })
    },
    handleMetaDescriptionChange(e) {
      this.setMetaDescription({
        metaDescription: e.target.value,
        backupKeyName: this.$props.localStorageBackupKeyName
      })
    },
    handleMetaKeywordsChange(e) {
      this.setMetaKeywords({
        metaKeywords: e.target.value,
        backupKeyName: this.$props.localStorageBackupKeyName
      })
    },
    async handleHeaderImageInputBlur() {
      this.imageLoading = true
      const inputElement = this.$refs.headerImageInput
      const errorElement = this.$refs.headerImageError
      const errorText = await validateHeaderImageURL(this.headerImage)

      this.imageLoading = false
      if (errorText) {
        this.isImageValid = false
        inputElement.classList.add('error')
        errorElement.classList.add('show')
        errorElement.textContent = errorText
      } else {
        this.isImageValid = true
        inputElement.classList.remove('error')
        errorElement.classList.remove('show')
        errorElement.textContent = ''
      }
    },
    handleMetaDescInputBlur() {
      const inputElement = this.$refs.metaDescInput
      const errorElement = this.$refs.metaDescError

      const metaDesc = inputElement.value.trim()
      const errorText = validateMetaDesc(metaDesc)
      if (errorText) {
        inputElement.classList.add('error')
        errorElement.classList.add('show')
        errorElement.textContent = errorText
      } else {
        inputElement.classList.remove('error')
        errorElement.classList.remove('show')
        errorElement.textContent = ''
      }
    },
    handleMetaKeywordsBlur() {
      const inputElement = this.$refs.metaKeywordsInput
      const errorElement = this.$refs.metaKeywordsError

      const metaKeywords = inputElement.value.trim()
      const errorText = validateMetaKeywords(metaKeywords)
      if (errorText) {
        inputElement.classList.add('error')
        errorElement.classList.add('show')
        errorElement.textContent = errorText
      } else {
        inputElement.classList.remove('error')
        errorElement.classList.remove('show')
        errorElement.textContent = ''
      }
    }
  }
}
</script>

<style scoped>
.sidebar-container {
  margin-top: 20px;
  text-align: center;
}

.sidebar-container .post-header-image-container {
  padding-top: 5px;
}

.sidebar-container .errorText {
  display: none;
}

.sidebar-container .errorText.show {
  display: block;
  padding-top: 5px;
  color: red;
}

.sidebar-container .errorText.show::before {
  content: '* ';
}

.sidebar-container .post-header-image-url,
.sidebar-container .post-meta-desc,
.sidebar-container .post-meta-keywords-input {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid black;
  padding: 5px 15px;
  outline: none;
  margin: 0 auto;
  width: 93%;
}

.sidebar-container .post-meta-desc-container .counter {
  text-align: right !important;
  font-size: 12px;
  padding-right: 13px;
  color: gray;
}

.sidebar-container .post-meta-desc::-webkit-scrollbar,
.sidebar-container .post-meta-keywords-input::-webkit-scrollbar {
  cursor: pointer;
  width: 10px;
  /* height: 12px;  */
}

.sidebar-container .post-meta-desc::-webkit-scrollbar-track,
.sidebar-container .post-meta-keywords-input::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.sidebar-container .post-meta-desc::-webkit-scrollbar-thumb,
.sidebar-container .post-meta-keywords-input::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.5);
}

.sidebar-container .post-meta-desc {
  height: 200px;
}

.sidebar-container .post-meta-keywords-input {
  height: 100px;
}

.sidebar-container .post-header-image-url.error,
.sidebar-container .post-meta-desc.error,
.sidebar-container .post-meta-keywords-input.error {
  border-bottom: 1px solid red;
  position: relative;
  animation: shake 0.1s linear;
  animation-iteration-count: 3;
}

@keyframes shake {
  0% {
    left: -3px;
  }
  100% {
    right: -3px;
  }
}

.sidebar-container
  .post-header-image-url[placeholder]:focus::-webkit-input-placeholder,
.sidebar-container
  .post-meta-desc[placeholder]:focus::-webkit-input-placeholder,
.sidebar-container
  .post-meta-keywords-input[placeholder]:focus::-webkit-input-placeholder {
  transition: text-indent 0.5s 0.4s ease;
  text-indent: -300%;
  opacity: 1;
}

.post-header-image-container .post-header-image-url::placeholder,
.post-meta-desc-container .post-meta-desc::placeholder,
.post-meta-keywords-container .post-meta-keywords-input::placeholder {
  /* Firefox, Chrome, Opera */
  color: gray;
}

.post-header-image-container .post-header-image-url:-ms-input-placeholder,
.post-meta-desc-container .post-meta-desc:-ms-input-placeholder,
.post-meta-keywords-container .post-meta-keywords-input::placeholder {
  /* Internet Explorer 10-11 */
  color: gray;
}

.post-header-image-container .post-header-image-url::-ms-input-placeholder,
.post-meta-desc-container .post-meta-desc::-ms-input-placeholder,
.post-meta-keywords-container .post-meta-keywords-input::placeholder {
  /* Microsoft Edge */
  color: gray;
}

.sidebar-container .loader-wait {
  float: right;
  width: 7%;
  background-color: transparent;
  text-align: right;
  outline: none;
  border: 0;
  padding: 0;
  margin-top: 5px;
}

.sidebar-container .header-image-preview {
  margin: 10px auto;
  height: 170px;
}

.sidebar-container img.header-img {
  object-fit: contain;
  border: 1px solid gray;
  width: 200px;
  height: 170px;
}

.sidebar-container .post-meta-keywords-container {
  margin-top: 10px;
}

.sidebar-container .post-meta-keywords-container .post-meta-keywords-view {
  margin-top: 10px;
  text-align: center;
  justify-content: center;
}

.sidebar-container .post-meta-keywords-container .post-meta-keyword {
  display: inline-flex;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 5px;
  background-color: #34495e;
  color: white;
  justify-content: space-evenly;
  cursor: pointer;
}

.sidebar-container .post-meta-keywords-container .post-meta-keyword .span-text {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .sidebar-container {
    text-align: left;
  }
  .sidebar-container .post-header-image-container {
    width: 70%;
  }
}
</style>
