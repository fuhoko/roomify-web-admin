const cookieparser = require('cookieparser')
const Cookie = require('js-cookie')
export default {
  async nuxtServerInit({ commit }, { req }) {
    // console.log('req :>> ', req.headers)
    if (req?.headers?.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        const token = parsed.token
        const response = await this.$axios.get('/auth/me', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        commit('user/SET_TOKEN', token)
        commit('user/SET_USER', response.data)
      } catch (error) {
        commit('user/SET_USER', null)
      }
    }
  },
  async logout({ commit }) {
    await Cookie.remove('token')
    commit('user/SET_USER', null)
  },
  async requireAdmin() {
    this.notifyToast('error', 'Error', 'Only Admin can access this permission')
  }
}
