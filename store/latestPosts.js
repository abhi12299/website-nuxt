/* eslint-disable no-console */
import fetch from 'isomorphic-unfetch'
import types from '../constants/types'
import baseURL from '~/constants/apiURL'

export const state = () => ({
  loading: false,
  error: false,
  data: null
})

export const mutations = {
  [types.SET_LATEST_POSTS_LOADING](state, payload) {
    state.loading = payload
  },
  [types.SET_LATEST_POSTS](state, payload) {
    state.loading = false
    state.error = false
    state.data = payload
  },
  [types.SET_LATEST_POSTS_ERROR](state, payload) {
    state.loading = false
    state.error = true
  }
}

export const actions = {
  async getLatestPosts({ commit, state }) {
    if (state.data && !state.error) {
      return
    }

    const url = `${baseURL}/api/post/getLatestPosts`

    await commit(types.SET_LATEST_POSTS_LOADING, true)
    try {
      let resp = await fetch(url, { credentials: 'include' })
      resp = await resp.json()
      if (resp.error) {
        console.error(resp)
        await commit(
          types.SET_LATEST_POSTS_ERROR,
          resp.msg || 'Please try later.'
        )
      } else {
        await commit(types.SET_LATEST_POSTS, resp.data)
      }
    } catch (error) {
      console.error(error)
      await commit(
        types.SET_LATEST_POSTS_ERROR,
        error.msg || 'Please try later.'
      )
    }
  }
}

export const getters = {
  mappedLatestPosts: (state) => {
    if (!state.data) {
      return null
    }
    return state.data.map((s) => ({
      ...s,
      metaKeywords: s.metaKeywords.join(', ')
    }))
  }
}
