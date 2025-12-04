#ifndef GL_ES
    #version 300 es
#endif

precision mediump float;

uniform float u_elevScale;
uniform int u_elevOctaves;
uniform float u_elevPersistence;
uniform float u_elevLac;
uniform int u_seed;
uniform float u_ElevationScale;

out vec3 v2f_posOrig;

float noise3D(vec3 pos, int seed, float scale, float lac, float pers, int octs);

vec3 vert(vec3 position, vec3 normal)
{
    v2f_posOrig = position;
    float elevation = noise3D(position, u_seed, u_elevScale, u_elevLac, u_elevPersistence, u_elevOctaves);
    float clamped = clamp(elevation, 0.5, 1.0);
    float value = smoothstep(0., 1., clamped);
    float jitter = value * value * u_ElevationScale;
    return position + normal * jitter;
}
