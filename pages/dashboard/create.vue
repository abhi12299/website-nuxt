<template>
  <div class="container">
    <div class="row">
      <PostEditor />
      <PostSidebar :defaultHeaderImage="DEFAULT_HEADER_IMAGE" />
      <SaveButton :defaultHeaderImage="DEFAULT_HEADER_IMAGE" />
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
        ? `${this.title} | New Post`
        : 'Create Post'
    }
  },
  mounted() {
    const savedPost = utils.restorePostFromLocalStorage()
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
