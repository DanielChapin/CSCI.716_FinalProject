#ifndef GL_ES
    #version 300 es
#endif

precision mediump float;

in vec3 v2f_posOrig;

struct Biome 
{
    vec3 min;
    vec3 max;
    vec4 color;
};

#define MAX_BIOMES 5
uniform Biome u_Biomes[MAX_BIOMES];
uniform int u_BiomeCount;

float calcElevation(vec3 pos);
float calcTemperature(vec3 pos);
float calcHumidity(vec3 pos);

bool contained(Biome b, vec3 pt)
{
    return b.min.x < pt.x && pt.x <= b.max.x &&
           b.min.y < pt.y && pt.y <= b.max.y &&
           b.min.z < pt.z && pt.z <= b.max.z;
}

vec4 frag(vec4 color)
{
    float elevation     = calcElevation(v2f_posOrig);
    float temperature   = calcTemperature(v2f_posOrig);
    float humidity      = calcHumidity(v2f_posOrig);

    Biome b = u_Biomes[0];
    for (int i = 0; i < u_BiomeCount; ++i)
    {
        if (contained(u_Biomes[i], vec3(elevation, temperature, humidity)))
        {
            b = u_Biomes[i];
            break;
        }
    }

    return color * b.color;
}