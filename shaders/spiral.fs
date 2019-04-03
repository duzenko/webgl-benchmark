#version 300 es
precision mediump float;

in vec3 color;
out vec4 FragColor;

void main() {
    FragColor.rgb = color;
    FragColor.a = 1.;
}