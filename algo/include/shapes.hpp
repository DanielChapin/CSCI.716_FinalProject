#pragma once

#include <cstdint>
#include <utility>
#include <vector>

#include <glm/vec3.hpp>

#include <geometry.hpp>

namespace algo
{
    using glm::vec3;

    using std::tuple;
    using std::vector;
    using std::function;

    struct NoiseConfig
    {
        float scale;
        uint32_t octaves;
        float persistence;
        float lacunarity;
    };

    struct FeaturesConfig
    {
        std::string seed;
        NoiseConfig elevation;
        NoiseConfig temperature;
        NoiseConfig humidity;
    };

    struct PlanetConfig
    {
        float radius;
        float elevationScale;
    };

    struct UserConfig
    {
        FeaturesConfig features;
        PlanetConfig planet;
    };

    extern mesh_t gen_circle_mesh(float radius, float scale, vec3 center, float step);
    extern mesh_t gen_terrain_mesh(UserConfig);
}
