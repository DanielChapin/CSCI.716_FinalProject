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

uniform float u_elevScale;
uniform float u_tempScale;
uniform float u_humiScale;

uniform int u_elevOctaves;
uniform int u_tempOctaves;
uniform int u_humiOctaves;

uniform float u_elevPersistence;
uniform float u_tempPersistence;
uniform float u_humiPersistence;

uniform float u_elevLac;
uniform float u_tempLac;
uniform float u_humiLac;

uniform int u_seed;

float noise3D(vec3 pos, int seed, float scale, float lac, float pers, int octs);

bool contained(Biome b, vec3 pt)
{
    return b.min.x < pt.x && pt.x <= b.max.x &&
           b.min.y < pt.y && pt.y <= b.max.y &&
           b.min.z < pt.z && pt.z <= b.max.z;
}

vec4 frag(vec4 color)
{
    float elevation = noise3D(v2f_posOrig, u_seed, u_elevScale, u_elevLac, u_elevPersistence, u_elevOctaves);
    elevation = clamp(elevation, 0.5, 1.0);
    elevation = smoothstep(0., 1., elevation);

    float temperature = noise3D(v2f_posOrig, u_seed + 1, u_tempScale, u_tempLac, u_tempPersistence, u_tempOctaves);
    float humidity = noise3D(v2f_posOrig, u_seed + 2, u_humiScale, u_humiLac, u_humiPersistence, u_humiOctaves);

    int biome_idx = 0;
    for (int i = 0; i < u_BiomeCount; ++i)
    {
        if (contained(u_Biomes[i], vec3(elevation, temperature, humidity)))
        {
            biome_idx = i;
            break;
        }
    }

    return color * u_Biomes[biome_idx].color;
}