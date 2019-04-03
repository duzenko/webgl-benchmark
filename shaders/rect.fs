#version 300 es
precision mediump float;

uniform sampler2D uSampler;
uniform float brightness, contrast, saturation;

in vec4 texCoord;
out vec4 FragColor;

void main() {
    FragColor = texture(uSampler, texCoord.xy);
    float b = dot(FragColor.rgb, vec3(1./3.));
    FragColor.rgb = mix(vec3(b), FragColor.rgb, saturation );
    FragColor.rgb = .5 +(FragColor.rgb-.5)*contrast;
    FragColor.rgb += brightness;
}