/* eslint-disable no-console */
import types from '../constants/types'
import baseURL from '../server/constants/apiURL'
import { showToast } from '~/utils/toasts'

export const state = () => ({
  loading: false,
  errorMessage: null,
  error: false,
  data: null
})

export const mutations = {
  [types.SET_SINGLE_POST_LOADING](state, payload) {
    state.loading = payload
  },
  [types.SET_SINGLE_POST](state, payload) {
    state.loading = false
    state.error = false
    state.data = payload
  },
  [types.SET_SINGLE_POST_ERROR](state, payload) {
    state.loading = false
    state.error = true
    state.errorMessage = payload
  },
  [types.SET_PUBLISHED_STATUS_SINGLE_POST](state, payload) {
    state.data.published = payload
  }
}

export const actions = {
  async getSinglePost({ commit, state }, { id, req }) {
    if (state.data && state.data._id === id && !state.error) {
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

    const url = `${baseURL}/api/post/getPost?id=${id}`

    await commit(types.SET_SINGLE_POST_LOADING, true)
    try {
      let resp = await fetch(url, fetchOpts)
      resp = await resp.json()
      if (resp.error) {
        console.error(resp)
        await commit(
          types.SET_SINGLE_POST_ERROR,
          resp.msg || 'Something went wrong!'
        )
      } else {
        await commit(types.SET_SINGLE_POST, resp.data)
      }
    } catch (error) {
      console.error(error)
      await commit(
        types.SET_SINGLE_POST_ERROR,
        error.msg || 'Something went wrong!'
      )
    }
  },
  async togglePublish({ commit, state, dispatch }) {
    const url = `${baseURL}/api/dashboard/setPublished`

    const newPublishedStatus = state.data.published ? 0 : 1
    try {
      let resp = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: state.data._id,
          published: newPublishedStatus
        })
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
        console.error(resp.error)
        showToast(
          'There was some error changing the publish status of the post!',
          'error'
        )
      } else {
        await commit(types.SET_PUBLISHED_STATUS_SINGLE_POST, newPublishedStatus)
      }
    } catch (error) {
      console.error(error)
      showToast(
        'There was some error changing the publish status of the post!',
        'error'
      )
    }
  }
}
