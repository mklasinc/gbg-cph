import { isSSR } from '~/constants'

export function get(info: string | string[]): any {
  if (isSSR) return undefined
  if (Array.isArray(info)) {
    const items = new Map()
    for (const key of info) {
      items.set(key, JSON.parse(<string>localStorage.getItem(key)) || undefined)
    }
    return Object.fromEntries(items)
  } else {
    return JSON.parse(<string>localStorage.getItem(info)) || undefined
  }
}

export function has(key: string) {
  if (isSSR) return false
  return localStorage.getItem(key) !== null
}

export function set(key: string, value: any): void {
  if (isSSR) return
  localStorage.setItem(key, JSON.stringify(value))
}

export function remove(items: string[]): void {
  if (isSSR) return
  items.forEach((item) => {
    localStorage.removeItem(item)
  })
}
