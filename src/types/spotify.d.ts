/**
 * See: https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
 */
export type RefreshTokenData = {
  access_token: string
  token_type: string
  scope: string
  expires_in: string
  error?: string
}

/**
 * See: https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
 */
export type AuthorizationData = {
  access_token: string
  refresh_token: string
  token_type: string
  scope: string
  expires_in: string
}

export type LocalStorageData = {
  access_token: string
  refresh_token: string
  expires_in: string
}

export type Track = {
  name: string
  album: {
    images: { url: string }[]
  }
  artists: { name: string }[]
}

/**
 * See: https://developer.spotify.com/documentation/web-playback-sdk/reference/#object-web-playback-player
 */
export type WebPlaybackPlayer = {
  device_id: string
}

/**
 * See: https://developer.spotify.com/documentation/web-playback-sdk/reference/#object-web-playback-track
 */
export type WebPlaybackTrack = {
  uri: string // Spotify URI
  id: string // Spotify ID from URI (can be null)
  type: string // Content type: can be "track", "episode" or "ad"
  media_type: string // Type of file: can be "audio" or "video"
  name: string // Name of content
  is_playable: boolean // Flag indicating whether it can be played
  album: {
    uri: string // Spotify Album URI
    name: string
    images: { url: string }[]
  }
  artists: { uri: string; name: string }[]
}

/**
 * See: https://developer.spotify.com/documentation/web-playback-sdk/reference/#object-web-playback-state
 */
export type WebPlaybackState = {
  context: {
    uri: string // The URI of the context (can be null)
    metadata: object // Additional metadata for the context (can be null)
  }
  disallows: {
    // A simplified set of restriction controls for
    pausing: boolean // The current track. By default, these fields
    peeking_next: boolean // will either be set to false or undefined, which
    peeking_prev: boolean // indicates that the particular operation is
    resuming: boolean // allowed. When the field is set to `true`, this
    seeking: boolean // means that the operation is not permitted. For
    skipping_next: boolean // example, `skipping_next`, `skipping_prev` and
    skipping_prev: boolean // `seeking` will be set to `true` when playing an
    // ad track.
  }
  paused: boolean // Whether the current track is paused.
  position: number // The position_ms of the current track.
  repeat_mode: number // The repeat mode. No repeat mode is 0,
  // repeat context is 1 and repeat track is 2.
  shuffle: boolean // True if shuffled, false otherwise.
  track_window: {
    current_track: WebPlaybackTrack // The track currently on local playback
    previous_tracks: WebPlaybackTrack[] // Previously played tracks. Number can vary.
    next_tracks: WebPlaybackTrack[] // Tracks queued next. Number can vary.
  }
}

/**
 * See: https://developer.spotify.com/documentation/web-playback-sdk/reference/#object-web-playback-player
 */
type WebPlaybackError = {
  message: string
}
