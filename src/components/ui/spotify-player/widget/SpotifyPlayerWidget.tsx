import styles from './SpotifyPlayerWidget.module.scss'
import Link from 'next/link'
import type { Track } from '~/types/spotify'
import { useEffect, useMemo, useState, useRef } from 'react'
import classnames from 'classnames'
import { throttle, noop } from '@/utils'

interface Props {
  track: Track | null
  isLoading: boolean
  isLoggedIn: boolean
  isPaused: boolean
  error: string | null
  volume: number
  onVolumeChange: (volume: number) => void
  onResume: () => void
}

type WidgetState = 'loading' | 'logged-out' | 'playing' | 'idle' | 'error' | 'paused'

export const SpotifyPlayerWidget = ({ track, isLoading, isLoggedIn, isPaused, volume, onResume, onVolumeChange, error }: Props) => {
  const hasTrack = useMemo(() => !!track, [track])
  const [state, setState] = useState<WidgetState>('loading')

  const sliderProgressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isLoading) {
      setState('loading')
    } else if (error) {
      setState('error')
    } else if (isLoggedIn) {
      if (isPaused) {
        setState('paused')
      } else if (hasTrack) {
        setState('playing')
      } else {
        setState('idle')
      }
    } else {
      setState('logged-out')
    }
  }, [isLoading, isLoggedIn, error, hasTrack, isPaused])

  return (
    <>
      <div
        className={classnames({ [styles.container]: true, [styles.hasTrack]: hasTrack && !isPaused })}
        onClick={() => {
          if (state === 'paused') {
            onResume()
          }
        }}
      >
        {state === 'logged-out' && (
          <Link href="/api/spotify/login">
            <a className={styles.cta}>Login</a>
          </Link>
        )}

        {state === 'loading' && (
          <div className={styles.loading}>
            <svg
              version="1.1"
              id="L9"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              enableBackground="new 0 0 0 0"
              xmlSpace="preserve"
            >
              <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  dur="1s"
                  from="0 50 50"
                  to="360 50 50"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        )}

        {state === 'error' && <div className={styles.error}>Error: {error}</div>}

        {state === 'paused' && (
          <div className={styles.paused}>
            <svg width="57" height="75" viewBox="0 0 57 75" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M51.9323 43.3696C57.4223 39.8196 57.4023 35.8696 51.9323 32.7296L9.00226 1.32956C4.55227 -1.47044 -0.117735 0.179558 0.00226464 6.01956L0.182265 67.6996C0.562265 74.0396 4.18227 75.7696 9.51227 72.8396L51.9323 43.3696Z"
                fill="white"
              />
            </svg>
          </div>
        )}

        {state === 'idle' && (
          <>
            <div className={styles.spotifyLogo}>
              <svg xmlns="http://www.w3.org/2000/svg" height="168px" width="168px" version="1.1" viewBox="0 0 168 168">
                <path
                  fill="#1ED760"
                  d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z"
                />
              </svg>
            </div>
          </>
        )}

        {state === 'playing' && (
          <>
            <div className={styles.artwork}>
              <img src={track?.album.images[0].url as string} alt="artwork" />
            </div>

            <div className={styles.trackInfo}>
              <div className={styles.track}>{track?.name}</div>
              <div className={styles.artist}>{track?.artists[0].name}</div>
            </div>
            <div className={styles.slidecontainer}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                className={styles.slider}
                id="volumeSlider"
                onInput={(e) => {
                  if (sliderProgressRef) sliderProgressRef.current!.style.width = `${+e.target.value * 100}%`
                }}
                onChange={throttle((e) => onVolumeChange(+e.target.value), 100)}
              />
              <span ref={sliderProgressRef} style={{ width: '50%' }} className={styles.progress}></span>
            </div>
            <div className={styles.spotifyLogo}>
              <svg xmlns="http://www.w3.org/2000/svg" height="168px" width="168px" version="1.1" viewBox="0 0 168 168">
                <path
                  fill="#1ED760"
                  d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z"
                />
              </svg>
            </div>
          </>
        )}
      </div>
    </>
  )
}

SpotifyPlayerWidget.defaultProps = {
  isLoading: false,
  isLoggedIn: false,
  isPaused: false,
  error: null,
  volume: 0.5,
  onVolumeChange: noop,
  onResume: noop,
}
