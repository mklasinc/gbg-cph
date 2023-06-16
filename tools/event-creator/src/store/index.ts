import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Events, Event } from '@base/types/events'

interface StoreState {
  get: () => StoreState

  day: number
  setDay: (day: number) => void

  events: Events
  setEvents: (events: Events) => void

  eventsDataInStorage: Events
  setEventsDataInStorage: (events: Events) => void

  createEvent: (event: Event) => void
  updateEvent: (event: Event) => void
  deleteEvent: (id: string) => void

  selectedEvent: Partial<Event>
  setSelectedEvent: (event: Partial<Event>) => void

  reset: () => void

  playerStatus: 'playing' | 'paused'
  setPlayerStatus: (status: 'playing' | 'paused') => void

  currentTimestamp: number
  setCurrentTimestamp: (timestamp: number) => void
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        get,

        day: 1,
        setDay: (day: number) => set({ day }),

        events: [],
        setEvents: (events) => set({ events }),

        eventsDataInStorage: [],
        setEventsDataInStorage: (events) => set({ eventsDataInStorage: events }),

        createEvent: (event: Event) => {
          const { events } = get()
          set({ events: [...events, event] })
        },
        updateEvent: (event: Event) => {
          const { events } = get()
          const updatedEvents = events.map((e) => (e.id === event.id ? event : e))
          set({ events: updatedEvents })
        },
        deleteEvent: (id: string) => {
          const { events } = get()
          const updatedEvents = events.filter((event) => event.id !== id)
          set({ events: updatedEvents })
        },

        selectedEvent: {},
        setSelectedEvent: (event) => set({ selectedEvent: event }),

        reset: () => set({ selectedEvent: {}, playerStatus: 'paused' }),

        playerStatus: 'paused',
        setPlayerStatus: (status: 'playing' | 'paused') => set({ playerStatus: status }),

        currentTimestamp: 0,
        setCurrentTimestamp: (timestamp: number) => set({ currentTimestamp: timestamp }),
      }),
      {
        name: 'event-creator-storage',
      }
    )
  )
)
