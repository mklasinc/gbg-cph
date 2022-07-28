import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import type { RefreshTokenData } from '~/types/spotify'
import { useSpotifyStore } from '~/store/spotify'

export function useSpotifyAuth(redirectURL = '/') {
  const router = useRouter()
  const isLoggedIn = useSpotifyStore((state) => state.loggedIn)
  const access_token = useSpotifyStore((state) => state.access_token)
  const refresh_token = useSpotifyStore((state) => state.refresh_token)
  const expires_in = useSpotifyStore((state) => state.expires_in)
  const set = useSpotifyStore((state) => state.set)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async function () {
      setIsLoading(true)

      // if there are access and refresh tokens in the query params, save those to local storage
      const urlParams = new URLSearchParams(window.location.search)
      const hasTokenInfoInQueryParams = urlParams.has('access_token') && urlParams.has('refresh_token') && urlParams.has('expires_in')

      if (hasTokenInfoInQueryParams) {
        console.log(urlParams.get('expires_in'))
        const tokenExpirationDate = +Date.now() + +urlParams.get('expires_in')!

        set({
          access_token: urlParams.get('access_token')!,
          refresh_token: urlParams.get('refresh_token')!,
          expires_in: tokenExpirationDate,
        })

        setIsLoading(false)
        set({ loggedIn: true })
        router.push(redirectURL, undefined, { shallow: true })
        return
      }

      // if there are items in local storage, set the user login as true
      const hasTokenInfo = !!access_token && !!refresh_token && !!expires_in

      if (hasTokenInfo) {
        const tokenHasExpired: boolean = expires_in - +new Date() < 0
        if (tokenHasExpired) {
          try {
            const { data } = await axios.get<RefreshTokenData>(`/api/spotify/refresh?refresh_token=${refresh_token}`)
            const { access_token, error, expires_in } = data
            if (error) {
              set({ loggedIn: false })
            } else {
              const tokenExpirationDate = +Date.now() + +expires_in
              set({ loggedIn: true, access_token, expires_in: tokenExpirationDate })
            }
          } catch (error) {
            set({ loggedIn: false })
            setIsLoading(false)
          }
        } else {
          set({ loggedIn: true })
        }
        setIsLoading(false)
      } else {
        set({ loggedIn: false })
        router.push(redirectURL, undefined, { shallow: true })
      }
      setIsLoading(false)
    })()
  }, [])

  return {
    isLoading,
    isLoggedIn,
  }
}
