import { changenew } from "./main";

var isAnimating = true;
function callapi() {
  fetch("http://127.0.0.1:5000/")
    .then((response) => response.json())
    .then((data) => plotpoint(data))
    .catch((error) => console.error("Error:", error));
}
const MEDIAPIPE_POSE_BONES=["leftUpperArm-leftLowerArm",
    "leftUpperLeg-leftLowerLeg",
    "rightUpperArm-rightLowerArm",
    "rightUpperLeg-rightLowerLeg",
    "leftLowerLeg-leftAngle",
    "rightLowerLeg-rightAngle",
    "leftLowerArm-leftWrist",
    "rightLowerArm-rightWrist"]
function plotpoint(values: any) {
//   var landmarks: any[] =[]
//   console.log(typeof values)
  //  updatePointsfromapi(landmarks)
  for (let i=0;i<MEDIAPIPE_POSE_BONES.length;i++){
    var key=MEDIAPIPE_POSE_BONES[i]
    const bones=key.split("-")
    // console.log(bones)
    // if(bones[0]=="leftLowerArm" && bones[1]=="leftWrist"){
        changenew(values[key],bones[0],bones[1])
        // orientBoneWithLookAt(bones[0],values[key])
        // orientBoneCorrectly(bones[0],values[key])
    // }
  }

  if (isAnimating) {
    requestAnimationFrame(callapi);
  }
}

export function starter() {
  if (isAnimating) {
    requestAnimationFrame(callapi);
  }
}

const btn = document.getElementById("call");
btn?.addEventListener("click", function () {
  isAnimating = false;
});
const btn1 = document.getElementById("start");
btn1?.addEventListener("click", starter);

async function randompints() {
  var targets = [
    [1, 0, 0],
    [1, 0.2, 0],
    [1, 0.4, 0],
    [1, 0.6, 0],
    [1, 0.8, 0],
    [1, 0.81, 0],
    [1, 0.82, 0],
    [1, 0.83, 0],
    [1, 0.84, 0],
    [1, 0.84, 0],
    [1, 0.85, 0],
    [1, 0.86, 0],
    [1, 1, 0],
    [1, 1, 0],
    [1, 1, 0],
    [1, 1, 0],
    [1, 1, 0],
    [1, 1, 0],
    [1, 1, 0],
  ];
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  for (const element of targets) {
    await sleep(2000);
    console.log(element)
    // change(element);
  }
}
