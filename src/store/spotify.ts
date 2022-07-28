import create from 'zustand'
import { persist } from 'zustand/middleware'
import { SPOTIFY_LOCAL_STORAGE_KEY } from '~/constants/spotify'
import type { LocalStorageData } from '~/types/spotify'
import * as localStorage from '~/utils/local-storage'

interface SpotifyState {
  access_token: string | null
  refresh_token: string | null
  expires_in: number | null
  loggedIn: boolean
  set: (data: Partial<SpotifyState>) => void
}

export const useSpotifyStore = create<SpotifyState>()(
  persist(
    (set, get) => {
      const localStorageData = localStorage.has(SPOTIFY_LOCAL_STORAGE_KEY)
        ? (localStorage.get(SPOTIFY_LOCAL_STORAGE_KEY) as LocalStorageData)
        : { access_token: undefined, refresh_token: undefined, expires_in: 0 }

      console.log('here is what were reading from local storage')
      console.table(localStorageData)

      return {
        access_token: localStorageData.access_token,
        refresh_token: localStorageData.refresh_token,
        expires_in: localStorageData.expires_in,
        loggedIn: false,
        set: (data: Partial<SpotifyState>) => set(data),
      } as SpotifyState
    },
    {
      name: SPOTIFY_LOCAL_STORAGE_KEY, // name of item in the storage (must be unique)
    }
  )
)
