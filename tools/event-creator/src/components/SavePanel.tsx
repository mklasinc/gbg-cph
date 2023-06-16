import { useRef, useState } from 'react'
import { Leva, useControls, button } from 'leva'
import { useStore } from '../store'
import { Modal } from '@geist-ui/core'
import { fileSave } from 'browser-fs-access'
import { equals } from 'ramda'

export const SavePanel = () => {
  const get = useStore((state) => state.get)
  const day = useStore((state) => state.day)
  const setDay = useStore((state) => state.setDay)
  const eventsDataInMemory = useStore((state) => state.events)
  const eventsDataInStorage = useStore((state) => state.eventsDataInStorage)
  const setEventsDataInStorage = useStore((state) => state.setEventsDataInStorage)
  const [showSaveModal, setShowSaveModal] = useState(false)

  async function saveEvents() {
    try {
      const eventsData = get().events
      var blob = new Blob([JSON.stringify(eventsData, null, 2)], { type: 'application/json' })

      await fileSave(blob, {
        fileName: `events_day_${get().day}.json`,
        extensions: ['.json'],
      })

      setEventsDataInStorage(eventsData)
    } catch (error) {
      console.error(error)
    }
  }

  // console.log('eventsDataInMemory', eventsDataInMemory)

  const intendedDay = useRef(day)

  useControls({
    day: {
      value: 1,
      options: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
      },
      onChange: (value) => {
        intendedDay.current = Number(value)

        const eventsInMemorySorted = get().events.sort((a, b) => a.timestamp - b.timestamp)
        const eventsInStorageSorted = get().eventsDataInStorage.sort((a, b) => a.timestamp - b.timestamp)

        if (!equals(eventsInMemorySorted, eventsInStorageSorted)) {
          setShowSaveModal(true)
          return
        }
        setDay(Number(value))
      },
    },
    save: button(() => {
      saveEvents()
    }),
  })

  return (
    <div className="p-2">
      <Leva
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
      />

      <Modal
        visible={showSaveModal}
        onClose={() => {
          setShowSaveModal(false)
        }}
      >
        <Modal.Title>DELETE EVENT</Modal.Title>
        <Modal.Content>
          <p>There's unsaved events for day {day} do you want to save them?</p>
        </Modal.Content>
        <Modal.Action
          passive
          onClick={() => {
            setShowSaveModal(false)
            setDay(intendedDay.current)
          }}
        >
          Cancel
        </Modal.Action>
        <Modal.Action
          onClick={() => {
            setShowSaveModal(false)
            saveEvents()
          }}
        >
          Save
        </Modal.Action>
      </Modal>
    </div>
  )
}
