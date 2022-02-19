export default ({ store, redirect }) => {
  if (store.state.user.currentUser) {
    if (
      store.state.user.currentUser.role == 'ADMIN' ||
      store.state.user.currentUser.role == 'MODERATOR'
    ) {
      return redirect('/users')
    }
  }
}
