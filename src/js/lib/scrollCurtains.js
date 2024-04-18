
import {Curtains, Plane, RenderTarget, Vec2} from 'https://cdn.jsdelivr.net/npm/curtainsjs@7.3.2/src/index.mjs';

window.addEventListener("load", () => {
  const curtains = new Curtains({
    container: "canvas",
    pixelRatio: Math.min(1.5, window.devicePixelRatio),
    premultipliedAlpha: true, // better texture rendering
  });

  const vs = `
    precision mediump float;

    // default mandatory variables
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    uniform mat4 planeTextureMatrix;

    // custom variables
    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;
    varying vec2 vPlaneTextureCoord;

    void main() {
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

      // varyings
      vVertexPosition = aVertexPosition;
      vTextureCoord = aTextureCoord;
      vPlaneTextureCoord = (planeTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    }
  `;

  const fs = `
    precision mediump float;

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;
    varying vec2 vPlaneTextureCoord;

    uniform sampler2D planeTexture;
    uniform sampler2D titleTexture;

    void main( void ) {
      // just display our texture
      vec4 image = texture2D(planeTexture, vPlaneTextureCoord);
      vec4 title = texture2D(titleTexture, vTextureCoord);
      gl_FragColor = mix(image, title, title.a);
    }
  `;

  const planeEls = document.querySelectorAll(".plane");

  const renderTarget = new RenderTarget(curtains);

  const writeTitle = (plane) => {
    if(plane.textures.length > 1) {
        const canvas = plane.textures[1].source;
        const ctx = canvas.getContext("2d");

        const planeBoundinRect = plane.getBoundingRect();

        const htmlPlaneWidth = planeBoundinRect.width;
        const htmlPlaneHeight = planeBoundinRect.height;

        // set sizes
        canvas.width = htmlPlaneWidth;
        canvas.height = htmlPlaneHeight;
        ctx.width = htmlPlaneWidth;
        ctx.height = htmlPlaneHeight;

        // const title = plane.htmlElement.querySelector("h2");
        // const style = window.getComputedStyle(title);

        // font sizes
        // const fontSize = parseFloat(style.fontSize) * curtains.pixelRatio;

      // draw our title with the original style
      // ctx.fillStyle = style.color;
      // ctx.font = style.fontWeight + " " + fontSize + "px " + style.fontFamily;
      // ctx.textAlign = "center";
      // vertical alignment
      // ctx.textBaseline = "center";

      // ctx.strokeStyle = '#ffffff';
      // ctx.lineWidth = 3;
      // ctx.strokeText(title.innerText, canvas.width / 2, canvas.height / 2);

      // ctx.fillText(title.innerText, canvas.width / 2, canvas.height / 2);

      plane.textures[1].needUpdate();
    }
  };

  planeEls.forEach(planeEl => {
    const plane = new Plane(curtains, planeEl, {
      vertexShader: vs,
      fragmentShader: fs,
    });

    const canvas = document.createElement("canvas");
    canvas.setAttribute("data-sampler", "titleTexture");
    plane.loadCanvas(canvas);

    plane.onLoading((texture) => {
      if(texture.sourceType === "canvas") {
        texture.shouldUpdate = false;
        writeTitle(plane);
      }
    }).onAfterResize(function() {
      writeTitle(plane);
    });

    plane.setRenderTarget(renderTarget);
  });


  // perspective plane that will render our scene

  // nb of divisions
  let dividers = 4;
  const definition = 5;
  const vertices = ((dividers * 2) - 1) * definition;

  // AVOID float numbers!
  dividers = parseInt(dividers);

  const perspectiveVs = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    uniform mat4 uTextureMatrix0;

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;

    uniform float uDepth;
    uniform vec2 uScrollPosition;
    uniform float uStrength;
    uniform float uNbDividers;

    void main() {
        vec3 vertexPosition = aVertexPosition;

        vec2 perspVertices = vec2(0.0);

        for(int i = 0; i < ${dividers}; i++) {
            float index = float(i);
            float step = index / uNbDividers;
            float position = index / (uNbDividers - 1.0);

            // uncomment to add the effect along X axis as well (box effect)
            /*if(abs(vertexPosition.x) >= step) {
                perspVertices.x = position;
            }*/

            if(abs(vertexPosition.y) >= step) {
                perspVertices.y = position;
            }
        }

        perspVertices = 1.0 - perspVertices;

        float perspective = min(perspVertices.x, perspVertices.y);

        vertexPosition.z = uStrength * perspective * -uDepth;

        vertexPosition.x += uStrength * uScrollPosition.x * vertexPosition.z / (uDepth * 5.0);
        vertexPosition.y += uStrength * uScrollPosition.y * vertexPosition.z / (uDepth * 5.0);

        gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

        vTextureCoord = aTextureCoord;
        vVertexPosition = vertexPosition;
    }
`;

  const perspectiveFs = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float uDepth;
    uniform vec2 uScrollPosition;

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;

    uniform sampler2D sceneTexture;

    void main() {
        // background layer
        vec4 finalColor = texture2D(sceneTexture, vTextureCoord);

        vec3 normal = vec3(0.0, 0.0, 1.0);
        vec3 lightDir = vec3(1.0, 1.0, -vVertexPosition.z);
        float intensity = dot(normal, lightDir) * 0.5;

        finalColor.rgb -= intensity;

        finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);

        gl_FragColor = finalColor;
    }
`;

  const perspectivePlane = new Plane(curtains, curtains.container, {
    vertexShader: perspectiveVs,
    fragmentShader: perspectiveFs,
    widthSegments: vertices,
    heightSegments: vertices,
    watchScroll: false,
    autoloadSources: false, // do not load curtains webgl canvas as a texture!
    uniforms: {
      depth: {
        name: "uDepth",
        type: "1f",
        value: 0.1,
      },
      scrollPosition: {
        name: "uScrollPosition",
        type: "2f",
        value: new Vec2(),
      },
      nbDividers: {
        name: "uNbDividers",
        type: "1f",
        value: dividers,
      },
      strength: {
        name: "uStrength",
        type: "1f",
        value: 0,
      }
    },
  });

  perspectivePlane.createTexture({
    sampler: "sceneTexture",
    fromTexture: renderTarget.getTexture()
  });

  let scrollStrength = 0;
  let scrollEnded;

  perspectivePlane.onRender(() => {
    const strength = curtains.lerp(perspectivePlane.uniforms.strength.value, scrollStrength, 0.1);
    perspectivePlane.uniforms.strength.value = strength;
  });

  curtains.onScroll(() => {
    const deltas = curtains.getScrollDeltas();

    // clamp value
    scrollStrength = Math.max(-0.5, Math.min(deltas.y / 40, 0.5));

    // reset to 0 when scroll is finished
    if(scrollEnded) {
      clearTimeout(scrollEnded);
    }

    scrollEnded = setTimeout(() => {
      scrollStrength = 0;
    }, 30);
  });
});
