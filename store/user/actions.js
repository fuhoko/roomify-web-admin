export default {
  async fetchList({ state, commit }) {
    try {
      const response = await this.$axios.get(
        `/users?filter=${state.query.filter}${state.query.s}&page=${state.query.page}&limit=${state.query.size}`,
        {
          headers: {
            Authorization: 'Bearer ' + state.token
          }
        }
      )
      await commit('SET_VIEWING', response.data)
    } catch (error) {
      alert('Fetch API error')
    }
  },
  async fetchListBanned({ state, commit }) {
    try {
      const response = await this.$axios.get(
        `/users?s={"status": { "$eq": "BANNED" }}&page=${state.query.page}&limit=${state.query.size}`,
        {
          headers: {
            Authorization: 'Bearer ' + state.token
          }
        }
      )
      await commit('SET_VIEWING', response.data)
    } catch (error) {
      alert('Fetch API error')
    }
  }
}
