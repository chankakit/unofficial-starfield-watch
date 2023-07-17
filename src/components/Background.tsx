// @ts-nocheck
import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

function Background({visible}: {visible:boolean}) {
  return (
    <>
      <div className='pos-abs' style={{  display: visible ? 'block' : 'none', width: '100vw', height: '100vh', top: '0', zIndex: -1 }}>
        <Canvas camera={{ position: [0,0,.4] }}>
          <Stars/>
        </Canvas>
      </div>
    </>
  )
}

const Stars = (props) => {
  const ref = useRef()
  const [sphere] = useState(() => random.inSphere(new Float32Array(2000), { radius: 2 }))
  useFrame((state, delta) => {
    // ref.current.rotation.x -= delta / 60
    ref.current.rotation.y -= delta / 70
    ref.current.rotation.z -= delta / 60
  })

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#99B9BF" size={0.008} sizeAttenuation={true} depthWrite={false}/>
      </Points>
    </group>
  )
}



export default Background
