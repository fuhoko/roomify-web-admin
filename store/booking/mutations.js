export default {
  SET_USER(state, id) {
    state.currentOwner = id
  },
  SET_VIEWING(state, payload) {
    state.viewing = payload
  },
  SET_TRANSACTION(state, payload) {
    state.listTransaction = payload
  },
  SET_OWNERS(state, payload) {
    state.listOwner = payload
  },
  SET_SEARCH_FILTER(state, string) {
    state.query.s = string != '' ? '&s=' + string : ''
  },
  SET_FILTER(state, string) {
    state.query.filter = string
  },
  SET_SEARCH_FILTER_BOOKING(state, string) {
    state.query.search = string != '' ? '&s=' + string : ''
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
