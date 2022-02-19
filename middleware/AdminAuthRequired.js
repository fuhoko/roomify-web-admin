export default ({ store, redirect }) => {
  try {
    if (
      store.state.user.currentUser?.role != 'ADMIN' &&
      store.state.user.currentUser?.role != 'MODERATOR'
    ) {
      store.dispatch('logout')
      return redirect('/auth/login')
    }
  } catch (error) {
    console.log(error)
    store.dispatch('logout')
    return redirect('/auth/login')
  }
}
