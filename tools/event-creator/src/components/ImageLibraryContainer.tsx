import { useEffect, useState, useRef } from 'react'
import imageManifest from '../../public/images/image-manifest.json'
import { suspend } from 'suspend-react'

// import { ImageLibraryList } from './ImageLibraryList'

console.log(imageManifest)
const IMAGE_DIR = '/images/library'

const Image = ({ data }: { data: Blob }) => {
  const imgRef = useRef(null)

  useEffect(() => {
    if (!imgRef.current) return
    let src = URL.createObjectURL(data)
    imgRef.current.src = src
    return () => URL.revokeObjectURL(src)
  }, [data])

  return <img ref={imgRef} />
}

export const ImageLibraryContainer = () => {
  const data = suspend(async () => {
    const data = await Promise.all(imageManifest.map((url) => fetch(`${IMAGE_DIR}/${url}`).then((r) => r.blob())))
    console.log(data)
    return data
  }, [])
  //   const [images, setImages] = useState(null)
  //   useEffect(() => {
  //     csv('/test/images.csv').then((data) => {
  //       console.log(data)
  //       console.log(csv.parse(data))
  //       console.log(csv.parseRows(data)) // [{"Hello": "world"}, …]
  //     })
  //   }, [])
  return data.map((d, i) => <Image data={d} key={i} />)
}
