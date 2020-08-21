<template>
  <article class="post-tile-v2" data-aos="fade-up">
    <div class="entry-media float-right">
      <nuxt-link :to="`/post/${post._id}`">
        <img
          :data-src="post.headerImageURL"
          class="lazyload"
          alt="post-image"
        />
      </nuxt-link>
    </div>
    <div class="entry-meta-content float-left">
      <nuxt-link :to="`/post/${post._id}`">
        <h2 class="entry-title">
          {{ post.title }}
        </h2>
      </nuxt-link>
      <span class="entry-meta">
        <span v-for="(mk, idx) in metaKeywords" :key="idx" class="mk-link">
          <nuxt-link :to="`/blog?keywords=${mk}`">
            #{{ mk }} {{ idx !== metaKeywords.length - 1 ? ', ' : '' }}
          </nuxt-link>
        </span>
        <span>- </span>
        {{ postedDate }}
      </span>
      <div class="entry-content-bottom">
        <nuxt-link :to="`/post/${post._id}`" class="entry-read-more">
          Read More
        </nuxt-link>
        <template v-if="!nativeShare">
          <ul class="social-share list-inline">
            <li class="list-inline-item">
              <a
                @click="handleShareClick('Facebook')"
                :href="sharer.facebook"
                target="_blank"
              >
                <font-awesome-icon
                  :icon="['fab', 'facebook']"
                  class="blog-ss-icons"
                  title="Share to FB"
                />
              </a>
            </li>
            <li class="list-inline-item">
              <a
                @click="handleShareClick('WhatsApp')"
                :href="sharer.whatsApp"
                target="_blank"
              >
                <font-awesome-icon
                  :icon="['fab', 'whatsapp']"
                  class="blog-ss-icons"
                  title="Share to WhatsApp"
                />
              </a>
            </li>
            <li class="list-inline-item">
              <a
                @click="handleShareClick('Twitter')"
                :href="sharer.twitter"
                target="_blank"
              >
                <font-awesome-icon
                  :icon="['fab', 'twitter']"
                  class="blog-ss-icons"
                  title="Tweet"
                />
              </a>
            </li>
            <li class="list-inline-item">
              <a
                @click="handleShareClick('LinkedIn')"
                :href="sharer.linkedIn"
                target="_blank"
              >
                <font-awesome-icon
                  :icon="['fab', 'linkedin']"
                  class="blog-ss-icons"
                  title="Post to LinkedIn"
                />
              </a>
            </li>
          </ul>
          <span class="entry-meta bold float-right">Share</span>
        </template>
        <template v-else>
          <span
            @click="handleNativeShare"
            class="entry-meta-native-share float-right"
          >
            <font-awesome-icon
              :icon="['fas', 'share-alt']"
              title="Share this post"
            />
            &nbsp;&nbsp;Share
          </span>
        </template>
      </div>
    </div>
  </article>
</template>

<script>
import utils from '../utils'
import baseURL from '~/constants/apiURL'

export default {
  props: {
    post: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      nativeShare: false
    }
  },
  computed: {
    postedDate() {
      const dateObj = utils.getDateParts(this.$props.post.postedDate)
      return `${dateObj.month} ${dateObj.date}, ${dateObj.year}`
    },
    sharer() {
      const url = this.shareURL
      return utils.getShareURL(url)
    },
    shareURL() {
      return `${baseURL}/post/${this.$props.post._id}`
    },
    metaKeywords() {
      const { post } = this.$props
      return post.metaKeywords.split(',').map((mk) => mk.trim())
    }
  },
  mounted() {
    this.nativeShare = !!navigator.share
  },
  methods: {
    handleShareClick(type) {
      this.$ga.social(type, 'share', this.shareURL)
    },
    handleNativeShare() {
      if (!this.nativeShare) return
      navigator
        .share({
          title: document.title,
          text: this.$props.post.title,
          url: this.shareURL
        })
        .then(() => {
          this.$ga.event({
            eventCategory: 'post',
            eventAction: 'nativeShare',
            eventLabel: this.shareURL
          })
        })
    }
  }
}
</script>

<style scoped>
.post-tile-v2 {
  height: 180px;
  float: left;
  width: 100%;
  margin-bottom: 75px;
  -webkit-box-shadow: 2px 2px 21px 2px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 2px 2px 21px 2px rgba(0, 0, 0, 0.1);
  box-shadow: 2px 2px 21px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row-reverse;
}

.post-tile-v2 .entry-media {
  width: 30%;
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  overflow: hidden;
}

.post-tile-v2 .entry-media img {
  object-fit: fill;
  width: 100%;
  height: 100%;
  display: inline-block;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.post-tile-v2:hover .entry-media img {
  -ms-transform: scale(1.2);
  -moz-transform: scale(1.05);
  -webkit-transform: scale(1.05);
  -o-transform: scale(1.05);
  transform: scale(1.05);
}

.post-tile-v2 .entry-meta-content {
  width: 70%;
  position: relative;
  padding: 20px 120px 20px 25px;
  background-color: #f4f4f7;
  height: 180px;
}

.post-tile-v2 .entry-title {
  font-size: 21px;
  line-height: 26px;
  margin-bottom: 10px;
  font-weight: 900;
  font-family: Poppins;
}

.post-tile-v2 .entry-meta,
.entry-meta-native-share {
  font-size: 16px;
  margin-top: 0px;
  font-weight: 900;
}

.post-tile-v2 .entry-content-bottom {
  padding-left: 0;
  padding-right: 120px;
  position: absolute;
  width: 100%;
  left: 25px;
  bottom: 32px;
}

.post-tile-v2 .entry-read-more {
  font-weight: bolder;
  font-size: 16px;
  margin-bottom: 0;
}

.post-tile-v2 .social-share {
  float: right;
  padding-left: 20px;
}

.post-tile-v2 .blog-ss-icons {
  font-size: 1.6em;
}

.mk-link {
  font-weight: bold;
}

.mk-link a:hover {
  text-decoration: underline;
}

@media (max-width: 1200px) {
  .post-tile-v2 .entry-content-bottom {
    bottom: 12px;
  }
}

@media (max-width: 991px) {
  .post-tile-v2 {
    margin-bottom: 60px;
    height: 169px;
  }

  .post-tile-v2 .entry-media {
    width: 45%;
  }

  .post-tile-v2 .entry-meta-content {
    padding: 20px 30px 20px 25px;
    width: 55%;
    height: 169px;
  }

  .post-tile-v2 .entry-title {
    font-size: 18px;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .post-tile-v2 .entry-meta {
    display: none;
  }
}

@media (max-width: 767px) {
  .post-tile-v2 {
    flex-direction: column;
    height: 402px;
  }

  .post-tile-v2 .entry-media {
    width: 100%;
  }

  .post-tile-v2 .entry-meta-content {
    width: 100%;
    height: 220px;
  }

  .post-tile-v2 .entry-meta {
    display: none;
  }

  .post-tile-v2 .entry-content-bottom {
    padding-right: 60px;
  }
}

@media (max-width: 400px) {
  .post-tile-v2 .entry-meta-content {
    height: 200px;
  }
  .post-tile-v2 {
    height: auto !important;
  }
}

@media (max-width: 361px) {
  .post-tile-v2 .entry-read-more {
    display: none;
  }
  .post-tile-v2 .entry-content-bottom {
    padding-right: 40px;
  }
}
</style>
