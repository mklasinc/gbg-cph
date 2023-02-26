import './App.css'
import { CameraIcon, EyeSlashIcon, FlagIcon, LightBulbIcon, PlusIcon } from '@heroicons/react/24/outline'
import { EyeIcon as EyeFilledIcon, FlagIcon as FlagFilledIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import create from 'zustand'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { persist } from 'zustand/middleware'
import { AudioPlayer } from './components/AudioPlayer'
import { ImageLibraryContainer } from './components/ImageLibraryContainer'
import { Suspense } from 'react'

function App() {
  return (
    <div
      style={{
        gridTemplateAreas: `
            "outliner scene properties"
            "outliner scene properties"
          `,
      }}
      className="bg-neutral-800 grid grid-cols-[400px_1fr_300px] grid-rows-[3fr_2fr] w-full h-full overflow-hidden gap-4 p-4 text-white"
    >
      <div style={{ gridArea: 'outliner' }} className="bg-neutral-900 rounded-lg overflow-y-auto">
        <h2 className="p-4 uppercase font-light text-xs tracking-widest text-gray-300 border-b border-white/10">Events</h2>

        {/* <Outliner /> */}
      </div>

      <div
        style={{
          gridArea: 'scene',
          backgroundSize: '20px 20px',
          backgroundImage:
            'linear-gradient(to right, #222222 1px, transparent 1px), linear-gradient(to bottom, #222222 1px, transparent 1px)',
        }}
        className="bg-neutral-900 rounded-lg overflow-hidden flex flex-col justify-stretch"
      >
        <div className="flex-grow">
          <h2 className="p-4 uppercase font-light text-xs tracking-widest bg-neutral-900  text-gray-300 border-b border-white/10">Event</h2>
        </div>
        <AudioPlayer src="/test/audio/t-rex-roar.mp3" />
      </div>

      <div style={{ gridArea: 'properties' }} className="bg-neutral-900 rounded-lg overflow-hidden">
        <div className="flex flex-col justify-stretch height h-full overflow-hidden">
          <div className="flex-grow">
            <h2 className="p-4 uppercase font-light text-xs tracking-widest text-gray-300 border-b border-white/10">Images</h2>
            <Suspense fallback={<div>Loading</div>}>
              <ImageLibraryContainer />
            </Suspense>
          </div>
          <div style={{ minHeight: '200px' }}>
            <h2 className="p-4 uppercase font-light text-xs tracking-widest text-gray-300 border-b border-white/10">Import/export</h2>
          </div>
        </div>

        <div className="p-2">
          {/* <Leva
            neverHide
            fill
            flat
            titleBar={false}
            theme={{
              colors: {
                elevation1: 'transparent',
                elevation2: 'transparent',
                elevation3: 'rgba(255, 255, 255, 0.1)',
              },
              sizes: {
                rootWidth: '100%',
              },
            }}
          /> */}
        </div>
      </div>
    </div>
  )
}

export default App
