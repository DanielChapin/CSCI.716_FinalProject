in vec3 v2f_pos;

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

bool contained(Biome b, vec3 pt)
{
    return b.min.x < pt.x && pt.x <= b.max.x &&
           b.min.y < pt.y && pt.y <= b.max.y &&
           b.min.z < pt.z && pt.z <= b.max.z;
}