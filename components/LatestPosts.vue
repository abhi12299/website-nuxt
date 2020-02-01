<template>
  <div class="container latest-posts-container">
    <div class="row">
      <div class="col-sm-12 text-center title">
        <h1>Latest Posts</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div v-if="loading" style="text-align: center;">
          <LoadingSVG
            :width="'50px'"
            :height="'50px'"
            :text="'Please wait...'"
          />
        </div>
        <div v-else v-for="post in latestPosts" :key="post._id">
          <PostTileV2 :post="post" />
        </div>
      </div>
    </div>
    <div v-if="!loading" class="row">
      <div class="d-flex justify-content-center col-sm-12 pad-top-50">
        <nuxt-link to="/blog">
          <div class="button-4">
            <div class="eff-4"></div>
            <span>All Blogs</span>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import LoadingSVG from './LoadingSVG'
import PostTileV2 from './PostTileV2'

export default {
  components: {
    LoadingSVG,
    PostTileV2
  },
  computed: {
    ...mapGetters({
      latestPosts: 'latestPosts/mappedLatestPosts'
    }),
    ...mapState({
      loading: (state) => state.latestPosts.loading
    })
  }
}
</script>
<style scoped>
.latest-posts-container {
  padding: 50px 0px;
}
.title {
  margin-bottom: 50px;
}
</style>
