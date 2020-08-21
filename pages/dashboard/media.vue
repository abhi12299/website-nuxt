<template>
  <div class="container">
    <Modal
      :maxWidth="'50%'"
      :show="showDeleteModal"
      :title="'Delete this media?'"
      :positiveActionButtonName="'Delete'"
      :negativeActionButtonName="'No'"
      :onPositiveAction="handleDelete"
      :onNegativeAction="handleDeleteClose"
      :onClose="handleDeleteClose"
      :triggerActionOnDismiss="false"
    >
      <div v-if="selectedMedia" class="delete-media-container">
        <img
          :data-src="selectedMedia.url"
          v-if="selectedMedia.type === 'image'"
          class="lazyload delete-media-img"
        />
        <video
          v-else
          :src="selectedMedia.url"
          controls="true"
          muted="true"
          class="deleted-media-video"
        />
      </div>
    </Modal>
    <div class="row container media-header">
      <div class="col-6">
        <UploadMediaButton :onUploadComplete="delayedReload" />
      </div>
      <div class="col-6">
        <div class="row">
          <div
            class="col-5"
            style="text-align: right; font-size: 18px; height: fit-content; margin-top: 25px;"
          >
            <div>
              Sort By:
            </div>
          </div>
          <div class="col-7" style="text-align: left">
            <Dropdown
              :options="dropdownOptions"
              :selected="selectedDropdownOption"
              v-on:updateOption="handleDropdownChange"
              :closeOnOutsideClick="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row container media-container">
      <Media
        v-for="m in media"
        :key="m._id"
        :media="m"
        @deleteClick="openDeleteModal"
        :loading="loading"
      />
    </div>
    <client-only>
      <Pagination
        v-if="count"
        :pageNo="page"
        :perPage="perPage"
        :totalItems="count"
      />
    </client-only>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Pagination from '~/components/Pagination'
import UploadMediaButton from '~/components/dashboard/UploadMediaButton'
import Dropdown from '~/components/Dropdown'
import Modal from '~/components/Modal'
import Media from '~/components/dashboard/Media'

export default {
  layout: 'page',
  components: {
    Pagination,
    UploadMediaButton,
    Dropdown,
    Modal,
    Media
  },
  watchQuery: ['page', 'sortBy', 'sortOrder'],
  data() {
    const dropdownOptions = [
      {
        name: 'Time (Latest first)',
        query: { sortBy: 'createdAt', sortOrder: '-1', page: 1 }
      },
      {
        name: 'Time (Oldest first)',
        query: { sortBy: 'createdAt', sortOrder: '1', page: 1 }
      },
      {
        name: 'Usage Freq (Desc)',
        query: { sortBy: 'usedInPublishedPosts', sortOrder: '-1', page: 1 }
      },
      {
        name: 'Usage Freq (Asc)',
        query: { sortBy: 'usedInPublishedPosts', sortOrder: '1', page: 1 }
      }
    ]
    return {
      perPage: 20,
      dropdownOptions,
      selectedDropdownOption: dropdownOptions[0],
      showDeleteModal: false,
      selectedMedia: null
    }
  },
  computed: {
    ...mapState({
      media: (state) => state.media.data,
      page: (state) => state.media.page,
      count: (state) => state.media.count,
      loading: (state) => state.media.loading
    }),
    title() {
      return `All Media - Page ${this.page}`
    }
  },
  async fetch({ store, req, query, error }) {
    await store.dispatch('media/fetchMedia', { query, req })
    const { media } = store.state
    if (media.error) {
      error({
        statusCode: 404,
        errorMessage: media.errorMessage || 'Something went wrong!'
      })
    }
  },
  mounted() {
    const { sortBy = 'createdAt', sortOrder = '-1' } = this.$route.query

    let filteredIndex = this.dropdownOptions.findIndex(
      (op) => op.query.sortBy === sortBy && op.query.sortOrder === sortOrder
    )
    filteredIndex = Math.max(0, filteredIndex)
    this.selectedDropdownOption = this.dropdownOptions[filteredIndex]
  },
  key: (to) => to.fullPath,
  transition(to, from) {
    if (!from) return 'slide-left'
    const { page: toPage = 1 } = to.query
    const { page: fromPage = 1 } = from.query
    return +toPage < +fromPage ? 'slide-right' : 'slide-left'
  },
  methods: {
    ...mapActions({
      deleteMedia: 'media/deleteMedia'
    }),
    handleDropdownChange(payload) {
      this.selectedDropdownOption = payload
      this.$router.push({
        query: {
          ...this.$route.query,
          ...payload.query
        }
      })
    },
    delayedReload() {
      setTimeout(() => window.location.reload(true), 1200)
    },
    async handleDelete() {
      await this.deleteMedia(this.selectedMedia?._id)
      this.handleDeleteClose()
    },
    handleDeleteClose() {
      this.showDeleteModal = false
      this.selectedMedia = null
    },
    openDeleteModal(_id) {
      this.selectedMedia = this.media.filter((m) => m._id === _id)[0]
      this.showDeleteModal = true
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>

<style scoped>
.media-header {
  margin-top: 10px;
}
.media-upload-container {
  margin-top: 5px;
}
.delete-media-container {
  text-align: center;
}
.deleted-media-video {
  width: 100%;
}
</style>
