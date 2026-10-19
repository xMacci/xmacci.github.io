export default class Balatro {
  constructor() {
    this.canvas = document.querySelector('#balatro');

    if (!this.canvas) return;

    this.gl = this.canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });

    if (!this.gl) {
      console.warn('Balatro nécessite WebGL 2.');
      return;
    }

    this.init();
  }

  init() {
    this.config = {
      color1: '#171717',
      color2: '#84cc16',
      color3: '#090909',
      contrast: 5,
      swirl: 0.35,
      speed: 0.35,
      rotationSpeed: -0.15,
      scale: 1.6,
      detail: 7,
      opacity: 0.65,
    };

    this.startTime = performance.now();
    this.frameId = null;
    this.isVisible = !document.hidden;

    this.createShaders();
    this.resize();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas);

    this.handleVisibility = () => {
      this.isVisible = !document.hidden;

      if (this.isVisible) {
        this.startTime = performance.now();
        this.render();
      } else {
        cancelAnimationFrame(this.frameId);
        this.frameId = null;
      }
    };

    document.addEventListener('visibilitychange', this.handleVisibility);

    this.render();
  }

  createShaders() {
    const gl = this.gl;

    const vertexSource = `#version 300 es
      const vec2 pos[3] = vec2[3](
        vec2(-1., -1.),
        vec2(3., -1.),
        vec2(-1., 3.)
      );

      void main() {
        gl_Position = vec4(pos[gl_VertexID], 0., 1.);
      }
    `;

    const fragmentSource = `#version 300 es
      precision highp float;

      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uRotation;
      uniform float uContrast;
      uniform float uSwirl;
      uniform float uScale;
      uniform int uDetail;
      uniform float uOpacity;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;

      out vec4 fragColor;

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        uv.y = 1.0 - uv.y;

        vec2 p = (uv - 0.5) *
          uResolution / length(uResolution);

        float radius = length(p);
        float angle = atan(p.y, p.x);

        angle += uRotation;
        angle -= 20.0 *
          (uSwirl * radius + (1.0 - uSwirl));

        p = radius * vec2(cos(angle), sin(angle));
        p *= 30.0 / uScale;

        vec2 q = p;

        for (int i = 0; i < 8; i++) {
          if (i >= uDetail) break;

          q += sin(max(p.x, p.y)) + p;

          p += 0.5 * vec2(
            cos(5.1123314 + 0.353 * q.y + uTime * 0.131121),
            sin(q.x - 0.113 * uTime)
          );

          p -= cos(p.x + p.y) -
            sin(p.x * 0.711 - p.y);
        }

        float cm = 0.25 * uContrast + 0.5 * uSwirl + 1.2;

        float amount = clamp(
          length(p) * 0.035 * cm,
          0.0,
          2.0
        );

        float c1 = max(
          0.0,
          1.0 - cm * abs(1.0 - amount)
        );

        float c2 = max(
          0.0,
          1.0 - cm * abs(amount)
        );

        float c3 = 1.0 - min(1.0, c1 + c2);

        vec3 color =
          uColor1 * c1 +
          uColor2 * c2 +
          uColor3 * c3;

        color = mix(
          uColor3,
          color,
          clamp(cm * 0.25, 0.0, 1.0)
        );

        float grain = fract(
          52.9829189 * fract(
            dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))
          )
        );

        color += (grain - 0.5) / 255.0;

        // Alpha variable pour laisser voir la vidéo.
        float alpha = clamp(
          max(c1, max(c2, c3)) * uOpacity,
          0.0,
          uOpacity
        );

        fragColor = vec4(color, alpha);
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`Erreur shader Balatro : ${error}`);
      }

      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);

    this.program = gl.createProgram();

    gl.attachShader(this.program, vertex);
    gl.attachShader(this.program, fragment);
    gl.linkProgram(this.program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program));
    }

    gl.useProgram(this.program);

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    this.uniforms = {};

    [
      'uResolution',
      'uTime',
      'uRotation',
      'uContrast',
      'uSwirl',
      'uScale',
      'uDetail',
      'uOpacity',
      'uColor1',
      'uColor2',
      'uColor3',
    ].forEach((name) => {
      this.uniforms[name] = gl.getUniformLocation(this.program, name);
    });

    const color = (hex) => {
      const value = hex.replace('#', '');

      return [
        parseInt(value.slice(0, 2), 16) / 255,
        parseInt(value.slice(2, 4), 16) / 255,
        parseInt(value.slice(4, 6), 16) / 255,
      ];
    };

    const c = this.config;
    const u = this.uniforms;

    gl.uniform3fv(u.uColor1, color(c.color1));
    gl.uniform3fv(u.uColor2, color(c.color2));
    gl.uniform3fv(u.uColor3, color(c.color3));

    gl.uniform1f(u.uContrast, c.contrast);
    gl.uniform1f(u.uSwirl, c.swirl);
    gl.uniform1f(u.uScale, c.scale);
    gl.uniform1i(u.uDetail, c.detail);
    gl.uniform1f(u.uOpacity, c.opacity);

    // Mélange alpha : fond transparent au-dessus de la vidéo.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  }

  resize() {
    const gl = this.gl;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.useProgram(this.program);
    gl.uniform2f(
      this.uniforms.uResolution,
      this.canvas.width,
      this.canvas.height,
    );
  }

  render() {
    if (!this.isVisible || this.frameId !== null) return;

    this.frameId = requestAnimationFrame((now) => {
      this.frameId = null;

      const gl = this.gl;
      const c = this.config;
      const elapsed = (now - this.startTime) / 1000;

      gl.useProgram(this.program);
      gl.bindVertexArray(this.vao);

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(this.uniforms.uTime, elapsed * c.speed);

      gl.uniform1f(
        this.uniforms.uRotation,
        -0.4 + elapsed * c.rotationSpeed * 0.2,
      );

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      this.render();
    });
  }

  destroy() {
    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();

    document.removeEventListener('visibilitychange', this.handleVisibility);

    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteProgram(this.program);
  }
}
