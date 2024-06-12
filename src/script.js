import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { log } from 'three/examples/jsm/nodes/Nodes.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const color1 = new THREE.Color('#c2d1ff')
scene.background = color1
gui.addColor(scene,'background')

// const axisHelper = new THREE.AxesHelper()
// scene.add(axisHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/9.png')

/**
 * Textures
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // console.log('Font Loaded');
        const textGeometry = new TextGeometry(
            'Rohan Raidani',
            {
                font:font,
                size:0.5,
                height:0.2,
                curveSegments: 5,
                bevelEnabled:true,
                bevelThickness:0.03,
                bevelSize:0.02,
                bevelOffset:0,
                bevelSegments:4
            }
        )
        const clock = new THREE.Clock()
        const newTime = clock.getElapsedTime()
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x  - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // )
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox);

        textGeometry.center()
        const material = new THREE.MeshMatcapMaterial({
            // wireframe:true,
            matcap:matcapTexture
        })
        const text = new THREE.Mesh(textGeometry,material)
        scene.add(text)

        const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45)

        for(let i = 0 ; i < 150 ; i++){
            
            const donut = new THREE.Mesh(donutGeometry,material)

            donut.position.x = (Math.random() - 0.5) * 30
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 30

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale,scale,scale)

            

            scene.add(donut)
            // donut.rotation.y = 20*newTime
        }

        const cubeGeometry = new THREE.BoxGeometry(1,1,1)
        for(let i = 0 ; i < 150 ; i++){
            
            const cube = new THREE.Mesh(cubeGeometry,material)

            cube.position.x = (Math.random() - 0.5) * 30
            cube.position.y = (Math.random() - 0.5) * 20
            cube.position.z = (Math.random() - 0.5) * 30

            cube.rotation.x = Math.random() * Math.PI
            cube.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            cube.scale.set(scale,scale,scale)
            scene.add(cube)
        }
        const iconTexture = createFontAwesomeTexture('\uf09b', '#d54d4d', 'pink'); // \uf09b is the Font Awesome code for GitHub icon
        const iconMaterial = new THREE.MeshBasicMaterial({ map: iconTexture })
        const gitGeometry = new THREE.PlaneGeometry(0.6, 0.6)
        const git = new THREE.Mesh(gitGeometry,iconMaterial)
        // git.rotation.x = -Math.PI / 2
        git.position.x = 0
        git.position.y = -0.8
        scene.add(git)
        
    }
)
/**
 * Object
 */



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 20

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    console.log(elapsedTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    // camera animation
     
    if (camera.position.y < 1.1 || camera.position.z < 3) {
        camera.position.z = camera.position.z
        camera.position.y = camera.position.y
    }else{
        camera.position.y = 15 -  -1 *(elapsedTime - (8.5 * elapsedTime))
        camera.position.z = 20 -  -1 *(elapsedTime - (8.5 * elapsedTime))
    }
    

}

tick()

/**
 * Helper function to create a texture with Font Awesome icon
 */
function createFontAwesomeTexture(icon, color, backgroundColor) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    // Set the background color
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, size, size);

    // Draw the icon
    context.font = `${size * 0.75}px FontAwesome`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(icon, size / 2, size / 2);

    // Create a texture
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
}