import { JSX, useEffect, useRef, useState } from "react"
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { Font, FontLoader } from "three/examples/jsm/Addons.js"

// Extend Three.js with TextGeometry
extend({ TextGeometry })

// Add this type declaration
declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: React.ReactNode
  }
}

export default function Start({...props}): JSX.Element {
  const [projectsFont, setProjectsFont] = useState<Font | null>(null)
  // @ts-expect-error directive here
  const [us_showClickToContinue, us_setShowClickToContinue] = useState<boolean>(false)
  const [us_welcomeText, us_setWelcomeText] = useState("")
  const [us_clickText, us_setClickText] = useState("")
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  
  const welcomeMessage = "Welcome to my portfolio,"
  const clickMessage = "please click anywhere to continue"

  document.addEventListener('mousemove', (e) => {
    mouseX.current = (e.clientX / window.innerWidth) * 5 - 2.5
    mouseY.current = ((window.innerHeight - e.clientY) / window.innerHeight) * 5 - 1.7
    us_setShowClickToContinue(true)
  })

  const state = useThree()

  // Load the font when component mounts
  useEffect(() => {
    const loader = new FontLoader()
    loader.load('./fonts/Roboto Condensed_Regular.json', (loadedFont) => {
      setProjectsFont(loadedFont)
    },
    // Add success and error handlers
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    (error) => {
      console.error('Font loading error:', error)
    })
  }, [])

  // Animate the welcome text
  useEffect(() => {
    if (!projectsFont) return;

    let currentIndex = 0;
    const welcomeInterval = setInterval(() => {
      if (currentIndex <= welcomeMessage.length) {
        us_setWelcomeText(welcomeMessage.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(welcomeInterval)
        // Start the click text animation after welcome text is done
        let clickIndex = 0
        const clickInterval = setInterval(() => {
          if (clickIndex <= clickMessage.length) {
            us_setClickText(clickMessage.slice(0, clickIndex))
            clickIndex++
          } else {
            clearInterval(clickInterval)
          }
        }, 50) // Adjust speed as needed
      }
    }, 50) // Adjust speed as needed

    return () => {
      clearInterval(welcomeInterval)
    }
  }, [projectsFont])

  useFrame(() => {
    const boundedX = Math.max(-5, Math.min(5, mouseX.current))
    const boundedY = Math.max(-5, Math.min(5, mouseY.current))
    state.camera.lookAt(boundedX, boundedY, 0)
  })


  return (
    <>
      {projectsFont && (
        <group dispose={null} rotation={[0, Math.PI/4, 0]}>
          {/* Welcome Text */}
          <group dispose={null} position={[-5,7,0]}>
            <mesh scale={[5, 5, 0.001]} {...props} position={[0,0,0]}>
              <textGeometry
                // @ts-expect-error directive here
                args={[
                  us_welcomeText,
                  {
                    font: projectsFont,
                    size: 0.12,
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.01,
                    bevelSize: 0.005,
                  }
                ]}
              />
              <meshToonMaterial 
                color='#ffffff' 
                opacity={1} 
                transparent={false}
                emissive='#ffffff'
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>

          {/* Click to Continue Text */}
          <group dispose={null} position={[-5,5,0]}>
            <mesh scale={[5, 5, 0.001]} {...props} position={[0,0,0]}>
              <textGeometry
                // @ts-expect-error directive here
                args={[
                  us_clickText,
                  {
                    font: projectsFont,
                    size: 0.12,
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.01,
                    bevelSize: 0.005,
                  }
                ]}
              />
              <meshToonMaterial 
                color='#E16A54' 
                opacity={1} 
                transparent={false}
                emissive='#E16A54'
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        </group>
      )}
    </>
  )
}