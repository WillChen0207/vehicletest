import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader }  from 'three/examples/jsm/loaders/GLTFLoader.js'
// import * as CANNON from 'cannon'

/**
 * GUI Controls
 */
import * as dat from 'dat.gui'
import { MeshDistanceMaterial, MeshLambertMaterial} from 'three'
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
// gui.add(vehicleAttribute, "speed", -100, 100).listen();
// gui.add(vehicleAttribute, "rotation", -0.1, 0.1).listen();
// gui.add(vehicleAttribute, "cameraPositionX", -2000, 3000).listen();
// gui.add(vehicleAttribute, "cameraPositionY", -2000, 3000).listen();
// gui.add(vehicleAttribute, "cameraPositionZ", -2000, 3000).listen();
// gui.add(vehicleAttribute, "cameraRotationX", -2 * Math.PI, 2 * Math.PI).listen();
// gui.add(vehicleAttribute, "cameraRotationY", -2 * Math.PI, 2 * Math.PI).listen();
// gui.add(vehicleAttribute, "cameraRotationZ", -2 * Math.PI, 2 * Math.PI).listen();


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('#webgl')

// Scene and physics
const scene = new THREE.Scene()
scene.fog = new THREE.Fog( 0xf2f7ff, 1, 100000 );
var titlearray = ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','🚗'];
var scoreSum = 0;
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
  var maxSpeed = 120;
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
        if (Speed <= -maxSpeed/2){
          Speed = -maxSpeed/2;
          vehicleAttribute.speed = -maxSpeed/2;
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

  var scoreMesh = new THREE.Mesh();
  var loader = new GLTFLoader();
  loader.load('../static/coin/scene.gltf',(obj) =>{
  var mesh = obj.scene;
  mesh.position.set(0, 200, 250);
  mesh.rotation.set(0,0,0);
  mesh.scale.set(5, 5, 5);
  scoreMesh = mesh;
  scene.add(scoreMesh);
  score();
});
  
  var timer2 = window.setInterval(function(){
    coinRotate();
  }, 10);
  function coinRotate(){
    scoreMesh.rotation.y += 0.01;
  }

  var floor = new THREE.Mesh();
  var loader = new GLTFLoader();
  loader.load('../static/floor.gltf',(obj) =>{
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update()
  
  //Move the vehicle
  Speed = vehicleAttribute.speed;
  camera.position.x = vehicleAttribute.cameraPositionX;
  camera.position.y = vehicleAttribute.cameraPositionY;
  camera.position.z = vehicleAttribute.cameraPositionZ;
  if (Rotation != 0){
    PreRotation -= Rotation;
    group.rotation.y = PreRotation;
    cubeMesh.rotation.y = PreRotation;
    if (PreRotation < 2 * (-Math.PI)){
      PreRotation += 2 * Math.PI;
    }
    if (PreRotation > 2 * Math.PI){
      PreRotation -= 2 * Math.PI;
    }
    vehicleAttribute.rotation = PreRotation;
  }
  Rotation = 0;
  ForwardSpeed = Speed * Math.cos(PreRotation);
  RightSpeed = -Speed * Math.sin(PreRotation);
  if (Speed != 0){
    if (collisionCheck(0)){
      console.log('碰撞');
      PlaySound();
      // setTimeout("alert('You crashed. \nYou will respawn.\nYour score:'+scoreSum);Initpos();",0);无法实现异步执行
      alert('You crashed. \nYou will respawn.\nYour score:'+scoreSum);
      Initpos();
    }
    else if (collisionCheck(1)){
      score();
      scoreSum ++;
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
  Posshow();
  if (group.position.z <= -25000){
    alert("恭喜你找到彩蛋！\n制作人：陈诺言 戴梓莘\n有些时候，我们是需要回头看看走过的路。");
    Initpos();
  }

  // Render
  renderer.render(scene, camera);
  renderer.shadowMap.enabled = true;
  

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}
tick();

function collisionCheck(Num){
  var bool = false;
  var centerCoord = cubeMesh.position.clone();
  var vertices = cubeGeometry.vertices;
  for (var i = 0; i < vertices.length; i++) {
    var vertexWorldCoord = vertices[i].clone().applyMatrix4(cubeMesh.matrixWorld);
    var dir = new THREE.Vector3(); 
    dir.subVectors(vertexWorldCoord, centerCoord);
    var raycaster = new THREE.Raycaster(centerCoord, dir.clone().normalize());
    if (Num == 0){
      var intersects = raycaster.intersectObjects([floor], true);
    }
    else if (Num == 1){
      var intersects = raycaster.intersectObjects([scoreMesh], true);
    }
    if (intersects.length > 0) { 
      if (intersects[0].distance < dir.length()) {
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
  scoreSum = 0;
}

function score(){
  var posz = [60000, 60000, 109000, 109500];
  var posx = [0, -50000, -100000, 0];
  var num = Math.floor(Math.random()*4);
  scoreMesh.position.set(posx[num], 200, posz[num]);
  document.getElementById("Target").innerHTML = "Your new target: x:" + posx[num] + " z:" + posz[num];
  auLoader.load('../static/Music/GetScore.mp3',function(AudioBuffer){
    auMuisc.setBuffer(AudioBuffer);
    auMuisc.autoplay = true;
    auMuisc.setLoop(flase);//是否循环
    auMuisc.setVolume(0.3);//音量
    auMuisc.play();//播放、stop停止、pause停止
  })//加载得分音频
}

function Posshow(){
  document.getElementById("Posshow").innerHTML = "Your position now: x:" + group.position.x.toFixed(1) + " z:" + group.position.z.toFixed(1);
  document.getElementById("ScoreSum").innerHTML = "Your score now: " + scoreSum +"!";
}

  var listener = new THREE.AudioListener();//创建一个监听者
  camera.add(listener);//把监听添加到camera
  var audio = new THREE.Audio(listener);//创建一个非位置音频对象 用于控制播放
  var audioLoader = new THREE.AudioLoader();//创建一个音频加载器对象
  audioLoader.load('../static/Music/Killer.mp3',function(AudioBuffer){
    audio.setBuffer(AudioBuffer);
    audio.autoplay = true;
    audio.setLoop(true);//是否循环
    audio.setVolume(0.5);//音量
    audio.play();//播放、stop停止、pause停止
  })//加载音频文件

  var listener = new THREE.AudioListener();//创建一个监听者
  camera.add(listener);//把监听添加到camera
  var auMuisc = new THREE.Audio(listener);//创建一个非位置音频对象 用于控制播放
  var auLoader = new THREE.AudioLoader();//创建一个音频加载器对象

  function PlaySound(){
    auLoader.load('../static/Music/Crash.mp3',function(AudioBuffer){
      auMuisc.setBuffer(AudioBuffer);
      auMuisc.autoplay = true;
      auMuisc.setLoop(flase);//是否循环
      auMuisc.setVolume(0.3);//音量
      auMuisc.play();//播放、stop停止、pause停止
    })//加载碰撞音频
  }
