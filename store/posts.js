/* eslint-disable no-console */
import fetch from 'isomorphic-unfetch'
import types from '../constants/types'
import baseURL from '~/constants/apiURL'
import { showToast } from '~/utils/toasts'

export const state = () => ({
  loading: false,
  error: false,
  errorMessage: null,
  data: null,
  count: 0,
  page: 1,
  pathname: '', // this is used in 2 routes, hence for distinction
  keywords: null
})

export const mutations = {
  [types.SET_POSTS_LOADING](state, payload) {
    state.loading = payload
  },
  [types.SET_POSTS](state, payload) {
    state.loading = false
    state.error = false
    state.data = payload.data
    state.count = payload.count
    state.page = payload.page
    state.pathname = payload.pathname
    state.keywords = payload.keywords
  },
  [types.SET_POSTS_ERROR](state, payload) {
    state.loading = false
    state.error = true
    state.errorMessage = payload
  },
  [types.SET_PUBLISHED_STATUS_ALL_BLOGS](state, payload) {
    const { _id, published } = payload
    state.data = state.data.map((d) => {
      if (d._id === _id) {
        d.published = published
      }
      return d
    })
  }
}

const PER_PAGE = 10

export const actions = {
  async getAllBlogPosts({ commit, state }, { query, req }) {
    let { page } = query
    const { keywords } = query
    page = page ? (isNaN(parseInt(page)) ? 1 : parseInt(page)) : 1
    page = page > 0 ? page : 1

    const isKeywordFilterSame =
      (!state.keywords && !keywords) || // when both are nullish
      state.keywords?.toString() === keywords?.toString()

    if (
      state.data &&
      state.page === page &&
      !state.error &&
      state.pathname === '/blog' &&
      isKeywordFilterSame
    ) {
      return
    }

    const fetchOpts = {
      method: 'GET',
      credentials: 'include'
    }

    if (req && 'token' in req.cookies) {
      fetchOpts.headers = {
        authorization: `Bearer ${req.cookies.token}`
      }
    }

    let url = `${baseURL}/api/post/getAllPosts`
    let appendToQuery = false
    if (keywords) {
      appendToQuery = true

      url += '?'
      if (Array.isArray(keywords)) {
        for (let i = 0; i < keywords.length; i++) {
          url += `${i === 0 ? '' : '&'}keywords=${keywords[i]}`
        }
      } else {
        url += `keywords=${keywords}`
      }
    }
    if (PER_PAGE) {
      url += `${appendToQuery ? '&' : '?'}limit=${PER_PAGE}`
      appendToQuery = true
    }
    if (page) {
      url += `${appendToQuery ? '&' : '?'}skip=${(page - 1) * PER_PAGE}`
    }

    // await commit(types.SET_POSTS_LOADING, true)
    try {
      let resp = await fetch(url, fetchOpts)
      resp = await resp.json()
      if (resp.error) {
        console.error(resp)
        await commit(types.SET_POSTS_ERROR, resp.msg || 'Something went wrong!')
      } else {
        await commit(types.SET_POSTS, {
          data: resp.data,
          count: resp.count,
          page,
          pathname: '/blog',
          keywords
        })
      }
    } catch (error) {
      console.error(error)
      await commit(types.SET_POSTS_ERROR, error.msg || 'Something went wrong!')
    }
  },
  async togglePublish({ commit, state, dispatch }, _id) {
    const url = `${baseURL}/api/dashboard/setPublished`
    const foundPost = state.data.find((post) => post._id === _id)

    const newPublishedStatus = foundPost.published ? 0 : 1
    try {
      let resp = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id, published: newPublishedStatus })
      })
      if (resp.status === 401) {
        // unauthorized!
        await dispatch(
          'auth/createAuthError',
          {
            errorMessage: 'Invalid user token! You will be logged out!',
            initiateForceLogout: true
          },
          { root: true }
        )
        return
      }
      resp = await resp.json()
      if (resp.error) {
        console.error(resp)
        showToast(
          resp.msg ||
            'There was some error changing the publish status of the post!',
          'error'
        )
      } else {
        await commit(types.SET_PUBLISHED_STATUS_ALL_BLOGS, {
          _id,
          published: newPublishedStatus
        })
      }
    } catch (error) {
      console.error(error)
      showToast(
        'There was some error changing the publish status of the post!',
        'error'
      )
    }
  },
  async fetchDashboardPosts(
    { commit, dispatch },
    { req, query, perPage = 10 }
  ) {
    const { sortBy = 'postedDate', sortOrder = '-1', published = 'all' } = query
    let { page } = query
    page = page ? (isNaN(parseInt(page)) ? 1 : parseInt(page)) : 1
    page = page > 0 ? page : 1

    const fetchOpts = {
      method: 'GET',
      credentials: 'include'
    }
    if (req && 'token' in req.cookies) {
      fetchOpts.headers = {
        authorization: `Bearer ${req.cookies.token}`
      }
    }
    const filters = { sortBy, sortOrder, published }
    let appendToQuery = false
    let url = `${baseURL}/api/dashboard/getPosts`
    if (perPage) {
      appendToQuery = true
      url += `?limit=${perPage}`
    }
    if (page) {
      url += `${appendToQuery ? '&' : '?'}skip=${(page - 1) * perPage}`
      appendToQuery = true
    }
    for (const [key, val] of Object.entries(filters)) {
      url += `${appendToQuery ? '&' : '?'}${key}=${val}`
      appendToQuery = true
    }

    try {
      let resp = await fetch(url, fetchOpts)
      if (resp.status === 401) {
        // unauthorized!
        await dispatch(
          'auth/createAuthError',
          {
            errorMessage: 'Invalid user token! You will be logged out!',
            initiateForceLogout: true
          },
          { root: true }
        )
        return
      }
      resp = await resp.json()
      if (resp.error) {
        console.error(resp)
        await commit(types.SET_POSTS_ERROR, resp.msg || 'Something went wrong!')
      } else {
        await commit(types.SET_POSTS, {
          data: resp.data,
          count: resp.count,
          page,
          pathname: '/dashboard/posts'
        })
      }
    } catch (error) {
      console.error(error)
      await commit(types.SET_POSTS_ERROR, error.msg || 'Something went wrong!')
    }
  }
}
