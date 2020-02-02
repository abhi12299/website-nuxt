<template>
  <div class="container">
    <div class="row">
      <!-- <div v-if="loading" class="mx-auto blog-loader">
        <transition name="fade">
          <LoadingSVG width="70px" height="70px" text="Please wait..." />
        </transition>
      </div> -->
      <template v-if="!loading && blogPosts.length">
        <div class="col-md-10 offset-lg-1 offset-md-1 text-center heading">
          <h2>All Blog Posts</h2>
        </div>
        <div v-for="post in blogPosts" :key="post._id">
          <PostTile :post="post" :adminButtons="adminButtons" />
        </div>
      </template>
      <div v-else class="col-md-10 offset-md-1">
        <div
          style="max-width: 50%"
          class="col container text-center mx-auto no-data-img-container"
        >
          <img src="~/assets/svg/no_data.svg" class="no-data-img" />
          <h4>No Blogs! Stay tuned!</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import LoadingSVG from './LoadingSVG'
import PostTile from './PostTile'

export default {
  components: {
    // LoadingSVG,
    PostTile
  },
  computed: {
    ...mapState({
      loading: (state) => state.posts.loading,
      blogPosts: (state) => state.posts.data,
      adminButtons: (state) => state.auth.admin
    })
  }
}
</script>

<style scoped>
.blog-loader {
  text-align: center;
  height: 50vh;
  width: 50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.heading {
  padding-top: 25px;
  padding-bottom: 20px;
  font-family: PoppinsBold;
  text-transform: uppercase;
}
</style>
