#version 300 es
out vec3 color;
void main() {
    float vertexId = float(gl_VertexID);
    float a = vertexId * 3e-2;
    float r = float(vertexId * 1e-4);
    gl_Position.x = sin(a)*r;
    gl_Position.y = cos(a)*r;
    gl_Position.w = 1.0;
    color = sin(vertexId * vec3(1, 2, 4) * 1e-1)*0.5+0.5;
}