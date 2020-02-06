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
  page: 1
})

export const mutations = {
  [types.SET_MEDIA_LOADING](state, payload) {
    state.loading = payload
  },
  [types.SET_MEDIA](state, payload) {
    state.loading = false
    state.error = false
    state.data = payload.data
    state.count = payload.count
    state.page = payload.page
    state.pathname = payload.pathname
  },
  [types.SET_MEDIA_ERROR](state, payload) {
    state.loading = false
    state.error = true
    state.errorMessage = payload
  }
}

const PER_PAGE = 20

export const actions = {
  async fetchMedia({ commit, dispatch }, { query, req }) {
    let { page } = query
    page = page ? (isNaN(parseInt(page)) ? 1 : parseInt(page)) : 1
    page = page > 0 ? page : 1

    const { sortBy = 'createdAt', sortOrder = '-1' } = query
    const fetchOpts = {
      method: 'GET',
      credentials: 'include'
    }

    if (req && 'token' in req.cookies) {
      fetchOpts.headers = {
        authorization: `Bearer ${req.cookies.token}`
      }
    }

    const filters = { sortBy, sortOrder }
    let url = `${baseURL}/api/dashboard/getMedia`
    let appendToQuery = false
    if (PER_PAGE) {
      url += `${appendToQuery ? '&' : '?'}limit=${PER_PAGE}`
      appendToQuery = true
    }
    if (page) {
      url += `${appendToQuery ? '&' : '?'}skip=${(page - 1) * PER_PAGE}`
    }
    for (const [key, val] of Object.entries(filters)) {
      url += `${appendToQuery ? '&' : '?'}${key}=${val}`
      appendToQuery = true
    }
    // await commit(types.SET_POSTS_LOADING, true)
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
        await commit(types.SET_MEDIA_ERROR, resp.msg || 'Something went wrong!')
      } else {
        await commit(types.SET_MEDIA, {
          data: resp.data,
          count: resp.count,
          page
        })
      }
    } catch (error) {
      console.error(error)
      await commit(types.SET_MEDIA_ERROR, error.msg || 'Something went wrong!')
    }
  },
  async deleteMedia({ commit, dispatch }, _id) {
    if (!_id) return
    const url = `${baseURL}/api/dashboard/deleteMedia`
    try {
      await commit(types.SET_MEDIA_LOADING, true)
      let resp = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id })
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
          resp.msg || 'There was some error deleting the media!',
          'error'
        )
      } else {
        showToast('The media was successfully deleted.', 'success', {
          timeOut: 1000,
          extendedTimeout: 1000
        }).then(() => {
          window.location.reload(true)
        })
      }
    } catch (error) {
      console.error(error)
      showToast(
        error || error.msg || 'There was some error deleting the media!',
        'error'
      )
    }
    await commit(types.SET_MEDIA_LOADING, false)
  }
}
