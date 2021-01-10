<template>
  <section class="single-post pad-50">
    <div class="container">
      <div class="row">
        <!-- Part 1 title and meta -->
        <div class="col-lg-8 offset-lg-2">
          <div class="entry-header text-left">
            <h4 class="entry-meta style2">
              Abhishek Mehandiratta
              <span></span>
              {{ getFormattedDate() }}
            </h4>
            <h1 class="entry-title">{{ blogPost.title }}</h1>
          </div>
        </div>
        <!-- Part 2 header image -->
        <div class="col-lg-12">
          <div class="entry-media">
            <img
              :data-src="blogPost.headerImageURL"
              class="lazyload"
              alt="header image"
            />
          </div>
        </div>
        <!-- Part 3 content -->
        <div class="col-lg-8 offset-lg-2 bottom-border">
          <div id="entry-content" v-html="blogPostbody" class="entry-content" />
          <div class="entry-share-div">
            <h5>Share :</h5>
            <ul class="social-text light list-inline">
              <li class="list-inline-item">
                <a
                  :href="sharer.facebook"
                  @click="handleShareClick('Facebook')"
                  target="_blank"
                  class="text-facebook"
                >
                  Facebook
                </a>
              </li>
              <li class="list-inline-item">
                <a
                  :href="sharer.twitter"
                  @click="handleShareClick('Twitter')"
                  target="_blank"
                  class="text-twiiter"
                >
                  Twitter
                </a>
              </li>
              <li class="list-inline-item">
                <a
                  :href="sharer.linkedIn"
                  @click="handleShareClick('LinkedIn')"
                  target="_blank"
                  class="text-linkedin"
                >
                  Linkedin
                </a>
              </li>
              <li class="list-inline-item">
                <a
                  :href="sharer.whatsApp"
                  @click="handleShareClick('WhatsApp')"
                  target="_blank"
                  class="text-whatsapp"
                >
                  Whatsapp
                </a>
              </li>
              <li v-if="nativeShare" class="list-inline-item">
                <a @click="handleNativeShare" class="text-other">
                  Other
                </a>
              </li>
            </ul>
          </div>
          <div class="entry-share-div">
            <h5>Tags :</h5>
            <ul class="taglist list-inline">
              <li
                v-for="mk in blogPost.metaKeywords"
                :key="mk"
                class="list-inline-item"
              >
                <nuxt-link :to="`/blog?keywords=${mk}`">#{{ mk }}</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
        <!-- Part 4 Comments -->
        <div
          v-if="enableComments"
          class="col-lg-8 offset-lg-2 comments-section"
        >
          <div id="wpac-comment"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from 'jquery'
import cheerio from 'cheerio'
import utils from '../utils'
import keys from '../constants/apiKeys'
import baseURL from '~/constants/apiURL'

export default {
  props: {
    blogPost: {
      type: Object,
      default: () => ({})
    },
    enableComments: {
      type: Boolean
    }
  },
  data() {
    return {
      nativeShare: false,
      debounceTimer: null,
      readEventSent: false
    }
  },
  computed: {
    blogPostbody() {
      const { body } = this.$props.blogPost
      const container = cheerio.parseHTML(`<div>${body}</div>`)

      cheerio(container[0])
        .find('img')
        .each(function(idx, img) {
          const { src } = img.attribs
          cheerio(img)
            .removeAttr('src')
            .attr('data-src', src)
            .addClass('lazyload')
        })
      // set all images class to be lazyloaded
      // remove all src attribs and replace with data-src
      return cheerio(container).html()
    },
    sharer() {
      const url = this.shareURL
      return utils.getShareURL(url)
    },
    shareURL() {
      return `${baseURL}/post/${this.$props.blogPost._id}`
    }
  },
  mounted() {
    window.addEventListener('scroll', this.trackProgress)
    window.lightGallery(document.getElementById('entry-content'), {
      selector: 'img',
      width: '700px',
      height: '470px'
    })
    this.nativeShare = !!navigator.share
    const { enableComments } = this.$props
    if (!enableComments) return

    if (document.querySelector('#wpac_init_script')) {
      window.wpac_init = window.wpac_init || []
      window.wpac_init.push({
        widget: 'Comment',
        id: `${keys.WIDGETPACK_PLUGIN_ID}`
      })
      window.WPac && window.WPac.init(window.wpac_init)
    } else {
      const widgetpackScript = document.createElement('script')
      widgetpackScript.id = 'wpac_init_script'
      widgetpackScript.innerHTML = `
        window.wpac_init = window.wpac_init || [];
        window.wpac_init.push({ widget: 'Comment', id: '${keys.WIDGETPACK_PLUGIN_ID}' });
        (function() {
          var mc = document.createElement('script');
          mc.type = 'text/javascript';
          mc.async = true;
          mc.src = 'https://embed.widgetpack.com/widget.js';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(mc, s.nextSibling);
        })()
      `
      document.body.appendChild(widgetpackScript)
    }
  },
  beforeDestroy() {
    delete window.wpac_init
    window.removeEventListener('scroll', this.trackProgress)
  },
  methods: {
    trackProgress() {
      if (this.readEventSent) return

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      this.debounceTimer = setTimeout(() => {
        const scrollTop = $(window).scrollTop()
        const docHeight = $(document).height()
        const winHeight = $(window).height()
        const scrollPercent = scrollTop / (docHeight - winHeight)
        const scrollPercentRounded = Math.round(scrollPercent * 100)

        if (!this.readEventSent && scrollPercentRounded > 50) {
          this.$ga.event({
            eventCategory: 'post',
            eventAction: 'read',
            eventLabel: this.shareURL
          })
          this.readEventSent = true
        }
      }, 100)
    },
    handleShareClick(type) {
      this.$ga.social(type, 'share', this.shareURL)
    },
    getFormattedDate() {
      const d = utils.getDateParts(this.$props.blogPost.postedDate)
      return `${d.date} ${d.month} ${d.year}`
    },
    handleNativeShare() {
      if (!this.nativeShare) return
      navigator
        .share({
          title: document.title,
          text: this.$props.blogPost.title,
          url: this.shareURL
        })
        .then(() => {
          this.$ga.event({
            eventCategory: 'post',
            eventAction: 'nativeShare',
            eventLabel: this.shareURL
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
.entry-content img {
  cursor: pointer;
}

.single-post {
  font-family: Lato, Helvetica, sans-serif;
}
.single-post .entry-title {
  font-weight: bold;
  line-height: 52px;
  margin-bottom: 15px;
}

.single-post a {
  color: #00bfffc4;
}

.single-post a:hover {
  color: #004085;
}

.single-post ol,
.single-post ul {
  margin-left: 30px;
}

.single-post .wp-caption-text {
  color: #111;
  font-size: 14px;
  font-weight: 400;
  font-style: italic;
  margin: 5px 0 24px;
  text-align: center;
}

.single-post .entry-meta {
  color: #000;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 0;
}

.single-post .entry-meta a {
  text-decoration: underline;
  color: #333;
}

.single-post .entry-meta span {
  padding: 0 3px;
}

.single-post .entry-meta.style2 {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 2px;
  color: #444040;
  margin-bottom: 15px;
}

.single-post .entry-meta.style2 span {
  margin: 0 5px !important;
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 10px;
  background-color: #444040;
}

.single-post .entry-media {
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;
  text-align: center;
}

.single-post .entry-media img {
  object-fit: cover;
  max-height: 100%;
}

.single-post .entry-header h5 {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.single-post h2 {
  line-height: 42px;
  font-weight: bold;
  color: #111;
  margin-bottom: 0px;
}

.single-post h3 {
  font-weight: bold;
  color: #111;
  margin-bottom: 25px;
  margin-top: 25px;
}

.single-post h4 {
  color: #333;
  font-weight: bold;
  display: inline-block;
}

.single-post h5 {
  color: #333;
  font-weight: bold;
  display: inline-block;
}

.single-post ul {
  padding-left: 20px;
  margin-bottom: 30px;
}

.single-post ul li {
  line-height: 32px;
  font-size: 16px;
  color: #111;
  font-weight: 400;
  margin-bottom: 10px;
}

.single-post p,
.single-post ol,
.single-post ul {
  line-height: 32px !important;
  font-size: 20px !important;
  color: #111 !important;
  font-weight: 400 !important;
  margin-bottom: 15px !important;
  margin-top: 20px !important;
}

.single-post li {
  line-height: 32px !important;
  font-size: 19px !important;
  color: #111 !important;
  font-weight: 400 !important;
  list-style-type: decimal !important;
  word-break: break-word;
}

.single-post p a {
  font-weight: bold;
}

.single-post img {
  margin-bottom: 5px;
}

.single-post .img-wrapper {
  margin: 30px 0;
  text-align: center;
  font-size: 17px;
}

.single-post .img-wrapper.border-img img {
  border: 1px solid #80808038;
}

.single-post.style-two .entry-meta,
.single-post.style-two .entry-meta a {
  color: #999;
  text-decoration: none;
  font-size: 15px;
}

.single-post.style-two .entry-title {
  margin-bottom: 0;
  margin-top: 0px;
}

.single-post .taglist,
.single-post .social-text {
  display: inline-block;
  padding-left: 50px;
  margin-top: 10px;
}

.single-post .taglist li {
  padding-right: 15px;
  font-family: PoppinsBold;
  font-weight: bold;
}

.single-post .taglist li a:hover {
  text-decoration: underlineg;
}

.single-post .taglist li a,
.single-post .social-text li a {
  font-size: 17px;
  font-weight: bold;
  color: #333;
}

.single-post .social-text li a.text-facebook {
  color: #3b5998 !important;
}

.single-post .social-text li a.text-twiiter {
  color: #1da1f2 !important;
}

.single-post .social-text li a.text-linkedin {
  color: #0077b5 !important;
}

.single-post .social-text li a.text-instagram {
  color: #fb3958 !important;
}

.single-post .social-text li a.text-whatsapp {
  color: #4fce5d !important;
}

.single-post .social-text li a.text-other {
  color: #0b0c0b !important;
  cursor: pointer;
}

.single-post .comments-section {
  padding-top: 30px;
}

.single-post .entry-share-div {
  margin-top: 15px;
}

.single-post .entry-share-div h5 {
  font-family: PoppinsBold;
}

.single-post .social-text .list-inline-item:not(:last-child) {
  margin-right: 25px;
}

@media (max-width: 991px) {
  .single-post h2,
  .contact-wrapper h2 {
    font-size: 22px;
    line-height: 34px;
  }
  .single-post .entry-header h5 {
    font-size: 14px;
  }
}

@media (max-width: 767px) {
  .single-post pre {
    font-size: 12px !important;
    margin: 20px 0 !important;
  }

  .single-post h3 {
    font-size: 20px;
  }
  .single-post p,
  .single-post ol,
  .single-post ul {
    margin-bottom: 5px !important;
    margin-top: 5px !important;
  }

  .single-post .social-text li a,
  .single-post .taglist li a {
    font-size: 14px;
  }

  .single-post h5 {
    display: block;
  }
  .single-post .taglist,
  .single-post .social-text {
    padding-left: 0;
  }
  .fullpage-wrapper .entry-header .entry-title,
  .single-post .entry-title,
  .meta-title h1 {
    font-size: 26px;
    line-height: 38px;
  }
  .about-wrapper p,
  .single-post p,
  .single-post ol,
  .single-post ul,
  .single-post li {
    line-height: 27px !important;
    font-size: 15px !important;
  }
  .fullpage-wrapper .single-post {
    padding: 50px 15px;
  }
  .single-post .social-text .list-inline-item:not(:last-child) {
    margin-right: 10px;
  }
  .single-post .taglist li {
    padding-right: 10px;
  }
  .single-post ol,
  .single-post ul {
    margin-left: 15px !important;
  }
}

@media (max-width: 580px) {
  .single-post .entry-meta {
    line-height: 24px;
  }
  .single-post .entry-meta.style2 {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 11px;
    letter-spacing: 1px;
  }
}
</style>
