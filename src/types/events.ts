type Millis = number
export type EventType = 'image' | 'audio'

export interface EventBase {
  id: string
  name: string
  timestamp: Millis
  type: EventType
}

export interface ImageEvent extends EventBase {
  type: 'image'
  payload: {
    url: string
  }
}

export interface AudioEvent extends EventBase {
  type: 'audio'
  payload: {
    url: string
  }
}

export type Event = ImageEvent | AudioEvent

export type Events = Event[]
