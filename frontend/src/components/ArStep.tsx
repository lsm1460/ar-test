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

  const helpMeanShift = (_width: number, _height: number) => {
    const template = cv.imread("target");
    const hsvRoi = new cv.Mat();
    const mask = new cv.Mat();
    const dst = new cv.Mat(); // 이미지 트래킹을 위한 타겟 이미지 변환 처리의 최종 결과물

    cv.cvtColor(template, hsvRoi, cv.COLOR_RGBA2RGB);
    cv.cvtColor(hsvRoi, hsvRoi, cv.COLOR_RGB2HSV);
    const lowScalar = new cv.Scalar(30, 30, 0);
    const highScalar = new cv.Scalar(180, 180, 180);
    const low = new cv.Mat(hsvRoi.rows, hsvRoi.cols, hsvRoi.type(), lowScalar);
    const high = new cv.Mat(
      hsvRoi.rows,
      hsvRoi.cols,
      hsvRoi.type(),
      highScalar
    );
    cv.inRange(hsvRoi, low, high, mask);
    const roiHist = new cv.Mat();
    const hsvRoiVec = new cv.MatVector();
    hsvRoiVec.push_back(hsvRoi);
    cv.calcHist(hsvRoiVec, [0], mask, roiHist, [180], [0, 180]);
    cv.normalize(roiHist, roiHist, 0, 255, cv.NORM_MINMAX);

    hsvRoi.delete();
    mask.delete();
    low.delete();
    high.delete();
    hsvRoiVec.delete();

    const hsv = new cv.Mat(_height, _width, cv.CV_8UC3);
    const hsvVec = new cv.MatVector();
    hsvVec.push_back(hsv);

    return [dst, hsv, hsvVec, roiHist];
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
    const [dst, hsv, hsvVec, roiHist] = helpMeanShift(width, height);

    const termCrit = new cv.TermCriteria(
      cv.TermCriteria_EPS | cv.TermCriteria_COUNT,
      10,
      1
    );

    const capture = new cv.VideoCapture(videoEl);

    const frame = new cv.Mat(height, width, cv.CV_8UC4);

    const processe = () => {
      capture.read(frame);

      cv.cvtColor(frame, hsv, cv.COLOR_RGBA2RGB);
      cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);
      const trackWindow = new cv.Rect(0, 0, 500, 500);
      cv.calcBackProject(hsvVec, [0], roiHist, dst, [0, 180], 1);

      cv.imshow("output", hsv);
      // @ts-ignore
      const [score, _pos] = cv.meanShift(dst, trackWindow, termCrit);

      console.log("_res", score, JSON.stringify(_pos));

      requestAnimationFrame(processe);
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
      <canvas
        id="output"
        style={{
          width: "100%",
          height: "50vh",
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      ></canvas>
      {isLoading ? (
        <div>Loading, please wait...</div>
      ) : (
        <video ref={videoElRef} style={{ width: "100%", height: "100dvh" }} />
      )}
    </div>
  );
}

export default ArStep;
