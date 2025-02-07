import { change } from "./main";

var isAnimating=true
 function callapi() {
    fetch('http://127.0.0.1:5000/')
  .then(response => response.json())
  .then(data => plotpoint(data))
  .catch(error => console.error('Error:', error));
}

function plotpoint(values:any){
    var landmarks=Object.keys(values).map((key)=>{
        return values[key]
    })
    console.log(landmarks)
    //  updatePointsfromapi(landmarks)
    change(landmarks)
   
    if (isAnimating) {
       
        requestAnimationFrame(callapi)
    }
    
}

export function starter(){
    if (isAnimating) {
       
        requestAnimationFrame(callapi)
    }
}


const btn=document.getElementById("call")
btn?.addEventListener("click",function () {
    isAnimating=false
   
})
const btn1=document.getElementById("start")
btn1?.addEventListener("click",starter)