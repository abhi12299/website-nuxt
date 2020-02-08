<template>
  <div class="container">
    <LatestPosts />
  </div>
</template>

<script>
import cookie from 'js-cookie'
import { showToast } from '../utils/toasts'
import LatestPosts from '~/components/LatestPosts'

export default {
  layout: 'page',
  components: {
    LatestPosts
  },
  data() {
    return {
      metaDesc: `I'm a full stack web developer specializing in server side app development. I like coding in Javascript and Go. You can read my blogs and learn more about me and my projects here.`,
      title: 'Abhishek Mehandiratta | Web Developer'
    }
  },
  async fetch({ store, req, error }) {
    await store.dispatch('latestPosts/getLatestPosts')
  },
  mounted() {
    if (cookie.get('notAdmin')) {
      cookie.remove('notAdmin', {
        expires: 1
      })
      showToast('You are not a registered admin!', 'error')
    }
  },
  head() {
    return {
      title: 'Abhishek Mehandiratta | Web Developer',
      meta: [
        { hid: 'description', name: 'description', content: this.metaDesc },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'Abhishek, Mehandiratta, Developer, Web'
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
          content: 'https://iabhishek.dev/static/logo.png'
        },
        {
          hid: 'twitter:site',
          name: 'twitter:site',
          content: 'https://iabhishek.dev'
        },
        {
          hid: 'twitter:creator',
          name: 'twitter:creator',
          content: '@abhishek_m'
        },
        { hid: 'twitter:title', name: 'twitter:title', content: this.title },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.metaDesc
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
