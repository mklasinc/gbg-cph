import React, { Suspense, useState } from 'react'
import { Canvas, extend, useThree } from '@react-three/fiber'
import { useTexture, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useControls } from 'leva'

const ImageShader = shaderMaterial(
  { u_tex: null, u_texSize: new THREE.Vector2(), u_frameSize: new THREE.Vector2(), u_has_soft_edge: false, u_edge_width: 0.03 },
  // vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  /*glsl*/ `
    highp float;
    uniform sampler2D u_tex;
    uniform vec2 u_texSize;
    uniform vec2 u_frameSize;
    uniform bool u_has_soft_edge;
    uniform float u_edge_width;
    varying vec2 vUv;

    vec4 coverTexture(sampler2D tex, vec2 imgSize, vec2 frameSize, vec2 ouv) {
      vec2 s = frameSize;
      vec2 i = imgSize;
      float rs = s.x / s.y;
      float ri = i.x / i.y;
      vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
      vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
      vec2 uv = ouv * s / new + offset;
    
      return texture2D(tex, uv);
    }

    void main() {
      gl_FragColor = coverTexture(u_tex, u_texSize, u_frameSize, vUv);

      float edge_left = smoothstep(0.0, u_edge_width, vUv.x);
      float edge_right = 1.0 - smoothstep(1.0 - u_edge_width, 1.0, vUv.x);
      float edge_top = smoothstep(0.0, u_edge_width, vUv.y);
      float edge_bottom = 1.0 - smoothstep(1.0 - u_edge_width, 1.0, vUv.y);
      float soft_frame = edge_left * edge_right * edge_top * edge_bottom;

      if(u_has_soft_edge) {
        gl_FragColor.a = soft_frame;
      }

    }
  `
)

extend({ ImageShader })

const Image = () => {
  const texture = useTexture('https://i8.amplience.net/i/rapha/_51A9067')
  const [frame] = useState(new THREE.Vector2(3, 4))

  const { edge } = useControls({
    edge: {
      value: 0.03,
      min: 0,
      max: 0.15,
      step: 0.01,
    },
  })

  return (
    <mesh position-z={0.01} scale={1.4}>
      <planeBufferGeometry attach="geometry" args={[frame.x, frame.y]} />
      <imageShader
        transparent={true}
        attach="material"
        u_tex={texture}
        u_frameSize={frame}
        u_texSize={[texture.image.width, texture.image.height]}
        u_has_soft_edge={true}
        u_edge_width={edge}
      />
    </mesh>
  )
}

const Background = () => {
  const texture = useTexture('https://i8.amplience.net/i/rapha/rapha_ss18_Argentina_Brevet_170_16x9')
  const { viewport, camera } = useThree()
  const { width, height } = viewport.getCurrentViewport(camera)

  return (
    <mesh scale={[width, height, 1]}>
      <planeBufferGeometry attach="geometry" />
      <imageShader
        transparent={true}
        attach="material"
        u_tex={texture}
        u_frameSize={[width, height]}
        u_texSize={[texture.image.width, texture.image.height]}
        u_has_soft_edge={false}
      />
    </mesh>
  )
}

export function Scene() {
  return (
    <Canvas
      linear
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
      }}
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        stencil: false,
        depth: false,
      }}
    >
      <color attach="background" args={['#313639']} />
      <Suspense fallback={null}>
        <Image />
        <Background />
      </Suspense>
    </Canvas>
  )
}
