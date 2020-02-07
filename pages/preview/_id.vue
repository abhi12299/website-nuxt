<template>
  <SingleBlogPost :enableComments="false" :blogPost="post" />
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
      return `${this.post.title} | Preview`
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
        errorMessage: singlePost.errorMessage || 'Post could not be found.'
      })
    }
  },
  mounted() {
    if (document.readyState === 'complete') {
      this.appendScripts()
    } else {
      window.addEventListener('load', () => this.appendScripts())
    }
  },
  beforeDestroy() {
    delete window.PRISM_CODE_PARSED
  },
  methods: {
    appendScripts() {
      if (!document.querySelector('script[src$="prism.js"]')) {
        const prismScript = document.createElement('script')
        prismScript.src = '../prism/prism.js'
        prismScript.setAttribute('data-manual', true)

        const prismInit = document.createElement('script')
        prismInit.innerHTML = `
          let timer = null
          timer = setInterval(window.highlight, 500)
          function highlight() {
            if ('Prism' in window && !('PRISM_CODE_PARSED' in window)) {
              Prism.highlightAll(false, () => {
                window.PRISM_CODE_PARSED = true;
                clearInterval(timer)
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

      setTimeout(window.highlight, 1000)
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
