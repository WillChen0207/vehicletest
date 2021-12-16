import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader }  from 'three/examples/jsm/loaders/GLTFLoader.js'
// import * as CANNON from 'cannon'

/**
 * GUI Controls
 */
import * as dat from 'dat.gui'
import { MeshLambertMaterial, Vector3} from 'three'
// import { DoubleSide, TextureLoader } from 'three'
const gui = new dat.GUI()
var vehicleAttribute = new function(){
  this.speed = 0;
  this.rotation = 0;
  this.cameraPositionX = 0;
  this.cameraPositionY = 390;
  this.cameraPositionZ = -150;
  this.cameraRotationX = 0;
  this.cameraRotationY = 0;
  this.cameraRotationZ = 0;
  this.positionX;
  this.positionY;
  this.positionZ;
};
gui.add(vehicleAttribute, "speed", -100, 100).listen();
gui.add(vehicleAttribute, "rotation", -0.1, 0.1).listen();
gui.add(vehicleAttribute, "cameraPositionX", -2000, 3000).listen();
gui.add(vehicleAttribute, "cameraPositionY", -2000, 3000).listen();
gui.add(vehicleAttribute, "cameraPositionZ", -2000, 3000).listen();
gui.add(vehicleAttribute, "cameraRotationX", -2 * Math.PI, 2 * Math.PI).listen();
gui.add(vehicleAttribute, "cameraRotationY", -2 * Math.PI, 2 * Math.PI).listen();
gui.add(vehicleAttribute, "cameraRotationZ", -2 * Math.PI, 2 * Math.PI).listen();


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('#webgl')

// Scene and physics
const scene = new THREE.Scene()
scene.fog = new THREE.Fog( 0xf2f7ff, 1, 100000 );
var titlearray = ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','🚗'];
var timer = window.setInterval(function(){
  titlechange();
}, 1000);
function titlechange(){
  var tmp = titlearray[0];
  var titleText = "";
  for (var i = 0; i <= 19; i++){
    titlearray[i] = titlearray[i+1];
  }
  titlearray[20] = tmp;
  for (var i = 0; i <= 20; i++){
    titleText += titlearray[i];
  }
  document.getElementById("titletext").innerHTML = titleText;
}

/**
 * Object
 */

//创建一个外包围立方体用于监测碰撞(cannonjs instead maybe)
var cubeGeometry = new THREE.Geometry();
        // 创建一个立方体
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3
var vertices = [
  new THREE.Vector3(-200, 350, -400),//0
  new THREE.Vector3(200, 350, -400),//1
  new THREE.Vector3(200, 0, -400),//2
  new THREE.Vector3(-200, 0, -400),//3
  new THREE.Vector3(-200, 0, 200),//4
  new THREE.Vector3(-200, 350, 200),//5
  new THREE.Vector3(200, 350, 200),//6
  new THREE.Vector3(200, 0, 200)//7
];//total:x, y, z = 400, 350, 600
cubeGeometry.vertices = vertices;
var cubeFaces = [
  new THREE.Face3(0,1,2),
  new THREE.Face3(0,2,3),
  new THREE.Face3(0,3,4),
  new THREE.Face3(0,4,5),
  new THREE.Face3(1,6,7),
  new THREE.Face3(1,7,2),
  new THREE.Face3(6,5,4),
  new THREE.Face3(6,4,7),
  new THREE.Face3(5,6,1),
  new THREE.Face3(5,1,0),
  new THREE.Face3(3,2,7),
  new THREE.Face3(3,7,4)
];
cubeGeometry.faces = cubeFaces;
cubeGeometry.computeFaceNormals();//生成法向量
var cubeMaterial = new MeshLambertMaterial({
  color : 0xeeeeee,
  transparent : true,
  opacity : 0
});
var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.position.set(0, 0, 0);
cubeMesh.castShadow = true;
scene.add(cubeMesh);


// 导入gltf的模型文件
var group = new THREE.Group();
var loader = new GLTFLoader();
var ForwardSpeed = 0, RightSpeed = 0, Rotation = 0, PreRotation = 0,Speed = 0;
loader.load('../static/scene.gltf',(obj) =>{
  var mesh = obj.scene;
  // var textloader = new TextureLoader();
  // textloader.load
  mesh.position.set(0, 0, 250);
  mesh.rotation.set(0,0,0);
  mesh.scale.set(3, 3, 3);
  mesh.castShadow = true;
  group.add(mesh);
  group.add(camera);
  vehicleAttribute.positionX = group.position.x;
  vehicleAttribute.positionY = group.position.y;
  vehicleAttribute.positionZ = group.position.z;
  gui.add(vehicleAttribute, "positionX").listen();
  gui.add(vehicleAttribute, "positionY").listen();
  gui.add(vehicleAttribute, "positionZ").listen();
  scene.add(group);


    
  var flag = true;
  var maxSpeed = 60;
    function onKeyDown(event)
  {
    switch(event.keyCode)
    {
      case 38: /*up*/	{
        Speed += 0.5; 
        vehicleAttribute.speed += 0.5;
        if (Speed >= maxSpeed){
          Speed = maxSpeed;
          vehicleAttribute.speed = maxSpeed;
        }
        break;
      }
        
      case 40: /*down*/{
        Speed -= 0.5; 
        vehicleAttribute.speed -= 0.5;
        if (Speed <= -maxSpeed){
          Speed = -maxSpeed;
          vehicleAttribute.speed = -maxSpeed;
        }
        break;
      }
      case 37: /*left*/{
        if (Speed >= 0) {
          Rotation = -0.02;
          // vehicleAttribute.cameraRotationY -= 0.02;
        }
        else{
          Rotation = 0.02; 
          // vehicleAttribute.cameraRotationY += 0.02;
        }
        break;
      }
      case 39: /*right*/{
        if (Speed >= 0) {
          Rotation = 0.02;
          // vehicleAttribute.cameraRotationY += 0.02;
        }
        else{
          Rotation = -0.02; 
          // vehicleAttribute.cameraRotationY -= 0.02;
        }
        break;
      }
      case 32:/*space*/{
        if (Speed >= 1){
          Speed -= 1;
          vehicleAttribute.speed -= 1;
          break;
        }
        if (Speed <= -1){
          Speed += 1; 
          vehicleAttribute.speed += 1;
          break;
        }
        if (Speed > -1 && Speed < 1){
          Speed = 0;
          vehicleAttribute.speed = 0;
          break;
        }
      }
      case 82:/*R*/ {
        Initpos();
        break;
      }
      case 70:/*F*/ {
        if (flag) {
          camera.position.set(0, 600, -2500);
          vehicleAttribute.cameraPositionX = 0;
          vehicleAttribute.cameraPositionY = 600;
          vehicleAttribute.cameraPositionZ = -2500;
        }
        if (!flag) {
          camera.position.set(0, 390, -150);
          vehicleAttribute.cameraPositionX = 0;
          vehicleAttribute.cameraPositionY = 390;
          vehicleAttribute.cameraPositionZ = -150;
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
          Rotation = -0;
          // vehicleAttribute.cameraRotationY -= 0;
        }
        else{
          Rotation = 0; 
          // vehicleAttribute.cameraRotationY += 0;
        }
        break;
      }
      case 39: /*right*/{
        if (Speed >= 0) {
          Rotation = 0;
          // vehicleAttribute.cameraRotationY += 0;
        }
        else{
          Rotation = 0; 
          // vehicleAttribute.cameraRotationY -= 0;
        }
        break;
      }
      case 32:/*space*/{
        if (Speed >= 1){
          Speed -= 1;
          vehicleAttribute.speed -= 1;
          break;
        }
        if (Speed <= -1){
          Speed += 1; 
          vehicleAttribute.speed += 1;
          break;
        }
        if (Speed > -1 && Speed < 1){
          Speed = 0;
          vehicleAttribute.speed = 0;
          break;
        }
      }
      
    }
  };

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
});

var floor = new THREE.Mesh();
var loader = new GLTFLoader();
loader.load('../static/floor3.gltf',(obj) =>{
  var mesh = obj.scene;
  mesh.position.set(0, 1900, 50000);
  mesh.rotation.set(0, Math.PI, 0);
  mesh.scale.set(1000, 1000, 1000);
  mesh.castShadow = true;
  floor = mesh;
  scene.add(mesh);
});

//盒子模型
let urls = [
  '../static/textures/posx.jpg','../static/textures/negx.jpg',
  '../static/textures/posy.jpg','../static/textures/negy.jpg',
  '../static/textures/posz.jpg','../static/textures/negz.jpg'
];
let boxloader = new THREE.CubeTextureLoader();
scene.background = boxloader.load(urls);

// 辅助坐标
// var axesHelper = new THREE.AxesHelper( 150 );
// scene.add( axesHelper );

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
var dirLight = new THREE.DirectionalLight(0xffffff);//创建一个白色点光源
dirLight.position.set(0, 650, -650);
dirLight.castShadow = true;//开启点光源生成动态投影
dirLight.lookAt(scene);
scene.add(dirLight);
var dirLight = new THREE.DirectionalLight(0xffffff);//创建另一个白色点光源
dirLight.position.set(0, 650, 650);
dirLight.castShadow = true;//开启点光源生成动态投影
dirLight.lookAt(scene);
scene.add(dirLight);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.001,
  200000
)
camera.position.set(0, 105, 105);
scene.add(camera)
// group.add(camera)

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

  // Update controls
  controls.update()
  
  //Move the vehicle
  Speed = vehicleAttribute.speed;
  camera.position.x = vehicleAttribute.cameraPositionX;
  camera.position.y = vehicleAttribute.cameraPositionY;
  camera.position.z = vehicleAttribute.cameraPositionZ;
  if (Rotation != 0){
    PreRotation -= Rotation;
    // vehicleAttribute.rotation = PreRotation;
    // PreRotation = vehicleAttribute.cameraRotationY;
    group.rotation.y = PreRotation;
    cubeMesh.rotation.y = PreRotation;
    // if (PreRotation < 2 * (-Math.PI)){
    //   PreRotation += 2 * Math.PI;
    // }
    // if (PreRotation > 2 * Math.PI){
    //   PreRotation -= 2 * Math.PI;
    // }
    vehicleAttribute.rotation = PreRotation;
  }
  Rotation = 0;
  ForwardSpeed = Speed * Math.cos(PreRotation);
  RightSpeed = -Speed * Math.sin(PreRotation);
  if (Speed != 0){
    if (collisionCheck()){
      console.log('碰撞');
      // if (PreRotation > -Math.PI/2 && PreRotation < Math.PI/2){//车头朝前
      //   PreRotation = 0;
      //   vehicleAttribute.rotation = 0;
      // }
      // if (PreRotation > Math.PI/2 && PreRotation < Math.PI*3/2){//车头朝后
      //   PreRotation = Math.PI;
      //   vehicleAttribute.rotation = Math.PI;
      // }
      // group.rotation.y = PreRotation;
      // cubeMesh.rotation.y = PreRotation;
      alert("You crashed. \nYou will respawn.");
      Initpos();
    }
  }
  camera.lookAt(10000000 * Math.sin(PreRotation), 220, 10000000 * Math.cos(PreRotation))
  group.position.z += ForwardSpeed;
  cubeMesh.position.z += ForwardSpeed;
  group.position.x -= RightSpeed;
  cubeMesh.position.x -= RightSpeed;
  vehicleAttribute.positionX = group.position.x;
  vehicleAttribute.positionY = group.position.y;
  vehicleAttribute.positionZ = group.position.z;
  SpeedShow();
  if (group.position.z <= -25000){
    alert("恭喜你找到彩蛋！\n制作人：陈诺言 戴梓莘\n有些时候，我们是需要回头看看走过的路。");
    Initpos();
  }

  // Render
  //camera.lookAt(group);
  renderer.render(scene, camera);
  renderer.shadowMap.enabled = true;
  

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}
tick();

function collisionCheck(){
  //声明一个变量用来表示是否碰撞
  var bool = false;
  // threejs的几何体默认情况下几何中心在场景中坐标是坐标原点。
  // 可以通过position属性或.getWorldPosition()方法获得模型几何中心的世界坐标
  var centerCoord = cubeMesh.position.clone();
  //网格模型几何体的所有顶点数据
  var vertices = cubeGeometry.vertices;
  //1.循环遍历几何体所有顶点坐标
  //2.把几何体的每一个顶点和几何体中心构建一个射线
  for (var i = 0; i < vertices.length; i++) {
    // vertices[i]获得几何体索引是i的顶点坐标，
    // 注意执行.clone()返回一个新的向量，以免改变几何体顶点坐标值
    // 几何体的顶点坐标要执行该几何体绑定模型对象经过的旋转平移缩放变换
    // 几何体顶点经过的变换可以通过模型的本地矩阵属性.matrix或世界矩阵属性.matrixWorld获得
    var vertexWorldCoord = vertices[i].clone().applyMatrix4(cubeMesh.matrixWorld);
    var dir = new THREE.Vector3(); //创建一个向量
    // 几何体顶点坐标和几何体中心坐标构成的方向向量
    dir.subVectors(vertexWorldCoord, centerCoord);

    //Raycaster构造函数创建一个射线投射器对象，参数1、参数2改变的是该对象的射线属性.ray
    // 参数1：射线的起点
    // 参数2：射线的方向，注意归一化的时候，需要先克隆,否则后面会执行dir.length()计算向量长度结果是1
    var raycaster = new THREE.Raycaster(centerCoord, dir.clone().normalize());

    // 计算射线和参数1中的模型对象是否相交，参数1数组中可以设置多个模型模型对象，下面参数只设置了立方体网格模型
    var intersects = raycaster.intersectObjects([floor], true);
    if (intersects.length > 0) { // 判断参数[floor]中模型对象是否与射线相交
      // intersects[0].distance：射线起点与交叉点之间的距离(交叉点：射线和模型表面交叉点坐标)
      // dir.length()：球体顶点和几何体几何中心构成向量的长度
      // 通过距离大小比较判断是否碰撞
      // intersects[0].distance小于dir.length()，说明交叉点的位置在射线起点和几何体顶点之间，
      //而交叉点又在立方体表面上,也就是说立方体部分表面插入到了几何体里面
      if (intersects[0].distance < dir.length()) {
        //循环遍历几何体顶点，每一个顶点都要创建一个射线，进行一次交叉拾取计算，只要有一个满足上面的距离条件，就发生了碰撞
        bool = true;
      }
    }
  }
  return bool;
}

function SpeedShow(){
  document.getElementById("speedshow").innerHTML = Speed.toFixed(1);
}

function Initpos(){
  Speed = 0;
  vehicleAttribute.speed = 0;
  vehicleAttribute.rotation = 0; 
  vehicleAttribute.cameraPositionX = 0;
  vehicleAttribute.cameraPositionY = 390;
  vehicleAttribute.cameraPositionZ = -150;
  vehicleAttribute.cameraRotationX = 0;
  vehicleAttribute.cameraRotationY = 0;
  vehicleAttribute.cameraRotationZ = 0;
  Speed = 0; 
  PreRotation = 0; 
  Rotation = 0; 
  group.position.set(0,0,0);
  cubeMesh.position.set(0,0,0);
  group.rotation.set(0,0,0); 
  cubeMesh.rotation.set(0,0,0); 
}