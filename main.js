import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import './style.css'

// Textures
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAOTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')

const bricksColorTextures = textureLoader.load('./textures/bricks/color.jpg')
const bricksAOTextures = textureLoader.load(
  './textures/bricks/ambientOcclusion.jpg'
)
const bricksNormalTextures = textureLoader.load('./textures/bricks/normal.jpg')
const bricksRoughnessTextures = textureLoader.load(
  './textures/bricks/roughness.jpg'
)

const grassColorTextures = textureLoader.load('./textures/grass/color.jpg')
const grassAOTextures = textureLoader.load(
  './textures/grass/ambientOcclusion.jpg'
)
const grassNormalTextures = textureLoader.load('./textures/grass/normal.jpg')
const grassRoughnessTextures = textureLoader.load(
  './textures/grass/roughness.jpg'
)

grassColorTextures.repeat.set(8, 8)
grassAOTextures.repeat.set(8, 8)
grassNormalTextures.repeat.set(8, 8)
grassRoughnessTextures.repeat.set(8, 8)

grassColorTextures.wrapS = THREE.RepeatWrapping
grassAOTextures.wrapS = THREE.RepeatWrapping
grassNormalTextures.wrapS = THREE.RepeatWrapping
grassRoughnessTextures.wrapS = THREE.RepeatWrapping
grassColorTextures.wrapT = THREE.RepeatWrapping
grassAOTextures.wrapT = THREE.RepeatWrapping
grassNormalTextures.wrapT = THREE.RepeatWrapping
grassRoughnessTextures.wrapT = THREE.RepeatWrapping

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#2B2E3E', 1, 16.5)
scene.fog = fog

// Grass
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTextures,
    aoMap: grassAOTextures,
    normalMap: grassNormalTextures,
    roughnessMap: grassRoughnessTextures,
  })
)
plane.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2)
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
  new THREE.MeshStandardMaterial({
    map: bricksColorTextures,
    aoMap: bricksAOTextures,
    normalMap: bricksNormalTextures,
    roughnessMap: bricksRoughnessTextures,
  })
)
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
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
  new THREE.PlaneGeometry(2.2, 2.2, 124, 124),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAOTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.11,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
)
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = door.geometry.parameters.height / 2 - 0.12
door.position.z = wallsDepth / 2 - 0.025
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
  grave.rotation.set(
    Math.random() * 0.26 - 0.13,
    0,
    (Math.random() - 0.5) * 0.4
  )

  graves.add(grave)
}

// Light
const ambientLight = new THREE.AmbientLight('#B2D1FF', 0.12)
scene.add(ambientLight)

const moonLight = new THREE.DirectionalLight('#B2D1FF', 0.12)
moonLight.position.set(4, 5, -2)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#FC9A1B', 1, 7)
doorLight.position.set(0, 2, 4.3)
house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight('#FFFF00', 2, 3.2)
const ghost2 = new THREE.PointLight('#E700E3', 2, 3.2)
const ghost3 = new THREE.PointLight('#69E700', 2, 3.2)

scene.add(ghost1, ghost2, ghost3)

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
renderer.setClearColor('#2B2E3E')
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

  // UpdateGhosts
  const ghost1Angle = elapsedTime / 2
  ghost1.position.x = Math.cos(ghost1Angle) * 5
  ghost1.position.z = Math.sin(ghost1Angle) * 5
  ghost1.position.y = Math.sin(ghost1Angle * 3)

  const ghost2Angle = -elapsedTime / 1.5
  ghost2.position.x = Math.cos(ghost2Angle) * 8
  ghost2.position.z = Math.sin(ghost2Angle) * 8
  ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2)

  const ghost3Angle = -elapsedTime * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 * Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7* Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(ghost3Angle * 4) + Math.sin(elapsedTime * 1.8)

  // Update controls
  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
