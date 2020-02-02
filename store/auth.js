/* eslint-disable no-console */
import types from '../constants/types'
import baseURL from '../server/constants/apiURL'
import { showToast } from '../utils/toasts'

export const state = () => ({
  admin: null,
  loading: false,
  initiateForceLogout: false,
  errorMessage: '',
  error: false,
  loggedOut: null
})

export const mutations = {
  [types.SET_AUTH_LOADING](state, payload) {
    state.loading = payload
  },
  [types.SET_AUTH_ADMIN](state, payload) {
    state.admin = payload
    state.loading = false
  },
  [types.SET_AUTH_ERROR](state, payload) {
    state.loading = false
    state.error = payload.error
    state.errorMessage = payload.errorMessage
    state.initiateForceLogout = payload.initiateForceLogout
  },
  [types.SET_AUTH_LOGOUT](state) {
    state.admin = null
    state.loading = false
    state.loggedOut = true
    state.error = false
    state.initiateForceLogout = false
    state.errorMessage = null
  }
}

export const actions = {
  async authenticate({ commit }, req) {
    // do nothing if called on client side
    // or when there is no token
    if (!process.server || !('token' in req.cookies)) return

    const fetchOpts = {
      credentials: 'include',
      headers: {
        authorization: `Bearer ${req.cookies.token}`
      }
    }

    await commit(types.SET_AUTH_LOADING, true)
    try {
      const resp = await fetch(`${baseURL}/auth/verify`, fetchOpts)
      const data = await resp.json()

      if (data.valid) {
        await commit(types.SET_AUTH_ADMIN, true)
      } else if (data.emptyToken === true) {
        await commit(types.SET_AUTH_ERROR, {
          error: true,
          errorMessage: 'You must be logged in!',
          initiateForceLogout: false
        })
      } else if (data.emptyToken === false) {
        await commit(types.SET_AUTH_ERROR, {
          error: true,
          errorMessage: 'Invalid user token! You will be logged out!',
          initiateForceLogout: true
        })
      }
    } catch (error) {
      console.error({ error })
      await commit(types.SET_AUTH_ERROR, {
        errorMessage: 'Something went wrong!'
      })
    }
  },
  async logout({ commit }) {
    await commit(types.SET_AUTH_LOADING, true)

    try {
      let resp = await fetch(baseURL + '/auth/logout', {
        method: 'GET',
        credentials: 'include'
      })
      resp = await resp.json()
      console.log({ resp })
      if (resp.loggedOut) {
        showToast('You have been logged out!', 'success')
        await commit(types.SET_AUTH_LOGOUT)
      }
    } catch (error) {
      console.error(error)
      await commit(types.SET_AUTH_LOGOUT)
    }
  },
  async createAuthError({ commit }, { errorMessage, initiateForceLogout }) {
    console.log('inside createAuthError')
    await commit(types.SET_AUTH_ERROR, {
      error: true,
      errorMessage,
      initiateForceLogout
    })
  }
}
