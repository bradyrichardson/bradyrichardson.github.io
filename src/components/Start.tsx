import { JSX, useEffect, useRef, useState } from "react"
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { Font, FontLoader } from "three/examples/jsm/Addons.js"
import { TextAnimation, animateText } from "../assets/util/helpers"

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
  const [us_welcomeText, us_setWelcomeText] = useState("")
  const [us_clickText, us_setClickText] = useState("")
  
  const welcomeMessage = "Welcome to my portfolio..."
  const clickMessage = "Please use a mouse/keyboard for the best experience, and click anywhere to continue."

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

  // Use the animation helper in useEffect
  useEffect(() => {
    if (!projectsFont) return;

    const animations: TextAnimation[] = [
      {
        text: welcomeMessage,
        setText: us_setWelcomeText,
        delay: 500
      },
      {
        text: clickMessage,
        setText: us_setClickText
      }
    ]

    animateText(animations)
  }, [projectsFont])

  useFrame(() => {
    const boundedX = Math.max(-5, Math.min(5, props.mouseX.current))
    const boundedY = Math.max(-5, Math.min(5, props.mouseY.current))
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
          <group dispose={null} position={[-14,5,0]}>
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
                color='#ffffff' 
                opacity={1} 
                transparent={false}
                emissive='#ffffff'
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        </group>
      )}
    </>
  )
}