#ifndef GL_ES
    #version 300 es
#endif

precision mediump float;

struct NoiseConfig
{
    float scale;
    float persistence;
    float lacunarity;
    int octaves;
};

struct FeaturesConfig
{
    int seed;
    float waterLevel;
    NoiseConfig elevation;
    NoiseConfig temperature;
    NoiseConfig humidity;
};

uniform FeaturesConfig u_FeaturesConfig;

float noise3D(vec3 pos, int seed, float scale, float lac, float pers, int octs);

float calcElevation(vec3 pos)
{
    float elevation = noise3D(
        pos, 
        u_FeaturesConfig.seed, 
        u_FeaturesConfig.elevation.scale, 
        u_FeaturesConfig.elevation.lacunarity, 
        u_FeaturesConfig.elevation.persistence, 
        u_FeaturesConfig.elevation.octaves);

    elevation = clamp(elevation, u_FeaturesConfig.waterLevel, 1.);
    elevation = smoothstep(0., 1., elevation);
    return elevation;
}

float calcTemperature(vec3 pos)
{
    return noise3D(
        pos, 
        u_FeaturesConfig.seed + 1, 
        u_FeaturesConfig.temperature.scale, 
        u_FeaturesConfig.temperature.lacunarity, 
        u_FeaturesConfig.temperature.persistence, 
        u_FeaturesConfig.temperature.octaves);
}

float calcHumidity(vec3 pos)
{
    return noise3D(
        pos, 
        u_FeaturesConfig.seed + 2, 
        u_FeaturesConfig.humidity.scale, 
        u_FeaturesConfig.humidity.lacunarity, 
        u_FeaturesConfig.humidity.persistence, 
        u_FeaturesConfig.humidity.octaves);
}