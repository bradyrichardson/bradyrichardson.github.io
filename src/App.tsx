import './App.css'
import { BakeShadows, Bounds, PresentationControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Room from './components/Room'
import { useEffect, useRef, useState, useMemo, memo } from 'react'
import * as THREE from 'three'
import { Box, Typography, Button } from '@mui/material'

// Memoized Canvas component
const MemoizedCanvas = memo(({ camera, canvasRef }: { camera: THREE.OrthographicCamera, canvasRef: React.RefObject<HTMLCanvasElement | null> }) => {
  return (
    <Canvas 
      ref={canvasRef}
      orthographic 
      shadows 
      dpr={[1, 2]} 
      camera={camera} 
      style={{
        height: window.innerHeight,
        width: window.innerWidth,
        display: 'flex', 
        justifySelf: 'center', 
        alignSelf: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }}
    >
      

      <PresentationControls
        enabled={true} // the controls can be disabled by setting this to false
        global={false} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={false} // Snap-back to center (can also be a spring config)
        speed={2} // Speed factor
        zoom={1} // Zoom factor when half the polar-max is reached
        rotation={[0, 0, 0]} // Default rotation
        polar={[0,0]} // Vertical limits
        azimuth={[-Infinity, Infinity]} // Horizontal limits
      >
        <Bounds fit clip observe>
          <Room />
        </Bounds>
        <BakeShadows />
      </PresentationControls>



      {/* <OrbitControls
        camera={camera}
        makeDefault
        minAzimuthAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        enableZoom={false}
        // minZoom={0.5}
        // maxZoom={4}
        enablePan={false}
        enableRotate={true}
        zoomSpeed={0.3}
      /> */}
    </Canvas>
  )
})

function App() {
const [us_scrollPosition, us_setScrollPosition] = useState<number>(0)
const [subtitleText, setSubtitleText] = useState<string>('')
const [subText, setSubText] = useState<string>('')
const canvasRef = useRef<HTMLCanvasElement>(null)

// Memoize camera to prevent recreation on every render
const camera = useMemo(() => {
  const aspect = window.innerWidth / window.innerHeight
  const frustumSize = 10
  const cam = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000
  )
  cam.position.set(10, 10, 10)
  cam.lookAt(0, 0, 0)
  return cam
}, []) // Empty dependency array means this only runs once

const handleScroll = () => {
  console.log(window.scrollY)
  us_setScrollPosition(window.scrollY)
}

useEffect(() => {
  window.addEventListener('scroll', handleScroll)
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [])

useEffect(() => {
  const subtitle = "Software Engineer & Creative Developer"
  const subTextContent = "Welcome to my room! Explore it to discover my projects, skills, and experience."
  
  let subtitleIndex = 0
  let subTextIndex = 0
  let phase = 0 // 0: typing subtitle, 1: typing sub text
  
  const typewriterInterval = setInterval(() => {
    if (phase === 0) {
      // Type subtitle first
      if (subtitleIndex <= subtitle.length) {
        setSubtitleText(subtitle.slice(0, subtitleIndex))
        subtitleIndex++
      } else {
        // Move to sub text phase
        phase = 1
        subTextIndex = 0
      }
    } else if (phase === 1) {
      // Type sub text
      if (subTextIndex <= subTextContent.length) {
        setSubText(subTextContent.slice(0, subTextIndex))
        subTextIndex++
      }
    }
  }, 20)
  
  return () => clearInterval(typewriterInterval)
}, []) // Empty dependency array means this only runs once on mount


  return (
    <Box
      sx={{
        overflowY: "scroll",
        backgroundColor: 'rgba(0, 0, 0, 0)', 
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px',
      }}
    >
      {/* Title Section */}
      {<Box
      id='scrollable-element'
      sx={{
        textAlign: 'center',
        marginTop: '300px',
        marginBottom: '150px',
        color: 'white',
        opacity: (300 - us_scrollPosition) / 300
      }}>
        <Typography 
          variant="h2" 
          sx={{
            fontWeight: 'bold',
            marginBottom: '10px',
            background: 'linear-gradient(45deg, #ffffff, #ffffff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Brady Richardson
        </Typography>
        <Typography 
          variant="h6" 
          sx={{
            color: '#ffffff',
            fontStyle: 'italic',
            marginBottom: '20px'
          }}
        >
          {subtitleText}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            color: '#ffffff',
            maxWidth: '600px',
            lineHeight: 1.6
          }}
        >
          {subText}
        </Typography>
      </Box>}
      
      {/* Canvas */}
      <Box sx={{padding: '20px', marginLeft: '50px'}}>
        <MemoizedCanvas camera={camera} canvasRef={canvasRef} />
      </Box>

      {/* Button Section */}
        <Box sx={{
          marginTop: '50',
          marginBottom: '100px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          opacity: (us_scrollPosition < 1050) ? 0 : (us_scrollPosition - 1000) / 300
        }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#2c3e50',
              color: 'white',
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '25px',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(44, 62, 80, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#34495e',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(44, 62, 80, 0.4)'
              }
            }}
            onClick={() => window.open('https://www.linkedin.com/in/brady-r-richardson/', '_blank')}
          >
            Connect on LinkedIn
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '25px',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#2980b9',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(52, 152, 219, 0.4)'
              }
            }}
            onClick={() => window.open('https://form.typeform.com/to/sIiim7lx', '_blank')}
          >
            Give me feedback?
          </Button>
        </Box>
    </Box>
  )
}

export default App
