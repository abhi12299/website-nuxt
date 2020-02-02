<template>
  <div class="row pagination">
    <div class="col-lg-10 offset-lg-1">
      <div class="row">
        <div class="col-md-3 col-xs-2">
          <a
            :class="[isPrevDisabled ? 'disabled' : '', 'left-button']"
            @click="handlePreviousClick"
          >
            <img src="~/assets/png/left-botton.png" alt="left-button" />
          </a>
        </div>
        <div class="col-md-6 col-xs-8 text-center">
          <ul class="page-nav text-center list-inline">
            <a
              v-for="page in pageArr"
              :key="page"
              :class="[page === pageNo ? 'active ' : '', 'list-inline-item']"
              @click="handleClick(page)"
            >
              {{ page }}
            </a>
          </ul>
        </div>
        <div class="col-md-3 col-xs-2 text-right">
          <a
            :class="[isNextDisabled ? 'disabled' : '', 'left-button']"
            @click="handleNextClick"
          >
            <img src="~/assets/png/right-button.png" alt="right-button" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
    pageNo: {
      type: Number,
      required: true
    }
  },
  computed: {
    pageArr() {
      return utils.createPagination({
        items: this.$props.totalItems,
        itemsOnPage: this.$props.perPage,
        currentPage: this.$props.pageNo
      })
    },
    isPrevDisabled() {
      return this.$props.pageNo === this.pageArr[0]
    },
    isNextDisabled() {
      return this.$props.pageNo === this.pageArr[this.pageArr.length - 1]
    }
  },
  methods: {
    handleClick(p) {
      if (p !== this.$props.pageNo) {
        this.$router.push({
          query: {
            ...this.$route.query,
            page: p
          }
        })
      }
    },
    handlePreviousClick() {
      if (this.isPrevDisabled) return
      this.handleClick(this.$props.pageNo - 1)
    },
    handleNextClick() {
      if (this.isNextDisabled) return
      this.handleClick(this.$props.pageNo + 1)
    }
  }
}
</script>

<style scoped>
.pagination ul.page-nav a {
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  margin: 0 3px 6px;
  height: 38px;
  min-width: 38px;
  border: 2px solid black;
  line-height: 36px;
  padding: 0;
  font-weight: 700;
  letter-spacing: 0.03em;
  border-radius: 50%;
  transition: all 500ms;
  -webkit-transition: all 500ms;
  -moz-transition: all 500ms;
  -o-transition: all 500ms;
}

.pagination .left-button {
  cursor: pointer;
}

.pagination .left-button.disabled {
  cursor: default !important;
}

.pagination ul.page-nav a:not(.active) {
  cursor: pointer;
}

.pagination ul.page-nav a.active {
  color: white;
  background: black;
}

.pagination ul.page-nav a:not(.active):hover {
  background-color: #f5f5f5;
  color: black;
}

.pagination {
  padding: 15px 0px;
}
</style>
