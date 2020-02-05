<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-10 text-left offset-lg-1">
        <p class="intro">
          You can either fill the form below, or
          <a href="mailto:abhi.9811206369@gmail.com">
            email me directly.
          </a>
        </p>
        <div>
          <form ref="contactForm" @submit.prevent="handleSubmit">
            <div :class="`form-row clearfix form-field ${nameValid}`">
              <label for="name">Name *</label>
              <input
                v-on:input="handleNameInput"
                :value="name"
                type="text"
                class="name"
              />
            </div>
            <div :class="`form-row clearfix form-field ${emailValid}`">
              <label for="email">Email *</label>
              <input
                v-on:input="handleEmailInput"
                :value="email"
                type="email"
                class="email"
              />
            </div>
            <div :class="`form-row clearfix form-field ${messageValid}`">
              <label for="message" class="req">Message *</label>
              <textarea
                v-on:input="handleMessageInput"
                :value="message"
                class="message"
                rows="15"
                cols="50"
              />
            </div>
            <div class="form-row form-submit">
              <div class="button-4">
                <div v-if="loading" style="height: 100%">
                  <LoadingSVG width="40" height="100%" />
                </div>
                <template v-else>
                  <div class="eff-4"></div>
                  <input
                    type="submit"
                    value="Send Message"
                    class="send-message"
                  />
                </template>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from 'isomorphic-unfetch'
import baseURL from '../server/constants/apiURL'
import { showToast } from '../utils/toasts'
import LoadingSVG from '~/components/LoadingSVG'

export default {
  layout: 'page',
  components: {
    LoadingSVG
  },
  data() {
    return {
      name: '',
      email: '',
      message: '',
      nameValid: true,
      emailValid: true,
      messageValid: true,
      loading: false,
      metaDesc: `Hi! I am Abhishek. I love developing web apps, especially server side applications.`,
      title: 'Contact Me - Abhishek Mehandiratta | Web Developer'
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
          content: 'Abhishek, Mehandiratta, Developer, Contact, Web'
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
            description: 'Contact Me'
          }
        }
      ]
    }
  },
  methods: {
    async handleSubmit() {
      const { name, email, message } = this
      let validateOk = true
      if (name.length === 0) {
        this.nameValid = false
        validateOk = false
      } else {
        this.nameValid = true
      }

      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!emailRegex.test(email)) {
        this.emailValid = false
        validateOk = false
      } else {
        this.emailValid = true
      }

      if (message.length < 10) {
        this.messageValid = false
        validateOk = false
      } else {
        this.messageValid = true
      }

      if (!validateOk) return

      this.loading = true
      try {
        let resp = await fetch(`${baseURL}/api/contact`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, message, name })
        })
        resp = await resp.json()
        if (!resp.error) {
          showToast("Query submitted! I'll get back to you soon!", 'success')
          this.email = ''
          this.name = ''
          this.message = ''
        } else {
          throw new Error(resp.msg)
        }
      } catch (error) {
        showToast('Could not submit query. Please try later!', 'error')
      }
      this.loading = false
    },
    handleNameInput(e) {
      this.name = e.target.value
    },
    handleEmailInput(e) {
      this.email = e.target.value
    },
    handleMessageInput(e) {
      this.message = e.target.value
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 25px;
  margin-bottom: 25px;
}

.send-message {
  width: 100%;
  cursor: pointer;
  outline: none;
  background-color: transparent;
  border: 0;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  line-height: 47px;
  transition: all 0.5s ease;
  z-index: 2;
  position: relative;
}

.button-4:hover .send-message {
  color: #fff;
}

.form-field.false {
  border-color: red;
}
.form-field {
  border: 1px solid #eaeaee;
  padding: 0 24px 24px;
  margin: 44px 0;
  transition: 200ms border-color ease-in-out;
}
.form-field label {
  display: inline-block;
  font-family: 'PoppinsBold', sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.2px;
  color: #555;
  padding: 0 8px;
  background-color: #fff;
  margin-left: -8px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  transition: 200ms color ease-in-out;
  margin-bottom: 0;
}

.form-field input[type='text'],
.form-field input[type='email'],
.form-field textarea {
  margin-top: 0;
  display: block;
  width: 100%;
  border: none;
  margin-top: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: #464343;
  outline: none;
}

p.intro {
  font-weight: bold;
  color: #111;
  margin-bottom: 0px;
}
p.intro a {
  text-decoration: underline;
  font-weight: 900;
}
</style>
