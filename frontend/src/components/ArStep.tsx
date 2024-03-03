import { useEffect, useRef } from "react";
import { useScript } from "../hooks/useScript";

function ArStep() {
  const videoElRef = useRef<HTMLVideoElement>(null);
  const [isLoading] = useScript("/js/opencv.js");

  const handleCamera = async (_width: number, _height: number) => {
    if (!videoElRef.current) {
      return;
    }

    const videoEl = videoElRef.current;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "environment",
        width: _height,
        height: _width,
      },
    });

    videoEl.srcObject = stream;

    return new Promise((resolve) => {
      videoEl.onloadedmetadata = (e) => {
        videoEl.play();

        resolve(true);
      };
    });
  };

  const handleTracking = async () => {
    if (!videoElRef.current) {
      return;
    }

    const videoEl = videoElRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    videoEl.width = width;
    videoEl.height = height; //prevent Opencv.js error.

    await handleCamera(width, height);

    const capture = new cv.VideoCapture(videoEl);

    const frame = new cv.Mat(height, width, cv.CV_8UC4);

    const processe = () => {
      capture.read(frame);
      let templ = cv.imread("target");
      let dst = new cv.Mat();
      let mask = new cv.Mat();

      // Template Matching
      cv.matchTemplate(frame, templ, dst, cv.TM_CCOEFF, mask);
      let result = cv.minMaxLoc(dst, mask);

      console.log("result", result);

      setTimeout(processe, 100); // 실행단위를 쪼개면 좀 나아지지 않을까?
    };

    processe();
  };

  useEffect(() => {
    if (!isLoading && videoElRef.current) {
      handleTracking();
    }
  }, [isLoading, videoElRef]);

  return (
    <div>
      <img src="/pinball.jpg" id="target" style={{ display: "none" }} />
      {isLoading ? (
        <div>Loading, please wait...!</div>
      ) : (
        <video ref={videoElRef} style={{ width: "100%", height: "100dvh" }} />
      )}
    </div>
  );
}

export default ArStep;
