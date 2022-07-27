import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Scene } from '@/components/webgl/Scene'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Gbg - Cph</title>
        <meta name="description" content="Description comes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Scene />
    </div>
  )
}

export default Home
