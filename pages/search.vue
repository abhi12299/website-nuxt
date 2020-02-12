<template>
  <div class="container">
    <SearchResults :page="page" :perPage="perPage" />
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
import { mapState } from 'vuex'
import SearchResults from '../components/SearchResults'
import Pagination from '../components/Pagination'

export default {
  layout: 'page',
  components: {
    SearchResults,
    Pagination
  },
  data() {
    return {
      perPage: 10
    }
  },
  watchQuery: ['q', 'sortBy', 'sortOrder', 'published', 'page'],
  computed: {
    title() {
      return `${decodeURI(
        this.query
      )} - Search Results - Abhishek Mehandiratta | Web Developer`
    },
    metaDesc() {
      return `Search in all blogs.`
    },
    ...mapState({
      query: (state) => state.search.searchQuery,
      count: (state) => state.search.count,
      page: (state) => state.search.page
    })
  },
  async fetch({ store, query, req, error }) {
    await store.dispatch('search/search', { query, req })
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.metaDesc },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'Abhishek, Mehandiratta, Developer, Web, Search'
        },
        { hid: 'author', name: 'author', content: 'Abhishek Mehandiratta' },
        { hid: 'og:title', name: 'og:title', content: this.title },
        { hid: 'og:type', name: 'og:type', content: 'website' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaDesc
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: 'https://iabhishek.dev/static/logo.png'
        },
        { hid: 'og:url', name: 'og:url', content: 'https://iabhishek.dev' },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter:site',
          name: 'twitter:site',
          content: '@abhishek_m_dev'
        },
        { hid: 'twitter:title', name: 'twitter:title', content: this.title },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.metaDesc
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: 'https://iabhishek.dev/static/logo.png'
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: 'Website logo'
        }
      ],
      link: [
        { rel: 'canonical', href: `https://iabhishek.dev${this.$route.path}` }
      ],
      script: [
        {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            publisher: {
              '@type': 'Organization',
              name: 'Abhishek Mehandiratta | Web Developer',
              logo: {
                '@type': 'ImageObject',
                url: 'https://iabhishek.dev/static/png/logo.png',
                width: 80,
                height: 80
              }
            },
            url: 'https://iabhishek.dev',
            image: {
              '@type': 'ImageObject',
              url: 'https://iabhishek.dev/static/png/logo.png',
              width: 80,
              height: 80
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://iabhishek.dev'
            },
            description: 'Web Developer'
          }
        }
      ]
    }
  }
}
</script>
