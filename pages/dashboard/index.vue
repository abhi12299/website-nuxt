<template>
  <div
    class="container"
    style="text-align: center; margin-top: 20px; margin-bottom: 20px"
  >
    <h4>Dashboard here!</h4>
    <p>
      You have
      <b style="text-decoration: underline;">{{ queries }} contact queries</b>
      in db!
    </p>
  </div>
</template>

<script>
import fetch from 'isomorphic-unfetch'
import baseURL from '~/constants/apiURL'

export default {
  layout: 'page',
  data() {
    return {
      queries: 0
    }
  },
  async asyncData({ req }) {
    try {
      const fetchOpts = {
        credentials: 'include'
      }
      if (req && 'token' in req.cookies) {
        fetchOpts.headers = {
          authorization: `Bearer ${req.cookies.token}`
        }
      }
      let resp = await fetch(
        `${baseURL}/api/dashboard/contactQueries`,
        fetchOpts
      )
      resp = await resp.json()
      return { queries: resp.data }
    } catch (error) {
      console.log('error:', error)
      return { queries: 0 }
    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  }
}
</script>
