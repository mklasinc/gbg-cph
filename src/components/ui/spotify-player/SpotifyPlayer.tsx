import { SpotifyPlayerWidget } from './widget/SpotifyPlayerWidget'
import classnames from 'classnames'
import Script from 'next/script'
import type { Track, WebPlaybackPlayer } from '~/types/spotify'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useSpotifyStore } from '~/store/spotify'
import { SPOTIFY_PLAYER_NAME } from '~/constants/spotify'
import { isSSR } from '~/constants'
import axios from 'axios'
import type { WebPlaybackState } from '@/types/spotify'

interface PlayProps {
  track_uri: string
  access_token: string
  player: any
  device_id: string
}

const play = async ({ access_token, player, device_id, track_uri }: PlayProps) => {
  console.log('try to play')
  try {
    const spotifyApiResponse = await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
      JSON.stringify({ uris: [track_uri] }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
  } catch (err) {
    console.error(err)
    // set({ error: err.message })
  }
}

export const SpotifyPlayer = () => {
  const isLibraryLoaded = useSpotifyStore((state) => state.isLibraryLoaded)
  const isLoggedIn = useSpotifyStore((state) => state.isLoggedIn)
  const isAuthorizing = useSpotifyStore((state) => state.isAuthorizing)
  const access_token = useSpotifyStore((state) => state.access_token)

  const [player, setPlayer] = useState<any>(null)
  const [paused, setPaused] = useState(false)
  const [active, setActive] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [deviceId, setDeviceId] = useState('')
  const [trackUri] = useState('spotify:track:2BMw5cf2Z0oIDLQpdOY38B')
  const [trackInfo, setTrackInfo] = useState<Track | null>(null)

  useEffect(() => {
    if (!access_token || !isLibraryLoaded || isSSR) return
    const _player = new (window as any).Spotify.Player({
      name: SPOTIFY_PLAYER_NAME,
      getOAuthToken: (cb: (access_token: string) => void) => {
        cb(access_token as string)
      },
      volume: volume,
    })

    // see: https://developer.spotify.com/documentation/web-playback-sdk/reference/#event-ready
    _player.addListener('ready', ({ device_id }: WebPlaybackPlayer) => {
      console.log('Ready with Device ID', device_id)
      setDeviceId(device_id)
    })

    // https://developer.spotify.com/documentation/web-playback-sdk/reference/#event-not-ready
    _player.addListener('not_ready', ({ device_id }: WebPlaybackPlayer) => {
      console.log('Device ID has gone offline', device_id)
    })

    // see: https://developer.spotify.com/documentation/web-playback-sdk/reference/#event-player-state-changed
    _player.addListener('player_state_changed', (state: WebPlaybackState | null) => {
      if (!state) {
        return
      }

      setTrackInfo(state.track_window.current_track)
      setPaused(state.paused)

      // see: https://developer.spotify.com/documentation/web-playback-sdk/reference/#api-spotify-player-getcurrentstate
      _player.getCurrentState().then((state: WebPlaybackState | null) => {
        !state ? setActive(false) : setActive(true)
      })
    })

    // https://developer.spotify.com/documentation/web-playback-sdk/reference/#event-autoplay-failed
    _player.addListener('autoplay_failed', () => {
      console.log('Autoplay is not allowed by the browser autoplay rules')
    })

    _player.connect()

    setPlayer(_player)
  }, [access_token, isLibraryLoaded])

  const onVolumeChange = useCallback(
    (volume: number) => {
      if (!player) return
      player.setVolume(volume).then(() => {
        console.log('set volume')
      })
    },
    [player]
  )

  const onResume = useCallback(() => {
    if (!player) return
    player.resume().then(() => {
      console.log('resumed player')
    })
  }, [player])

  // /**
  //  * Play if all conditions are met
  //  */
  // useEffect(() => {
  //   if (player && deviceId && access_token) {
  //     play({
  //       access_token,
  //       player,
  //       track_uri: trackUri,
  //       device_id: deviceId,
  //     })
  //   }
  // }, [player, deviceId, access_token, trackUri])

  return (
    <SpotifyPlayerWidget
      isLoggedIn={isLoggedIn}
      isLoading={!isLibraryLoaded || isAuthorizing}
      isPaused={paused}
      error=""
      track={trackInfo}
      onVolumeChange={onVolumeChange}
      onResume={onResume}
      volume={volume}
    />
  )
}
