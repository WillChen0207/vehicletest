import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader }  from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { RoughnessMipmapper }  from 'three/examples/jsm/utils/RoughnessMipmapper.js'

/**
 * GUI Controls
 */
import * as dat from 'dat.gui'
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
// const geometry = new THREE.IcosahedronGeometry(20, 1)
// const material = new THREE.MeshNormalMaterial()
// // Material Props.
// material.wireframe = true
// // Create Mesh & Add To Scene
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// 导入gltf的模型文件
var loader = new GLTFLoader();

loader.load('././static/scene.gltf',(obj) =>{
  obj.scene.position.set(0,60,250);
  // obj.scene.position.set(0,0,0);
  obj.scene.rotation.set(0,0,0);
  obj.scene.scale.set(1,1,1);
  var mesh = obj.scene;
  scene.add(obj.scene);
    function onKeyDown(event)
  {
    switch(event.keyCode)
    {
      case 38: /*up*/	mesh.position.z += 10; break;
      case 40: /*down*/mesh.position.z -= 10; break;
      case 37: /*left*/mesh.rotation.y += 0.04; break;
      case 39: /*right*/mesh.rotation.y -= 0.04; break;
    }
  };

  function onKeyUp(event)
  {
    switch(event.keyCode)
    {
      case 38: /*up*/	mesh.position.z += 0; break;
      case 40: /*down*/mesh.position.z -= 0; break;
      case 37: /*left*/mesh.rotation.y += 0; break;
      case 39: /*right*/mesh.rotation.y -= 0; break;
    }
  };
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
});



//旋转双面白色平面
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
let plane = new THREE.Mesh(planeGeometry);
plane.material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,//双面显示
    color: '#eeeeee'//材质颜色
});
plane.rotation.x += 1.57;//旋转平面
plane.position.y -= 2;//移动位置
scene.add(plane);

//辅助坐标
var axesHelper = new THREE.AxesHelper( 150 );
scene.add( axesHelper );


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
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

var ambient = new THREE.AmbientLight(0x444444);//创建一个环境光
scene.add(ambient);
var spotLight = new THREE.SpotLight(0xffffff);//创建一个白色点光源
spotLight.position.set(500,1000,500);
spotLight.castShadow = true;//开启点光源生成动态投影
spotLight.lookAt(scene);
scene.add(spotLight);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.001,
  5000
)
camera.position.x = 500
camera.position.y = 400
camera.position.z = 50
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = false             
// controls.enableZoom = false
controls.enablePan = false
controls.dampingFactor = 0.05
controls.maxDistance = 1000
controls.minDistance = 30
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN,
}
 


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setClearColor(0x444444,1);//设置渲染器renderer的背景色
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  //mesh.rotation.y += 0.01 * Math.sin(1)
  //mesh.rotation.y += 0.01 * Math.sin(1)
  // mesh.rotation.z += 0.01 * Math.sin(1)

  // Update controls
  controls.update()
  // Render
  renderer.render(scene, camera)
  

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick();
