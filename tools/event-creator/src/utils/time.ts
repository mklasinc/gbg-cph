/*
 * Formats a time in milliseconds to a string in the format mm:ss:msmsms
 * @param milliseconds The time in milliseconds
 * @returns The formatted time
 */
export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const remainingMillis = milliseconds % 1000
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0')
  const formattedMillis = remainingMillis.toString().padStart(3, '0')
  return `${formattedMinutes}:${formattedSeconds}:${formattedMillis}`
}
