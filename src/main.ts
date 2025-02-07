import * as THREE from "three";

import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { poseBones } from "./bones";
import { starter } from "./getdata";



var scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls;
var skeltonhelper: THREE.SkeletonHelper, skeleton:any, clock: THREE.Clock;

export var model:any;

const h = window.innerHeight;
const w = window.innerWidth;

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);

  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  const fov = 75;
  const asratio = w / h;
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, asratio, near, far);
  camera.position.z = 3;
  camera.position.y = 2;

  scene = new THREE.Scene();
  controls = new OrbitControls(camera, renderer.domElement);

  scene.background = new THREE.Color("rgb(255, 255, 255)");

  // const light = new THREE.PointLight(0xffffff, 50);
  // light.position.set(0.8, 1.4, 1.0);
  // scene.add(light);

  const ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  const dirlight = new THREE.DirectionalLight("rgb(255, 255, 255)", 1);
  scene.add(dirlight);
  const axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper)


}

function loadmodel() {
  const gltfloader = new GLTFLoader();

  gltfloader.load("assets/bian.glb", (gltf) => {
    model = gltf.scene;
    scene.add(model);

    model.traverse((object:any) => {
      

      if (object.type === "SkinnedMesh") {
        skeleton = object.skeleton;
        console.log("Found skeleton:", skeleton);
      }
      // if (object.isMesh) {
      //  skeleton=object.skeleton
      //  console.log(skeleton)
      // }
    });
    skeltonhelper = new THREE.SkeletonHelper(gltf.scene);
    scene.add(skeltonhelper);
  });
}

export function change(target:any[]) {
 
  const axesHelper = new THREE.AxesHelper(1);

 
  const leftUpperArm = model.getObjectByName(poseBones.leftUpperArm);

  leftUpperArm.add(axesHelper);


  let localDirection1 = new THREE.Vector3(0, 1, 0);
  let targetDirection = new THREE.Vector3(target[0][0], target[0][1], target[0][2]);
  let current=localDirection1.clone().applyQuaternion(leftUpperArm.quaternion)
  current.normalize();

  console.log("before",current)
 
  var rotationq=new THREE.Quaternion()
 
  


  rotationq.setFromUnitVectors(current,targetDirection)
  leftUpperArm.quaternion.premultiply(rotationq)
  leftUpperArm.quaternion.normalize()

  console.log("after",localDirection1.clone().applyQuaternion(leftUpperArm.quaternion).normalize())

}



function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (model) {
    model.updateMatrixWorld(true);
    skeleton.update(clock.getDelta());
   
  }
  controls.update();
}
init();
loadmodel();

animate();
