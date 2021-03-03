#ifdef GL_ES
precision mediump float;
#endif

// variáveis a receber do sketch
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// receber variável do arquivo .vert
// varying vec2 vTexCoord;

// ainda não entendi, mas pelo visto tem que ter uma cópia local da variável
// vec2 st = vTexCoord;

void main() {

  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  gl_FragColor = vec4(0.5, u_mouse.x, u_mouse.y, 1.0);

}

vec3 rgb(float r, float g, float b){
  return vec3(r / 255.0, g / 255.0, b / 255.0);
}
