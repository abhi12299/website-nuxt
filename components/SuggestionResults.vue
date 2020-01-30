<template>
  <div class="search-suggestions-container container">
    <div v-if="loading">
      <div class="search-suggestions-result">
        <p class="title">Searching...</p>
      </div>
    </div>
    <div v-else-if="suggestions.length === 0" class="search-suggestions-result">
      <p class="title">No results found.. Try some different keywords</p>
    </div>
    <div v-else>
      <div
        v-for="s in suggestion"
        :key="s._id"
        class="search-suggestions-result"
      >
        <a @click="handleSuggestionClick(s)">
          <div class="title">
            {{ s.title }}
            <p
              v-if="adminButtons"
              :class="
                `search-publish-indicator ${s.published ? 'pub' : 'unpub'}`
              "
            >
              {{ s.published ? 'Published' : 'Unpublished' }}
            </p>
          </div>
          <p v-html="postBodyMatchedText(s.body)" class="post-body-text"></p>
        </a>
      </div>
      <div class="sep" />
    </div>
  </div>
</template>

<script>
import utils from '~/utils'

export default {
  props: {
    suggestions: {
      type: Array,
      default: () => null
    },
    adminButtons: {
      type: Boolean,
      default: false
    },
    searchQuery: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    postBodyMatchedText(body) {
      return utils.getMatchedText(this.$props.searchQuery, body)
    },
    handleSuggestionClick(suggestion) {
      const postLink =
        this.$props.adminButtons && !suggestion.published
          ? `/preview/${suggestion._id}`
          : `/post/${suggestion._id}`
      this.$emit('suggestionClick', postLink)
    }
  }
}
</script>

<style scoped>
.search-suggestions-container {
  border: 1px solid rgba(128, 128, 128, 0.863);
  border-radius: 5px;
  margin-top: 5px;
  overflow-y: auto;
  /* margin-bottom: 25px; */
  width: 90%;
}

.search-suggestions-container .search-suggestions-result {
  padding: 7px 0px;
  margin-left: 10px;
  font-size: 1.2rem;
  cursor: pointer;
}

.search-suggestions-container .sep:not(:last-child) {
  border-bottom: 1px solid gray;
}

.search-suggestions-result .title,
.search-suggestions-result .post-body-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-suggestions-result .post-body-text {
  font-size: 1rem;
}

.search-suggestions-result .title .search-publish-indicator {
  float: right;
  padding-right: 20px;
}

.search-publish-indicator.pub {
  color: #13cb86;
}

.search-publish-indicator.unpub {
  color: orangered;
}

.search-suggestions-result .post-body-text b {
  font-weight: 900 !important;
}

.search-suggestions-result .post-body-text {
  padding: 0 15px;
  width: 100%;
}

.search-suggestions-result .post-body-text::before {
  content: '> ';
}

@media (max-width: 768px) {
  .search-suggestions-container .search-suggestions-result {
    font-size: 1rem;
  }
}
</style>
