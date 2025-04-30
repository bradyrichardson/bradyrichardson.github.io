import './App.css'
import { BakeShadows, Bounds, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Room from './components/Room'

function App() {
  return (
    <Canvas orthographic shadows dpr={[1, 2]} camera={{ position: [10, 10, 10], zoom: 10 }} style={{height: window.innerHeight, width: window.innerWidth, display: 'flex', justifySelf: 'center', alignSelf: 'center'}}>
      <color attach="background" args={['#000000']} />
      {/* <ambientLight intensity={0.01} /> */}
      {/* <hemisphereLight intensity={0.125} color="#8040df" groundColor="red" /> */}
      {/* <spotLight castShadow color="orange" intensity={2} position={[0, 7, -6]} angle={90} penumbra={1} shadow-mapSize={[128, 128]} shadow-bias={0.00005}/> */}

      <Bounds fit clip observe margin={1}>
        <Room />
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
  )
}

export default App
