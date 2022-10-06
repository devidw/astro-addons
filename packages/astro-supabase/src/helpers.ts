import type { SupabaseClient, AuthChangeEvent, Session } from "@supabase/supabase-js"
import type { AstroGlobal } from "astro"
import Cookies from 'js-cookie'
import type { CookieAttributes } from 'js-cookie'

/**
 * supabase.auth.api.setAuthCookie()
 */
export function setAuthCookie(event: AuthChangeEvent, session: Session | null) {
  const cookieOptions: CookieAttributes = {
    sameSite: 'strict',
  }

  if (event === 'SIGNED_IN') {
    if (!session) throw new Error('Session is null')

    Cookies.set('sb-access-token', session.access_token, cookieOptions)

    if (session.refresh_token) {
      Cookies.set('sb-refresh-token', session.refresh_token)
    }
  }

  if (event === 'SIGNED_OUT') {
    ['sb-access-token', 'sb-refresh-token'].forEach((cookie) => {
      Cookies.remove(cookie)
    })
  }
}

/**
 * supabaseClient.auth.api.getUserByCookie()
 */
export async function getUserByCookie(Astro: AstroGlobal, supabaseClient: SupabaseClient) {
  // supabaseClient.auth.api.setAuthCookie
  // supabaseClient.auth.api.getUserByCookie
  const accessToken = Astro.cookies.get("sb-access-token")
  const refreshToken = Astro.cookies.get("sb-refresh-token")

  if (!accessToken.value) {
    return null
  }

  const { user, error: getUserError } = await supabaseClient.auth.api.getUser(
    accessToken.value
  )

  // if (getUserError) {
  //   if (!refreshToken.value) {
  //     return null
  //   }

  //   const { error } = await supabaseClient.auth.api.refreshAccessToken(
  //     refreshToken.value
  //   )

  //   if (error) {
  //     return null
  //   }
  // }

  return user
}