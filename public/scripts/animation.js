window.addEventListener("load", () => {
  // track the mouse positions to send it to the shaders
  const mousePosition = new Vec2();
  // we will keep track of the last position in order to calculate the movement strength/delta
  const mouseLastPosition = new Vec2();

  const deltas = {
    max: 0,
    applied: 0,
  };

  // set up our WebGL context and append the canvas to our wrapper
  const curtains = new Curtains({
    container: "canvas",
    watchScroll: false, // no need to listen for the scroll in this example
    pixelRatio: Math.min(1.5, window.devicePixelRatio), // limit pixel ratio for performance
  });

  setTimeout(() => {
    // handling errors
    curtains
      .onError(() => {
        // we will add a class to the document body to display original images
        document.body.classList.add("no-curtains");
      })
      .onContextLost(() => {
        // on context lost, try to restore the context
        curtains.restoreContext();
      });

    // get our plane element
    const planeElements = document.getElementsByClassName("curtain");

    const vs = `
  precision mediump float;
  // default mandatory variables
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  
  // our texture matrix uniform
  uniform mat4 simplePlaneTextureMatrix;
  // custom variables
  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMousePosition;
  uniform float uMouseMoveStrength;
  void main() {
      vec3 vertexPosition = aVertexPosition;
      // get the distance between our vertex and the mouse position
      float distanceFromMouse = distance(vec2(0.0, 0.0), vec2(vertexPosition.x, vertexPosition.y));
      // calculate our wave effect
      float waveSinusoid = cos(2.5 * (distanceFromMouse - (uTime / 200.0)));
      // attenuate the effect based on mouse distance
      float distanceStrength = 1.0;
      // calculate our distortion effect
      float distortionEffect = distanceStrength * waveSinusoid * 2.0;
      // apply it to our vertex position
      vertexPosition.z +=  distortionEffect / 30.0;
      vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (vertexPosition.x));
      vertexPosition.y +=  distortionEffect / 30.0 * (vertexPosition.y);
      gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 0.75);
      // varyings
      vTextureCoord = (simplePlaneTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
      vVertexPosition = vertexPosition;
  }
`;

    const fs = `
  precision mediump float;
  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;
  uniform sampler2D simplePlaneTexture;
  uniform float uTime;
  void main() {
      // apply our texture
      vec4 finalColor = texture2D(simplePlaneTexture, vTextureCoord);
      // fake shadows based on vertex position along Z axis
      finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
      // fake lights based on vertex position along Z axis
      finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);
      // handling premultiplied alpha (useful if we were using a png with transparency)
      finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
      gl_FragColor = vec4(finalColor.rgb, uTime / 50.0);
  }
`;

    // some basic parameters
    const params = {
      vertexShader: vs,
      fragmentShader: fs,
      widthSegments: 20,
      heightSegments: 20,
      uniforms: {
        resolution: {
          // resolution of our plane
          name: "uResolution",
          type: "2f", // notice this is an length 2 array of floats
          value: [planeElements[0].clientWidth, planeElements[0].clientHeight],
        },
        time: {
          // time uniform that will be updated at each draw call
          name: "uTime",
          type: "1f",
          value: 0,
        },
      },
    };

    // create our plane
    const simplePlane = new Plane(curtains, planeElements[0], params);

    // if there has been an error during init, simplePlane will be null
    simplePlane
      .onReady(() => {
        // set a fov of 35 to reduce perspective (we could have used the fov init parameter)
        simplePlane.setPerspective(35);

        // apply a little effect once everything is ready
        deltas.max = 2;

        // now that our plane is ready we can listen to mouse move event
        const wrapper = document.getElementById("page-wrap");
      })
      .onRender(() => {
        // increment our time uniform
        simplePlane.uniforms.time.value++;
        // simplePlane.style.opacity = simplePlane.uniforms.time.value;
      })
      .onAfterResize(() => {
        const planeBoundingRect = simplePlane.getBoundingRect();
        simplePlane.uniforms.resolution.value = [
          planeBoundingRect.width,
          planeBoundingRect.height,
        ];
      })
      .onError(() => {
        // we will add a class to the document body to display original images
        document.body.classList.add("no-curtains");
      });
  }, 0);
});
