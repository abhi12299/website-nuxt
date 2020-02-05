<template>
  <SingleBlogPost :enableComments="true" :blogPost="post" />
</template>

<script>
import { mapState } from 'vuex'
import SingleBlogPost from '~/components/SingleBlogPost'

export default {
  layout: 'page',
  components: {
    SingleBlogPost
  },
  computed: {
    ...mapState({
      post: (state) => state.singlePost.data
    }),
    title() {
      return `${this.post.title} - Abhishek Mehandiratta | Web Developer`
    },
    metaKeywords() {
      return this.post.metaKeywords.join(', ')
    }
  },
  async fetch({ store, req, params, error }) {
    await store.dispatch('singlePost/getSinglePost', { id: params.id, req })
    const { singlePost } = store.state
    if (singlePost.error || !singlePost.data) {
      error({
        statusCode: 404,
        errorMessage: 'Post could not be found.'
      })
    }
  },
  mounted() {
    if (document.readyState === 'complete') {
      this.appendScripts(1000)
    } else {
      window.addEventListener('load', () => this.appendScripts(100))
    }
  },
  beforeDestroy() {
    delete window.PRISM_CODE_PARSED
  },
  methods: {
    appendScripts(highlightTimeout) {
      if (!document.querySelector('script[src$="prism.js"]')) {
        const prismScript = document.createElement('script')
        prismScript.src = '../prism/prism.js'
        prismScript.setAttribute('data-manual', true)

        const prismInit = document.createElement('script')
        prismInit.innerHTML = `
          function highlight() {
            if ('Prism' in window && !('PRISM_CODE_PARSED' in window)) {
              Prism.highlightAll(false, () => {
                window.PRISM_CODE_PARSED = true;
              });
            }
          }
        `

        const prismCss = document.createElement('link')
        prismCss.rel = 'stylesheet'
        prismCss.href = '../prism/prism.css'
        document.body.appendChild(prismScript)
        document.body.appendChild(prismCss)
        document.body.appendChild(prismInit)
      }

      setTimeout(window.highlight, highlightTimeout)
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.post.metaDescription
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.metaKeywords
        },
        { hid: 'author', name: 'author', content: 'Abhishek Mehandiratta' },
        { hid: 'og:title', name: 'og:title', content: this.title },
        { hid: 'og:type', name: 'og:type', content: 'article' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.post.metaDescription
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.post.headerImageURL
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `https://iabhishek.dev${this.$route.path}`
        },
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
          content: this.post.metaDescription
        },
        {
          hid: 'twitter:label1',
          name: 'twitter:label1',
          content: 'Written By'
        },
        {
          hid: 'twitter:data1',
          name: 'twitter:data1',
          content: 'Abhishek Mehandiratta'
        },
        {
          hid: 'twitter:label2',
          name: 'twitter:label2',
          content: 'Filed under'
        },
        {
          hid: 'twitter:data2',
          name: 'twitter:data2',
          content: this.metaKeywords
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
            '@type': 'Article',
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
            author: {
              '@type': 'Person',
              name: 'Abhishek Mehandiratta',
              image: {
                '@type': 'ImageObject',
                url: 'https://iabhishek.dev/static/png/logo.png',
                width: 100,
                height: 100
              },
              url: 'https://iabhishek.dev/about/'
            },
            headline: this.title,
            url: `https://iabhishek.dev${this.$route.path}`,
            datePublished: `${new Date(this.post.postedDate).toJSON()}`,
            keywords: this.metaKeywords,
            description: this.post.metaDescription,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://iabhishek.dev'
            }
          }
        }
      ]
    }
  }
}
</script>
