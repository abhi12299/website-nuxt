<template>
  <div class="container">
    <AllBlogs />
    <div style="margin-top: 20px" />
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
import Pagination from '~/components/Pagination'
import AllBlogs from '~/components/AllBlogs'

export default {
  layout: 'page',
  components: {
    AllBlogs,
    Pagination
  },
  watchQuery: ['page', 'keywords'],
  data() {
    return {
      metaDesc: `Check out these interesting blogs written by me, ranging from basics of javascript and other languages to advanced concepts.`,
      perPage: 10
    }
  },
  computed: {
    title() {
      return `All Blog Posts - Page ${this.page} - Abhishek Mehandiratta | Web Developer`
    },
    ...mapState({
      page: (state) => state.posts.page,
      count: (state) => state.posts.count
    })
  },
  async fetch({ store, req, query, error }) {
    await store.dispatch('posts/getAllBlogPosts', { query, req })
  },
  key: (to) => to.fullPath,
  transition(to, from) {
    if (!from) return 'slide-left'
    const { page: toPage = 1 } = to.query
    const { page: fromPage = 1 } = from.query
    return +toPage < +fromPage ? 'slide-right' : 'slide-left'
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.metaDesc },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'Abhishek, Mehandiratta, Developer, Web, Blog'
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
        {
          hid: 'og:url',
          name: 'og:url',
          content: 'https://iabhishek.dev/blog'
        },
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
            description: this.metaDesc
          }
        }
      ]
    }
  }
}
</script>
