import { useFrame } from "@react-three/fiber"
import { JSX, useRef, useState, Fragment, forwardRef, useEffect } from "react"
import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { Font, FontLoader } from "three/examples/jsm/Addons.js"
import { extend } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import turdlImage from '/src/assets/turdl.png'
import lazynotesLogo from '/src/assets/lazynotes-logo.png'
import pokeVision from '/src/assets/poke-vision.png'
import parapalLogo from '/src/assets/parapal-logo.png'

extend({ TextGeometry })

declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: React.ReactNode
  }
}

export default function Room({...props}): JSX.Element {
  const group = useRef<THREE.Group>(null)
  const [us_lightOne, us_setLightOne] = useState(false)
  const [us_lightTwo, us_setLightTwo] = useState(false)
  const [us_laptopOn, us_setLaptopOn] = useState(false)
  const drawerOneRef = useRef<THREE.Group>(null)
  const drawerTwoRef = useRef<THREE.Group>(null)
  const drawerThreeRef = useRef<THREE.Group>(null)
  const drawerFourRef = useRef<THREE.Group>(null)
  const targetPositionOne = useRef(new THREE.Vector3(0, 1.0, 0))      // Top drawer
  const targetPositionTwo = useRef(new THREE.Vector3(0, 0.583, 0))    // Second drawer
  const targetPositionThree = useRef(new THREE.Vector3(0, 0.167, 0))  // Third drawer
  const targetPositionFour = useRef(new THREE.Vector3(0, -0.25, 0))   // Bottom drawer
  const [us_ballAnimating, us_setBallAnimating] = useState(false)
  const ballRef = useRef<THREE.Mesh>(null)
  const ballVelocity = useRef({ x: 0, y: 0, z: 0 })
  const ballStartPos = { x: -2, y: 1.02, z: -0.82 } // Original position
  const gravity = -9.8
  const bounceFactor = 0.6 // How much bounce (1 = perfect bounce, 0 = no bounce)
  const floorY = 0.105 // Y position of floor + ball radius
  const bookPageRotation = useRef(new THREE.Vector3(0, 0, 0))
  const [us_animationTriggered, us_setAnimationTriggered] = useState(false)
  const [us_stringLightsOn, us_setStringLightsOn] = useState(false)
  const [us_projectsFont, us_setProjectsFont] = useState<Font | null>(null)
  const projectDisplayBoardOneRef = useRef<THREE.Mesh>(null)
  const projectDisplayBoardTwoRef = useRef<THREE.Mesh>(null)
  const projectDisplayBoardThreeRef = useRef<THREE.Mesh>(null)
  const projectDisplayBoardFourRef = useRef<THREE.Mesh>(null)
  const projectDisplayBoardOneIsAnimating = useRef(false)
  const projectDisplayBoardTwoIsAnimating = useRef(false)
  const projectDisplayBoardThreeIsAnimating = useRef(false)
  const projectDisplayBoardFourIsAnimating = useRef(false)
  const COLOR_PALETTE = {
    'trueWhite': '#ffffff',
    'black': '#0f1626',
    'beige': '#ab987a',
    'white': '#f5f5f5',
    'gray': '#aaaaaa',
    'orange': '#E16A54',
    'lightOrange': '#F39E60',
    'darkOrange': '#9F5255',
    'test': '#FFFDD0',
    'lightBlue': '#99D1DB',
    'darkBlue': '#5E8FB1',
    'lightGreen': '#A2C579',
    'darkGreen': '#6F8F3F',
    'lightRed': '#D1605D',
    'darkRed': '#8F3F3F',
    'silver': '#818589',
    'lightBeige': '#F5F5DC',
    'lightYellow': '#FFFFC5',
    'pink': '#FF8DA1',
    'canaryYellow': '#FFEF00',
    'darkBrown': '#5C4033',
    'darkCharcoal': '#808080',
  }

  const handleLampMouseOver = () => {
      us_setLightOne(!us_lightOne)
  }

  const handleLaptopMouseOver = () => {
    us_setLightTwo(!us_lightTwo)
    us_setLaptopOn(!us_laptopOn)
  }

  const handleDrawerClick = (targetPosition: React.RefObject<THREE.Vector3>, drawerNumber: number) => {
    const drawers = [targetPositionOne, targetPositionTwo, targetPositionThree, targetPositionFour]

    // move drawers
    if (targetPosition.current.x === 0) {
      targetPosition.current.x = 0.6 // move drawer out

      // close other drawers if they are open
      drawers.forEach((target, drawerNum) => {
        if (target.current.x === 0.6 && drawerNum + 1 !== drawerNumber) {
          target.current.x = 0
        }
      })
    } else {
      targetPosition.current.x = 0 // move drawer in
    }

    // animate project display board
    switch (drawerNumber) {
      case 1:
        projectDisplayBoardOneIsAnimating.current = true
        break
      case 2:
        projectDisplayBoardTwoIsAnimating.current = true
        break
      case 3:
        projectDisplayBoardThreeIsAnimating.current = true
        break
      case 4:
        projectDisplayBoardFourIsAnimating.current = true
        break
      default:
        break
    }
  }

  const handleProjectDisplayBoardClick = (link: string, boardNumber: number) => {
    if (projectDisplayBoardOneRef.current && projectDisplayBoardTwoRef.current && projectDisplayBoardThreeRef.current && projectDisplayBoardFourRef.current) {
      switch (boardNumber) {
        case 1:
          // the reason we check if the y position is greater than the start position is to determine
          // if the board is currently being displayed...if it is, then we want to open the link
          // but if it's not, then we don't want to open the link...the issue is that clicks in
          // threeJS will go through objects and click on the boards even if they are not currently being displayed
          if (projectDisplayBoardOneRef.current.position.y > displayBoardStartPosition.y + 0.05) {
            window.open(link, '_blank')
          }
          break
        case 2:
          if (projectDisplayBoardTwoRef.current.position.y > displayBoardStartPosition.y + 0.05) {
            window.open(link, '_blank')
          }
          break
        case 3:
          if (projectDisplayBoardThreeRef.current.position.y > displayBoardStartPosition.y + 0.05) {
            window.open(link, '_blank')
          }
          break
        case 4:
          if (projectDisplayBoardFourRef.current.position.y > displayBoardStartPosition.y + 0.05) {
            window.open(link, '_blank')
          }
          break
        default:
          break
        }
      }
  }

  const handleLacrosseBallMouseOver = () => {
    if (!us_ballAnimating && !us_animationTriggered) {
      us_setAnimationTriggered(true)
      us_setBallAnimating(true)

      // initial velocity when ball leaves stick
      ballVelocity.current = { x: 0.5, y: -1, z: 0.3 }
    }
  }

  const handleLightSwitchMouseOver = () => {
    us_setStringLightsOn(!us_stringLightsOn)
  }

  useFrame((_, delta) => {
    // drawer animation on click
    if (drawerOneRef.current && targetPositionOne.current) {
      drawerOneRef.current.position.lerp(targetPositionOne.current, delta * 5)
    }
    if (drawerTwoRef.current && targetPositionTwo.current) {
      drawerTwoRef.current.position.lerp(targetPositionTwo.current, delta * 5)
    }
    if (drawerThreeRef.current && targetPositionThree.current) {
      drawerThreeRef.current.position.lerp(targetPositionThree.current, delta * 5)
    }
    if (drawerFourRef.current && targetPositionFour.current) {
      drawerFourRef.current.position.lerp(targetPositionFour.current, delta * 5)
    }

    // ball animation on mouse over
    if (us_ballAnimating && ballRef.current) {
      // Update velocity with gravity
      ballVelocity.current.y += gravity * delta

      // update position based on velocity
      ballRef.current.position.x += ballVelocity.current.x * delta
      ballRef.current.position.y += ballVelocity.current.y * delta
      ballRef.current.position.z += ballVelocity.current.z * delta

      // check for floor collision
      if (ballRef.current.position.y < floorY) {
        ballRef.current.position.y = floorY // Prevent going through floor
        
        // bounce with energy loss
        if (Math.abs(ballVelocity.current.y) > 0.1) {
          ballVelocity.current.y = -ballVelocity.current.y * bounceFactor
          // Reduce horizontal velocity with each bounce (friction)
          ballVelocity.current.x *= 0.9
          ballVelocity.current.z *= 0.9
        } else {
          // stop animation when ball nearly stops
          us_setBallAnimating(false)
          // reset ball position
          // ballRef.current.position.set(ballStartPos.x, ballStartPos.y, ballStartPos.z)
        }
      }

      // add rotation to the ball as it moves
      ballRef.current.rotation.x += ballVelocity.current.x * delta * 2
      ballRef.current.rotation.z += ballVelocity.current.z * delta * 2

      // book page animation on mouse over
      bookPageRotation.current.x += 0.01 * delta * 2
      bookPageRotation.current.z += 0.01 * delta * 2
    }
  })

  const Box = ({...props}): JSX.Element => {
    return (
        <mesh position={props.position} onClick={props.onClick ? props.onClick : null} rotation={props.rotation ? props.rotation : [0,0,0] } onPointerOver={props.onPointerOver ? props.onPointerOver : null}>
          <boxGeometry args={props.geometry}/>
          <meshToonMaterial color={props.color} opacity={props.opacity ? props.opacity : 1} transparent={props.transparent ? props.transparent : false} side={THREE.DoubleSide} emissive={props.emissive} emissiveIntensity={props.emissiveIntensity} />
      </mesh>
    )
  }

  const PointLight = ({...props}): JSX.Element => {
    return (
      <pointLight position={props.position} intensity={props.intensity} color={props.color}/>
    )
  }

  const Sphere = ({...props}): JSX.Element => {
    return (
      <mesh position={props.position} onClick={props.onClick ? props.onClick : null} onPointerOver={props.onPointerOver ? props.onPointerOver : null}>
        <sphereGeometry args={props.radius}/>
        <meshToonMaterial color={props.color} opacity={props.opacity} transparent={props.transparent}/>
      </mesh>
    )
  }

  const Cylinder = ({...props}): JSX.Element => {
    return (
      <mesh position={props.position} onClick={props.onClick ? props.onClick : null}>
        <cylinderGeometry args={[props.radiusTop, props.radiusBottom, props.height]}/>
        <meshToonMaterial color={props.color} opacity={props.opacity} transparent={props.transparent}/>
      </mesh>
    )
  }

  const Lathe = ({...props}): JSX.Element => {
    return (
      <mesh position={props.position} onPointerOver={props.onPointerOver ? props.onPointerOver : null}>
        <latheGeometry args={[props.points, props.segments]}/>
        <meshPhongMaterial 
          color={props.color} 
          opacity={props.opacity} 
          transparent={props.transparent}
          emissive={props.emissive}
          emissiveIntensity={props.emissiveIntensity}
        />
      </mesh>
    )
  }

  const Extrude = ({...props}): JSX.Element => {
    return (
      <mesh position={props.position} rotation={[Math.PI/2, 0, 0]}>
        <extrudeGeometry args={[props.shape, props.extrudeSettings]}/>
        <meshToonMaterial 
          color={props.color} 
          transparent={props.transparent || false}
        />
      </mesh>
    )
  }

  const pillowShape = new THREE.Shape()
    pillowShape.moveTo(-0.3, -0.1)
    pillowShape.quadraticCurveTo(-0.3, -0.15, -0.25, -0.15)
    pillowShape.lineTo(0.25, -0.15)
    pillowShape.quadraticCurveTo(0.3, -0.15, 0.3, -0.1)
    pillowShape.lineTo(0.3, 0.1)
    pillowShape.quadraticCurveTo(0.3, 0.15, 0.25, 0.15)
    pillowShape.lineTo(-0.25, 0.15)
    pillowShape.quadraticCurveTo(-0.3, 0.15, -0.3, 0.1)
    pillowShape.lineTo(-0.3, -0.1)

  const pillowExtrudeSettings = {
    steps: 5,
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.2,
    bevelOffset: 0.05,
    bevelSegments: 20
  }

  const bedShape = new THREE.Shape()
    bedShape.moveTo(-0.75, -1.5)
    bedShape.quadraticCurveTo(-0.75, -1.55, -0.7, -1.55)  // slight round corner
    bedShape.lineTo(0.7, -1.55)
    bedShape.quadraticCurveTo(0.75, -1.55, 0.75, -1.5)    // slight round corner
    bedShape.lineTo(0.75, 1.5)
    bedShape.quadraticCurveTo(0.75, 1.55, 0.7, 1.55)      // slight round corner
    bedShape.lineTo(-0.7, 1.55)
    bedShape.quadraticCurveTo(-0.75, 1.55, -0.75, 1.5)    // slight round corner
    bedShape.lineTo(-0.75, -1.5)

  const coversShape = new THREE.Shape()
    coversShape.moveTo(-0.75, -0.85)        // Left bottom corner
    coversShape.quadraticCurveTo(-0.75, -0.9, -0.7, -0.9)     // Round corner
    coversShape.lineTo(0.7, -0.9)           // Bottom edge
    coversShape.quadraticCurveTo(0.75, -0.9, 0.75, -0.85)     // Round corner
    coversShape.lineTo(0.75, 1.5)           // Right edge
    coversShape.quadraticCurveTo(0.75, 1.55, 0.7, 1.55)       // Round corner
    coversShape.lineTo(-0.7, 1.55)          // Top edge
    coversShape.quadraticCurveTo(-0.75, 1.55, -0.75, 1.5)     // Round corner
    coversShape.lineTo(-0.75, -0.85)        // Back to start

  const coversExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 1,
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.08,
    bevelOffset: 0,
    bevelSegments: 3
  }

  const coverFoldShape = new THREE.Shape()
    coverFoldShape.moveTo(-0.77, 0.85)      // Left bottom corner
    coverFoldShape.quadraticCurveTo(-0.77, 0.8, -0.7, 0.8)    // Round corner
    coverFoldShape.lineTo(0.7, 0.8)         // Bottom edge
    coverFoldShape.quadraticCurveTo(0.77, 0.8, 0.77, 0.85)    // Round corner
    coverFoldShape.lineTo(0.77, 1.1)        // Right edge
    coverFoldShape.quadraticCurveTo(0.77, 1.15, 0.7, 1.15)    // Round corner
    coverFoldShape.lineTo(-0.7, 1.15)       // Top edge
    coverFoldShape.quadraticCurveTo(-0.77, 1.15, -0.77, 1.1)  // Round corner
    coverFoldShape.lineTo(-0.77, 0.85)      // Back to start

  const coverFoldSettings: THREE.ExtrudeGeometryOptions = {
    steps: 1,
    depth: 0.42,            // Match the covers depth
    bevelEnabled: true,
    bevelThickness: 0.05,  // Slightly thicker for folded appearance
    bevelSize: 0.11,        // Larger bevel for softer edges
    bevelOffset: 0,
    bevelSegments: 3
  }

  const bedExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 1,
    depth: 0.4,            // Make it thicker
    bevelEnabled: true,
    bevelThickness: 0.05,   // Smaller bevel for sharper edges
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 3
  }

  const Book = ({...props}): JSX.Element => {
    return (
      <group position={props.position} rotation={props.rotation ? props.rotation : [0,0,0]}>
        {/* <group position={props.position ? props.bookPagePosition : [0,0,0]} rotation={props.bookPageRotation ? props.bookPageRotation : [0,0,0]}> */}
          {/* Right Cover */}
          {Box({
            position: [0, 0, -0.03],
            geometry: props.rightCoverGeometry,
            color: props.rightCoverColor,
            onPointerOver: props.onPointerOver ? props.onPointerOver : null
          })}
          {/* Pages */}
          {Box({
            position: [0, 0, 0],
            geometry: props.pagesGeometry,
            color: props.pagesColor
          })}
          {/* Spine */}
          {Box({
            position: [0.1, 0, 0],
            geometry: props.spineGeometry,
            color: props.spineColor
          })}
        {/* </group> */}
          {/* Front pages that will be visible when book is open */}
          {Box({
            position: [0, 0, 0],
            geometry: props.pagesGeometry,
            color: props.pagesColor
          })}
          {/* Left Cover */}
          {Box({
            position: [0, 0, 0.03],
            geometry: props.leftCoverGeometry,
            color: props.leftCoverColor
          })}
      </group>
    )
  }

  const Lamp = ({...props}): JSX.Element => {
    const lampPoints = [
      new THREE.Vector2(0.1, 0),        // Inner top edge
      new THREE.Vector2(0.3, 0),        // Outer top edge
      new THREE.Vector2(0.5, -0.4),     // Outer bottom edge
      new THREE.Vector2(0.2, -0.4),     // Inner bottom edge
      new THREE.Vector2(0.2, -0.39),    // Inner wall bottom
      new THREE.Vector2(0.49, -0.39),   // Outer wall bottom
      new THREE.Vector2(0.29, -0.01),   // Outer wall top
      new THREE.Vector2(0.1, -0.01)     // Inner wall top
    ]

    return (
      <group position={props.position} rotation={props.rotation ? props.rotation : [0,0,0]}>
        {/* Lampshade */}
        {Lathe({
          segments: 32,
          position: [0, 0.3, 0],
          points: lampPoints,
          color: COLOR_PALETTE.white,
          opacity: us_lightOne ? 0.4 : 1,
          transparent: true,
          onPointerOver: handleLampMouseOver
        })}

        {/* Lampshade glow */}
        <pointLight
          position={[0, 0.3, 0]}
          intensity={!us_lightOne ? 0.4 : 0}
          color={COLOR_PALETTE.orange}
          distance={1}
        />

        {/* Existing light for illumination */}
        {PointLight({
          position: [0.3, 0, 0.1],
          intensity: us_lightOne ? 6 : 0,
          color: COLOR_PALETTE.lightYellow
        })}
        {/* Bulb */}
        {Sphere({
          position: [0, 0, 0],
          radius: [0.1],
          transparent: true,
          opacity: us_lightOne ? 0.4 : 1,
          shininess: 100,
          specular: 'white',
          color: COLOR_PALETTE.white,
        })}
        {/* Bulb holder */}
        {Cylinder({
          position: [0, -0.1, 0],
          radiusTop: [0.05],
          radiusBottom: [0.05],
          height: [0.05],
          transparent: true,
          opacity: us_lightOne ? 0.4 : 1,
          shininess: 100,
          specular: 'white',
          color: COLOR_PALETTE.white,
        })}
        {/* Top joint */}
        {Cylinder({
          position: [0, -0.15, 0],
          radiusTop: [0.1],
          radiusBottom: [0.1],
          height: [0.05],
          opacity: us_lightOne ? 0.2 : 1,
          color: COLOR_PALETTE.black,
        })}
        {/* Arm */}
        {Cylinder({
          position: [0, -0.3, 0],
          radiusTop: [0.05],
          radiusBottom: [0.05],
          height: [0.35],
          opacity: us_lightOne ? 0.2 : 1,
          color: COLOR_PALETTE.black,
        })}
        {/* Base */}
        {Cylinder({
          position: [0, -0.45, 0],
          radiusTop: [0.15],
          radiusBottom: [0.15],
          height: [0.05],
          opacity: us_lightOne ? 0.2 : 1,
          color: COLOR_PALETTE.black,
        })}
      </group>
    )
  }

  const Keyboard = ({...props}): JSX.Element => {
    return (
      <group position={props.position} rotation={props.rotation ? props.rotation : [0,0,0]}>
        {/* Keys - 5 rows of 12 keys */}
        {[...Array(5)].map((_, row) =>
          [...Array(12)].map((_, col) => {
            const keyId = `key-${row}-${col}`
            return (
              <Fragment key={keyId}>
                {Box({
                  position: [
                    -0.19 + col * 0.035, // Spread across width
                    0.01,                // Slightly above base
                    -0.05 + row * 0.035  // Spread across depth
                  ],
                  geometry: [0.03, 0.01, 0.03],
                  color: COLOR_PALETTE.black
                })}
              </Fragment>
            )
          })
        )}
        {/* Spacebar */}
        {Box({
          position: [0.004, 0.01, 0.09],
          geometry: [0.133, 0.009999999, 0.03],
          color: COLOR_PALETTE.black
        })}
        {/* Mousepad */}
        {Box({
          position: [0, 0.02, 0.25],
          geometry: [0.15, 0.001, 0.15],
          color: COLOR_PALETTE.black
        })}
      </group>
    )
  }

  const Laptop = ({...props}): JSX.Element => {
    // Create canvas textures once, outside the render
    const linkedInTexture = new THREE.CanvasTexture((() => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { alpha: true })
      canvas.width = 128
      canvas.height = 128

      if (ctx) {
        // Clear the canvas with transparent background
        ctx.globalCompositeOperation = 'source-over'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Draw rounded rectangle for background
        ctx.fillStyle = '#0077B5'
        const radius = 15
        const x = 24
        const y = 24
        const width = 80
        const height = 80
        
        // Background
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.fill()
  

        // Draw "in" text
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 80px Arial'
        ctx.fillText('in', 30, 90)
      }
      return canvas
    })())

    const githubTexture = new THREE.CanvasTexture((() => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { alpha: true })
      canvas.width = 128
      canvas.height = 128
      if (ctx) {
        // Clear the canvas with transparent background
        ctx.globalCompositeOperation = 'source-over'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Draw button background with rounded corners
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        const radius = 15
        const x = 7
        const y = 24
        const width = 115
        const height = 80
        
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.fillStyle = '#000000'
        ctx.fill()
        
        // Draw "GitHub" text
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 32px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('GitHub', 64, 74)
      }
      return canvas
    })())
    
    

    return (
      <group position={props.position} rotation={props.rotation ? props.rotation : [0,0,0]}>
        {/* Base of laptop */}
        {Box({
          position: [0, 0, 0],
          geometry: [0.5, 0.02, 0.5],
          color: COLOR_PALETTE.silver
        })}
        {Keyboard({
          position: [-0.1,0,0],
          rotation: [0, Math.PI/2, 0]
        })}
        {/* Screen of laptop */}
        {Box({
          position: [-0.35, 0.22, 0],
          geometry: [0.5, 0.02, 0.5],
          color: us_laptopOn ? COLOR_PALETTE.silver : COLOR_PALETTE.lightBlue,
          rotation: [0, 0, 2*Math.PI/3],
          transparent: true,
          opacity: us_laptopOn ? 1 : 0.8,
          onPointerOver: !us_laptopOn ? handleLaptopMouseOver : undefined
        })}
        
        {/* Screen glow */}
        <pointLight
          position={[-0.35, 0.22, 0]}
          intensity={!us_laptopOn ? 0.5 : 0}
          color={COLOR_PALETTE.orange}
          distance={0.5}
        />
        
        {/* Screen content */}
        <group position={[-0.34, 0.23, 0]} rotation={[0, 0, 2*Math.PI/3]}>
          {/* Background */}
          {Box({
            position: [0, 0, 0],
            geometry: [0.42, 0.02, 0.45],
            color: us_laptopOn ? COLOR_PALETTE.trueWhite : COLOR_PALETTE.black,
            shininess: 100,
            specular: 'white',
          })}
          
          {/* LinkedIn Logo */}
          {us_laptopOn && (
            <mesh 
              position={[0, -0.02, -0.1]} 
              rotation={[Math.PI/2, 0, 3*Math.PI/2]}
              onClick={() => window.open("https://www.linkedin.com/in/brady-r-richardson/", "_blank")}
            >
              <planeGeometry args={[0.15, 0.15]} />
              <meshBasicMaterial map={linkedInTexture} transparent={true} alphaTest={0.1} />
            </mesh>
          )}

          {/* GitHub Logo */}
          {us_laptopOn && (
            <mesh 
              position={[0, -0.02, 0.1]} 
              rotation={[Math.PI/2, 0, 3*Math.PI/2]}
              onClick={() => window.open("https://github.com/bradyrichardson", "_blank")}
            >
              <planeGeometry args={[0.15, 0.15]} />
              <meshBasicMaterial map={githubTexture} transparent={true} alphaTest={0.1} />
            </mesh>
          )}
        </group>

        {/* Light */}
        {PointLight({
          position: [-0.34, 0.3, 0],
          intensity: us_lightTwo ? 1 : 0,
          color: COLOR_PALETTE.white
        })}
      </group>
    )
  }

  const Drawer = forwardRef(({...props}, ref): JSX.Element => {
    return (
      <group 
        // @ts-expect-error directive here
        position={props.position} 
        // @ts-expect-error directive here
        rotation={props.rotation ? props.rotation : [0,0,0]}
        ref={ref}
      >
        {Box({
          position: [0, 0, 0],
          // @ts-expect-error directive here
          geometry: props.geometry,
          // @ts-expect-error directive here
          color: props.color
        })}
        {/* Drawer Handle */}
        {Box({
          position: [0.82, 0.25, 0],
          geometry: [0.1, 0.1, 0.3],
          color: COLOR_PALETTE.black,
          // @ts-expect-error directive here
          onClick: props.onClick,
          emissive: !us_lightOne ? COLOR_PALETTE.darkBlue : COLOR_PALETTE.black,
          emissiveIntensity: !us_lightOne ? 0.5 : 0
        })}
        {/* Drawer Outer Wall */}
        {Box({
          position: [0.77, 0.2, 0],
          geometry: [0.05, 0.417, 1.4],
          // @ts-expect-error directive here
          color: props.color,
        })}
        {/* Drawer Back Inner Wall */}
        {Box({
          position: [0, 0.2, 0],
          geometry: [0.05, 0.409, 1.4],
          // @ts-expect-error directive here
          color: props.color
        })}
        {/* Drawer Right Inner Wall */}
        {Box({
          position: [0.1, 0.18, -0.625],
          geometry: [1.3, 0.38, 0.05],
          // @ts-expect-error directive here
          color: props.color
        })}
        {/* Drawer Left Inner Wall */}
        {Box({
          position: [0.1, 0.18, 0.625],
          geometry: [1.3, 0.38, 0.05],
          // @ts-expect-error directive here
          color: props.color,
          // transparent: true,
          // opacity: 0.5
        })}
      </group>
    )
  })

  const Drawers = ({...props}): JSX.Element => {
    return (
      <group 
        position={props.position} 
        rotation={props.rotation ? props.rotation : [0,0,0]}
      >
        <Drawer
          // @ts-expect-error directive here
          position={[0, 1, 0]}
          geometry={[1.4, 0.01, 1.25]}
          color={COLOR_PALETTE.darkBrown}
          ref={drawerOneRef}
          onClick={() => handleDrawerClick(targetPositionOne, 1)}
        />
        <Drawer
          // @ts-expect-error directive here
          position={[0, 0.583, 0]}
          geometry={[1.4, 0.01, 1.25]}
          color={COLOR_PALETTE.darkBrown}
          ref={drawerTwoRef}
          onClick={() => handleDrawerClick(targetPositionTwo, 2)}
        />
        <Drawer
          // @ts-expect-error directive here
          position={[0, 0.167, 0]}
          geometry={[1.4, 0.01, 1.25]}
          color={COLOR_PALETTE.darkBrown}
          ref={drawerThreeRef}
          onClick={() => handleDrawerClick(targetPositionThree, 3)}
        />
        <Drawer
          // @ts-expect-error directive here
          position={[0, -0.25, 0]}
          geometry={[1.4, 0.01, 1.25]}
          color={COLOR_PALETTE.darkBrown}
          ref={drawerFourRef}
          onClick={() => handleDrawerClick(targetPositionFour, 4)}
        />
      </group>
    )
  }

  const LacrosseStick = ({...props}): JSX.Element => {
    return (
      <group position={props.position} rotation={props.rotation ? props.rotation : [0,0,0]}>
        {/* Shaft */}
        {Cylinder({
          position: [0,-0.05,0],
          radiusTop: 0.02,
          radiusBottom: 0.02,
          height: 1,
          color: COLOR_PALETTE.silver
        })}
        {/* Butt */}
        {Cylinder({
          position: [0,-0.55,0],
          radiusTop: 0.03,
          radiusBottom: 0.03,
          height: 0.02,
          color: COLOR_PALETTE.white
        })}
        {/* Head */}
        {Cylinder({
          position: [0,0.45,0],
          radiusTop: 0.025,
          radiusBottom: 0.025,
          height: 0.06,
          color: COLOR_PALETTE.white
        })}
        {/* Top of Head */}
        <mesh position={[0,0.8,0]} rotation={[0,0,1.8*Math.PI]}> 
          <torusGeometry args={[0.15, 0.015, 10, 30, 1.4*Math.PI]}/> 
          <meshToonMaterial color={COLOR_PALETTE.white} />
        </mesh>
        {/* Right Sidewall */}
        <mesh position={[-0.248,0.63,0]} rotation={[0,0,1.95*Math.PI]}> 
          <torusGeometry args={[0.15, 0.015, 10, 30, Math.PI/4]}/> 
          <meshToonMaterial color={COLOR_PALETTE.white} />
        </mesh>
        {/* Left Sidewall */}
        <mesh position={[0.25,0.635,0]} rotation={[0,0,2.83*Math.PI]}> 
          <torusGeometry args={[0.15, 0.015, 10, 30, Math.PI/4]}/> 
          <meshToonMaterial color={COLOR_PALETTE.white} />
        </mesh>
        {/* Bottom */}
        <mesh position={[0,0.58,0]} rotation={[0,0,2.83*Math.PI]}> 
          <torusGeometry args={[0.11, 0.016, 10, 5, 1.3*Math.PI]}/> 
          <meshToonMaterial color={COLOR_PALETTE.white} />
        </mesh>
        {/* Mesh */}
        <group position={[0, 0.15, 0]}>
          {/* Center string */}
          <mesh position={[0, -0.1, 0]}>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0.9, 0),
                new THREE.Vector3(0, 0.8, 0.02),
                new THREE.Vector3(0, 0.75, 0.09),
                new THREE.Vector3(0, 0.71, 0.12),
                new THREE.Vector3(0, 0.7, 0.12),
                new THREE.Vector3(0, 0.6, 0.05),
                new THREE.Vector3(0, 0.55, 0.04),
                new THREE.Vector3(0, 0.5, 0.02),
                new THREE.Vector3(0, 0.45, 0),
              ]),
              32, 0.01, 8, false
            ]} />
            <meshToonMaterial color={COLOR_PALETTE.white} />
          </mesh>
          
          {/* Left strings */}
          {[-0.1, -0.05].map((xPos) => (
            <mesh position={[xPos, -0.1, 0]} key={`left-string-${xPos}`}>
              <tubeGeometry args={[
                new THREE.CatmullRomCurve3([
                  // new THREE.Vector3(0, 0.8, 0),
                  new THREE.Vector3(0, 0.87, 0),
                  new THREE.Vector3(0, 0.8, 0.02),
                  new THREE.Vector3(0, 0.7, 0.09),
                  new THREE.Vector3(0, 0.65, 0.09),
                  new THREE.Vector3(0, 0.6, 0.05),
                  new THREE.Vector3(0, 0.55, 0.03),
                  new THREE.Vector3(0, 0.45, 0.015),
                  // new THREE.Vector3(0, 0.45, 0),
                ]),
                32, 0.01, 8, false
              ]} />
              <meshToonMaterial color={COLOR_PALETTE.white} />
            </mesh>
          ))}
          
          {/* Right strings */}
          {[0.05, 0.1].map((xPos) => (
            <mesh position={[xPos, -0.1, 0]} key={`right-string-${xPos}`}>
              <tubeGeometry args={[
                new THREE.CatmullRomCurve3([
                  // new THREE.Vector3(0, 0.9, 0),
                  new THREE.Vector3(0, 0.87, 0),
                  new THREE.Vector3(0, 0.8, 0.025),
                  new THREE.Vector3(0, 0.7, 0.09),
                  new THREE.Vector3(0, 0.65, 0.09),
                  new THREE.Vector3(0, 0.6, 0.05),
                  new THREE.Vector3(0, 0.55, 0.03),
                  new THREE.Vector3(0, 0.45, 0.015),
                  // new THREE.Vector3(0, 0., 0),
                ]),
                32, 0.01, 8, false
              ]} />
              <meshToonMaterial color={COLOR_PALETTE.white} />
            </mesh>
          ))}

          {/* Shooter string */}
          <mesh position={[0, 0, 0]}>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.15, 0.65, 0.02),
                new THREE.Vector3(-0.1, 0.65, 0.02),
                new THREE.Vector3(-0.05, 0.65, 0.05),
                new THREE.Vector3(0, 0.67, 0.05),
                new THREE.Vector3(0.02, 0.67, 0.05),
                new THREE.Vector3(0.05, 0.65, 0.05),
                new THREE.Vector3(0.1, 0.65, 0.02),
                new THREE.Vector3(0.15, 0.65, 0.02),
              ]),
              32, 0.01, 8, false
            ]} />
            <meshToonMaterial color={COLOR_PALETTE.lightBlue} />
          </mesh>
          {/* Horizontal string */}
          <mesh position={[0, 0, 0]}>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.15, 0.60, 0.02),
                new THREE.Vector3(-0.1, 0.60, 0.02),
                new THREE.Vector3(-0.05, 0.60, 0.09),
                new THREE.Vector3(0, 0.62, 0.09),
                new THREE.Vector3(0.02, 0.62, 0.09),
                new THREE.Vector3(0.05, 0.6, 0.09),
                new THREE.Vector3(0.1, 0.6, 0.02),
                new THREE.Vector3(0.15, 0.6, 0.02),
              ]),
              32, 0.01, 8, false
            ]} />
            <meshToonMaterial color={COLOR_PALETTE.white} />
          </mesh>
          {/* Horizontal string */}
          <mesh position={[0, 0, 0]}>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.1, 0.55, 0.02),
                new THREE.Vector3(-0.1, 0.55, 0.02),
                new THREE.Vector3(-0.05, 0.55, 0.09),
                new THREE.Vector3(0, 0.57, 0.09),
                new THREE.Vector3(0.02, 0.57, 0.09),
                new THREE.Vector3(0.05, 0.55, 0.09),
                new THREE.Vector3(0.1, 0.55, 0.02),
                new THREE.Vector3(0.1, 0.55, 0.02),
              ]),
              32, 0.01, 8, false
            ]} />
            <meshToonMaterial color={COLOR_PALETTE.white} />
          </mesh>
          {/* Horizontal string */}
          <mesh position={[0, 0, 0]}>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.1, 0.5, 0.02),
                new THREE.Vector3(-0.1, 0.5, 0.02),
                new THREE.Vector3(-0.05, 0.5, 0.09),
                new THREE.Vector3(0, 0.52, 0.09),
                new THREE.Vector3(0.02, 0.52, 0.09),
                new THREE.Vector3(0.05, 0.5, 0.09),
                new THREE.Vector3(0.1, 0.5, 0.02),
                new THREE.Vector3(0.1, 0.5, 0.02),
              ]),
              32, 0.01, 8, false
            ]} />
            <meshToonMaterial color={COLOR_PALETTE.white} />
          </mesh>
          {/* Horizontal string */}
          <mesh position={[0, 0, 0]}>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.1, 0.45, 0.02),
                new THREE.Vector3(-0.1, 0.45, 0.02),
                new THREE.Vector3(-0.05, 0.45, 0.02),
                new THREE.Vector3(0, 0.46, 0.03),
                new THREE.Vector3(0.02, 0.46, 0.03),
                new THREE.Vector3(0.05, 0.45, 0.03),
                new THREE.Vector3(0.1, 0.45, 0.02),
                new THREE.Vector3(0.1, 0.45, 0.02),
              ]),
              32, 0.01, 8, false
            ]} />
            <meshToonMaterial color={COLOR_PALETTE.white} />
          </mesh>
        </group>
      </group>
    )
  }

  const StringLight = ({position, color}: {position: [number, number, number], color: string}): JSX.Element => {
    return (
      <group position={position}>
        {/* Hanging wire */}
        <mesh>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, -0.1, 0),
            ]),
            8, 0.002, 8, false
          ]} />
          <meshToonMaterial color={COLOR_PALETTE.black} />
        </mesh>
        
        {/* Bulb base (cylinder) */}
        {Cylinder({
          position: [0, -0.12, 0],
          radiusTop: 0.015,
          radiusBottom: 0.015,
          height: 0.04,
          color: COLOR_PALETTE.silver
        })}
        
        {/* Glass bulb */}
        {Sphere({
          position: [0, -0.2, 0],
          radius: [0.06],
          color: us_stringLightsOn ? color : COLOR_PALETTE.white,
          opacity: us_stringLightsOn ? 0.2 : 1,
          transparent: true
        })}
        {/* Light source */}
        <pointLight
          position={[0, -0.17, 0]}
          intensity={us_stringLightsOn ? 0.1 : 0}
          color={color}
          distance={5}
        />
      </group>
    )
  }

  // In the Room component, add these refs
  const leftLeftWindowRef = useRef<THREE.Group>(null)
  const leftRightWindowRef = useRef<THREE.Group>(null)
  const rightLeftWindowRef = useRef<THREE.Group>(null)
  const rightRightWindowRef = useRef<THREE.Group>(null)
  const windowRotations = useRef({
    left: 0,
    right: 0,
    target: 0
  })

  // Then modify the WindowFrame component
  // @ts-expect-error directive here
  const WindowFrame = forwardRef(({leftRef, rightRef, rotations, ...props}, ref): JSX.Element => {
    useFrame((_, delta) => {
      if (leftRef.current && rightRef.current) {
        // Smoothly interpolate the rotations
        rotations.current.left += (rotations.current.target - rotations.current.left) * delta * 5
        rotations.current.right += (rotations.current.target - rotations.current.right) * delta * 5
        
        // Apply rotations
        leftRef.current.rotation.y = rotations.current.left
        rightRef.current.rotation.y = -rotations.current.right
      }
    })

    const handleWindowMouseOver = () => {
      // Toggle between 0 and PI/3
      rotations.current.target = Math.abs(rotations.current.target) < 0.01 ? Math.PI / 3 : 0
    }

  return (
    // @ts-expect-error directive here
      <group position={props.position} rotation={props.rotation}>
        {/* Static frame parts */}
        <mesh>
          {/* Left frame */}
          {Box({
            position: [-0.75, 2.5, -2.5], 
            geometry: [0.05, 1.5, 0.15], 
            color: COLOR_PALETTE.white
          })}
          {/* Right frame */}
          {Box({
            position: [0.775, 2.5, -2.5], 
            geometry: [0.05, 1.5, 0.15], 
            color: COLOR_PALETTE.white
          })}
          {/* Top frame */}
          {Box({
            position: [0, 3.22, -2.5], 
            geometry: [1.5, 0.06, 0.15], 
            color: COLOR_PALETTE.white
          })}
          {/* Window Sill  */}
          {Box({position: [0.012, 1.8, -2.5], geometry: [1.6,0.1,0.5], onPointerOver: handleWindowMouseOver, emissive: COLOR_PALETTE.orange, emissiveIntensity: !us_lightOne && !us_stringLightsOn ? 0.5 : 0})}
        </mesh>

        {/* Left window (animated) */}
        <group ref={leftRef} position={[-0.75, 2.5, -2.5]}>
          <mesh position={[0.375, 0, 0]}>
            {Box({
              position: [0, 0.05, 0],
              geometry: [0.75, 1.29, 0.05],
              color: COLOR_PALETTE.white,
              transparent: true,
              opacity: 0.1,
            })}
            {/* Vertical divider */}
            {Box({
              position: [0, 0.04, 0], 
              geometry: [0.05, 1.29, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {Box({
              position: [0.365, 0.04, 0], 
              geometry: [0.05, 1.29, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {/* Horizontal segments */}
            {Box({
              position: [0, 0.4, 0], 
              geometry: [0.75, 0.05, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {Box({
              position: [0, -0.1, 0], 
              geometry: [0.75, 0.05, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {Box({
              position: [0, 0.67, 0], 
              geometry: [0.76, 0.05, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {Box({
              position: [0.01, -0.625, 0], 
              geometry: [0.76, 0.05, 0.075], 
              color: COLOR_PALETTE.white
            })}
          </mesh>
        </group>

        {/* Right window (animated) */}
        <group ref={rightRef} position={[0.775, 2.5, -2.5]}>
          <mesh position={[-0.375, 0, 0]}>
            {Box({
              position: [0, 0.05, 0],
              geometry: [0.75, 1.29, 0.05],
              color: COLOR_PALETTE.white,
              transparent: true,
              opacity: 0.1,
            })}
            {/* Vertical divider */}
            {Box({
              position: [0, 0.04, 0], 
              geometry: [0.05, 1.29, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {Box({
              position: [-0.365, 0.02, 0], 
              geometry: [0.05, 1.34, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {/* Horizontal segments */}
            {Box({
              position: [0, 0.4, 0], 
              geometry: [0.75, 0.05, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {Box({
              position: [0, -0.1, 0], 
              geometry: [0.75, 0.05, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {Box({
              position: [0, 0.67, 0], 
              geometry: [0.77, 0.05, 0.075], 
              color: COLOR_PALETTE.white
            })}
            {Box({
              position: [0, -0.625, 0], 
              geometry: [0.75, 0.05, 0.075], 
              color: COLOR_PALETTE.white
            })}
          </mesh>
        </group>
      </group>
    )
  })

  const StringLights = ({...props}) => {
    return (
      <group {...props}>
        <mesh>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(1.62, 3.8, -2.0),
              new THREE.Vector3(1.62, 3.7, -1.5),
              new THREE.Vector3(1.62, 3.8, -1.0),
              // new THREE.Vector3(1.62, 3.7, -0.5),
              // new THREE.Vector3(1.62, 3.8, 0),
            ]),
            32, 0.005, 8, false
          ]} />
          <meshToonMaterial color={COLOR_PALETTE.black} />
        </mesh>
        {/* Lights */}
        <StringLight position={[1.62, 3.8, -2.0]} color={COLOR_PALETTE.lightYellow} />
        <StringLight position={[1.62, 3.7, -1.5]} color={COLOR_PALETTE.lightYellow} />
        {!props.isEnd ? <StringLight position={[1.62, 3.8, -1.0]} color={COLOR_PALETTE.lightYellow} /> : <></>}
        {/* <StringLight position={[1.62, 3.7, -0.5]} color={COLOR_PALETTE.white} />
        <StringLight position={[1.62, 3.8, 0]} color={COLOR_PALETTE.white} /> */}
      </group>
    )
  }

  // Load the font when component mounts
  useEffect(() => {
    const loader = new FontLoader()
    loader.load('./fonts/Roboto Condensed_Regular.json', (loadedFont) => {
      us_setProjectsFont(loadedFont)
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    (error) => {
      console.error('Font loading error:', error)
    })
  }, [])

  const ProjectDisplayBoard = forwardRef(({...props}: {imgPath: string, rotation: THREE.Euler, position: THREE.Vector3, title: string, color: string, link: string, boardNumber: number}, ref): JSX.Element => {  
    const texture = new THREE.TextureLoader().load(props.imgPath);

    const displayBoardOneEndPosition = new THREE.Vector3(0,2.1,0.5)
    const displayBoardTwoEndPosition = new THREE.Vector3(0.2,1.7,0.5)
    const displayBoardThreeEndPosition = new THREE.Vector3(0.2,1.3,0.5)
    const displayBoardFourEndPosition = new THREE.Vector3(0.2,0.9,0.5)
    const lerpOpenDelta = 0.2
    const lerpCloseDelta = 0.05
    
    // animate the project display boards when the corresponding drawer is moving
    useFrame(() => {
      // project display board one
      if (projectDisplayBoardOneRef.current && projectDisplayBoardOneIsAnimating.current && targetPositionOne.current.x >= 0.59) {
        projectDisplayBoardOneRef.current.position.lerp(displayBoardOneEndPosition, lerpOpenDelta)
      }
      else if (projectDisplayBoardOneRef.current && projectDisplayBoardOneIsAnimating.current && targetPositionOne.current.x < 0.59) {
        projectDisplayBoardOneRef.current.position.lerp(displayBoardStartPosition, lerpCloseDelta)
      }
      else {
        projectDisplayBoardOneIsAnimating.current = false
      }

      // project display board two
      if (projectDisplayBoardTwoRef.current && projectDisplayBoardTwoIsAnimating.current && targetPositionTwo.current.x >= 0.59) {
        projectDisplayBoardTwoRef.current.position.lerp(displayBoardTwoEndPosition, lerpOpenDelta)
      }
      else if (projectDisplayBoardTwoRef.current && projectDisplayBoardTwoIsAnimating.current && targetPositionTwo.current.x < 0.59) {
        projectDisplayBoardTwoRef.current.position.lerp(displayBoardStartPosition, lerpCloseDelta)
      }
      else {
        projectDisplayBoardTwoIsAnimating.current = false
      }
      
      // project display board three
      if (projectDisplayBoardThreeRef.current && projectDisplayBoardThreeIsAnimating.current && targetPositionThree.current.x >= 0.59) {
        projectDisplayBoardThreeRef.current.position.lerp(displayBoardThreeEndPosition, lerpOpenDelta)
      }
      else if (projectDisplayBoardThreeRef.current && projectDisplayBoardThreeIsAnimating.current && targetPositionThree.current.x < 0.59) {
        projectDisplayBoardThreeRef.current.position.lerp(displayBoardStartPosition, lerpCloseDelta)
      }
      else {
        projectDisplayBoardThreeIsAnimating.current = false
      }

      // project display board four
      if (projectDisplayBoardFourRef.current && projectDisplayBoardFourIsAnimating.current && targetPositionFour.current.x >= 0.59) {
        projectDisplayBoardFourRef.current.position.lerp(displayBoardFourEndPosition, lerpOpenDelta)
      }
      else if (projectDisplayBoardFourRef.current && projectDisplayBoardFourIsAnimating.current && targetPositionFour.current.x < 0.59) {
        projectDisplayBoardFourRef.current.position.lerp(displayBoardStartPosition, lerpCloseDelta)
      }
      else {
        projectDisplayBoardFourIsAnimating.current = false
      }
    })

    return (
      <group rotation={props.rotation} position={props.position} ref={ref}>
        { us_projectsFont &&
        <mesh scale={[1.1, 1.1, 0.001]} {...props} position={[-2,0.5,0.5]}>
          <textGeometry 
            // @ts-expect-error directive here
                args={[
                  props.title,
                  {
                    font: us_projectsFont,
                    size: 0.12,
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.01,
                    bevelSize: 0.005,
                  }
                ]}
              />
              <meshBasicMaterial 
                color={props.color} opacity={1} transparent={false}
          />
        </mesh>
        }
        <mesh {...props} onClick={() => {
            handleProjectDisplayBoardClick(props.link, props.boardNumber)
          }}>
          <planeGeometry args={[0.5, 0.5]}/>
          <meshBasicMaterial map={texture} />
        </mesh>
      </group>
    )
  })

  const Cactus = ({...props}) => {
    return (
      <group {...props}>
        {/* Pot */}
        <mesh position={[-2.33, 3.7, -1.2]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.12, 16]} />
          <meshToonMaterial color={COLOR_PALETTE.darkOrange} />
        </mesh>

        {/* Cactus Base */}
        <mesh position={[-2.33, 3.8, -1.2]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 0.29, 6]} />
          <meshToonMaterial color={COLOR_PALETTE.darkGreen} />
        </mesh>

        {/* Left Branch */}
        {/* <mesh position={[-2.34, 3.95, -1.17]} rotation={[0, Math.PI/2, 0.3]}>
          <cylinderGeometry args={[0.03, 0.04, 0.15, 6]} />
          <meshToonMaterial color={COLOR_PALETTE.darkGreen} />
        </mesh> */}

        {/* Right Branch */}
        <mesh position={[-2.33, 3.88, -1.27]} rotation={[0, Math.PI/2, -0.8]}>
          <cylinderGeometry args={[0.025, 0.035, 0.12, 6]} />
          <meshToonMaterial color={COLOR_PALETTE.darkGreen} />
        </mesh>

        {/* Dirt in Pot */}
        <mesh position={[-2.33, 3.76, -1.2]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
          <meshToonMaterial color={COLOR_PALETTE.darkBrown} />
        </mesh>
      </group>
    )
  }

  const OfficeChair = ({ position = [0, 0, 0] }) => {
    return (
      // @ts-expect-error directive here
      <group position={position} rotation={[0, -Math.PI/4, 0]}>
        {/* Base with wheels */}
        <mesh position={[0, 0.15, 0]}>
          {/* Center cylinder */}
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial color={COLOR_PALETTE.darkCharcoal} />
        </mesh>

        {/* Five-star base */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <group key={angle} rotation={[0, (angle * Math.PI) / 180, 0]}>
            <mesh position={[0.25, 0.1, 0]}>
              <boxGeometry args={[0.5, 0.05, 0.1]} />
              <meshStandardMaterial color={COLOR_PALETTE.darkCharcoal} />
            </mesh>
            {/* Wheel */}
            <mesh position={[0.5, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
              <meshStandardMaterial color="#0a0a0a" />
            </mesh>
          </group>
        ))}

        {/* Hydraulic lift */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        {/* Seat */}
        <mesh position={[0, 0.9, 0.07]}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color={COLOR_PALETTE.darkCharcoal} />
        </mesh>

        {/* Back support pole */}
        <mesh position={[0, 1.2, -0.2]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.1, 0.6, 0.05]} />
          <meshStandardMaterial color={COLOR_PALETTE.darkCharcoal} />
        </mesh>

        {/* Back rest */}
        <mesh position={[0, 1.3, -0.2]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.1]} />
          <meshStandardMaterial color={COLOR_PALETTE.darkCharcoal} />
        </mesh>

        {/* Arm rests */}
        <mesh position={[0.3, 1, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.4]} />
          <meshStandardMaterial color={COLOR_PALETTE.darkCharcoal} />
        </mesh>
        <mesh position={[-0.3, 1, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.4]} />
          <meshStandardMaterial color={COLOR_PALETTE.darkCharcoal} />
        </mesh>
      </group>
    )
  }

  const displayBoardStartPosition = new THREE.Vector3(-1.4, 0.1, 0.4)

  const FlatBook = ({...props}) => {
    const [isOpen, setIsOpen] = useState(false)
    const leftCoverRef = useRef<THREE.Group>(null)
    const rightCoverRef = useRef<THREE.Group>(null)
    const targetRotation = useRef(0)
    const [showText, setShowText] = useState(false)

    useFrame((_, delta) => {
      if (leftCoverRef.current && rightCoverRef.current) {
        // smoothly animate the covers
        const currentRotation = leftCoverRef.current.rotation.y
        const newRotation = currentRotation + (targetRotation.current - currentRotation) * delta * 10
        
        // leftCoverRef.current.rotation.y = newRotation
        // rightCoverRef.current.rotation.y = -newRotation
        // leftCoverRef.current.rotation.z = newRotation
        rightCoverRef.current.rotation.z = -newRotation

      }
    })

    const handleBookMouseOver = () => {
      if (!isOpen) {
        targetRotation.current = Math.PI / 2 // 90 degrees open
        setIsOpen(true)
        // Delay showing text until book is mostly open
        setTimeout(() => setShowText(true), 100)
      }
    }

    const handleClose = () => {
      setShowText(false)
      targetRotation.current = 0
      setIsOpen(false)
    }

    const aboutMeText = `
      Hi, I'm Brady Richardson!
      
      I'm a new grad (April 2025) software engineer with a passion for creating intuitive and engaging user experiences. 
      My journey in tech began with simple C++ programs for school, and now I do everything from web development, to mobile apps, to machine learning projects! When I'm not coding, you can find me playing lacrosse, studying languages, reading about new technologies, or working on personal projects.

      You can find my resume on my LinkedIn, and my projects on GitHub (both of which can be accessed by clicking the links on the laptop in this room). As of May 12, 2025, I am looking for a Summer 2025 position or freelance work!
      
      Email me at bradyrr33@gmail.com or message me on LinkedIn to get in touch.
    `

    return (
      <group {...props}>
        {/* Base/Pages (always visible) */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.05]} />
          <meshStandardMaterial color={COLOR_PALETTE.white} />
        </mesh>

        {/* Left Cover */}
        <group ref={leftCoverRef} position={[-0.25, -0.03, 0]}>
          <mesh position={[0.25, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.02]} />
            <meshStandardMaterial color={COLOR_PALETTE.silver} />
          </mesh>
        </group>

        {/* Right Cover */}
        <group ref={rightCoverRef} position={[0.25, 0.03, 0]}>
          <mesh position={[-0.25, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.02]} />
            <meshStandardMaterial color={COLOR_PALETTE.silver} emissive={COLOR_PALETTE.orange} emissiveIntensity={!us_stringLightsOn && !us_lightOne ? 0.5 : 0} />
          </mesh>
        </group>

        {/* Invisible hover trigger */}
        <mesh 
          position={[0, 0.1, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerOver={handleBookMouseOver}
        >
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>

        {/* Text Display with Close Button */}
        {showText && (
          <Html
            position={[-2, 0.3, 4]}
            rotation={[0, -Math.PI/4, 0]}
            transform
            occlude
          >
            <div
              style={{
                position: 'relative',
                width: '300px',
                height: '450px',
                padding: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '10px',
                overflowY: 'auto',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#333',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transform: 'scale(0.5)', // Scale down to match scene scale
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '5px 10px',
                  backgroundColor: COLOR_PALETTE.darkBlue,
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  zIndex: 1000,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = COLOR_PALETTE.lightBlue
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = COLOR_PALETTE.darkBlue
                }}
              >
                ✕
              </button>

              {/* Text Content */}
              {aboutMeText.split('\n').map((text, index) => (
                <p key={index} style={{ marginBottom: '10px' }}>
                  {text}
                </p>
              ))}
            </div>
          </Html>
        )}
      </group>
    )
  }

  return (
      <group ref={group} {...props} dispose={null}>
        {/* <ambientLight intensity={0.5} /> */}
        {/* <directionalLight position={[0, 5, -5]} intensity={1} /> */}
        {/* Floor */}
        {Box({position: [0,0,0], geometry: [5.1, 0.1, 5.1], color: COLOR_PALETTE.test })}
        {/* Walls */}
        {/* Right Wall */}
        {Box({position: [-1.62,0.9,-2.5], geometry: [1.85,1.75,0.1], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [-1.65,2.45,-2.5], geometry: [1.8,1.75,0.1], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [-1.62,4.075,-2.5], geometry: [1.85,1.75,0.1], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [1.675,2.45,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [1.675,4.075,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [1.675,0.9,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [0,0.9,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [0,4.075,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.darkBlue })}
        {/* Left Wall */}
        {Box({position: [-2.5, 0.9, -1.62], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [-2.5, 2.45, -1.62], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [-2.5, 4.075, -1.62], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [-2.5, 2.45, 1.675], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [-2.5, 4.075, 1.675], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [-2.5, 0.9, 1.675], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [-2.5, 0.9, 0], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.darkBlue })}
        {Box({position: [-2.5, 4.075, 0], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.darkBlue })}
        {/* Contact Me text */}
        {us_projectsFont && us_laptopOn && (
          <mesh 
            position={[-2.15, 2, -1.25]} 
            rotation={[0, Math.PI/4, 0]}
            scale={[1, 1, 0.001]}
          >
            <textGeometry 
              // @ts-expect-error directive here  
              args={[
                'Links',
                {
                  font: us_projectsFont,
                  size: 0.2,
                  height: 0.1,
                  curveSegments: 12,
                  bevelEnabled: true,
                  bevelThickness: 0.01,
                  bevelSize: 0.005,
                }
              ]} 
            />
            <meshToonMaterial 
              color={COLOR_PALETTE.trueWhite} emissive={ COLOR_PALETTE.white}
              emissiveIntensity={0.5}
            />
          </mesh>
        )}
        {/* Laptop */}
        {Laptop({position: [-1.6, 1.06, -1.7], rotation: [0, -Math.PI/6, 0]})}
        {/* Desk */}
        {Box({position: [-2,1,-1.7], geometry: [1,0.1,1.6], color: COLOR_PALETTE.beige})}
        {/* Desk Legs */}
        {Box({position: [-2.4,0.5,-2.4], geometry: [0.1,1,0.1], color: COLOR_PALETTE.beige})}
        {Box({position: [-2.4,0.5,-0.95], geometry: [0.1,1,0.1], color: COLOR_PALETTE.beige})}
        {Box({position: [-1.55,0.5,-2.4], geometry: [0.1,1,0.1], color: COLOR_PALETTE.beige})}
        {Box({position: [-1.55,0.5,-0.95], geometry: [0.1,1,0.1], color: COLOR_PALETTE.beige})}
        {/* Chair */}
        {OfficeChair({position: [-0.5,0.03,-1.5]})}
        {/* Lamp */}
        {Lamp({position: [-1.8, 2.47, 1.799]})}
        {/* Bed */}
        {Extrude({
          position: [1.7, 0.75, -.85],
          shape: bedShape,
          extrudeSettings: bedExtrudeSettings,
          color: COLOR_PALETTE.white
        })}
        {/* Covers */}
        {Extrude({
          position: [1.7, 0.76, -.85],
          shape: coversShape,
          extrudeSettings: coversExtrudeSettings,
          color: COLOR_PALETTE.darkBlue
        })}
        {/* Cover Fold */}
        {Extrude({
          position: [1.69, 0.778, -2.51],
          shape: coverFoldShape,
          extrudeSettings: coverFoldSettings,
          color: COLOR_PALETTE.white
        })}
        {/* Bed Frame */}
        {Box({position: [1.7, 0.25, -2.35], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, -2.05], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, -1.75], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, -1.45], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, -1.15], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, -.85], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, -.55], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, -.25], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, 0.05], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, 0.35], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [1.7, 0.25, 0.65], geometry: [1.55, 0.1, 0.05], color: COLOR_PALETTE.beige})}
        {/* Bed Frame Border */}
        {Box({position: [2.5, 0.25, -0.85], geometry: [0.1, 0.1, 3.2], color: COLOR_PALETTE.beige})}
        {Box({position: [0.89, 0.25, -0.85], geometry: [0.1, 0.1, 3.2], color: COLOR_PALETTE.beige})}
        {Box({position: [1.696, 0.25, 0.72], geometry: [1.71, 0.1, 0.1], color: COLOR_PALETTE.beige})}
        {Box({position: [1.696, 0.25, -2.4], geometry: [1.71, 0.1, 0.1], color: COLOR_PALETTE.beige})}
        {/* Bed Legs */}
        {Box({position: [0.89, 0.1, -2.4], geometry: [0.1, 0.25, 0.1], color: COLOR_PALETTE.beige})}
        {Box({position: [2.499, 0.1, -2.4], geometry: [0.1, 0.25, 0.1], color: COLOR_PALETTE.beige})}
        {Box({position: [0.89, 0.1, 0.72], geometry: [0.1, 0.25, 0.1], color: COLOR_PALETTE.beige})}
        {Box({position: [2.499, 0.1, 0.72], geometry: [0.1, 0.25, 0.1], color: COLOR_PALETTE.beige})}
        {/* Pillow */}
        {Extrude({
          position: [1.7, 0.98, -2],
          shape: pillowShape,
          extrudeSettings: pillowExtrudeSettings,
          color: COLOR_PALETTE.white
        })}
        {/* Dresser */}
        {Box({position: [-2.4, 1, 1.8], geometry: [0.1, 2, 1.498], color: COLOR_PALETTE.darkBrown})}
        {Box({position: [-1.8, 1, 1.1], geometry: [1.5, 2, 0.1], color: COLOR_PALETTE.darkBrown})}
        {Box({position: [-1.8, 1, 2.499], geometry: [1.5, 2, 0.1], color: COLOR_PALETTE.darkBrown})}
        {Box({position: [-1.8, 1.95, 1.799], geometry: [1.5, 0.1, 1.5], color: COLOR_PALETTE.darkBrown})}
        {Box({position: [-1.8, 1.95, 1.799], geometry: [1.5, 0.1, 1.5], color: COLOR_PALETTE.darkBrown})}
        {Box({position: [-1.8, 0.15, 1.799], geometry: [0.5, 0.2, 1.5], color: COLOR_PALETTE.darkBrown})}
        {/* Drawers */}
        {Drawers({position: [-1.8, 0.5, 1.799], rotation: [0, 0, 0]})}
        {/* Projects Text */}
        {us_projectsFont && us_lightOne && (
          <mesh 
            position={[-1, 1.8, 3.8]} 
            rotation={[0, Math.PI/2, 0]}
            scale={[1, 1, 0.001]}
          >
            <textGeometry 
              // @ts-expect-error directive here  
              args={[
                'Projects',
                {
                  font: us_projectsFont,
                  size: 0.2,
                  height: 0.1,
                  curveSegments: 12,
                  bevelEnabled: true,
                  bevelThickness: 0.01,
                  bevelSize: 0.005,
                  bevelOffset: 0,
                  bevelSegments: 5
                }
              ]} 
            />
            <meshToonMaterial 
              color={COLOR_PALETTE.trueWhite}
              emissive={COLOR_PALETTE.white}
              emissiveIntensity={0.5}
            />
          </mesh>
        )}
        {/* Bookshelf */}
        {Box({position: [-2.45, 4, 0], geometry: [0.05, 0.6, 3], color: COLOR_PALETTE.beige, onMouseOver: () => {}})}
        {Box({position: [-2.33, 4.3, 0], geometry: [0.4, 0.06, 3], color: COLOR_PALETTE.beige})}
        {Box({position: [-2.33, 3.68, 0], geometry: [0.4, 0.06, 3], color: COLOR_PALETTE.beige})}
        {Box({position: [-2.33, 4, 1.475], geometry: [0.4, 0.6, 0.05], color: COLOR_PALETTE.beige})}
        {Box({position: [-2.33, 4, -1.475], geometry: [0.4, 0.6, 0.05], color: COLOR_PALETTE.beige})}
        {/* Books */}
        {Book({
          rotation: [Math.PI/6, 0, 0],
          position: [-2.33, 3.86, 1.35],
          rightCoverGeometry: [0.2,0.3,0.02],
          rightCoverColor: COLOR_PALETTE.darkOrange,
          pagesGeometry: [0.2,0.28,0.05],
          pagesColor: COLOR_PALETTE.white,
          leftCoverGeometry: [0.2,0.3,0.02],
          leftCoverColor: COLOR_PALETTE.darkOrange,
          spineGeometry: [0.01,0.3,0.08],
          spineColor: COLOR_PALETTE.darkOrange,
        })}
        {Book({
          rotation: [0, 0, 0],
          position: [-2.33, 3.86, 1.2],
          rightCoverGeometry: [0.2,0.3,0.02],
          rightCoverColor: COLOR_PALETTE.lightOrange,
          pagesGeometry: [0.2,0.28,0.05],
          pagesColor: COLOR_PALETTE.white,
          leftCoverGeometry: [0.2,0.3,0.02],
          leftCoverColor: COLOR_PALETTE.lightOrange,
          spineGeometry: [0.01,0.3,0.08],
          spineColor: COLOR_PALETTE.lightOrange,
        })}
        {Book({
          rotation: [0, 0, 0],
          position: [-2.33, 3.86, 1.12],
          rightCoverGeometry: [0.2,0.3,0.02],
          rightCoverColor: COLOR_PALETTE.orange,
          pagesGeometry: [0.2,0.28,0.05],
          pagesColor: COLOR_PALETTE.white,
          leftCoverGeometry: [0.2,0.3,0.02],
          leftCoverColor: COLOR_PALETTE.orange,
          spineGeometry: [0.01,0.3,0.08],
          spineColor: COLOR_PALETTE.orange,
        })}
        {Book({
          rotation: [0, 0, 0],
          position: [-2.33, 3.86, 1.04],
          rightCoverGeometry: [0.2,0.3,0.02],
          rightCoverColor: COLOR_PALETTE.lightGreen,
          pagesGeometry: [0.2,0.28,0.05],
          pagesColor: COLOR_PALETTE.white,
          leftCoverGeometry: [0.2,0.3,0.02],
          leftCoverColor: COLOR_PALETTE.lightGreen,
          spineGeometry: [0.01,0.3,0.08],
          spineColor: COLOR_PALETTE.lightGreen,
        })}
        {Book({
          rotation: [0, 0, 0],
          position: [-2.33, 3.86, 0.96],
          rightCoverGeometry: [0.2,0.3,0.02],
          rightCoverColor: COLOR_PALETTE.lightBlue,
          pagesGeometry: [0.2,0.28,0.05],
          pagesColor: COLOR_PALETTE.white,
          leftCoverGeometry: [0.2,0.3,0.02],
          leftCoverColor: COLOR_PALETTE.lightBlue,
          spineGeometry: [0.01,0.3,0.08],
          spineColor: COLOR_PALETTE.lightBlue,
        })}
        {Book({
          rotation: [Math.PI/2, 0, 2*Math.PI/3],
          position: [-2.2, 3.75, 0.72],
          rightCoverGeometry: [0.2,0.3,0.02],
          rightCoverColor: COLOR_PALETTE.darkBlue,
          pagesGeometry: [0.2,0.28,0.05],
          pagesColor: COLOR_PALETTE.white,
          leftCoverGeometry: [0.2,0.3,0.02],
          leftCoverColor: COLOR_PALETTE.darkBlue,
          spineGeometry: [0.01,0.3,0.08],
          spineColor: COLOR_PALETTE.darkBlue,
        })}
        {/* About Me Book */}
        <FlatBook position={[-2.1, 3.75, 0]} rotation={[0,Math.PI/2,0]} />
        {/* Cactus */}
        {Cactus({position: [0,0.06,0], rotation: [0, 0, 0]})}
        {/* Lacrosse Stick */}
        {LacrosseStick({position: [-2,0.54,-0.55], rotation: [2.6, -2*Math.PI, -Math.PI]})}
        {/* Lacrosse Ball */}
        <mesh 
          ref={ballRef}
          position={[ballStartPos.x, ballStartPos.y, ballStartPos.z]} 
          onPointerOver={handleLacrosseBallMouseOver}
        >
          <sphereGeometry args={[0.06]} />
          <meshToonMaterial color={COLOR_PALETTE.trueWhite} emissive={COLOR_PALETTE.orange}
          emissiveIntensity={!us_lightOne && !us_lightTwo && !us_laptopOn ? 0.5 : 0} />
        </mesh>
        {/* Windows */}
        {/* {Box({position: [0.025, 2.5, -2.48], geometry: [1.6, 1.5, 0.05], color: COLOR_PALETTE.white, transparent: true, opacity: 0.2})}
        {Box({position: [-2.7, 2.5, 1.1], geometry: [0.8, 1.5, 0.05], color: COLOR_PALETTE.white, transparent: true, opacity: 0.2, rotation: [0, Math.PI/3, 0]})} */}
        {/* {Box({position: [-2.7, 2.5, -1.025], geometry: [0.8, 1.5, 0.05], color: COLOR_PALETTE.white, transparent: true, opacity: 0.2, rotation: [0, -Math.PI/3, 0]})} */}
        {/* Left Window Frame */}
        <WindowFrame 
          // @ts-expect-error directive here
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          color={COLOR_PALETTE.white}
          leftRef={leftLeftWindowRef}
          rightRef={leftRightWindowRef}
          rotations={windowRotations}
        />
        {/* Right Window Frame */}
        <WindowFrame 
          // @ts-expect-error directive here
          position={[0, 0, 0.05]}
          rotation={[0, Math.PI/2, 0]}
          color={COLOR_PALETTE.white}
          leftRef={rightLeftWindowRef}
          rightRef={rightRightWindowRef}
          rotations={windowRotations}
        />        {/* Light switch */}
        {Box({
          position: [1.675, 2, -2.39],
          geometry: [0.05, 0.1, 0.05],
          color: us_stringLightsOn ? COLOR_PALETTE.white : COLOR_PALETTE.orange,
        })}
        {Box({
          position: [1.675, 2, -2.45],
          geometry: [0.1, 0.15, 0.1],
          color: us_stringLightsOn ? COLOR_PALETTE.white : COLOR_PALETTE.black,
          transparent: true,
          opacity: us_stringLightsOn ? 1 : 1,
          onPointerOver: handleLightSwitchMouseOver
        })}
        {/* Light switch glow */}
        <pointLight
          position={[1.675, 2, -2.3]}
          intensity={us_stringLightsOn ? 0 : 0.1}
          color={COLOR_PALETTE.orange}
          distance={0.3}
        />
        {/* About Me text */}
        {/* {us_projectsFont && us_stringLightsOn && (
          <mesh 
            position={[-1.85, 3.7, -1.5]} 
            rotation={[0, Math.PI/4, 0]}
            scale={[1, 1, 0.001]}
          >
            <textGeometry 
              // @ts-expect-error directive here  
              args={[
                'About Me',
                {
                  font: us_projectsFont,
                  size: 0.2,
                  height: 0.1,
                  curveSegments: 12,
                  bevelEnabled: true,
                  bevelThickness: 0.01,
                  bevelSize: 0.005,
                }
              ]} 
            />
            <meshToonMaterial 
              color={COLOR_PALETTE.trueWhite} emissive={COLOR_PALETTE.white} emissiveIntensity={0.5}
            />
          </mesh>
        )} */}
        {/* right side string lights */}
        {StringLights({position: [-.35,1,-0.73], rotation: [0,Math.PI/2,0]})}
        {StringLights({position: [0.65,1,-0.73], rotation: [0,Math.PI/2,0]})}
        {StringLights({position: [1.65,1,-0.73], rotation: [0,Math.PI/2,0]})}
        {StringLights({position: [2.65,1,-0.73], rotation: [0,Math.PI/2,0]})}
        {StringLights({position: [3.65,1,-0.73], rotation: [0,Math.PI/2,0], isEnd: true})}
        {/* left side string lights */}
        {StringLights({position: [-3.97,1,-0.35], rotation: [0,0,0]})}
        {StringLights({position: [-3.97,1,0.65], rotation: [0,0,0]})}
        {StringLights({position: [-3.97,1,1.65], rotation: [0,0,0]})}
        {StringLights({position: [-3.97,1,2.65], rotation: [0,0,0]})}
        {StringLights({position: [-3.97,1,3.65], rotation: [0,0,0], isEnd: true})}
        {/* first project board in first drawer */}
        <ProjectDisplayBoard
          boardNumber={1}
          position={displayBoardStartPosition}
          rotation={new THREE.Euler(0, Math.PI/4, 0)} 
          imgPath={lazynotesLogo}
          title='LazyNotes'
          ref={projectDisplayBoardOneRef}
          color={COLOR_PALETTE.pink}
          link='https://github.com/bradyrichardson/LazyNotes'
        />
        <ProjectDisplayBoard
          boardNumber={2}
          position={displayBoardStartPosition}
          rotation={new THREE.Euler(0, Math.PI/4, 0)} 
          imgPath={turdlImage}
          title='Turdl'
          ref={projectDisplayBoardTwoRef}
          color={COLOR_PALETTE.darkGreen}
          link='https://github.com/bradyrichardson/turdle'
        />
        <ProjectDisplayBoard
          boardNumber={3}
          position={displayBoardStartPosition}
          rotation={new THREE.Euler(0, Math.PI/4, 0)} 
          imgPath={pokeVision}
          title='Poke-vision'
          ref={projectDisplayBoardThreeRef}
          color={COLOR_PALETTE.canaryYellow}
          link='https://github.com/bradyrichardson/poke-vision'
        />
         <ProjectDisplayBoard
          boardNumber={4}
          position={displayBoardStartPosition}
          rotation={new THREE.Euler(0, Math.PI/4, 0)} 
          imgPath={parapalLogo}
          title='ParaPal'
          ref={projectDisplayBoardFourRef}
          color={COLOR_PALETTE.trueWhite}
          link='https://github.com/bradyrichardson/ParaPal-demo'
        />
        {/* Help text */}
        {us_projectsFont && <group dispose={null} position={[4,3,0]}>
            <mesh scale={[1, 1, 0.001]} {...props} position={[0,0,0]} rotation={[0,Math.PI/4,0]}>
              <textGeometry
                // @ts-expect-error directive here
                args={[
                  'Orange:',
                  {
                    font: us_projectsFont,
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
                color={COLOR_PALETTE.orange} 
                opacity={1} 
                transparent={false}
                emissive={COLOR_PALETTE.orange}
                emissiveIntensity={1}
              />
            </mesh>
            <mesh scale={[1, 1, 0.001]} {...props} position={[0,-0.3,0]} rotation={[0,Math.PI/4,0]}>
              <textGeometry
                // @ts-expect-error directive here
                args={[
                  'Mouse over',
                  {
                    font: us_projectsFont,
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
                color={COLOR_PALETTE.white} 
                opacity={1} 
                transparent={false}
                emissive={COLOR_PALETTE.white}
                emissiveIntensity={1}
              />
            </mesh>
          </group>}
          {us_projectsFont && <group dispose={null} position={[4,2,0]}>
            <mesh scale={[1, 1, 0.001]} {...props} position={[0,0,0]} rotation={[0,Math.PI/4,0]}>
              <textGeometry
                // @ts-expect-error directive here
                args={[
                  'Blue:',
                  {
                    font: us_projectsFont,
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
                color={COLOR_PALETTE.darkBlue} 
                opacity={1} 
                transparent={false}
                emissive={COLOR_PALETTE.darkBlue}
                emissiveIntensity={1}
              />
            </mesh>
            <mesh scale={[1, 1, 0.001]} {...props} position={[0,-0.3,0]} rotation={[0,Math.PI/4,0]}>
              <textGeometry
                // @ts-expect-error directive here
                args={[
                  'Click',
                  {
                    font: us_projectsFont,
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
                color={COLOR_PALETTE.white} 
                opacity={1} 
                transparent={false}
                emissive={COLOR_PALETTE.white}
                emissiveIntensity={1}
              />
            </mesh>
          </group>}
          {us_projectsFont && <group dispose={null} position={[4,1,0]}>
            <mesh scale={[1, 1, 0.001]} {...props} position={[0,0,0]} rotation={[0,Math.PI/4,0]}>
              <textGeometry
                // @ts-expect-error directive here
                args={[
                  'Click + drag mouse to rotate room',
                  {
                    font: us_projectsFont,
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
                color={COLOR_PALETTE.white} 
                opacity={1} 
                transparent={false}
                emissive={COLOR_PALETTE.white}
                emissiveIntensity={1}
              />
            </mesh>
          </group>}
          {us_projectsFont && <group dispose={null} position={[4,0.8,0]}>
            <mesh scale={[1, 1, 0.001]} {...props} position={[0,0,0]} rotation={[0,Math.PI/4,0]}>
              <textGeometry
                // @ts-expect-error directive here
                args={[
                  'Scroll to zoom in/out',
                  {
                    font: us_projectsFont,
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
                color={COLOR_PALETTE.white} 
                opacity={1} 
                transparent={false}
                emissive={COLOR_PALETTE.white}
                emissiveIntensity={1}
              />
            </mesh>
          </group>}
      </group>
  )
}