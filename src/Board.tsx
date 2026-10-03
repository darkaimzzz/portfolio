import { Canvas, useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { pawns, projects, type PieceKind } from './projects'

const GOLD = new THREE.Color('#e8b04b')
const sq = ([f, r]: [number, number]) => new THREE.Vector3(f - 3.5, 0, 3.5 - r)

// Staunton-style pieces: a lathed body plus extras, merged into one geometry per kind.
type P = [number, number] // [radius, height]
const base: P[] = [[0, 0], [0.36, 0], [0.37, 0.025], [0.36, 0.05], [0.31, 0.07], [0.32, 0.1], [0.28, 0.12], [0.24, 0.14]]
// Points on a sphere's silhouette, from just above its lower neck to the top.
const ball = (cy: number, r: number, from = -0.6): P[] =>
  Array.from({ length: 10 }, (_, i) => {
    const a = from + ((Math.PI / 2 - from) * i) / 9
    return [Math.max(0, r * Math.cos(a)), cy + r * Math.sin(a)]
  })
const collar = (y: number, r: number, neck: number): P[] => [[neck, y - 0.02], [r, y], [r, y + 0.03], [neck, y + 0.05]]

const profiles: Record<PieceKind, P[]> = {
  pawn: [...base, [0.2, 0.2], [0.15, 0.28], [0.12, 0.38], ...collar(0.42, 0.19, 0.1), ...ball(0.57, 0.13)],
  rook: [...base, [0.24, 0.2], [0.21, 0.35], [0.2, 0.55], ...collar(0.58, 0.26, 0.21), [0.25, 0.66], [0.28, 0.7], [0.28, 0.78], [0, 0.78]],
  knight: [...base, [0.24, 0.2], [0.22, 0.26], [0, 0.26]],
  bishop: [...base, [0.2, 0.2], [0.14, 0.35], [0.1, 0.55], ...collar(0.62, 0.2, 0.1), [0.13, 0.7], [0.16, 0.78], [0.15, 0.88], [0.1, 0.96], [0.05, 1.0], ...ball(1.04, 0.05, -1)],
  queen: [...base, [0.22, 0.2], [0.15, 0.38], [0.11, 0.7], ...collar(0.8, 0.22, 0.11), ...collar(0.88, 0.18, 0.11), [0.15, 0.98], [0.23, 1.1], [0.2, 1.12], [0.15, 1.15], ...ball(1.16, 0.08, -0.3)],
  king: [...base, [0.22, 0.2], [0.16, 0.4], [0.12, 0.78], ...collar(0.86, 0.23, 0.12), ...collar(0.94, 0.19, 0.12), [0.15, 1.04], [0.22, 1.16], [0.2, 1.2], [0.08, 1.24], [0, 1.25]],
}

const box = (w: number, h: number, d: number, x: number, y: number, z: number, ry = 0) =>
  new THREE.BoxGeometry(w, h, d).rotateY(ry).translate(x, y, z)

// Horse-head silhouette, extruded and bevelled.
function horseHead() {
  const pts: P[] = [[-0.17, 0], [0.17, 0], [0.13, 0.12], [0.2, 0.24], [0.3, 0.33], [0.34, 0.4], [0.32, 0.46], [0.24, 0.5],
    [0.14, 0.56], [0.08, 0.62], [0.06, 0.7], [0.01, 0.65], [-0.04, 0.68], [-0.08, 0.6], [-0.16, 0.5], [-0.21, 0.36], [-0.22, 0.18]]
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))), {
    depth: 0.14, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 3, curveSegments: 4,
  })
  return g.translate(0, 0.24, -0.07).rotateY(Math.PI) // profile toward the camera, facing the board centre
}

const extras: Partial<Record<PieceKind, () => THREE.BufferGeometry[]>> = {
  knight: () => [horseHead()],
  rook: () => Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2
    return box(0.12, 0.1, 0.09, Math.cos(a) * 0.23, 0.83, Math.sin(a) * 0.23, -a)
  }),
  queen: () => Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    return new THREE.SphereGeometry(0.035, 10, 8).translate(Math.cos(a) * 0.22, 1.12, Math.sin(a) * 0.22)
  }),
  king: () => [box(0.06, 0.26, 0.06, 0, 1.36, 0), box(0.18, 0.06, 0.06, 0, 1.4, 0)],
}

const geos = Object.fromEntries(
  (Object.keys(profiles) as PieceKind[]).map((k) => {
    const parts = [new THREE.LatheGeometry(profiles[k].map(([x, y]) => new THREE.Vector2(x, y)), 48), ...(extras[k]?.() ?? [])]
    return [k, mergeGeometries(parts.map((g) => (g.index ? g.toNonIndexed() : g)))]
  }),
) as Record<PieceKind, THREE.BufferGeometry>

function Piece({ kind, at, lit }: { kind: PieceKind; at: THREE.Vector3; lit: boolean }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((_, dt) => {
    const m = mat.current!
    m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, lit ? 0.6 : 0, 4, dt)
  })
  return (
    <mesh position={at} geometry={geos[kind]} castShadow>
      <meshStandardMaterial ref={mat} color="#ece6d8" emissive={GOLD} emissiveIntensity={0} roughness={0.3} />
    </mesh>
  )
}

function Squares({ highlight }: { highlight?: THREE.Vector3 }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const glow = useRef<THREE.Mesh>(null)
  useLayoutEffect(() => {
    const m = ref.current!
    const o = new THREE.Object3D()
    for (let i = 0; i < 64; i++) {
      o.position.set((i % 8) - 3.5, -0.05, Math.floor(i / 8) - 3.5)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
      m.setColorAt(i, new THREE.Color(((i % 8) + Math.floor(i / 8)) % 2 ? '#3a3a44' : '#141418'))
    }
    m.instanceMatrix.needsUpdate = true
    m.instanceColor!.needsUpdate = true
  }, [])
  useFrame((_, dt) => {
    const g = glow.current!
    const target = highlight ? 0.35 : 0
    const mat = g.material as THREE.MeshBasicMaterial
    mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 5, dt)
    if (highlight) g.position.set(highlight.x, 0.005, highlight.z)
  })
  return (
    <>
      <instancedMesh ref={ref} args={[undefined, undefined, 64]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial roughness={0.6} />
      </instancedMesh>
      <mesh ref={glow} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0} />
      </mesh>
    </>
  )
}

// active: -1 = hero overview, 0..n-1 = project stop, anything else = wide angle.
function Rig({ active }: { active: number }) {
  const look = useRef(new THREE.Vector3())
  useFrame(({ camera, clock }, dt) => {
    const p = projects[active]
    let pos: THREE.Vector3, tgt: THREE.Vector3
    if (p) {
      const at = sq(p.square)
      tgt = at.clone().add(new THREE.Vector3(-0.9, 0.6, 0)) // aim left of the piece so it sits right of the text
      pos = at.clone().add(new THREE.Vector3(1.6, 2.6, 4.4))
    } else if (active === -1) {
      const t = clock.elapsedTime * 0.05
      pos = new THREE.Vector3(Math.sin(t) * 2, 11, 6 + Math.cos(t))
      tgt = new THREE.Vector3(-2.5, 0, 0.5) // board sits right of the hero text
    } else {
      pos = new THREE.Vector3(-7, 6, 7)
      tgt = new THREE.Vector3(0, 0, 0)
    }
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pos.x, 2.5, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pos.y, 2.5, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, pos.z, 2.5, dt)
    look.current.lerp(tgt, 1 - Math.exp(-2.5 * dt))
    camera.lookAt(look.current)
  })
  return null
}

export default function Board({ active }: { active: number }) {
  const p = projects[active]
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 11, 7], fov: 40 }}>
      <color attach="background" args={['#0b0b0e']} />
      <fog attach="fog" args={['#0b0b0e', 10, 24]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 8, 3]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-5, 3, -4]} intensity={8} color="#6a7cff" />
      <Squares highlight={p ? sq(p.square) : undefined} />
      {projects.map((x, i) => <Piece key={x.id} kind={x.piece} at={sq(x.square)} lit={i === active} />)}
      {pawns.map((x) => <Piece key={x.name} kind="pawn" at={sq(x.square)} lit={active === projects.length} />)}
      <Rig active={active} />
    </Canvas>
  )
}
