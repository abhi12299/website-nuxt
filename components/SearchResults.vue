<template>
  <div class="row search-results-container">
    <template v-if="searchResults.length">
      <div class="col-md-10 offset-md-1">
        <div class="search-results-count-info">
          <h4>
            Showing Results {{ lowerLimit }} to {{ upperLimit }} of {{ count }}
          </h4>
        </div>
      </div>
      <div v-for="s in searchResults" :key="s._id">
        <PostTile :post="s" :adminButtons="admin" route="search" />
      </div>
    </template>
    <div v-else class="no-search-results col-md-10 offset-md-1">
      <div class="col container mx-auto no-data-img-container">
        <img src="~/assets/svg/no_data.svg" class="no-data-img" />
        <h4>No results found!</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PostTile from './PostTile'
export default {
  components: {
    PostTile
  },
  props: {
    page: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 10
    }
  },
  computed: {
    lowerLimit() {
      const { page, perPage } = this.$props
      return (page - 1) * perPage + 1
    },
    upperLimit() {
      const { page, perPage } = this.$props
      return Math.min(this.count, (page - 1) * perPage + perPage)
    },
    ...mapState({
      count: (state) => state.search.count,
      searchResults: (state) => state.search.searchResults,
      admin: (state) => state.auth.admin
    })
  }
}
</script>

<style scoped>
.search-results-container {
  margin-top: 10px;
  margin-bottom: 25px;
}

.no-data-img {
  max-width: 100%;
  max-height: 100%;
}

.no-search-results {
  width: 100%;
  height: 100%;
}

.no-data-img-container {
  text-align: center;
  width: 350px;
}

.search-results-count-info {
  margin-top: 10px;
  padding-left: 15px;
}

@media (max-width: 768px) {
  .no-data-img-container {
    width: 270px;
  }
}

@media (max-width: 580px) {
  .search-results-count-info {
    padding-left: 0px;
  }
}
</style>
