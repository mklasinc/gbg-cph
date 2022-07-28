declare module 'babel-plugin-glsl/macro'

declare module JSX {
  interface IntrinsicElements {
    imageShader: ReactThreeFiber.Object3DNode<ImageShader, typeof ImageShader>
  }
}
