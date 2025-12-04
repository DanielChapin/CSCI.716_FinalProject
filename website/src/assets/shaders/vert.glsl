#ifndef GL_ES
    #version 300 es
#endif

precision mediump float;

out vec3 v2f_posOrig;

struct PlanetConfig
{
    float heightAmplitude;
    float radius; 
};

uniform PlanetConfig u_PlanetConfig;

float calcElevation(vec3 pos);

vec3 vert(vec3 position, vec3 normal)
{
    v2f_posOrig = position;
    float elevation = calcElevation(position);
    return position + normal * elevation * u_PlanetConfig.heightAmplitude;
}
