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
