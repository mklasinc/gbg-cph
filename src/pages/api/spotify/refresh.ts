import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import type { RefreshTokenData } from '@/types/spotify'

export default async function refreshTokenHandler(_req: NextApiRequest, res: NextApiResponse) {
  const { refresh_token } = _req.query

  try {
    const auth_query_parameters = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token as string,
    })

    const spotifyApiResponse = await axios.post('https://accounts.spotify.com/api/token', auth_query_parameters.toString(), {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    const data: RefreshTokenData = spotifyApiResponse.data
    const { access_token, expires_in } = data
    res.json({ access_token, expires_in })
  } catch (err) {
    res.json({ error: 'invalid_token' })
  }
}
