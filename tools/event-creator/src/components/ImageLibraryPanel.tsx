import { useEffect, useRef } from 'react'
import imageManifest from '../../public/images/image-manifest.json'
import { suspend } from 'suspend-react'

// console.log(imageManifest)
const IMAGE_DIR = '/images/library'

const Image = ({ data }: { data: Blob }) => {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgRef.current) return
    let src = URL.createObjectURL(data)
    imgRef.current.src = src
    return () => URL.revokeObjectURL(src)
  }, [data])

  return (
    <div className="rounded-md overflow-hidden">
      <img ref={imgRef} />
    </div>
  )
}

export const ImageLibraryPanel = () => {
  const data = suspend(async () => {
    const data = await Promise.all(imageManifest.map((url) => fetch(`${IMAGE_DIR}/${url}`).then((r) => r.blob())))
    return data
  }, [])

  return (
    <div className="grid grid-cols-2 p-4 gap-2">
      {data.map((d, i) => (
        <Image data={d} key={i} />
      ))}
    </div>
  )
}
