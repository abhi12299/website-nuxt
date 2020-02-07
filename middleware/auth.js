export default async function({ store, req, error, route }) {
  await store.dispatch('auth/authenticate', req)
  const { auth } = store.state

  let errorMessage =
    auth.errorMessage || 'Something went wrong! Please try later.'
  if (
    (route.path.startsWith('/dashboard') || route.path.includes('/preview/')) &&
    !auth.admin
  ) {
    errorMessage = 'You need to be logged in!'
  }
  if (
    auth.initiateForceLogout ||
    ((route.path.startsWith('/dashboard') ||
      route.path.includes('/preview/')) &&
      !auth.admin)
  ) {
    error({
      statusCode: 400,
      errorMessage
    })
  }
}
