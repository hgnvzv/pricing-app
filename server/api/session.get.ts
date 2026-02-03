export default defineEventHandler(async (event) => {
  // Get user from session cookie
  const session = getCookie(event, 'auth-session')
  
  if (!session) {
    return null
  }
  
  try {
    const userData = JSON.parse(session)
    return userData
  } catch (e) {
    // Invalid session, clear it
    deleteCookie(event, 'auth-session')
    return null
  }
})