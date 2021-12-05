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
// var vehicleAttribute = new function(){
//   this.speed = 0;
//   this.rotation = 0;
//   this.cameraPositionX = 0;
//   this.cameraPositionY = 300;
//   this.cameraPositionZ = 1000;
//   this.cameraRotationX = 0;
//   this.cameraRotationY = 0;
//   this.cameraRotationZ = 0;
// };
// gui.add(vehicleAttribute,"speed", 0, 10);
// gui.add(vehicleAttribute,"rotation", -0.1, 0.1);
// gui.add(vehicleAttribute,"cameraPositionX", -2000, 2000);
// gui.add(vehicleAttribute,"cameraPositionY", -2000, 2000);
// gui.add(vehicleAttribute,"cameraPositionZ", -2000, 2000);
// gui.add(vehicleAttribute,"cameraRotationX", -3.14, 3.14);
// gui.add(vehicleAttribute,"cameraRotationY", -3.14, 3.14);
// gui.add(vehicleAttribute,"cameraRotationZ", -3.14, 3.14);




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
var group = new THREE.Group();
var ForwardSpeed = 0, RightSpeed = 0, Rotation = 0, PreRotation = 0,Speed = 0;
loader.load('././static/scene.gltf',(obj) =>{
  obj.scene.position.set(0,60,-250);
  // obj.scene.position.set(0,0,0);
  obj.scene.rotation.set(0,Math.PI,0);
  obj.scene.scale.set(1,1,1);
  //var mesh = obj.scene;
  group.add(obj.scene);
  scene.add(group);

    function onKeyDown(event)
  {
    switch(event.keyCode)
    {
      case 38: /*up*/	 Speed += 0.5; break;
      case 40: /*down*/Speed -= 0.5; break;
      case 37: /*left*/if (Speed >= 0) Rotation = -0.02;if (Speed < 0) Rotation = 0.02; break;
      case 39: /*right*/if (Speed >= 0) Rotation = 0.02;if (Speed < 0) Rotation = -0.02; break;
      case 32:/*space*/if (Speed >= 1) Speed -= 1; if (Speed <= -1) Speed += 1; if (Speed > -1 && Speed < 1) Speed = 0; break;
      case 82:/*R*/ Speed = 0; PreRotation = 0; Rotation = 0; group.position.set(0,0,0);group.rotation.set(0,0,0); camera.position.set(0,220,-50); break;

    }
  };

  function onKeyUp(event)
  {
    switch(event.keyCode)
    {
      case 38: /*up*/	 Speed += 0; break;
      case 40: /*down*/Speed -= 0; break;
      case 37: /*left*/Rotation = 0; break;
      case 39: /*right*/Rotation = 0; break;
      case 32:/*space*/if (Speed >= 1) Speed -= 1; if (Speed <= -1) Speed += 1; if (Speed > -1 && Speed < 1) Speed = 0; break;
      case 82:/*R*/Speed = 0; PreRotation = 0; Rotation = 0; group.position.set(0,0,0);group.rotation.set(0,0,0); camera.position.set(0,220,-50); break;
    }
  };

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
});



//旋转双面白色平面
const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
let plane = new THREE.Mesh(planeGeometry);
plane.material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,//双面显示
    color: '#eeeeee'//材质颜色
});
plane.rotation.x += 1.57;//旋转平面
plane.position.y -= 2;//移动位置
scene.add(plane);

//盒子模型
// let urls = [
//   '././static/textures/posx.jpg','././static/textures/negx.jpg',
//   '././static/textures/posy.jpg','././static/textures/negy.jpg',
//   '././static/textures/posz.jpg','././static/textures/negz.jpg'
// ];
// let boxloader = new THREE.CubeTextureLoader();
// scene.background = boxloader.load(urls);

// 辅助坐标
// var axesHelper = new THREE.AxesHelper( 150 );
// scene.add( axesHelper );



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
spotLight.position.set(0,5000,0);
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
  10000
)
camera.position.set(0, 220, -50)
// camera.lookAt(group)
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
  logarithmicDepthBuffer : true
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
  
  //Move the vehicle
  camera.lookAt(0, 220, -10000)
  // Speed = vehicleAttribute.speed;
  // Rotation = vehicleAttribute.rotation;
  // camera.position.x = vehicleAttribute.cameraPositionX;
  // camera.position.y = vehicleAttribute.cameraPositionY;
  // camera.position.z = vehicleAttribute.cameraPositionZ;
  // camera.rotation.x = vehicleAttribute.cameraRotationX;
  // camera.rotation.y = vehicleAttribute.cameraRotationY;
  // camera.rotation.z = vehicleAttribute.cameraRotationZ;
  if (Rotation != 0){
    PreRotation += Rotation;
    group.rotation.y -= Rotation;
    
    if (PreRotation > 2 * Math.PI || PreRotation < 2 * (-Math.PI)){
      PreRotation -= 2 * Math.PI;
    }
  }
  Rotation = 0;
  ForwardSpeed = Speed * Math.cos(PreRotation);
  RightSpeed = Speed * Math.sin(PreRotation);
  camera.position.z -= ForwardSpeed;
  group.position.z -= ForwardSpeed;
  group.position.x += RightSpeed;
  // camera.position.x -= RightSpeed;
  // camera.position.x += RightSpeed;
  

  // Render
  //camera.lookAt(group);
  renderer.render(scene, camera)
  

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick();
