import { element } from "three/tsl";
import { change } from "./main";

var isAnimating = true;
function callapi() {
  fetch("http://127.0.0.1:5000/")
    .then((response) => response.json())
    .then((data) => plotpoint(data))
    .catch((error) => console.error("Error:", error));
}

function plotpoint(values: any) {
  var landmarks = Object.keys(values).map((key) => {
    return values[key];
  });
  // console.log(landmarks)
  //  updatePointsfromapi(landmarks)
  change(landmarks);

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
    change(element);
  }
}
