/* eslint-disable no-console */
import fetch from 'isomorphic-unfetch'
import types from '../constants/types'
import baseURL from '~/constants/apiURL'

export const state = () => ({
  errorMessage: '',
  error: false,
  title: 'Untitled Post',
  body: 'Write something awesome!',
  headerImageURL: '',
  metaDescription: '',
  metaKeywords: '',
  saving: false,
  prevTitle: '',
  _id: null,
  loading: false
})

function backupToLocalStorage(keyName, value, lsKeyName = 'tempSavePost') {
  let tempSavePost = JSON.parse(localStorage.getItem(lsKeyName))
  if (!tempSavePost) {
    tempSavePost = {}
  }
  tempSavePost[keyName] = value
  localStorage.setItem(lsKeyName, JSON.stringify(tempSavePost))
}

export const mutations = {
  [types.SET_POST_TITLE](state, payload) {
    const { title, backupKeyName = 'tempSavePost' } = payload
    state.title = title
    backupToLocalStorage('title', title, backupKeyName)
  },
  [types.SET_POST_BODY](state, payload) {
    const { body, backupKeyName = 'tempSavePost' } = payload
    state.body = body
    backupToLocalStorage('body', body, backupKeyName)
  },
  [types.SET_POST_HEADER_IMG](state, payload) {
    const { headerImageURL, backupKeyName = 'tempSavePost' } = payload
    state.headerImageURL = headerImageURL
    backupToLocalStorage('headerImageURL', headerImageURL, backupKeyName)
  },
  [types.SET_POST_META_DESC](state, payload) {
    const { metaDescription, backupKeyName = 'tempSavePost' } = payload
    state.metaDescription = metaDescription
    backupToLocalStorage('metaDescription', metaDescription, backupKeyName)
  },
  [types.SET_POST_META_KEYWORDS](state, payload) {
    const { metaKeywords, backupKeyName = 'tempSavePost' } = payload
    state.metaKeywords = metaKeywords
    backupToLocalStorage('metaKeywords', metaKeywords, backupKeyName)
  },
  [types.RESTORE_POST_FROM_LOCAL_STORAGE](state, payload) {
    const {
      title,
      body,
      headerImageURL,
      metaDescription,
      metaKeywords
    } = payload
    if (title) {
      state.title = title
    }
    if (body) {
      state.body = body
    }
    if (headerImageURL) {
      state.headerImageURL = headerImageURL
    }
    if (metaDescription) {
      state.metaDescription = metaDescription
    }
    if (metaKeywords) {
      state.metaKeywords = metaKeywords
    }
  },
  [types.SET_POST](state, payload) {
    // getting from db
    let { metaKeywords } = payload
    const { headerImageURL, title, body, metaDescription, _id } = payload
    metaKeywords = (metaKeywords || []).join(', ')
    state.metaKeywords = metaKeywords
    state.headerImageURL = headerImageURL
    state.title = title
    state.body = body
    state.metaDescription = metaDescription
    state.prevTitle = title
    state._id = _id
  },
  [types.SET_POST_SAVING](state, payload) {
    state.saving = payload
  },
  [types.SET_POST_ERROR](state, payload) {
    state.error = true
    state.errorMessage = payload
  },
  [types.SET_EDIT_POST_LOADING](state, payload) {
    state.loading = payload
  }
}

export const actions = {
  setPostSaving({ commit }, s) {
    commit(types.SET_POST_SAVING, s)
  },
  setPostTitle({ commit }, { title, backupKeyName }) {
    commit(types.SET_POST_TITLE, { title, backupKeyName })
  },
  setPostBody({ commit }, { body, backupKeyName }) {
    commit(types.SET_POST_BODY, { body, backupKeyName })
  },
  setPostHeaderImage({ commit }, { headerImageURL, backupKeyName }) {
    commit(types.SET_POST_HEADER_IMG, { headerImageURL, backupKeyName })
  },
  setPostMetaDesc({ commit }, { metaDescription, backupKeyName }) {
    commit(types.SET_POST_META_DESC, { metaDescription, backupKeyName })
  },
  setPostMetaKeywords({ commit }, { metaKeywords, backupKeyName }) {
    commit(types.SET_POST_META_KEYWORDS, { metaKeywords, backupKeyName })
  },
  restorePostFromLocalStorage(
    { commit },
    { title, body, headerImageURL, metaDescription, metaKeywords }
  ) {
    commit(types.RESTORE_POST_FROM_LOCAL_STORAGE, {
      title,
      body,
      headerImageURL,
      metaDescription,
      metaKeywords
    })
  },
  async savePost({ commit, dispatch }, postData) {
    const fetchOpts = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    }
    await commit(types.SET_POST_SAVING, true)
    try {
      let resp = await fetch(`${baseURL}/api/dashboard/savePost`, fetchOpts)
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
        return { error: true }
      }
      resp = await resp.json()
      console.log(resp)
      if (!resp.error) {
        await commit(types.SET_POST_SAVING, false)
        return { error: false }
      } else {
        throw new Error(resp.msg)
      }
    } catch (error) {
      await commit(types.SET_POST_SAVING, false)
      console.error(error)
      return { error: true }
    }
  },
  async editPost({ commit, dispatch }, postData, keepOldId) {
    await commit(types.SET_POST_SAVING, true)
    const fetchOpts = {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...postData, keepOldId })
    }
    try {
      let resp = await fetch(`${baseURL}/api/dashboard/editPost`, fetchOpts)
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
        return { error: true }
      }
      resp = await resp.json()
      if (resp.error) {
        throw new Error(resp.msg)
      }
      await commit(types.SET_POST_SAVING, false)
      return { error: false }
    } catch (error) {
      console.error(error)
      await commit(types.SET_POST_SAVING, false)
      return {
        error: true,
        msg:
          error || 'Something went wrong! Please check console and server logs'
      }
    }
  },
  async fetchPost({ commit, dispatch }, { req, id }) {
    const fetchOpts = {
      method: 'GET',
      credentials: 'include'
    }

    if (req && 'token' in req.cookies) {
      fetchOpts.headers = {
        authorization: `Bearer ${req.cookies.token}`
      }
    }

    const url = `${baseURL}/api/dashboard/getPost?id=${id}`

    await commit(types.SET_EDIT_POST_LOADING, true)
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
        throw new Error(resp.msg)
      }
      await commit(types.SET_POST, resp.data)
    } catch (error) {
      console.error(error)
      await commit(
        types.SET_POST_ERROR,
        error || error.msg || 'Something went wrong!'
      )
    }
  }
}
