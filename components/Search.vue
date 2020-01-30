<template>
  <div class="section search-section">
    <div class="container search-overall-container">
      <!-- admin dropdowns -->
      <div class="admin-search-nav row mx-auto">
        <div class="col-lg-6 col-md-6 col-12">
          <div class="dropdown-label">Sort By:</div>
          <div class="sort-dropdown-wrapper mx-auto">
            <Dropdown
              :options="dropdownSortOptions"
              :selected="selectedSortDropdownOption"
              v-on:updateOption="handleSortDropdownChange"
              :closeOnOutsideClick="true"
            />
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-12 sort-in-wrapper">
          <div class="dropdown-label">Search In:</div>
          <div class="search-in-dropdown-wrapper mx-auto">
            <Dropdown
              :options="dropdownSearchInOptions"
              :selected="selectedSearchInDropdownOption"
              v-on:updateOption="handleSearchInDropdownChange"
              :closeOnOutsideClick="true"
            />
          </div>
        </div>
      </div>
      <a @click="handleCloseSearch" class="close-search">
        <img src="~/assets/png/close.png" alt="close" />
      </a>
      <div class="centered">
        <div class="search-container mx-auto">
          <input
            ref="searchFieldRef"
            @change="handleSearchInputChange"
            @keydown="handleSearchInputKeydown"
            v-model="q"
            type="text"
            placeholder="Search here.."
          />
          <button @click="handleSearch">Search</button>
        </div>
      </div>
      <SuggestionResults
        v-if="suggestions"
        :adminButtons="true"
        :searchQuery="searchQuery"
        :loading="loading"
        :suggestions="suggestions"
        v-on:suggestionClick="handleSuggestionClick"
      />
    </div>
  </div>
</template>

<script>
import Dropdown from './Dropdown'
import SuggestionResults from './SuggestionResults'

export default {
  components: {
    Dropdown,
    SuggestionResults
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    // admin: Boolean,
    suggestions: {
      type: Array,
      default: () => []
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    const dropdownSortOptions = [
      {
        name: 'Time (Latest first)',
        query: { sortBy: 'postedDate', sortOrder: '-1' }
      },
      {
        name: 'Time (Oldest first)',
        query: { sortBy: 'postedDate', sortOrder: '1' }
      }
    ]
    const dropdownSearchInOptions = [
      { name: 'All (Pub/unpub)', query: { published: 'all' } },
      { name: 'Published', query: { published: '1' } },
      { name: 'Unpublished', query: { published: '0' } }
    ]
    return {
      q: '',
      typingTimeout: null,
      dropdownSortOptions,
      dropdownSearchInOptions,
      selectedSortDropdownOption: dropdownSortOptions[0],
      selectedSearchInDropdownOption: dropdownSearchInOptions[0]
    }
  },
  mounted() {
    document.documentElement.classList.add('no-scroll')
    this.$refs.searchFieldRef.focus()
    window.addEventListener('keydown', this.escapeKeyCloseSearch)
  },
  destroyed() {
    window.removeEventListener('keydown', this.escapeKeyCloseSearch)
  },
  methods: {
    handleCloseSearch() {
      document.documentElement.classList.remove('no-scroll')
      clearTimeout(this.typingTimeout)
      this.q = ''
      // this.props.dispatch(actions.searchActions.clearSearchSuggestions()) // clear suggestions
      this.$emit('closeSearch')
    },
    handleSearchInputChange() {},
    handleSearchInputKeydown() {},
    handleSearch() {
      let query = this.q
      query = query.trim()
      query = encodeURI(query)
      if (query.length < 1) {
        return
      }
      // let searchQuery = { q: query }
      // if (admin) {
      //   searchQuery = {
      //     ...searchQuery,
      //     ...dropdownSearchInOptions[selectedIndexSearchIn].query,
      //     ...dropdownSortOptions[selectedIndexSort].query
      //   }
      // }
      this.handleCloseSearch()
      // this.$router.push({
      //
      // })
    },
    escapeKeyCloseSearch(e) {
      if (e.keyCode === 27) {
        this.handleCloseSearch()
      }
    },
    handleSortDropdownChange(payload) {
      this.selectedSortDropdownOption = payload
    },
    handleSearchInDropdownChange(payload) {
      this.selectedSearchInDropdownOption = payload
    },
    handleSuggestionClick(url) {
      this.handleCloseSearch()
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
.admin-search-nav {
  margin-top: 25px;
  text-align: center;
  width: 80%;
  position: absolute;
  top: 20px;
}

.sort-dropdown-wrapper,
.search-in-dropdown-wrapper {
  margin-top: 10px;
  width: 50%;
  text-align: center;
}

.search-section {
  opacity: 1;
  /* transition: opacity 0.5s ease-in-out; */
  overflow-y: auto;
}

.search-section.hide {
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
  pointer-events: none;
}

.search-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
  background-color: rgba(255, 255, 255, 0.97);
}

.admin-search-nav .dropdown-label {
  font-size: 20px;
}

.close-search {
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 101;
}

.search-section .centered {
  width: 100%;
}

.search-section .centered .search-container {
  display: flex;
  width: 90%;
  border-bottom: 1px solid #aaa;
  font-size: 1.2rem;
}

.search-section .centered .search-container input {
  flex: 2;
  color: #333;
  font-weight: 300;
  border: 0;
  background-color: transparent;
  width: 100%;
}

.search-section .centered .search-container button {
  display: inline;
  font-weight: 300;
  cursor: pointer;
  border: 0;
  background-color: transparent;
}

.search-section .search-overall-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
}

@media (max-width: 1100px) {
  .dd-sort,
  .dd-search-in {
    font-size: 11px !important;
  }
}

@media (max-width: 768px) {
  .sort-in-wrapper {
    margin-top: 15px;
  }
}

@media (max-width: 360px) {
  .search-section .search-container {
    font-size: 1rem;
  }
}
</style>
