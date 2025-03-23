import { io } from "socket.io-client";
import { plotpoint } from "./getdata";
// import { plotpoint } from "./getdata";

class VideoStreamer {
  private socket: any;

  private receivedVideoElement: HTMLImageElement;

  constructor(serverUrl: string, fps: number = 10) {
    this.receivedVideoElement = document.getElementById(
      "receivedVideo"
    ) as HTMLImageElement;
    if (!this.receivedVideoElement) {
      this.receivedVideoElement = document.createElement("img");
      this.receivedVideoElement.id = "receivedVideo";
      document.body.appendChild(this.receivedVideoElement);
    }

    // Connect to Socket.IO server
    this.socket = io(serverUrl, { transports: ["websocket"] });

    // Set up Socket.IO event listeners
    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
      this.stopStream();
    });

    // Handle received frames from server
    this.socket.on("keypoints_vector", (frameData: string) => {
      plotpoint(frameData);
    //   console.log(frameData)
    });
    this.socket.on("frame_processed", (data: string) => {
      this.receivedVideoElement.src = data;
    });
  }

  public startStream() {
    console.log("file")
    this.socket.emit("video_source", "camera");
  }
  public stopStream() {
    console.log("stop")
    this.socket.emit("video_source", "stop");
    this.receivedVideoElement.src = "";
  }

  public disconnect() {
   
    this.socket.disconnect();
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const streamer = new VideoStreamer("http://127.0.0.1:5000");

  // Connect buttons
  document.getElementById("start")?.addEventListener("click", () => {
    streamer.startStream();
  });

  document.getElementById("stop")?.addEventListener("click", () => {
    streamer.stopStream();
  });
});

export default VideoStreamer;
