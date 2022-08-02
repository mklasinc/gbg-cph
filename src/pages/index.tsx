import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { Scene } from '@/components/webgl/Scene'
import { useSpotifyAuth } from '~/hooks/use-spotify-auth'
import Script from 'next/script'
import { useEffect } from 'react'
import { useSpotifyStore } from '~/store/spotify'
import { SpotifyPlayer } from '~/components/ui/spotify-player/SpotifyPlayer'

const Home: NextPage = () => {
  const set = useSpotifyStore((state) => state.set)
  const isLibraryLoaded = useSpotifyStore((state) => state.isLibraryLoaded)
  useSpotifyAuth()

  /**
   * Load the Spotify player script.
   */
  useEffect(() => {
    ;(window as any).onSpotifyWebPlaybackSDKReady = () => {
      set({ isLibraryLoaded: true })
    }
  }, [])

  return (
    <>
      <Head>
        <title>Gbg - Cph</title>
        <meta name="description" content="Description comes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script async strategy="lazyOnload" src="https://sdk.scdn.co/spotify-player.js" />
      <Scene />
      <div className="layout">
        <SpotifyPlayer />
      </div>
    </>
  )
}

export default Home
