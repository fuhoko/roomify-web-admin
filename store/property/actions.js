export default {
  async fetchList({ state, commit }) {
    try {
      const response = await this.$axios.get(
        `/properties?filter''${state.query.s}&page=${state.query.page}&limit=${state.query.size}`
      )
      await commit('SET_VIEWING', response.data)
    } catch (error) {
      alert('Fetch API error')
    }
  },
  async fetchListBanned({ state, commit, rootState }) {
    try {
      const response = await this.$axios.get(
        `/properties/deleted?page=${state.query.page}&limit=${state.query.size}`,
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
  }
}
