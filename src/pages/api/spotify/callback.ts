import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import type { AuthorizationData } from '~/types/spotify'
import { SPOTIFY_REDIRECT_URI } from '~/constants/spotify'

export default async function callbackHandler(_req: NextApiRequest, res: NextApiResponse) {
  const code = _req.query.code
  const state = _req.query.state ?? null
  const storedState = _req.cookies ? _req.cookies.spotify_auth_state : null

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        new URLSearchParams({
          error: 'state_mismatch',
        }).toString()
    )
  } else {
    try {
      const auth_query_parameters = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      })

      const spotifyApiResponse = await axios.post('https://accounts.spotify.com/api/token', auth_query_parameters.toString(), {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const data: AuthorizationData = spotifyApiResponse.data
      const { access_token, refresh_token, expires_in } = data

      res.redirect(
        '/?' +
          new URLSearchParams({
            access_token,
            refresh_token,
            expires_in,
          }).toString()
      )
    } catch (err) {
      // Handle Error Here
      console.error(err)

      res.redirect(
        '/?' +
          new URLSearchParams({
            error: 'invalid_token',
          }).toString()
      )
    }
  }
}
