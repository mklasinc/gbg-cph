import { NextApiRequest, NextApiResponse } from 'next'
import { generateRandomString } from '@/utils'
import Cookies from 'cookies'
import { SPOTIFY_REDIRECT_URI } from '~/constants/spotify'

export default function loginHandler(_req: NextApiRequest, res: NextApiResponse) {
  const authState = generateRandomString(16)
  const cookies = new Cookies(_req, res)
  cookies.set('spotify_auth_state', authState)

  const scope = 'streaming user-read-private user-read-email'

  console.log(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID)

  const auth_query_parameters = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
    scope: scope,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: authState,
  })

  res.redirect('https://accounts.spotify.com/authorize?' + auth_query_parameters.toString())
}
