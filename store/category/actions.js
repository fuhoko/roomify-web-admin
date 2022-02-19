export default {
  async fetchList({ state, commit }) {
    try {
      const response = await this.$axios.get(
        `/category?page=${state.query.page}&limit=${state.query.size}`,
        {
          headers: {
            Authorization: 'Bearer ' + state.token
          }
        }
      )
      //console.log(response)
      await commit('SET_VIEWING', response.data)
    } catch (error) {
      alert('Fetch API error')
    }
  },
  async fetchDetail({ state, commit }) {
    try {
      console.log(state.selectId)
      console.log(state.viewing)
      const detail = state.viewing.result.find(
        (obj) => obj.id == state.selectId
      )
      console.log(detail)
      await commit('SET_DETAIL', detail)
    } catch (error) {
      alert('Fetch detail get error')
    }
  }
}
