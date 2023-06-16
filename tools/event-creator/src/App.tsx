import './App.css'
import { CameraIcon, EyeSlashIcon, FlagIcon, LightBulbIcon, PlusIcon } from '@heroicons/react/24/outline'
import { EyeIcon as EyeFilledIcon, FlagIcon as FlagFilledIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import create from 'zustand'
import { GeistProvider, CssBaseline, Button } from '@geist-ui/core'
import { persist } from 'zustand/middleware'
import { AudioPlayer } from './components/AudioPlayer'
import { ImageLibraryPanel } from './components/ImageLibraryPanel'
import { EventsPanel } from './components/EventsPanel'
import { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { equals } from 'ramda'
import { useStore } from './store'
import { SavePanel } from './components/SavePanel'

function App() {
  const eventsDataInMemory = useStore((state) => state.events)
  const eventsDataInStorage = useStore((state) => state.eventsDataInStorage)

  useEffect(() => {
    const onBeforeUnload = async (e) => {
      e.cancelBubble = true
      const eventsInMemorySorted = eventsDataInMemory.sort((a, b) => a.timestamp - b.timestamp)
      const eventsInStorageSorted = eventsDataInStorage.sort((a, b) => a.timestamp - b.timestamp)

      // console.log('eventsInMemorySorted', eventsInMemorySorted, eventsInStorageSorted)

      // const dataInMemoryAndStorageIsEqual = equals(eventsInMemorySorted, eventsInStorageSorted)

      // if (!dataInMemoryAndStorageIsEqual) {
      //   e.returnValue = 'Are you sure you want to leave?'
      // }
    }

    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [eventsDataInMemory, eventsDataInStorage])

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
      <EventsPanel />

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
          <div className="flex-grow overflow-hidden">
            <h2 className="p-4 uppercase font-light text-xs tracking-widest text-gray-300 border-b border-white/10">Images</h2>
            <div className="w-full h-full">
              <Suspense fallback={<div>Loading</div>}>
                <ImageLibraryPanel />
                <div className="h-[40px]"></div>
              </Suspense>
            </div>
          </div>
          <div style={{ minHeight: '200px' }}>
            <h2 className="p-4 uppercase font-light text-xs tracking-widest text-gray-300 border-b border-white/10">Import/export</h2>
            <SavePanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
