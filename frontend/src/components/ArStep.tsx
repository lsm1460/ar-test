function ArStep() {
  const handleButtonClick = () => {
    console.log("test");
  };

  return (
    <div>
      <div className="arjs-loader">
        <div>Loading, please wait...</div>
      </div>
      <a-scene
        vr-mode-ui="enabled: false;"
        renderer="logarithmicDepthBuffer: true;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: true;"
      >
        <a-nft
          type="nft"
          url="/nft/pinball"
          smooth="true"
          smoothCount="10"
          smoothTolerance="0.01"
          smoothThreshold="5"
        >
          <a-entity
            gltf-model="http://59.6.9.44:3001/Flamingo.glb"
            scale="5 5 5"
            position="100 100 -160"
          ></a-entity>
        </a-nft>
        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
}

export default ArStep;
