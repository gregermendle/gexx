import { useEffect, useRef } from "react";
import { cn } from "~/utils/cn";

export function Graphic({
  className,
  ...props
}: React.HTMLAttributes<HTMLCanvasElement>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.log("WebGL not supported");
      throw new Error("WebGL not supported");
    }

    // Vertex shader program
    const vsSource = `
            attribute vec4 aVertexPosition;
            void main() {
                gl_Position = aVertexPosition;
            }
        `;

    // Fragment shader program (your provided shader)
    const fsSource = `
            precision highp float;

            uniform vec2 resolution;
            uniform vec3 color;
            uniform float time;
            uniform vec2 mouse;

            const float WAVELENGTH = 0.1;
            const float SLIT_SEPARATION = 0.05;
            const float DISTANCE = 0.4;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy/resolution.xy;
                float aspect = resolution.x/resolution.y;
                float y = abs((gl_FragCoord.y / resolution.y) - 0.5);

                vec3 lines = vec3(0., 0., 0.);
                if (mod(gl_FragCoord.y, 4.0) < 1.) {
                  lines = vec3(5., 0.1, 0.0);
                }

                vec2 centered;
                if(aspect > 1.0) {
                    centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
                } else {
                    centered = vec2(uv.x - 0.5, (uv.y - 0.5) / aspect);
                }

                float radius = length(centered * (mouse + vec2(0.4, 0.9)));
                float circle = smoothstep(0.3, 0.0, radius);
                float x = centered.x * 3.0;
                float pathDiff = SLIT_SEPARATION * x / DISTANCE;
                float pattern = 0.5 + 0.5 * cos(
                  2.0 * 3.14159 * pathDiff / WAVELENGTH
                );
                float envelope = exp(-radius * radius * 4.0);
                pattern *= envelope;
                pattern = pow(pattern, 0.4);
                pattern = smoothstep(0.2, 1.0, pattern);
                vec4 color = mix(
                  vec4(0.), 
                  vec4(mix(color, vec3(8., 0., 20.), y) + lines, 1.), 
                  pattern * circle * 0.9
                );
                float r = random(uv + time / 900.0);
                color *= 0.95 + r * 0.6;

                gl_FragColor = color;
            }
        `;

    // Initialize a shader program
    function initShaderProgram(
      gl: WebGLRenderingContext,
      vsSource: string,
      fsSource: string
    ) {
      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)!;
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)!;

      const shaderProgram = gl.createProgram()!;
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        return null;
      }

      return shaderProgram;
    }

    // Create a shader of the given type, upload source and compile it
    function loadShader(
      gl: WebGLRenderingContext,
      type: GLenum,
      source: string
    ) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    // Initialize buffers
    function initBuffers(gl: WebGLRenderingContext) {
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
      );

      return {
        position: positionBuffer,
      };
    }

    // Initialize everything
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)!;
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      },
      uniformLocations: {
        resolution: gl.getUniformLocation(shaderProgram, "resolution"),
        time: gl.getUniformLocation(shaderProgram, "time"),
        mouse: gl.getUniformLocation(shaderProgram, "mouse"),
        color: gl.getUniformLocation(shaderProgram, "color"),
      },
    };

    const buffers = initBuffers(gl);

    // Scrolling
    const r = 0.0;
    const g = 0.8;
    const b = 0.1;

    let mouseX = 1.0;
    let mouseY = 1.0;

    let nextMouseX = 1.0;
    let nextMouseY = 1.0;

    const mouseControl = (e: MouseEvent) => {
      nextMouseX = e.clientX / window.innerWidth;
      nextMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    document.addEventListener("mousemove", mouseControl);

    let prevNow = 0;
    function render(now: number) {
      if (!canvas || !gl) return requestAnimationFrame(render);

      const dt = now - prevNow;
      prevNow = now;
      const timeScale = Math.abs(1 - (dt - 1));
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      const dx = nextMouseX - mouseX;
      const dy = nextMouseY - mouseY;
      mouseX = mouseX + dx * 0.01 * timeScale;
      mouseY = mouseY + dy * 0.01 * timeScale;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(programInfo.program);

      gl.uniform2f(
        programInfo.uniformLocations.resolution,
        canvas.width,
        canvas.height
      );
      gl.uniform1f(programInfo.uniformLocations.time, now * 0.001 * timeScale);
      gl.uniform2f(programInfo.uniformLocations.mouse, mouseX, mouseY);
      gl.uniform3f(programInfo.uniformLocations.color, r, g, b);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    return () => {
      document.removeEventListener("mousemove", mouseControl);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-screen h-screen", className)}
      {...props}
    />
  );
}
