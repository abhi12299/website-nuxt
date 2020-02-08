<template>
  <div class="container">
    <section class="about-me pad-top-50">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-12">
            <h2 class="about-me-title">A Little Bit About Me</h2>
            <div class="about-me-content-bottom">
              <p class="about-me-content">
                A MERN Stack Developer based in Delhi. I love to learn new
                things and experiment with new technologies that come about in
                the web development community. Besides programming, I also love
                to play video games :)
              </p>
              <hr class="sep" />
              <div class="experience">
                <b>Work Experience</b>
                <ul>
                  <li>
                    MERN Stack Developer @<a
                      href="https://so.city"
                      target="_blank"
                      rel="noopener"
                      >SoDelhi</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            class="d-none d-lg-block d-md-block col-lg-5 col-md-5 offset-md-1 offset-lg-1 text-center my-auto"
          >
            <img
              src="~/assets/png/about-me.png"
              alt="banner-right"
              class="banner-right-about-me"
            />
          </div>
        </div>
      </div>
    </section>
    <!-- tech stack -->
    <section class="tech-stack pad-top">
      <div class="container">
        <div class="row">
          <div
            class="d-none d-lg-block d-md-block col-lg-5 col-md-5 text-center my-auto"
          >
            <img
              src="~/assets/png/tech-stack-left-banner.png"
              alt="banner-left"
              class="banner-right-tech-stack"
            />
          </div>
          <div
            class="offset-md-1 offset-lg-1 col-lg-6 col-md-6 tech-stack-content"
          >
            <h2 class="tech-stack-title">Technologies I Work With</h2>
            <div class="row">
              <div
                v-for="tech in myTech"
                :key="tech"
                class="col-lg-4 col-md-4 col-sm-4 col-4"
              >
                <div class="single-brand-item d-table">
                  <div class="d-table-cell text-center">
                    <img
                      :src="`/logo-${tech.toLowerCase()}.png`"
                      :alt="tech"
                      :title="tech"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import myTech from '~/constants/myTech'

export default {
  layout: 'page',
  data() {
    return {
      metaDesc: `I'm a passionate web developer, always keen to learn new things. Find more about my skills and technologies I work with.`,
      title: 'About Me - Abhishek Mehandiratta | Web Developer',
      myTech
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.metaDesc },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'Abhishek, Mehandiratta, Developer, Web'
        },
        { hid: 'author', name: 'author', content: 'Abhishek Mehandiratta' },
        { hid: 'og:title', name: 'og:title', content: this.title },
        { hid: 'og:type', name: 'og:type', content: 'website' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaDesc
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: 'https://iabhishek.dev/static/logo.png'
        },
        { hid: 'og:url', name: 'og:url', content: 'https://iabhishek.dev' },
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
          content: this.metaDesc
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
            '@type': 'WebSite',
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
            url: 'https://iabhishek.dev',
            image: {
              '@type': 'ImageObject',
              url: 'https://iabhishek.dev/static/png/logo.png',
              width: 80,
              height: 80
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://iabhishek.dev'
            },
            description: 'Web Developer'
          }
        }
      ]
    }
  }
}
</script>

<style scoped>
.about-me.pad-top-50 {
  padding-top: 50px;
}

.banner-right-about-me {
  max-height: 300px;
}

.about-me .sep {
  width: 50%;
  margin-left: 0px;
}

.experience {
  font-size: 20px;
}

.experience ul {
  list-style-type: none;
}

.experience ul li {
  margin-right: 5px;
  font-size: 20px;
}

.experience ul li::before {
  content: '> ';
}

.experience ul li a {
  text-decoration: underline;
}

@media (max-width: 991px) {
  .experience ul li {
    font-size: 18px;
  }
}

.tech-stack-title {
  margin-bottom: 20px;
  text-align: right;
}

.banner-right-tech-stack {
  max-height: 300px;
}

.tech-stack-contain {
  margin-top: 50px;
}

.single-brand-item .d-table-cell {
  vertical-align: middle;
}

.single-brand-item img {
  max-width: 95px;
  margin: 0 auto;
  -webkit-transition: all 0.4s ease 0s;
  -moz-transition: all 0.4s ease 0s;
  -o-transition: all 0.4s ease 0s;
  transition: all 0.4s ease 0s;
}

.single-brand-item {
  width: 170px;
  height: 100px;
  margin-bottom: 30px;
  -webkit-transition: all 0.4s ease 0s;
  -moz-transition: all 0.4s ease 0s;
  -o-transition: all 0.4s ease 0s;
  transition: all 0.4s ease 0s;
}

.single-brand-item:hover img {
  filter: brightness(85%);
  -o-filter: brightness(85%);
  -ms-filter: brightness(85%);
  -moz-filter: brightness(85%);
  -webkit-filter: brightness(85%);
}

@media only screen and (max-width: 767px) {
  .tech-stack {
    margin-top: 75px;
  }
  .single-brand-item {
    height: 100px;
    width: 140px;
  }
}

@media (max-width: 575px) {
  .single-brand-item {
    margin: 0 auto;
    margin-bottom: 30px;
  }
}

@media (min-width: 767px) {
  .tech-stack.pad-top {
    padding-top: 50px;
  }
}

@media (max-width: 767px) {
  .tech-stack-title {
    text-align: left;
  }
  .tech-stack-content .row {
    margin-right: 0 !important;
    margin-left: -45px;
  }
  .single-brand-item img {
    max-width: 100px;
  }
}

@media (max-width: 991px) {
  .single-brand-item img {
    max-width: 85px;
  }
  .tech-stack-content .row {
    margin-right: 30px;
  }
}

@media (max-width: 878px) {
  .single-brand-item img {
    max-width: 75px;
  }
}
</style>
