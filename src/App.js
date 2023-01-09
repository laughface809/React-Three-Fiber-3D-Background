import { useRef } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, Plane, useTexture } from '@react-three/drei'

// MIDAS : https://huggingface.co/spaces/pytorch/MiDaS

export const App = () => (
  <>
    <h1 class="welcome2023">welcome 2023</h1>
    <Canvas>
      <Model />
    </Canvas>
  </>
)

function Model(props) {
  const depthMaterial = useRef()
  const texture = useTexture('/welcome2023.png')
  const depthMap = useTexture('/welcome-blend.png')
  const { viewport } = useThree()
  useFrame((state) => (depthMaterial.current.uMouse = [state.mouse.x * 0.01, state.mouse.y * 0.01]))
  return (
    <Plane args={[1, 1]} scale={[viewport.width, viewport.height, 1]}>
      <pseudo3DMaterial ref={depthMaterial} uImage={texture} uDepthMap={depthMap} />
    </Plane>
  )
}

extend({
  Pseudo3DMaterial: shaderMaterial(
    { uMouse: [0, 0], uImage: null, uDepthMap: null },
    `
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }`,
    `
    precision mediump float;

    uniform vec2 uMouse;
    uniform sampler2D uImage;
    uniform sampler2D uDepthMap;

    varying vec2 vUv;

    void main() {
       vec4 depthDistortion = texture2D(uDepthMap, vUv);
       float parallaxMult = depthDistortion.r;

       vec2 parallax = (uMouse) * parallaxMult;

       vec4 original = texture2D(uImage, (vUv + parallax));
       gl_FragColor = original;
    }
    `,
  ),
})
