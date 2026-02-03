export default defineEventHandler(async (event) => {
  // Clear session cookie
  deleteCookie(event, 'auth-session')
  return { success: true }
})