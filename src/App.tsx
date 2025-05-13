import './App.css'
import { BakeShadows, Bounds, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Room from './components/Room'
import Start from './components/Start'
import { useEffect, useRef, useState } from 'react'

function App() {
const [us_isStartPage, us_setIsStartPage] = useState<boolean>(true)
const mouseX = useRef(0)
const mouseY = useRef(0)

const handleMouseMove = (e: MouseEvent) => {
  mouseX.current = (e.clientX / window.innerWidth) * 5 - 2.5
  mouseY.current = ((window.innerHeight - e.clientY) / window.innerHeight) * 5 - 1.7
}

const handleClick = () => {
  us_setIsStartPage(false)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('click', handleClick)
}

document.addEventListener('mousemove', handleMouseMove)

useEffect(() => {
  document.addEventListener('click', handleClick)
}, [])

  return (
    <>
    <Canvas orthographic shadows dpr={[1, 2]} camera={{ position: [10, 10, 10], zoom: 10 }} style={{height: window.innerHeight, width: window.innerWidth, display: 'flex', justifySelf: 'center', alignSelf: 'center'}}>
    <color attach="background" args={['#000000']} />
      <Bounds fit clip observe margin={1}>
        {!us_isStartPage ? <Room /> : <Start mouseX={mouseX} mouseY={mouseY} /> }
      </Bounds>
      <BakeShadows />

      <OrbitControls
        makeDefault
        minAzimuthAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        // minPolarAngle={5 * Math.PI / 6}
        minZoom={70}
        maxPolarAngle={Math.PI / 2}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.3}
      />
      {/* <gridHelper args={[1000, 200, '#151515', '#020202']} position={[0, -4, 0]} /> */}
      <mesh scale={200} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry/>
        <meshPhongMaterial opacity={1} color="#6B6B6B" /> 
      </mesh>
    </Canvas>
    </>
  )
}

export default App
