import { THREEx } from "@ar-js-org/ar.js-threejs";
import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function ArStep() {
  useEffect(() => {
    THREEx.ArToolkitContext.baseURL = "./";

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: "mediump",
    });

    const clock = new THREE.Clock();

    const mixers: THREE.AnimationMixer[] = [];

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setClearColor(new THREE.Color("lightgrey"), 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0px";
    renderer.domElement.style.left = "0px";
    document.body.appendChild(renderer.domElement);

    // init scene and camera
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    const arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: "webcam",
      sourceWidth: 480,
      sourceHeight: 640,
    });

    arToolkitSource.init(
      () => {
        // use a resize to fullscreen mobile devices
        setTimeout(() => {
          onResize();
        }, 1000);
      },
      (_e: Error) => {
        // alert(`test.${_e.message}`);
      }
    );

    // handle resize
    window.addEventListener("resize", () => {
      onResize();
    });

    // listener for end loading of NFT marker
    window.addEventListener("arjs-nft-loaded", (ev) => {
      //   alert("nft-load..");
    });

    const onResize = () => {
      arToolkitSource.onResizeElement();
      arToolkitSource.copyElementSizeTo(renderer.domElement);
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    };

    // initialize arToolkitContext

    // create atToolkitContext
    const arToolkitContext = new THREEx.ArToolkitContext({
      detectionMode: "mono",
      canvasWidth: 480,
      canvasHeight: 640,
      cameraParametersUrl: "/data/camera_para.dat",
    });

    // initialize it
    arToolkitContext.init(() => {
      // copy projection matrix to camera
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    // init controls for camera
    const markerControls = new THREEx.ArMarkerControls(
      arToolkitContext,
      camera,
      {
        type: "nft",
        descriptorsUrl: "/nft/pinball",
        changeMatrixMode: "cameraTransformMatrix",
      }
    );

    scene.visible = false;

    const root = new THREE.Object3D();
    scene.add(root);

    const threeGLTFLoader = new GLTFLoader();
    let model: any;

    threeGLTFLoader.load("/Flamingo.glb", (gltf) => {
      model = gltf.scene.children[0];
      model.name = "Flamingo";
      const clips = gltf.animations;

      const animation = gltf.animations[0];
      const mixer = new THREE.AnimationMixer(gltf.scene);
      mixers.push(mixer);
      const clip = THREE.AnimationClip.findByName(clips, "flamingo_flyA_");
      const action = mixer.clipAction(clip);
      action.play();

      root.matrixAutoUpdate = false;
      root.add(model);

      model.position.z = -160;
      //model.position.z = 100;

      window.addEventListener("arjs-nft-init-data", (nft: any) => {
        const msg = nft.detail;
        model.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0; //y axis
        model.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0; //x axis
      });

      const animate = function () {
        requestAnimationFrame(animate);

        if (mixers.length > 0) {
          for (let i = 0; i < mixers.length; i++) {
            mixers[i].update(clock.getDelta());
          }
        }

        if (!arToolkitSource.ready) {
          return;
        }

        arToolkitContext.update(arToolkitSource.domElement);

        // update scene.visible if the marker is seen
        scene.visible = camera.visible;

        renderer.render(scene, camera);
      };

      requestAnimationFrame(animate);
    });
  }, []);

  return (
    <div className="arjs-loader">
      {/*arjs에서 로딩이 완료되면 사라지도록 약속되어 있는 클레스*/}
      <div className="arjs-loader-spinner"></div>
    </div>
  );
}

export default ArStep;
