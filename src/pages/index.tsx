import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { Scene } from '@/components/webgl/Scene'
import { useSpotifyAuth } from '~/hooks/use-spotify-auth'

const Home: NextPage = () => {
  const { isLoggedIn, isLoading } = useSpotifyAuth()

  return (
    <div>
      <Head>
        <title>Gbg - Cph</title>
        <meta name="description" content="Description comes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Scene />
      <div className="layout">
        {isLoading ? (
          <div>Loading...</div>
        ) : isLoggedIn ? (
          <div>Logged in </div>
        ) : (
          <Link href="/api/spotify/login">
            <a>Login</a>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Home
