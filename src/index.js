import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader }  from 'three/examples/jsm/loaders/GLTFLoader.js'
import { BasisTextureLoader }  from 'three/examples/jsm/loaders/BasisTextureLoader'

// import { RoughnessMipmapper }  from 'three/examples/jsm/utils/RoughnessMipmapper.js'

/**
 * GUI Controls
 */
import * as dat from 'dat.gui'
import { DoubleSide, TextureLoader } from 'three'
const gui = new dat.GUI()
var vehicleAttribute = new function(){
  this.speed = 0;
  this.rotation = 0;
  this.cameraPositionX = 0;
  this.cameraPositionY = 220;
  this.cameraPositionZ = 50;
  this.cameraRotationX = 0;
  this.cameraRotationY = 0;
  this.cameraRotationZ = 0;
};
gui.add(vehicleAttribute,"speed", -100, 100).listen();
gui.add(vehicleAttribute,"rotation", -0.1, 0.1).listen();
gui.add(vehicleAttribute,"cameraPositionX", -100000, 100000).listen();
gui.add(vehicleAttribute,"cameraPositionY", -100000, 100000).listen();
gui.add(vehicleAttribute,"cameraPositionZ", -100000, 100000).listen();
gui.add(vehicleAttribute,"cameraRotationX", -2 * Math.PI, 2 * Math.PI).listen();
gui.add(vehicleAttribute,"cameraRotationY", -2 * Math.PI, 2 * Math.PI).listen();
gui.add(vehicleAttribute,"cameraRotationZ", -2 * Math.PI, 2 * Math.PI).listen();




/**
 * Base
 */
// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog( 0xf2f7ff, 1, 100000 );


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
var group = new THREE.Group();
var loader = new GLTFLoader();
var ForwardSpeed = 0, RightSpeed = 0, Rotation = 0, PreRotation = 0,Speed = 0;
loader.load('../static/scene.gltf',(obj) =>{
  var mesh = obj.scene;
  // var textloader = new TextureLoader();
  // textloader.load
  mesh.position.set(0,60,250);
  mesh.rotation.set(0,0,0);
  mesh.scale.set(1,1,1);
  group.add(mesh);
  scene.add(group);

  //双面平面
  var planeGeometry = new THREE.PlaneGeometry(10000, 10000);
  var textureloader = new THREE.TextureLoader();
  var planematerial;
  textureloader.load("../static/textures/plane.jpg", function(planetexture){
      planematerial = new THREE.MeshLambertMaterial({
      color : 0xffffff,
      map : planetexture,
      side : THREE.DoubleSide
    });
  var meshPlane = new THREE.Mesh(planeGeometry, planematerial);
  meshPlane.rotation.x += 0.5 * Math.PI;//旋转平面
  meshPlane.position.y -= 2;//移动位置
  scene.add(meshPlane);
  });
  

  var flag = true;
    function onKeyDown(event)
  {
    switch(event.keyCode)
    {
      case 38: /*up*/	 Speed += 0.5; vehicleAttribute.speed += 0.5;break;
      case 40: /*down*/Speed -= 0.5; vehicleAttribute.speed -= 0.5;break;
      case 37: /*left*/{
        if (Speed >= 0) {
          // Rotation = -0.02;
          vehicleAttribute.cameraRotationY -= 0.02;
        }
        else{
          // Rotation = 0.02; 
          vehicleAttribute.cameraRotationY += 0.02;
        }
        break;
      }
      case 39: /*right*/{
        if (Speed >= 0) {
          // Rotation = -0.02;
          vehicleAttribute.cameraRotationY += 0.02;
        }
        else{
          // Rotation = 0.02; 
          vehicleAttribute.cameraRotationY -= 0.02;
        }
        break;
      }
      case 32:/*space*/if (Speed >= 1) Speed -= 1; if (Speed <= -1) Speed += 1; if (Speed > -1 && Speed < 1) Speed = 0; break;
      case 82:/*R*/ {
        vehicleAttribute.speed = 0; 
        vehicleAttribute.rotation = 0; 
        vehicleAttribute.cameraPositionX = 0;
        vehicleAttribute.cameraPositionY = 220;
        vehicleAttribute.cameraPositionZ = 50;
        vehicleAttribute.cameraRotationX = 0;
        vehicleAttribute.cameraRotationY = 0;
        vehicleAttribute.cameraRotationZ = 0;
        Speed = 0; 
        PreRotation = 0; 
        Rotation = 0; 
        group.position.set(0,0,0);
        group.rotation.set(0,0,0); 
        // camera.position.set(0,220,50); 
        break;
      }
      case 70:/*F*/ {
        if (flag) {
          camera.position.set(0,1000,-3000);
          vehicleAttribute.cameraPositionX = 0;
          vehicleAttribute.cameraPositionY = 1000;
          vehicleAttribute.cameraPositionZ = -3000;
        }
        if (!flag) {
          camera.position.set(0,220,50);
          vehicleAttribute.cameraPositionX = 0;
          vehicleAttribute.cameraPositionY = 220;
          vehicleAttribute.cameraPositionZ = 50;
        }
        flag = !flag;
        break;
      }

    }
  };

  function onKeyUp(event)
  {
    switch(event.keyCode)
    {
      case 38: /*up*/	 Speed += 0; vehicleAttribute.speed += 0;break;
      case 40: /*down*/Speed -= 0; vehicleAttribute.speed -= 0;break;
      case 37: /*left*/{
        if (Speed >= 0) {
          // Rotation = -0.02;
          vehicleAttribute.cameraRotationY -= 0;
        }
        else{
          // Rotation = 0.02; 
          vehicleAttribute.cameraRotationY += 0;
        }
        break;
      }
      case 39: /*right*/{
        if (Speed >= 0) {
          // Rotation = -0.02;
          vehicleAttribute.cameraRotationY += 0;
        }
        else{
          // Rotation = 0.02; 
          vehicleAttribute.cameraRotationY -= 0;
        }
        break;
      }
      case 32:/*space*/if (Speed >= 1) Speed -= 1; if (Speed <= -1) Speed += 1; if (Speed > -1 && Speed < 1) Speed = 0; break;
      
    }
  };

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
});


// renderer.render(scene, camera);
  
// plane.material = new THREE.MeshBasicMaterial({
//     side: THREE.DoubleSide,//双面显示
//     color: '#eeeeee'//材质颜色
// });



//盒子模型
let urls = [
  '../static/textures/posx.jpg','../static/textures/negx.jpg',
  '../static/textures/posy.jpg','../static/textures/negy.jpg',
  '../static/textures/posz.jpg','../static/textures/negz.jpg'
];
let boxloader = new THREE.CubeTextureLoader();
scene.background = boxloader.load(urls);



// 辅助坐标
var axesHelper = new THREE.AxesHelper( 150 );
scene.add( axesHelper );

//辅助网格
// var helper = new THREE.GridHelper( 100000, 10000 );
// scene.add( helper );




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
camera.position.set(0, 220, 50)
scene.add(camera)
group.add(camera)

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
  //if (flag){
  //   camera.lookAt(-1000000 * Math.sin(PreRotation), 220, 1000000 * Math.cos(PreRotation));
  // }
  Speed = vehicleAttribute.speed;
  Rotation = vehicleAttribute.rotation;
  camera.position.x = vehicleAttribute.cameraPositionX;
  camera.position.y = vehicleAttribute.cameraPositionY;
  camera.position.z = vehicleAttribute.cameraPositionZ;
  group.rotation.x = vehicleAttribute.cameraRotationX;
  group.rotation.y = vehicleAttribute.cameraRotationY;
  group.rotation.z = vehicleAttribute.cameraRotationZ;
  // camera.lookAt(-1000000 * Math.sin(PreRotation), 220, 1000000 * Math.cos(PreRotation));
  camera.lookAt(-1000000 * Math.sin(vehicleAttribute.cameraRotationY), 220, 1000000 * Math.cos(vehicleAttribute.cameraRotationY));
  // if (Rotation != 0){
    // PreRotation += Roation;
    PreRotation = vehicleAttribute.cameraRotationY;
    group.rotation.y = PreRotation;
    if (PreRotation < 2 * (-Math.PI)){
      PreRotation += 2 * Math.PI;
    }
    if (PreRotation > 2 * Math.PI){
      PreRotation -= 2 * Math.PI;
    }
  // }
  Rotation = 0;
  ForwardSpeed = Speed * Math.cos(PreRotation);
  RightSpeed = Speed * Math.sin(PreRotation);
  group.position.z += ForwardSpeed;
  group.position.x -= RightSpeed;
  // camera.position.x -= RightSpeed;
  // camera.position.x += RightSpeed;
  

  // Render
  //camera.lookAt(group);
  renderer.render(scene, camera)
  

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick();
