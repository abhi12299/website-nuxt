<template>
  <div class="col-lg-9 col-md-8 col-sm-12 editor-container">
    <div class="post-title-container">
      <h3>
        <input
          ref="titleInput"
          @blur="handleTitleInputBlur"
          @input="handleTitleChange"
          :value="title"
          :disabled="saving"
          type="text"
          placeholder="Title"
          class="post-title"
        />
      </h3>
      <div class="my-auto">
        <UploadMediaButton />
      </div>
    </div>
    <small
      ref="titleError"
      class="errorText"
      style="margin-bottom: 20px;"
    ></small>
    <editor
      :api-key="tinyMceApiKey"
      :init="{
        height: 570,
        plugins: [
          'advlist autolink lists link codesample image charmap print anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect blockquote | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help',
        menubar: 'file edit view insert format tools table tc help',
        autosave_ask_before_unload: true,
        codesample_languages: [
          { text: 'HTML/XML', value: 'markup' },
          { text: 'JavaScript', value: 'javascript' },
          { text: 'CSS', value: 'css' },
          { text: 'PHP', value: 'php' },
          { text: 'Ruby', value: 'ruby' },
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' },
          { text: 'C', value: 'c' },
          { text: 'C#', value: 'csharp' },
          { text: 'C++', value: 'cpp' },
          { text: 'Go', value: 'go' },
          { text: 'Bash', value: 'bash' },
          { text: 'Docker', value: 'docker' },
          { text: 'HTTP', value: 'http' },
          { text: 'Markdown', value: 'markdown' },
          { text: 'React', value: 'jsx' }
        ],
        video_template_callback: handleVideoInput
      }"
      @onChange="handleEditorChange"
      @onKeyUp="handleEditorChange"
      @onBlur="handleEditorBlur"
      :initialValue="body"
      :disabled="saving"
    />
    <small ref="bodyError" class="errorText"></small>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Editor from '@tinymce/tinymce-vue'
import UploadMediaButton from './UploadMediaButton'
import { validatePostBody, validatePostTitle } from '~/utils/validate'
import apiKeys from '~/constants/apiKeys'

export default {
  components: {
    editor: Editor,
    UploadMediaButton
  },
  props: {
    localStorageBackupKeyName: {
      type: String,
      default: 'tempSavePost'
    },
    type: {
      type: String,
      default: 'create'
    }
  },
  computed: {
    tinyMceApiKey() {
      return apiKeys.TINY_MCE_API_KEY
    },
    ...mapState({
      title: (state) => state.dashboardPost.title,
      body: (state) => state.dashboardPost.body,
      saving: (state) => state.dashboardPost.saving
    })
  },
  mounted() {
    const { type } = this.$props
    if (type === 'edit') {
      this.handleTitleInputBlur()
      this.handleEditorBlur()
    }
  },
  methods: {
    ...mapActions({
      setPostTitle: 'dashboardPost/setPostTitle',
      setPostBody: 'dashboardPost/setPostBody'
    }),
    handleVideoInput(data) {
      return `<video src="${data.source1}" width="100%" height="100%" autoplay="autoplay" loop="loop" muted="" controls="controls"></video>`
    },
    handleTitleInputBlur() {
      const titleElem = this.$refs.titleInput
      const errorElem = this.$refs.titleError
      const title = titleElem.value.trim()
      const errorMsg = validatePostTitle(title)
      if (errorMsg) {
        titleElem.classList.add('error')
        errorElem.classList.add('show')
        errorElem.textContent = errorMsg
      } else {
        titleElem.classList.remove('error')
        errorElem.classList.remove('show')
        errorElem.textContent = ''
      }
    },
    handleTitleChange(e) {
      this.setPostTitle({
        title: e.target.value,
        backupKeyName: this.$props.localStorageBackupKeyName
      })
    },
    handleEditorChange(e, editor) {
      this.setPostBody({
        body: editor.getContent(),
        backupKeyName: this.$props.localStorageBackupKeyName
      })
    },
    handleEditorBlur() {
      const errorElem = this.$refs.bodyError

      const errorMsg = validatePostBody(this.body)
      if (errorMsg) {
        errorElem.classList.add('show')
        errorElem.textContent = errorMsg
      } else {
        errorElem.classList.remove('show')
        errorElem.textContent = ''
      }
    }
  }
}
</script>

<style scoped>
.editor-container {
  margin-top: 20px;
}

.post-title-container {
  display: flex;
  justify-content: space-between;
}

.post-title {
  width: 100%;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid black;
  padding: 5px 15px;
  outline: none;
  margin: 0 auto;
  /* width: 75%; */
}

.post-title.error {
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

.errorText,
.editor-container .errorText {
  display: none;
}

.errorText.show,
.editor-container .errorText.show {
  padding-top: 5px;
  display: block;
  color: red;
}

.errorText.show::before,
.editor-container .errorText.show::before {
  content: '* ';
}

.post-title::placeholder {
  /* Firefox, Chrome, Opera */
  color: gray;
}

.post-title:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: gray;
}

.post-title::-ms-input-placeholder {
  /* Microsoft Edge */
  color: gray;
}

.post-title[placeholder]:focus::-webkit-input-placeholder {
  transition: text-indent 1.5s 0.4s ease;
  text-indent: -100%;
  opacity: 1;
}

@media (max-width: 991px) {
  .post-title {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .post-title {
    width: 100%;
  }
  .post-title-container {
    flex-direction: column;
  }
}
</style>
