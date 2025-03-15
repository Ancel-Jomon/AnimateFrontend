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
        determineDefaultDirections(skeleton);
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

export function changenew(target: any[], parent: string, child: string) {
  const parentBone = model.getObjectByName(poseBones[parent]);
  // const childBone = model.getObjectByName(poseBones[child]);

  let targetDirection = new THREE.Vector3(target[0], target[1], target[2]);

  if (parent == "leftUpperLeg") {
    drawline(
      [targetDirection.x, targetDirection.y, targetDirection.z],
      arrowHelper2,
      "original"
    );
  }
  // Default bone direction
  const _tempQuat = new THREE.Quaternion();
  const _tempMatrix = new THREE.Matrix4();

  _tempMatrix.copy(parentBone.parent.matrixWorld).invert();
  _tempMatrix.extractRotation(_tempMatrix); // Only keep rotation
  targetDirection.applyMatrix4(_tempMatrix);

  calculateRotationToTarget(targetDirection, _tempQuat, parent);

  if (parent == "leftUpperLeg") {
    drawline(
      [targetDirection.x, targetDirection.y, targetDirection.z],
      arrowHelper1,
      "original"
    );
  }

  parentBone.quaternion.slerp(_tempQuat, 0.4);
}

function calculateRotationToTarget(
  direction: THREE.Vector3Like,
  resultQuat: THREE.Quaternion,
  name: string
) {
  const parentBone = model.getObjectByName(poseBones[name]);

  const _defaultDir = new THREE.Vector3(0, 1, 0);
  const normalizedDirection = new THREE.Vector3(direction.x, direction.y, direction.z).normalize();

//   const axis = new THREE.Vector3();
//   axis.crossVectors(_defaultDir, direction).normalize();
//   const angle = Math.acos(_defaultDir.dot(direction));

//   resultQuat.setFromAxisAngle(axis, angle);

    resultQuat.setFromUnitVectors(_defaultDir,normalizedDirection)

  if (name == "leftUpperLeg" || name=="rightUpperLeg") {
    // resultQuat.setFromUnitVectors(new THREE.Vector3(0,1,0),normalizedDirection)
    // resultQuat.multiplyQuaternions(new THREE.Quaternion(0,0,1,0),resultQuat)
    // resultQuat.multiplyQuaternions(resultQuat,new THREE.Quaternion(0,-1,0,0))
    // resultQuat.invert()

    const correctionQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    resultQuat.multiply(correctionQuat);
  }

  
}

// Create a map of bone-specific default directions (if they differ from y-axis)
const boneDefaultDirections = new Map();

// Determine the actual default direction of each bone in your skeleton
function determineDefaultDirections(skeleton: {
  pose: () => void;
  bones: any[];
}) {
  // Reset the skeleton to its bind pose first
  skeleton.pose();

  skeleton.bones.forEach((bone) => {
    // Create a local-to-world direction
    const worldDir = new THREE.Vector3(0, 1, 0).applyMatrix4(bone.matrixWorld);

    // Store this direction
    boneDefaultDirections.set(bone.uuid, worldDir);
    // if (bone.name == "CC_Base_R_Calf") {
    //   drawline([worldDir.x, worldDir.y, worldDir.z], arrowHelper2, "original");
    // }
    // You can also visualize this with arrows for debugging
    // const arrow = new THREE.ArrowHelper(worldDir, bone.getWorldPosition(new THREE.Vector3()), 1, 0xff0000);
    // scene.add(arrow);
  });
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
