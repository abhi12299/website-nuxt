<template>
  <div class="col-md-10 offset-md-1">
    <article class="blog-post">
      <div class="entry-meta-content">
        <div class="entry-date">
          {{ dateObj.date }}
          <span>{{ dateObj.month }} {{ dateObj.year }}</span>
        </div>
        <nuxt-link :to="postURL">
          <h2 class="entry-title">{{ post.title }}</h2>
        </nuxt-link>
        <div class="entry-meta row">
          <div v-for="mk in post.metaKeywords" :key="mk" class="meta-tags">
            #{{ mk }}
          </div>
        </div>
      </div>
      <div class="entry-media">
        <img :src="post.headerImageURL" alt="blog post header img" />
      </div>
      <div class="entry-content-bottom">
        <nuxt-link :to="postURL">
          <p class="entry-content">{{ post.metaDescription }}</p>
        </nuxt-link>
        <nuxt-link :to="postURL" v-if="post.published" class="entry-read-more">
          <span></span>
          Read More
        </nuxt-link>
        <div v-if="adminButtons" class="admin-btns">
          <ul class="list-inline float-left">
            <li class="list-inline-item">
              <font-awesome-icon
                :class="`toggle-publish ${loading ? 'toggle-wait' : ''}`"
                :icon="['fas', post.published ? 'eye-slash' : 'eye']"
                :title="`${post.published ? 'Unpublish' : 'Publish'}`"
                @click="handleTogglePublish"
              />
            </li>
            <li class="list-inline-item">
              <nuxt-link :to="`/dashboard/edit?id=${post._id}`">
                <font-awesome-icon :icon="['fas', 'edit']" title="Edit Post" />
              </nuxt-link>
            </li>
          </ul>
        </div>
        <template v-if="post.published">
          <ul v-if="!nativeShare" class="blog-social-share list-inline">
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
          <span
            @click="handleNativeShare"
            :class="
              `entry-meta bold float-right ${nativeShare ? 'show' : 'hide'}`
            "
          >
            Share
          </span>
        </template>
      </div>
    </article>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import utils from '../utils'
import baseURL from '~/constants/apiURL'

export default {
  props: {
    post: {
      type: Object,
      default: () => ({})
    },
    adminButtons: {
      type: Boolean,
      default: false
    },
    route: {
      type: String,
      default: 'blog'
    }
  },
  data() {
    return {
      loading: false,
      nativeShare: false
    }
  },
  computed: {
    dateObj() {
      const { postedDate } = this.$props.post
      return utils.getDateParts(postedDate)
    },
    postURL() {
      const { published, _id } = this.$props.post
      return `/${published ? 'post' : 'preview'}/${_id}`
    },
    sharer() {
      const url = this.shareURL
      return utils.getShareURL(url)
    },
    shareURL() {
      return `${baseURL}/post/${this.$props.post._id}`
    }
  },
  mounted() {
    this.nativeShare = !!navigator.share
  },
  methods: {
    handleShareClick(type) {
      this.$ga.social(type, 'share', this.shareURL)
    },
    async handleTogglePublish() {
      if (this.loading) {
        return
      }

      this.loading = true
      const { _id } = this.$props.post
      const { route } = this.$props
      switch (route) {
        case 'blog':
          await this.togglePublishFromAllBlogs(_id)
          break
        case 'search':
          await this.togglePublishFromSearchPage(_id)
      }
      this.loading = false
    },
    handleNativeShare() {
      if (!this.nativeShare) {
        return
      }

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
        .catch(() => {})
    },
    ...mapActions({
      togglePublishFromAllBlogs: 'posts/togglePublish',
      togglePublishFromSearchPage: 'search/togglePublish'
    })
  }
}
</script>

<style scoped>
.blog-post {
  margin-bottom: 75px;
  margin-top: 10px;
  position: relative;
}

.entry-meta {
  font-size: 16px;
  color: #111;
  font-family: PoppinsBold;
  padding-left: 15px;
}

.entry-meta.show {
  cursor: pointer;
}

.meta-tags {
  text-decoration: underline;
  display: inline;
}

.meta-tags:not(:last-child) {
  margin-right: 10px;
}

.blog-post .entry-meta-content,
.blog-post .entry-content-bottom {
  padding-left: 180px;
  padding-right: 100px;
  position: relative;
}

.blog-post .entry-title {
  font-family: PoppinsBold !important;
}

.blog-post .entry-date {
  position: absolute;
  font-size: 70px;
  color: #ccc;
  font-weight: bold;
  top: 0;
  left: 55px;
  line-height: 1;
}

.blog-post .entry-date span {
  font-size: 14px;
  text-transform: uppercase;
  font-weight: bold;
  color: #111;
  position: absolute;
  bottom: 14px;
  right: -0%;
  font-family: PoppinsBold;
}

.blog-post .entry-media {
  margin-top: 35px;
  margin-bottom: 35px;
  overflow: hidden;
  text-align: center;
}

.blog-post .entry-media img {
  display: inline-block;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.blog-post:hover .entry-media img {
  -ms-transform: scale(1.2);
  -moz-transform: scale(1.05);
  -webkit-transform: scale(1.05);
  -o-transform: scale(1.05);
  transform: scale(1.05);
}

.blog-post .entry-content {
  margin-bottom: 26px;
  line-height: 30px;
  font-size: 16px;
  color: #111;
  font-weight: 400;
}

.blog-post .entry-read-more {
  font-family: PoppinsBold;
  font-size: 16px;
  font-weight: bold;
  position: relative;
}

.blog-post .entry-read-more span {
  content: '';
  position: relative;
  width: 40px;
  background-color: #000;
  top: -5px;
  left: 0;
  height: 1px;
  display: inline-block;
  margin-right: 10px;
}

.blog-post .admin-btns {
  margin-top: 5px;
}

.blog-post .admin-btns ul li {
  font-size: 1.5em;
  cursor: pointer;
}

.blog-post .toggle-publish.toggle-wait {
  cursor: not-allowed !important;
}

.blog-post .blog-social-share {
  float: right;
  padding-left: 20px;
}

.blog-post .blog-social-share li {
  line-height: 21px;
}

.blog-post .blog-social-share li:not(:last-child) {
  margin-right: 15px;
}

.blog-post .blog-social-share li a {
  display: inline-block;
}

.blog-post .blog-social-share .blog-ss-icons {
  font-size: 1.6em;
}

@media (max-width: 1024px) {
  .blog-post .entry-date {
    font-size: 60px;
    left: 15px;
  }
}

@media (max-width: 991px) {
  .blog-post .entry-date {
    font-size: 45px;
  }
  .blog-post .entry-date span {
    font-size: 11px;
    bottom: 5px;
  }
  .blog-post .entry-title {
    font-size: 24px;
    line-height: 32px;
  }
  .blog-post .entry-meta-content,
  .blog-post .entry-content-bottom {
    padding-right: 80px;
    padding-left: 90px;
  }
}

@media (max-width: 768px) {
  .blog-post {
    margin-bottom: 50px;
  }

  .blog-post .entry-content-bottom {
    padding-left: 50px;
    padding-right: 50px;
  }
}

@media (max-width: 580px) {
  .blog-post .entry-meta-content,
  .blog-post .entry-meta {
    padding-left: 0px;
    padding-right: 0px;
  }

  .blog-post .entry-meta,
  .blog-post .entry-read-more {
    font-size: 14px;
    margin-left: 0px;
  }

  .blog-post .entry-meta-content .entry-date {
    position: relative;
    left: 0px;
    margin-bottom: 5px;
  }

  .blog-post .entry-meta-content .entry-date span {
    left: 40px;
    right: auto;
  }

  .blog-post .entry-content-bottom {
    padding-left: 0px;
    padding-right: 0px;
  }

  .entry-meta.show {
    margin-right: 15px;
  }

  .blog-post .entry-meta.hide {
    display: none;
  }
}
</style>
