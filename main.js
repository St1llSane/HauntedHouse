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

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(5, 3, 5),
  new THREE.MeshStandardMaterial({ color: '#8B7164' })
)
walls.position.y = walls.geometry.parameters.height / 2
console.log(walls.geometry)
house.add(walls)

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(4.3, 1.5, 4),
  new THREE.MeshStandardMaterial({ color: '#9A533D' })
)
roof.position.y =
  walls.geometry.parameters.height + roof.geometry.parameters.height / 2
roof.rotation.y = Math.PI / 4
house.add(roof)

// Light
const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 0.8
scene.add(ambientLight)

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
