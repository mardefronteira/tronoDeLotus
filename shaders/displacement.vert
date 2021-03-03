#ifdef GL_ES
precision mediump float;
#endif

// coordenadas do pixel
attribute vec3 aPosition;

// coordenadas de texturas vindas do CPU
attribute vec2 aTexCoord;

// variável cópia das coordenadas para transmitir ao .frag
varying vec2 vTexCoord;

void main () {

  // copiar valor das texturas
  vTexCoord = aTexCoord;

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; // doing .xy means we do the same math for both x and y positions

  gl_Position = positionVec4;

}
