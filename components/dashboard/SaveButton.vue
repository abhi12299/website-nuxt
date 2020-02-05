<template>
  <div class="col-lg-12 col-md-12 col-sm-12 save-container">
    <div
      :class="`button-4 mx-auto ${saving ? ' no-cursor' : ''}`"
      @click="handleSavePost"
    >
      <LoadingSVG v-if="saving" width="43" height="43" />
      <div v-else>
        <div class="eff-4" />
        <span>
          <font-awesome-icon :icon="['fas', 'bookmark']" /> &nbsp;&nbsp; Save
          Post
        </span>
      </div>
    </div>
    <Modal
      :maxWidth="'50%'"
      :show="showBeforeSaveModal"
      :title="'Alert!'"
      :positiveActionButtonName="'Yes, keep the old id'"
      :negativeActionButtonName="'No, change the id'"
      :onPositiveAction="handlePositiveAction"
      :onNegativeAction="handleNegativeAction"
      :onClose="handleClose"
      :triggerActionOnDismiss="false"
    >
      <div>
        <p>
          The post has a new title. This means that the id for this post will
          change. I suggest keeping the same id and just updating the title and
          the rest of the contents. Do you want to keep the old id?
          <br />
          <small className="text-danger">
            * Please note that changing the id will have its implications(on SEO
            for example)!
          </small>
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LoadingSVG from '../LoadingSVG'
import Modal from '../Modal'
import {
  validatePostTitle,
  validatePostBody,
  validateHeaderImageURL
} from '../../utils/validate'
import { showToast } from '../../utils/toasts'

export default {
  components: {
    Modal,
    LoadingSVG
  },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    localStorageBackupKeyName: {
      type: String,
      default: 'tempSavePost'
    },
    defaultHeaderImage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showBeforeSaveModal: false
    }
  },
  computed: {
    ...mapState({
      saving: (state) => state.dashboardPost.saving,
      headerImageURL: (state) => state.dashboardPost.headerImageURL,
      title: (state) => state.dashboardPost.title,
      body: (state) => state.dashboardPost.body,
      prevTitle: (state) => state.dashboardPost.prevTitle,
      metaDescription: (state) => state.dashboardPost.metaDescription,
      metaKeywords: (state) => state.dashboardPost.metaKeywords,
      _id: (state) => state.dashboardPost._id
    })
  },
  methods: {
    ...mapActions({
      setPostSaving: 'dashboardPost/setPostSaving',
      savePost: 'dashboardPost/savePost',
      editPost: 'dashboardPost/editPost'
    }),
    transformMetaKeywords() {
      const { metaKeywords } = this
      return metaKeywords
        .split(',')
        .filter((k) => k.trim().length > 0)
        .map((k) => k.trim())
    },
    handlePositiveAction() {
      this.dispatchEditPostAction(true)
    },
    handleNegativeAction() {
      this.dispatchEditPostAction(false)
    },
    async dispatchEditPostAction(keepOldId = true) {
      const { title, body, headerImageURL, metaDescription, _id } = this
      const { localStorageBackupKeyName } = this.$props
      const { error, msg = '' } = await this.editPost(
        {
          title,
          body,
          metaDescription,
          headerImageURL,
          metaKeywords: this.transformMetaKeywords(),
          _id
        },
        keepOldId
      )
      if (!error) {
        localStorage.removeItem(localStorageBackupKeyName)
        await showToast('Post was updated successfully!', 'success', {
          timeOut: 1000,
          extendedTimeout: 1000
        })
        this.$router.push('/dashboard/posts')
      } else {
        showToast(msg || 'There was some error updating the post!', 'error')
      }
    },
    handleClose() {
      this.showBeforeSaveModal = false
      this.setPostSaving(false)
    },
    async handleSavePost() {
      const { title, body, prevTitle, headerImageURL, metaDescription } = this
      const {
        type,
        localStorageBackupKeyName,
        defaultHeaderImage
      } = this.$props

      let errorText = ''
      // validate mandatory fields
      errorText = validatePostTitle(title)
      if (errorText) {
        showToast(errorText, 'error')
        return
      }
      errorText = validatePostBody(body)
      if (errorText) {
        showToast(errorText, 'error')
        return
      }

      // validate other fields
      if (headerImageURL.length > 0 && headerImageURL !== defaultHeaderImage) {
        errorText = await validateHeaderImageURL(headerImageURL)
        if (errorText) {
          showToast(errorText, 'error')
          return
        }
      }

      if (type === 'create') {
        const { error } = await this.savePost({
          title,
          body,
          metaDescription,
          headerImageURL,
          metaKeywords: this.transformMetaKeywords()
        })
        if (error) {
          showToast('Post cannot be saved!', 'error')
        } else {
          localStorage.removeItem(localStorageBackupKeyName)
          await showToast('Post saved!', 'success', {
            timeOut: 1000,
            extendedTimeout: 1000
          })
          this.$router.push('/dashboard/posts')
        }
      } else if (type === 'edit' && prevTitle !== title) {
        this.showBeforeSaveModal = true
      } else if (type === 'edit' && prevTitle === title) {
        await this.dispatchEditPostAction()
      }
    }
  }
}
</script>

<style scoped>
.save-container {
  margin-bottom: 50px;
  text-align: center;
  justify-content: center;
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.save-container .no-cursor {
  cursor: default !important;
}
</style>
