import './App.css'
import { BakeShadows, Bounds, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Room from './components/Room'
import Start from './components/Start'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function App() {
const [us_isStartPage, us_setIsStartPage] = useState<boolean>(true)
const mouseX = useRef(0)
const mouseY = useRef(0)

// Initialize orthographic camera with proper frustum
const aspect = window.innerWidth / window.innerHeight
const frustumSize = 10
const camera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2,
  frustumSize * aspect / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  1000
)
camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)

const handleMouseMove = (e: MouseEvent) => {
  mouseX.current = (e.clientX / window.innerWidth) * 5 - 2.5
  mouseY.current = ((window.innerHeight - e.clientY) / window.innerHeight) * 5 - 1.7
}

const handleClick = () => {
  us_setIsStartPage(false)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('click', handleClick)
}

useEffect(() => {
  document.addEventListener('click', handleClick)
  document.addEventListener('mousemove', handleMouseMove)
}, [])

  return (
    <>
    <Canvas orthographic shadows dpr={[1, 2]} camera={camera} style={{height: window.innerHeight, width: window.innerWidth, display: 'flex', justifySelf: 'center', alignSelf: 'center', backgroundColor: '#000000'}}>
      <Bounds fit clip observe margin={1}>
        {!us_isStartPage ? <Room /> : <Start mouseX={mouseX} mouseY={mouseY} /> }
      </Bounds>
      <BakeShadows />

      <OrbitControls
        camera={camera}
        makeDefault
        minAzimuthAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        // minPolarAngle={5 * Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.3}
      />
    </Canvas>
    </>
  )
}

export default App
