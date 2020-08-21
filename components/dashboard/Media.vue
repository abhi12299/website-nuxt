<template>
  <div class="col-lg-3 col-6 media-card">
    <div class="card">
      <img
        v-if="media.type === 'image'"
        :data-src="media.url"
        @click="handlePreview"
        alt="Card image cap"
        class="lazyload card-img-top media-card-img"
      />
      <video
        v-else
        :src="media.url"
        autoplay
        muted
        controls
        loop
        class="ard-img-top media-card-img"
      />
    </div>
    <div class="card-body row c2a-btns mx-auto">
      <div class="col-6" title="Used In Published Posts">
        <font-awesome-icon :icon="['fas', 'thumbtack']" />
        <sup>(P)</sup>
        &nbsp;{{ media.usedInPublishedPosts }}
      </div>
      <div class="col-6" title="Used In Unpublished Posts">
        <font-awesome-icon :icon="['fas', 'thumbtack']" />
        <sup>(Up)</sup>
        &nbsp;{{ media.usedInUnpublishedPosts }}
      </div>
      <div class="col-6">
        <font-awesome-icon
          :icon="['fas', 'copy']"
          :class="`media-copy-btn ${loading ? 'disabled' : ''}`"
          @click="handleCopyLink"
          title="Copy link"
        />
      </div>
      <div class="col-6">
        <font-awesome-icon
          :icon="['fas', 'trash-alt']"
          :class="`media-delete-btn ${loading ? 'disabled' : ''}`"
          @click="handleDeleteClick"
          title="Delete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../../utils'
import { showToast } from '../../utils/toasts'
export default {
  props: {
    media: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean
    }
  },
  methods: {
    handlePreview() {
      const { url } = this.$props.media
      window.open(url, '_blank')
    },
    handleCopyLink() {
      const { url } = this.$props.media
      utils.copyToClipboard(url)
      showToast('Link copied!', 'success')
    },
    handleDeleteClick() {
      const { _id } = this.$props.media
      this.$emit('deleteClick', _id)
    }
  }
}
</script>

<style scoped>
.media-card {
  margin-top: 15px;
  margin-bottom: 10px;
  height: fit-content;
}

.media-card video {
  max-height: 150px;
}

.media-card .media-card-img {
  border-bottom: 1px solid black;
  cursor: pointer;
}

.media-card .c2a-btns {
  font-size: 18px;
}

.media-card .media-copy-btn,
.media-card .media-delete-btn {
  cursor: pointer;
}

.delete-media-container {
  max-height: 250px;
  text-align: center;
}

.delete-media-container img {
  height: -webkit-fill-available;
}
</style>
