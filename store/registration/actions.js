export default {
  async fetchList({ state, commit, rootState }) {
    try {
      console.log(state.query.filter)
      const response = await this.$axios.get(
        `/owner-registration?filter=${state.query.filter}${state.query.s}&page=${state.query.page}&limit=${state.query.size}`,
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
