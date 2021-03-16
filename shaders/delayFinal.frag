precision mediump float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;


void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;

  // get the three webcam feeds
  vec4 cam = texture2D(tex0, uv);
  vec4 cam2 = texture2D(tex1, uv);
  vec4 cam3 = texture2D(tex2, uv);

  // cor cinza da camera 3 + dois canais verde e rosa
  float avgCam3 = (cam3.r+cam3.g+cam3.b) / 3.0;

  vec4 colOut = vec4(avgCam3+cam.r-cam2.r, avgCam3+cam2.g-cam.g, cam3.b, 1.0);

  // render the output
  gl_FragColor = colOut;
}
