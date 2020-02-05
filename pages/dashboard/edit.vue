<template>
  <div class="container">
    <div class="row">
      <PostEditor :type="'edit'" :localStorageBackupKeyName="lsKeyName" />
      <PostSidebar
        :type="'edit'"
        :localStorageBackupKeyName="lsKeyName"
        :defaultHeaderImage="DEFAULT_HEADER_IMAGE"
      />
      <SaveButton
        :type="'edit'"
        :localStorageBackupKeyName="lsKeyName"
        :defaultHeaderImage="DEFAULT_HEADER_IMAGE"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PostEditor from '~/components/dashboard/PostEditor'
import PostSidebar from '~/components/dashboard/PostSidebar'
import SaveButton from '~/components/dashboard/SaveButton'
import utils from '~/utils'

const DEFAULT_HEADER_IMAGE =
  'https://via.placeholder.com/600x600.png?text=Header+image+shown+here'

export default {
  layout: 'page',
  components: {
    PostEditor,
    PostSidebar,
    SaveButton
  },
  data() {
    return {
      DEFAULT_HEADER_IMAGE
    }
  },
  computed: {
    ...mapState({
      title: (state) => state.dashboardPost.title
    }),
    getTitle() {
      return this.title.trim().length > 0
        ? `${this.title} | Edit Post`
        : 'Edit Post'
    },
    lsKeyName() {
      const { id } = this.$route.query
      // localStorage key where local backup is taken
      return `edit-${id}`
    }
  },
  async fetch({ store, req, query, error }) {
    const { id } = query
    await store.dispatch('dashboardPost/fetchPost', { id, req })
    const { dashboardPost } = store.state
    if (dashboardPost.error) {
      error({
        statusCode: 404,
        errorMessage: 'Post not found!'
      })
    }
  },
  mounted() {
    const savedPost = utils.restorePostFromLocalStorage(this.lsKeyName)
    if (savedPost) {
      this.restorePostFromLocalStorage(savedPost)
    }
  },
  methods: {
    ...mapActions({
      restorePostFromLocalStorage: 'dashboardPost/restorePostFromLocalStorage'
    })
  },
  head() {
    return {
      title: this.getTitle
    }
  }
}
</script>
