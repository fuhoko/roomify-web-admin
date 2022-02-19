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
  SET_SEARCH_FILTER(state, text) {
    state.query.name = text
  },
  SET_PAGE_FILTER(state, page) {
    state.query.page = page
  },
  SET_LIMIT_FILTER(state, limit) {
    state.query.size = limit
  },
  SET_DETAIL(state, payload) {
    state.selected = payload
  },
  SET_SELECTED_ID(state, id) {
    state.selectId = id
  },
  RESET_FILTER(state) {
    state.query.name = ''
    state.query.page = 1
    state.query.size = 5
  }
}
