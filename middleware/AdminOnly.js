export default ({ store, next }) => {
  if (store.state.user.currentUser.role == 'ADMIN') {
    alert('oke')
    next()
  } else {
    store.dispatch('requireAdmin')
  }
}
