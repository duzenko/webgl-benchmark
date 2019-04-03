#version 300 es
uniform vec2 center, size;
out vec4 texCoord;
void main() {
    float a = radians(float(gl_VertexID * 90 + 45));
    gl_Position.x = sin(a);
    gl_Position.y = cos(a);
    texCoord = sign(gl_Position)*-0.5+0.5;
    gl_Position.xy *= sqrt(2.0)*size;
    gl_Position.w = 1.0;
    gl_Position.xy += center;
}