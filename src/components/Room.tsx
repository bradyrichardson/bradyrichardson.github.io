import { useThree, useFrame } from "@react-three/fiber";
import { JSX, useRef, useState, Fragment, forwardRef } from "react";
import * as THREE from 'three'

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
  const isHovered = useRef(false)

  const COLOR_PALETTE = {
    'trueWhite': '#ffffff',
    'black': '#0f1626',
    'beige': '#ab987a',
    'white': '#f5f5f5',
    'gray': 'aaaaaa',
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

  }

  const handleLampMouseOver = (event: unknown) => {
    us_setLightOne(!us_lightOne)
  }

  const handleLaptopMouseOver = () => {
    us_setLightTwo(!us_lightTwo)
    us_setLaptopOn(!us_laptopOn)
  }

  const handleDrawerMouseOver = (drawerRef: React.RefObject<THREE.Group>, targetPosition: React.RefObject<THREE.Vector3>) => {
    if (targetPosition.current) {
      targetPosition.current.x = 0.6 // Move drawer out
    }
  }

  const handleDrawerMouseOut = (drawerRef: React.RefObject<THREE.Group>, targetPosition: React.RefObject<THREE.Vector3>) => {
    if (targetPosition.current) {
      targetPosition.current.x = 0 // Move drawer back in
    }
  }

  useFrame((_, delta) => {
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
  })

  const Box = ({...props}): JSX.Element => {
    return (
        <mesh position={props.position} onClick={props.onClick ? props.onClick : null} rotation={props.rotation ? props.rotation : [0,0,0] } onPointerOver={props.onPointerOver ? props.onPointerOver : null}>
          <boxGeometry args={props.geometry}/>
          <meshPhongMaterial color={props.color} opacity={props.opacity ? props.opacity : 1} transparent={props.transparent ? props.transparent : false} side={THREE.DoubleSide}/>
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
      <mesh position={props.position} onClick={props.onClick ? props.onClick : null}>
        <sphereGeometry args={props.radius}/>
        <meshPhongMaterial color={props.color} opacity={props.opacity} transparent={props.transparent} shininess={props.shininess} specular={props.specular}/>
      </mesh>
    )
  }

  const Cylinder = ({...props}): JSX.Element => {
    return (
      <mesh position={props.position} onClick={props.onClick ? props.onClick : null}>
        <cylinderGeometry args={[props.radiusTop, props.radiusBottom, props.height]}/>
        <meshPhongMaterial color={props.color} opacity={props.opacity} transparent={props.transparent} shininess={props.shininess} specular={props.specular}/>
      </mesh>
    )
  }

  const Lathe = ({...props}): JSX.Element => {
    return (
      <mesh position={props.position} onPointerOver={props.onPointerOver ? props.onPointerOver : null}>
        <latheGeometry args={[props.points, props.segments]}/>
        <meshPhongMaterial color={props.color} opacity={props.opacity} transparent={props.transparent}/>
      </mesh>
    )
  }

  const Extrude = ({...props}): JSX.Element => {
    return (
      <mesh position={props.position} rotation={[Math.PI/2, 0, 0]}>
        <extrudeGeometry args={[props.shape, props.extrudeSettings]}/>
        <meshPhongMaterial 
          color={props.color} 
          transparent={props.transparent || false}
        />
      </mesh>
    )
  }

  const pillowShape = new THREE.Shape();
    pillowShape.moveTo(-0.3, -0.1);
    pillowShape.quadraticCurveTo(-0.3, -0.15, -0.25, -0.15);
    pillowShape.lineTo(0.25, -0.15);
    pillowShape.quadraticCurveTo(0.3, -0.15, 0.3, -0.1);
    pillowShape.lineTo(0.3, 0.1);
    pillowShape.quadraticCurveTo(0.3, 0.15, 0.25, 0.15);
    pillowShape.lineTo(-0.25, 0.15);
    pillowShape.quadraticCurveTo(-0.3, 0.15, -0.3, 0.1);
    pillowShape.lineTo(-0.3, -0.1);

  const pillowExtrudeSettings = {
    steps: 5,
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.2,
    bevelOffset: 0.05,
    bevelSegments: 20
  };

  const bedShape = new THREE.Shape();
    bedShape.moveTo(-0.75, -1.5);
    bedShape.quadraticCurveTo(-0.75, -1.55, -0.7, -1.55);  // slight round corner
    bedShape.lineTo(0.7, -1.55);
    bedShape.quadraticCurveTo(0.75, -1.55, 0.75, -1.5);    // slight round corner
    bedShape.lineTo(0.75, 1.5);
    bedShape.quadraticCurveTo(0.75, 1.55, 0.7, 1.55);      // slight round corner
    bedShape.lineTo(-0.7, 1.55);
    bedShape.quadraticCurveTo(-0.75, 1.55, -0.75, 1.5);    // slight round corner
    bedShape.lineTo(-0.75, -1.5);

  const bedExtrudeSettings = {
    steps: 1,
    depth: 0.4,            // Make it thicker
    bevelEnabled: true,
    bevelThickness: 0.05,   // Smaller bevel for sharper edges
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 3
  };

  const Book = ({...props}): JSX.Element => {
    return (
      <group position={props.position} rotation={props.rotation ? props.rotation : [0,0,0]}>
        {/* Right Cover */}
        {Box({
          position: [0, 0, -0.03],
          geometry: props.rightCoverGeometry,
          color: props.rightCoverColor
        })}
        {/* Pages */}
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
        {/* Spine */}
        {Box({
          position: [0.1, 0, 0],
          geometry: props.spineGeometry,
          color: props.spineColor
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
    ];

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
        {/* Light */}
        {PointLight({
          position: [0.3, 0, 0.1],
          intensity: us_lightOne ? 10 : 0,
          color: COLOR_PALETTE.white
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
            const keyId = `key-${row}-${col}`;
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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: true });
      canvas.width = 128;
      canvas.height = 128;
      if (ctx) {
        // Clear the canvas with transparent background
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw rounded rectangle for background
        ctx.fillStyle = '#0077B5';
        const radius = 15;
        const x = 24;
        const y = 24;
        const width = 80;
        const height = 80;
        
        // Background
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
  

        // Draw "in" text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 80px Arial';
        ctx.fillText('in', 30, 90);
      }
      return canvas;
    })());

    const githubTexture = new THREE.CanvasTexture((() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: true });
      canvas.width = 128;
      canvas.height = 128;
      if (ctx) {
        // Clear the canvas with transparent background
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw button background with rounded corners
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        const radius = 15;
        const x = 7;
        const y = 24;
        const width = 115;
        const height = 80;
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        // Draw "GitHub" text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GitHub', 64, 74);
      }
      return canvas;
    })());
    
    

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
          color: COLOR_PALETTE.silver,
          rotation: [0, 0, 2*Math.PI/3],
          onPointerOver: handleLaptopMouseOver
        })}
        
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
        position={props.position} 
        rotation={props.rotation ? props.rotation : [0,0,0]}
        ref={ref}
        onPointerOver={props.onPointerOver}
        onPointerOut={props.onPointerOut}
      >
        {Box({
          position: [0, 0, 0],
          geometry: props.geometry,
          color: props.color
        })}
        {/* Drawer Handle */}
        {Box({
          position: [0.82, 0.25, 0],
          geometry: [0.1, 0.1, 0.3],
          color: COLOR_PALETTE.black
        })}
        {/* Drawer Outer Wall */}
        {Box({
          position: [0.77, 0.2, 0],
          geometry: [0.05, 0.417, 1.4],
          color: COLOR_PALETTE.beige
        })}
        {/* Drawer Back Inner Wall */}
        {Box({
          position: [0, 0.2, 0],
          geometry: [0.05, 0.417, 1.4],
          color: COLOR_PALETTE.beige
        })}
        {/* Drawer Right Inner Wall */}
        {Box({
          position: [0.1, 0.18, -0.625],
          geometry: [1.3, 0.38, 0.05],
          color: COLOR_PALETTE.beige
        })}
        {/* Drawer Left Inner Wall */}
        {Box({
          position: [0.1, 0.18, 0.625],
          geometry: [1.3, 0.38, 0.05],
          color: COLOR_PALETTE.beige,
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
          position={[0, 1, 0]}
          geometry={[1.4, 0.01, 1.25]}
          color={COLOR_PALETTE.lightBeige}
          ref={drawerOneRef}
          onPointerOver={() => handleDrawerMouseOver(drawerOneRef, targetPositionOne)}
          onPointerOut={() => handleDrawerMouseOut(drawerOneRef, targetPositionOne)}
        />
        <Drawer
          position={[0, 0.583, 0]}
          geometry={[1.4, 0.01, 1.25]}
          color={COLOR_PALETTE.lightBeige}
          ref={drawerTwoRef}
          onPointerOver={() => handleDrawerMouseOver(drawerTwoRef, targetPositionTwo)}
          onPointerOut={() => handleDrawerMouseOut(drawerTwoRef, targetPositionTwo)}
        />
        <Drawer
          position={[0, 0.167, 0]}
          geometry={[1.4, 0.01, 1.25]}
          color={COLOR_PALETTE.lightBeige}
          ref={drawerThreeRef}
          onPointerOver={() => handleDrawerMouseOver(drawerThreeRef, targetPositionThree)}
          onPointerOut={() => handleDrawerMouseOut(drawerThreeRef, targetPositionThree)}
        />
        <Drawer
          position={[0, -0.25, 0]}
          geometry={[1.4, 0.01, 1.25]}
          color={COLOR_PALETTE.lightBeige}
          ref={drawerFourRef}
          onPointerOver={() => handleDrawerMouseOver(drawerFourRef, targetPositionFour)}
          onPointerOut={() => handleDrawerMouseOut(drawerFourRef, targetPositionFour)}
        />
      </group>
    )
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, -5]} intensity={1} />
      {/* Floor */}
      {Box({position: [0,0,0], geometry: [5.1, 0.1, 5.1], color: COLOR_PALETTE.test })}
      {/* Walls */}
      {/* Right Wall */}
      {Box({position: [-1.62,0.9,-2.5], geometry: [1.85,1.75,0.1], color: COLOR_PALETTE.test })}
      {Box({position: [-1.65,2.45,-2.5], geometry: [1.8,1.75,0.1], color: COLOR_PALETTE.test })}
      {Box({position: [-1.62,4.075,-2.5], geometry: [1.85,1.75,0.1], color: COLOR_PALETTE.test })}
      {Box({position: [1.675,2.45,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.test })}
      {Box({position: [1.675,4.075,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.test })}
      {Box({position: [1.675,0.9,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.test })}
      {Box({position: [0,0.9,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.test })}
      {Box({position: [0,4.075,-2.5], geometry: [1.75,1.75,0.1], color: COLOR_PALETTE.test })}
      {/* Left Wall */}
      {Box({position: [-2.5, 0.9, -1.62], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.test })}
      {Box({position: [-2.5, 2.45, -1.62], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.test })}
      {Box({position: [-2.5, 4.075, -1.62], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.test })}
      {Box({position: [-2.5, 2.45, 1.675], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.test })}
      {Box({position: [-2.5, 4.075, 1.675], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.test })}
      {Box({position: [-2.5, 0.9, 1.675], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.test })}
      {Box({position: [-2.5, 0.9, 0], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.test })}
      {Box({position: [-2.5, 4.075, 0], geometry: [0.1, 1.75, 1.75], color: COLOR_PALETTE.test })}
      {/* Laptop */}
      {Laptop({position: [-1.85, 1.06, -1.7], rotation: [0, -Math.PI/6, 0]})}
      {/* Desk */}
      {Box({position: [-2,1,-1.7], geometry: [1,0.1,1.6], color: COLOR_PALETTE.beige})}
      {/* Desk Legs */}
      {Box({position: [-2.4,0.5,-2.4], geometry: [0.1,1,0.1], color: COLOR_PALETTE.beige})}
      {Box({position: [-2.4,0.5,-0.95], geometry: [0.1,1,0.1], color: COLOR_PALETTE.beige})}
      {Box({position: [-1.55,0.5,-2.4], geometry: [0.1,1,0.1], color: COLOR_PALETTE.beige})}
      {Box({position: [-1.55,0.5,-0.95], geometry: [0.1,1,0.1], color: COLOR_PALETTE.beige})}
      {/* Lamp */}
      {Lamp({position: [-1.8, 2.47, 1.799]})}
      {/* Bed */}
      {Extrude({
        position: [1.7, 0.75, -.85],
        shape: bedShape,
        extrudeSettings: bedExtrudeSettings,
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
      {Box({position: [-2.4, 1, 1.8], geometry: [0.1, 2, 1.498], color: COLOR_PALETTE.beige})}
      {Box({position: [-1.8, 1, 1.1], geometry: [1.5, 2, 0.1], color: COLOR_PALETTE.beige})}
      {Box({position: [-1.8, 1, 2.499], geometry: [1.5, 2, 0.1], color: COLOR_PALETTE.beige})}
      {Box({position: [-1.8, 1.95, 1.799], geometry: [1.5, 0.1, 1.5], color: COLOR_PALETTE.beige})}
      {Box({position: [-1.8, 1.95, 1.799], geometry: [1.5, 0.1, 1.5], color: COLOR_PALETTE.beige})}
      {/* Drawers */}
      {Drawers({position: [-1.8, 0.5, 1.799], rotation: [0, 0, 0]})}
      {/* Windows */}
      {/* Left Window */}
      {/* Right Window */}
      {/* {Box({position: [0, 2.5, -2.45], geometry: [1.5, 1.5, 0.05], color: COLOR_PALETTE.white})} */}
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
    </group>
  )
}