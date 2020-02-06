<template>
  <div>
    <transition name="fade-search">
      <Search v-on:closeSearch="toggleSearch" v-if="showSearch" />
    </transition>
    <section ref="headerComponent" class="header-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-lg-2 col-md-12 text-left">
            <a @click="$router.push('/')" class="logo">
              <img src="~/assets/png/logo.png" alt="logo" />
            </a>
            <div class="search-menu-container">
              <div class="search-mobile-container">
                <a @click="toggleSearch">
                  <img
                    class="search-img-mobile"
                    src="~/assets/png/icons8-search-50.png"
                  />
                </a>
              </div>
              <a
                @click="handleToggleDropdownMenu"
                :class="{ 'menu-click': true, open: showDropdownMenu }"
              >
                <span></span>
                <span></span>
                <span></span>
              </a>
            </div>
          </div>
          <div class="col-lg-8 col-md-12">
            <nav id="main-menu" class="text-center">
              <ul>
                <li v-for="(link, index) in links" :key="index">
                  <a @click="handleNavlinkClick(link.to)">
                    {{ link.name }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="desktop-search col-lg-2 col-md-4 text-right">
            <a @click="toggleSearch" class="search-icon">
              <img
                class="search-area"
                src="~/assets/png/icons8-search-50.png"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import $ from 'jquery'
import Search from './Search'

export default {
  components: {
    Search
  },
  data() {
    return {
      links: this.navLinks(),
      isMobileView: false,
      showSearch: false,
      showDropdownMenu: false
    }
  },
  computed: {
    ...mapState({
      admin: (state) => state.auth.admin
    })
  },
  watch: {
    $route() {
      this.links = this.navLinks()
    }
  },
  mounted() {
    this.links = this.navLinks()
    this.mainBodyWrapper = document.querySelector('.main-body-content')
    this.isMobileView = window.innerWidth <= 991
    this.initialHeaderOffset = this.$refs.headerComponent.offsetTop

    window.addEventListener('resize', this.handleWindowResize)
    window.addEventListener('scroll', this.handleScroll)

    this.handleScroll()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    navLinks() {
      if (this.admin && this.$route.path.startsWith('/dashboard')) {
        return [
          { name: 'View Posts', to: '/dashboard/posts' },
          { name: 'Write A Post', to: '/dashboard/create' },
          { name: 'Media', to: '/dashboard/media' }
        ]
      }
      return [
        { name: 'Home', to: '/' },
        { name: 'About Me', to: '/about' },
        { name: 'Contact', to: '/contact' },
        { name: 'Blog Posts', to: '/blog' }
      ]
    },
    handleScroll() {
      if (window.pageYOffset <= this.initialHeaderOffset) {
        this.$refs.headerComponent.classList.remove('sticky')
        this.mainBodyWrapper.classList.remove('pt-75')
      }
      if (window.pageYOffset > this.$refs.headerComponent.offsetTop) {
        this.$refs.headerComponent.classList.add('sticky')
        this.mainBodyWrapper.classList.add('pt-75')
      }
    },
    handleWindowResize() {
      this.isMobileView = window.innerWidth <= 991
    },
    toggleSearch() {
      this.showSearch = !this.showSearch
    },
    handleToggleDropdownMenu() {
      this.showDropdownMenu = !this.showDropdownMenu
      $('#main-menu').slideToggle(200)
    },
    handleNavlinkClick(to) {
      this.$router.push(to)
      if (this.isMobileView) {
        this.handleToggleDropdownMenu()
      }
    }
  }
}
</script>

<style scoped>
.header-wrapper.sticky {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  background-color: #fff;
}

.search-menu-container {
  display: none;
}

.search-mobile-container {
  cursor: pointer;
  display: inline-block;
  margin-top: 7px;
}

.search-img-mobile {
  width: 25px;
  height: 25px;
}

/* DOESN'T WORK! 
.header-wrapper.sticky+.main-body-content {
    padding-top: 75px;
} */

.header-wrapper {
  padding: 13px 0;
}

.header-wrapper:before {
  content: '';
  width: 100%;
  height: 2px;
  top: 0px;
  left: 0;
  position: absolute;
  z-index: -2;
  background: linear-gradient(
    to right,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -ms-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -o-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -webkit-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -moz-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0%, #fff),
    color-stop(35%, #eeeeee),
    color-stop(65%, #eeeeee),
    color-stop(100%, #fff)
  );
}

.header-wrapper:after {
  content: '';
  width: 100%;
  height: 2px;
  bottom: 0px;
  left: 0;
  position: absolute;
  z-index: -2;
  background: linear-gradient(
    to right,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -ms-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -o-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -webkit-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -moz-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0%, #fff),
    color-stop(35%, #eeeeee),
    color-stop(65%, #eeeeee),
    color-stop(100%, #fff)
  );
}

.bottom-border:after {
  display: block !important;
  content: '';
  width: 100%;
  height: 2px;
  bottom: 0px;
  left: 0;
  position: absolute;
  z-index: 1;
  background: linear-gradient(
    to right,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -ms-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -o-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -webkit-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -moz-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0%, #fff),
    color-stop(35%, #eeeeee),
    color-stop(65%, #eeeeee),
    color-stop(100%, #fff)
  );
}

.top-border:before {
  display: block !important;
  content: '';
  width: 100%;
  height: 2px;
  top: 0px;
  left: 0;
  position: absolute;
  z-index: 1;
  background: linear-gradient(
    to right,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -ms-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -o-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -webkit-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -moz-linear-gradient(
    left,
    #fff 0,
    #eeeeee 35%,
    #eeeeee 65%,
    #fff 100%
  );
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0%, #fff),
    color-stop(35%, #eeeeee),
    color-stop(65%, #eeeeee),
    color-stop(100%, #fff)
  );
}

.logo {
  display: inline-block;
  cursor: pointer;
}

.header-wrapper .logo img {
  border-radius: 50%;
  width: 46px;
}

.header-wrapper .icon {
  display: inline-block;
  margin-top: 7px;
}

.header-wrapper .icon-search {
  background-position: -385px 0;
  width: 25px;
  height: 25px;
  display: inline-block;
}

.search-area {
  cursor: pointer;
  padding-top: 14px;
}

.search-icon {
  display: inline-block;
}

.search-icon img {
  width: 22px;
  display: inline-block;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.6s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

#main-menu {
  padding-top: 7px;
}

#main-menu::selection,
#main-menu::-moz-selection {
  color: none;
  background: none;
}

#main-menu ul li {
  padding: 0 18px;
  display: inline-block;
  position: relative;
  cursor: pointer;
}

#main-menu ul li a {
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  color: #000;
  line-height: 42px;
  letter-spacing: 0.7px;
}

#main-menu ul li:after {
  background-color: #333;
  border-radius: 100%;
  width: 4px;
  height: 4px;
  bottom: 18.8px;
  right: -3px;
  content: '';
  position: absolute;
}

#main-menu ul li:last-child:after {
  display: none;
}

#main-menu ul li a:hover {
  color: #777;
}

.fade-search-enter-active {
  transition: opacity 0.35s;
}
.fade-search-leave-active {
  transition: opacity 0.35s;
}
.fade-search-enter,
.fade-search-leave-to {
  opacity: 0;
}

/* #main-menu ul li:nth-last-child(2):after {
    display: none;
} */

.menu-click {
  display: none;
  float: right;
  position: relative;
  width: 30px;
  height: 20px;
  margin-top: 12px;
  margin-right: 5px;
}

.menu-click span {
  position: absolute;
  background-color: #111;
  right: 0;
  height: 2px;
  width: 25px;
  display: inline-block;
  transition: all 0.3s;
}

.menu-click span:nth-child(1) {
  top: 0;
}

.menu-click span:nth-child(2) {
  top: 46%;
  width: 20px;
}

.menu-click span:nth-child(3) {
  top: auto;
  bottom: 0;
  width: 26px;
}

.menu-click.open span:nth-child(1) {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
  top: 10px;
}

.menu-click.open span:nth-child(2) {
  opacity: 0;
}

.menu-click.open span:nth-child(3) {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
  top: 10px;
}

.side-click {
  display: block;
  float: right;
  position: relative;
  width: 30px;
  height: 20px;
  margin-top: 12px;
  margin-right: 10px;
}

.side-click span {
  position: absolute;
  background-color: #111;
  right: 0;
  height: 2px;
  width: 25px;
  display: inline-block;
  transition: all 0.3s;
}

.side-click span:nth-child(1) {
  top: 0;
}

.side-click span:nth-child(2) {
  top: 46%;
  width: 20px;
}

.side-click span:nth-child(3) {
  top: auto;
  bottom: 0;
  width: 26px;
}

.side-click.open span:nth-child(1) {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
  top: 10px;
}

.side-click.open span:nth-child(2) {
  opacity: 0;
}

.side-click.open span:nth-child(3) {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
  top: 10px;
}

.menu-title {
  background-color: #fff;
}

.menu-title #main-menu {
  padding-top: 15px;
  padding-bottom: 15px;
}

.menu-title #main-menu li {
  padding: 0 20px;
}

.menu-title #main-menu li a {
  line-height: 40px;
  font-size: 14px;
  font-weight: 500;
}

.menu-title .search-icon {
  padding-top: 23px;
  display: inline-block;
}

.menu-title .search-icon img {
  width: 20px;
}

.soical-icon-font {
  padding: 15px 0;
}

.soical-icon-font li {
  padding-left: 8px;
  padding-right: 8px;
}

.soical-icon-font li a {
  line-height: 40px;
  font-size: 16px;
  color: #333;
}

.header-wrapper #search-nav {
  display: none;
}

/* RESPONSIVE SECTION */
@media (max-width: 991px) {
  .desktop-search .search-icon {
    display: none;
  }
  .header-wrapper .search-area {
    display: none;
  }
  .search-menu-container {
    display: block;
    float: right;
  }
  .menu-click {
    display: inline-block;
    cursor: pointer;
  }
  .header-wrapper .menu-click {
    display: inline-block;
    width: 50px;
  }
  .header-wrapper.logo img {
    width: 75px;
  }
  /* .header-wrapper #search-nav {
        display: inline-block;
    } */
}

@media (min-width: 991px) {
  .header-wrapper nav {
    display: block !important;
  }
}
</style>
