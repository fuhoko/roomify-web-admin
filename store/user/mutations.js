export default {
  SET_USER(state, auth) {
    state.currentUser = auth
  },
  SET_VIEWING(state, payload) {
    state.viewing = payload
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_SEARCH_FILTER(state, string) {
    state.query.s = string != '' ? '&s=' + string : ''
  },
  SET_FILTER(state, string) {
    state.query.filter = string
  },
  SET_PAGE_FILTER(state, page) {
    state.query.page = page
  },
  SET_LIMIT_FILTER(state, limit) {
    state.query.size = limit
  },
  RESET_FILTER(state) {
    state.query.name = ''
    state.query.page = 1
    state.query.size = 5
  }
}
