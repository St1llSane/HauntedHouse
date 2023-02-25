import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import './style.css'

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Mesh
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: '#86A064' })
)
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.receiveShadow = true
scene.add(plane)

// House
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(5, 3.2, 5),
  new THREE.MeshStandardMaterial({ color: '#977568' })
)
const wallsHeight = walls.geometry.parameters.height
const wallsDepth = walls.geometry.parameters.depth
walls.position.y = wallsHeight / 2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(4.3, 1.5, 4),
  new THREE.MeshStandardMaterial({ color: '#9A533D' })
)
roof.position.y = wallsHeight + roof.geometry.parameters.height / 2
roof.rotation.y = Math.PI / 4
house.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshStandardMaterial({ color: '#aa7b7b' })
)
door.position.y = door.geometry.parameters.height / 2
door.position.z = wallsDepth / 2 + 0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 32, 32)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const leftBush = new THREE.Group()
const rightBush = new THREE.Group()

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.55, 0.55, 0.55)
bush1.position.set(1.5, 0.28, 3.25)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.3, 0.3, 0.3)
bush2.position.set(2, 0.15, 3.45)
rightBush.add(bush1, bush2)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.62, 0.62, 0.62)
bush3.position.set(-1.2, 0.28, 3.35)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.38, 0.38, 0.38)
bush4.position.set(-1.6, 0.1, 2.95)

const bush5 = new THREE.Mesh(bushGeometry, bushMaterial)
bush5.scale.set(0.25, 0.25, 0.25)
bush5.position.set(-1.35, 0.11, 3.9)
leftBush.add(bush3, bush4, bush5)

house.add(leftBush, rightBush)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const gravesGeometry = new THREE.BoxGeometry(1.05, 1.2, 0.4)
const gravesMatearials = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 4.5 + Math.random() * 4.8
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  const grave = new THREE.Mesh(gravesGeometry, gravesMatearials)
  const graveHeight = grave.geometry.parameters.height
  grave.position.set(x, graveHeight / 2 - 0.1, z)
  grave.rotation.set(Math.random() * 0.4 - 0.2, 0, (Math.random() - 0.5) * 0.4)

  graves.add(grave)
}

// Light
const ambientLight = new THREE.AmbientLight('#B2D1FF', 0.12)
scene.add(ambientLight)

const moonLight = new THREE.DirectionalLight('#B2D1FF', 0.12)
moonLight.position.set(4, 5, -2)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#F0AF4D', 1, 8)
doorLight.position.set(0, 2.5, 4)
house.add(doorLight)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 0
camera.position.y = 4
camera.position.z = 10
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene, camera)

// Resizing
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.03
controls.minDistance = 1
controls.maxDistance = 20

// Debug UI
const gui = new dat.GUI()
gui.closed = true

// Animations
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
