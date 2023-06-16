import React, { createContext, useContext, useState } from 'react'
import { suspend } from 'suspend-react'
import { useStore } from '@/store'
import type { Events, Event } from '@base/types/events'
import { useErrorBoundary } from 'react-error-boundary'
import eventsTI from '@base/types/events-ti'
import { createCheckers } from 'ts-interface-checker'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { TrashIcon, PencilIcon, EyeSlashIcon, FlagIcon, LightBulbIcon, PlusIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { formatTime } from '@/utils/time'
import { v4 as uuidv4 } from 'uuid'
import { Modal } from '@geist-ui/core'

const { IEvents } = createCheckers(eventsTI)

const EventDeleteContext = createContext({
  showDeleteModal: false,
  setShowDeleteModal: (() => {}) as any,
})

const EventListItem = ({ event }: { event: Event }) => {
  const deleteEvent = useStore((state) => state.deleteEvent)
  const selectedEvent = useStore((state) => state.selectedEvent)
  const setSelectedEvent = useStore((state) => state.setSelectedEvent)

  const isSelected = selectedEvent?.id === event.id

  const { setShowDeleteModal } = useContext(EventDeleteContext)

  return (
    <li
      key={event.id}
      className={clsx(
        'group flex relative list-none p-2 gap-2 rounded-md bg-transparent cursor-pointer transition-colors',
        isSelected && 'bg-white/20',
        !isSelected && 'hover:bg-white/10'
      )}
      onClick={() => setSelectedEvent(event)}
    >
      <div className="w-full flex justify-between items-center content-center">
        <div className="text-sm font-bold">{event.name}</div>
        <div className="flex items-center content-center">
          <div className="px-4">
            <button
              className="rounded p-1 hover:bg-white/20 transition-colors"
              onClick={() => {
                setSelectedEvent(event)
                setShowDeleteModal(true)
              }}
            >
              <TrashIcon className="w-4 h-4 text-red-500 opacity-80 hover:opacity-100" />
            </button>
          </div>

          <div className="text-xs text-white/20">{formatTime(event.timestamp)}</div>
        </div>
      </div>
    </li>
  )
}

const EventsList = () => {
  const day = useStore((state) => state.day)
  const events = useStore((state) => state.events)
  const setEvents = useStore((state) => state.setEvents)
  const setEventsDataInStorage = useStore((state) => state.setEventsDataInStorage)
  const eventsSorted = React.useMemo(() => events.sort((a, b) => a.timestamp - b.timestamp), [events])

  const { showBoundary } = useErrorBoundary()

  React.useEffect(() => {
    console.log(day)
    async function fetchEvents() {
      let data
      try {
        const r = await fetch(`/events_day_${day}.json`)
        data = await r.json()
      } catch (err) {
        console.error(err)
        setEvents([])
        setEventsDataInStorage([])
        return
      }

      try {
        // IEvents.check(data)
        setEvents(data as Events)
        setEventsDataInStorage(data as Events)
      } catch (err) {
        console.error(err)
        showBoundary(err)
      }
    }

    fetchEvents()
  }, [day])

  return (
    <ul className="w-full h-full m-0 p-2 flex flex-col gap-1">
      {eventsSorted.map((event, i) => (
        <EventListItem event={event} key={i} />
      ))}
    </ul>
  )
}

export const EventsPanel = () => {
  const currentTimestamp = useStore((state) => state.currentTimestamp)
  const selectedEvent = useStore((state) => state.selectedEvent)
  const setSelectedEvent = useStore((state) => state.setSelectedEvent)
  const events = useStore((state) => state.events)
  const setEvents = useStore((state) => state.setEvents)
  const deleteEvent = useStore((state) => state.deleteEvent)

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function createEvent() {
    const newEvent = {
      id: uuidv4(),
      name: 'Event name',
      timestamp: currentTimestamp,
      data: {},
    } as unknown as Event

    setEvents([...events, newEvent])
    setSelectedEvent(newEvent)
  }

  return (
    <div style={{ gridArea: 'outliner' }} className="bg-neutral-900 rounded-lg">
      <div className="w-full flex p-4 justify-between items-center border-b border-white/10">
        <h2 className=" uppercase font-light text-xs tracking-widest text-gray-300">Events</h2>
        <button className="rounded p-1 -m-1 hover:bg-white/20 transition-colors" onClick={createEvent}>
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      <ErrorBoundary fallback={<div>Something went wrong</div>} onError={(error) => console.error(error)}>
        <Suspense fallback={<div>Loading</div>}>
          <EventDeleteContext.Provider
            value={{
              showDeleteModal,
              setShowDeleteModal,
            }}
          >
            <EventsList />
          </EventDeleteContext.Provider>
        </Suspense>
      </ErrorBoundary>

      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
        }}
      >
        <Modal.Title>DELETE EVENT</Modal.Title>
        <Modal.Content>
          <p>Are you sure you want to delete an event?</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          onClick={() => {
            deleteEvent(selectedEvent?.id as string)
            setShowDeleteModal(false)
          }}
        >
          Submit
        </Modal.Action>
      </Modal>
    </div>
  )
}
