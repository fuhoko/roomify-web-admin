export default {
  async fetchList({ state, commit, rootState }) {
    try {
      const response = await this.$axios.get(
        `/booking/owner/${state.currentOwner}?filter=''${state.query.search}&page=${state.query.page}&limit=${state.query.size}`,
        {
          headers: {
            Authorization: 'Bearer ' + rootState.user.token
          }
        }
      )
      await commit('SET_VIEWING', response.data)
    } catch (error) {
      alert('Fetch API error')
    }
  },
  async fetchListOwner({ state, commit, rootState }) {
    try {
      const response = await this.$axios.get(
        `/users/?filter=roles.id||$eq||3${state.query.s}&page=${state.query.page}&limit=${state.query.size}`,
        {
          headers: {
            Authorization: 'Bearer ' + rootState.user.token
          }
        }
      )
      await commit('SET_OWNERS', response.data)
    } catch (error) {
      alert('Fetch API error')
    }
  },
  async fetchListTransaction({ state, commit, rootState }) {
    try {
      const response = await this.$axios.get(
        `/transaction?filter=${state.query.filter}${state.query.s}&page=${state.query.page}&limit=${state.query.size}`,
        {
          headers: {
            Authorization: 'Bearer ' + rootState.user.token
          }
        }
      )
      await commit('SET_TRANSACTION', response.data)
    } catch (error) {
      alert('Fetch API error')
    }
  }
}
