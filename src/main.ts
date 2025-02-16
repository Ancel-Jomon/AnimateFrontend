import * as THREE from "three";

import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { poseBones } from "./bones";
import { Rotationhistory } from "./rotationhistory";
import { arrowHelper1, arrowHelper2, drawline } from "./vectorvisualize";

var scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls;
var skeltonhelper: THREE.SkeletonHelper, skeleton: any, clock: THREE.Clock;

export var model: any;

const h = window.innerHeight;
const w = window.innerWidth;

const boneRotationHistory = new Rotationhistory();

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
  scene.add(axesHelper);

  scene.add(arrowHelper1);
  scene.add(arrowHelper2);
}

function loadmodel() {
  const gltfloader = new GLTFLoader();

  gltfloader.load("assets/bian.glb", (gltf) => {
    model = gltf.scene;
    scene.add(model);

    model.traverse((object: any) => {
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

export function change(target: any[]) {
  //   const axesHelper = new THREE.AxesHelper(1);

  const leftUpperArm = model.getObjectByName(poseBones.leftUpperArm);
  const leftLowerArm = model.getObjectByName(poseBones.leftLowerarm);

  //   leftUpperArm.add(axesHelper);
  //   leftLowerArm.add(axesHelper)

  
  //   let localDirection = new THREE.Vector3();

  let targetDirection = new THREE.Vector3(
    target[0][0],
    target[0][1],
    target[0][2]
  );

  //   targetDirection.normalize();
  //   targetDirection.multiplyScalar(-1)

 
  
  // let current3=localDirection.subVectors(current2,current1)
  //   let current = getBoneVector(leftUpperArm);
  //

  let localDirection2 = new THREE.Vector3();
  let localDirection3 = new THREE.Vector3();
  let current = new THREE.Vector3();
  leftUpperArm.getWorldPosition(localDirection2);
  leftLowerArm.getWorldPosition(localDirection3);
  current.subVectors(localDirection3, localDirection2);
 
  current.normalize();

  drawline([current.x, current.y, current.z], arrowHelper1, "ddiff");
  drawline(
    [targetDirection.x, targetDirection.y, targetDirection.z],
    arrowHelper2,
    "original"
  );
  // console.log("before", localDirection2);

  //

  let rotationq = new THREE.Quaternion();
  //   const angleToRotate = 0;

  var rotationAxis,
    angleToRotate = 0;

  //   rotationq.setFromUnitVectors(current, targetDirection);

  // console.log(rotationq)
  var prev = boneRotationHistory.getLastRotation(leftUpperArm);
  var axis;
  if (prev == null) {
    axis = targetDirection;
    // angle=angleToRotate

    // boneRotationHistory.addRotation(leftUpperArm, current);

    boneRotationHistory.addRotation(leftUpperArm, targetDirection);

    rotationAxis = new THREE.Vector3()
      .crossVectors(current, targetDirection)
      .normalize();
    angleToRotate = current.angleTo(targetDirection);
    // console.log(angleToRotate,rotationAxis)

    //   console.log(rotationAxis,angleToRotate);
    
  } else {
    axis = prev.axis;
    //    angle=prev.angle
    current=prev.axis
    
    rotationAxis = new THREE.Vector3()
      .crossVectors(current, targetDirection)
      .normalize();
    angleToRotate = current.angleTo(targetDirection);

  }
  rotationq.setFromAxisAngle(rotationAxis, angleToRotate);
  rotationq.normalize();
 

  //   //     // rotationq.conjugate()
 
    if (prev == null || !areVectorsEqual(axis, targetDirection)) {
      // console.log(axis,targetDirection)
      // quat.multiply(rotationq)
      //  console.log("inside")
      console.log( angleToRotate);
      leftUpperArm.quaternion.premultiply(rotationq);
      leftUpperArm.quaternion.normalize();
      leftUpperArm.updateMatrix();
      leftLowerArm.updateMatrix();
      leftLowerArm.updateMatrixWorld(true);

      leftUpperArm.updateMatrixWorld(true);
      boneRotationHistory.addRotation(leftUpperArm, targetDirection);
    }
  

  //   console.log("after",localDirection1.clone().applyQuaternion(leftUpperArm.quaternion).normalize())
}


function areVectorsEqual(
  vec1: THREE.Vector3,
  vec2: THREE.Vector3,
  epsilon = 0.001
) {
  return (
    Math.abs(vec1.x - vec2.x) < epsilon &&
    Math.abs(vec1.y - vec2.y) < epsilon &&
    Math.abs(vec1.z - vec2.z) < epsilon
  );
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
