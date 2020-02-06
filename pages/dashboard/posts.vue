<template>
  <div class="container">
    <div class="row dashboard-posts-headee">
      <div class="offset-lg-6 col-lg-6 col-md-12 col-12">
        <div class="row">
          <div
            class="col-5 col-md-7 col-lg-5"
            style="text-align: right; font-size: 18px; height: fit-content; margin-top: 25px;"
          >
            <div>
              Sort By:
            </div>
          </div>
          <div class="col-7 col-md-5 col-lg-7" style="text-align: left">
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
    <div class="posts-container">
      <PostTile
        v-for="post in posts"
        :key="post._id"
        :post="post"
        :adminButtons="true"
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
import Dropdown from '~/components/Dropdown'
import PostTile from '~/components/PostTile'

export default {
  layout: 'page',
  components: {
    Pagination,
    PostTile,
    Dropdown
  },
  watchQuery: ['page', 'sortBy', 'published', 'sortOrder'],
  data() {
    const dropdownOptions = [
      {
        name: 'All (Latest first)',
        query: {
          sortBy: 'postedDate',
          published: 'all',
          sortOrder: '-1',
          page: 1
        }
      },
      {
        name: 'Published (Latest first)',
        query: {
          sortBy: 'postedDate',
          published: '1',
          sortOrder: '-1',
          page: 1
        }
      },
      {
        name: 'Published (Oldest first)',
        query: {
          sortBy: 'postedDate',
          published: '1',
          sortOrder: '1',
          page: 1
        }
      },
      {
        name: 'Unpublished (Latest first)',
        query: {
          sortBy: 'postedDate',
          published: '0',
          sortOrder: '-1',
          page: 1
        }
      },
      {
        name: 'Unpublished (Oldest first)',
        query: {
          sortBy: 'postedDate',
          published: '0',
          sortOrder: '1',
          page: 1
        }
      },
      {
        name: 'All (Oldest first)',
        query: {
          sortBy: 'postedDate',
          published: 'all',
          sortOrder: '1',
          page: 1
        }
      }
    ]
    return {
      perPage: 10,
      dropdownOptions,
      selectedDropdownOption: dropdownOptions[0]
    }
  },
  computed: {
    ...mapState({
      posts: (state) => state.posts.data,
      page: (state) => state.posts.page,
      count: (state) => state.posts.count
    }),
    title() {
      return `All Posts - Page ${this.page}`
    }
  },
  async fetch({ store, req, query, error }) {
    await store.dispatch('posts/fetchDashboardPosts', { query, req })
    const { posts } = store.state
    if (posts.error) {
      error({
        statusCode: 404,
        errorMessage: posts.errorMessage || 'Something went wrong!'
      })
    }
  },
  mounted() {
    const {
      sortBy = 'postedDate',
      sortOrder = '-1',
      published = 'all'
    } = this.$route.query

    let filteredIndex = this.dropdownOptions.findIndex(
      (op) =>
        op.query.sortBy === sortBy &&
        op.query.sortOrder === sortOrder &&
        op.query.published === published
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
      fetchDashboardPosts: 'posts/fetchDashboardPosts'
    }),
    handleDropdownChange(payload) {
      this.selectedDropdownOption = payload
      this.$router.push({
        query: {
          ...this.$route.query,
          ...payload.query
        }
      })
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
.dashboard-posts-header {
  margin-top: 10px;
}
</style>
