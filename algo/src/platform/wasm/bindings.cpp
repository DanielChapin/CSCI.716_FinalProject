#ifdef SYSTEM_EMSCRIPTEN

// Precompiled
#include <algo_pch.hpp>
//

#include <shapes.hpp>
#include <noise.hpp>
#include <spatial_random.hpp>
#include <geometry.hpp>

#include <emscripten/bind.h>

EMSCRIPTEN_BINDINGS(algo)
{
    using namespace glm;
    using namespace std;
    using namespace emscripten;

    using namespace algo;

    emscripten::function("gen_circle_mesh", &gen_circle_mesh);
    emscripten::function("gen_terrain_mesh", &gen_terrain_mesh);
    emscripten::function("simplex3D", &simplex3D);
    emscripten::function("noise3D", &noise3D);
    
    emscripten::function("randv4", static_cast<float (*)(vec4, uint32_t)>(&rand));
    emscripten::function("randv3", static_cast<float (*)(vec3, uint32_t)>(&rand));
    emscripten::function("randv2", static_cast<float (*)(vec2, uint32_t)>(&rand));
    
    value_object<vec4>("vec4")
        .field("x", &vec4::x)
        .field("y", &vec4::y)
        .field("z", &vec4::z)
        .field("w", &vec4::w);
    
    value_object<vec3>("vec3")
        .field("x", &vec3::x)
        .field("y", &vec3::y)
        .field("z", &vec3::z);

    value_object<vec2>("vec2")
        .field("x", &vec2::x)
        .field("y", &vec2::y);

    value_object<mesh_t>("Mesh")
        .field("vertices", &mesh_t::verts)
        .field("colors", &mesh_t::colors)
        .field("indices", &mesh_t::idxs);

    value_object<NoiseConfig>("NoiseConfig")
        .field("scale", &NoiseConfig::scale)
        .field("octaves", &NoiseConfig::octaves)
        .field("persistence", &NoiseConfig::persistence)
        .field("lacunarity", &NoiseConfig::lacunarity);

    value_object<FeaturesConfig>("FeaturesConfig")
        .field("elevation", &FeaturesConfig::elevation)
        .field("temperature", &FeaturesConfig::temperature)
        .field("humidity", &FeaturesConfig::humidity)
        .field("seed", &FeaturesConfig::seed);

    value_object<PlanetConfig>("PlanetConfig")
        .field("radius", &PlanetConfig::radius)
        .field("elevationScale", &PlanetConfig::elevationScale);

    value_object<UserConfig>("UserConfig")
        .field("features", &UserConfig::features)
        .field("planet", &UserConfig::planet);
        
    register_vector<vec3>("vec3_vector");
    register_vector<std::uint8_t>("uint8_vector");
    register_vector<std::uint16_t>("uint16_vector");
    register_vector<std::uint32_t>("uint32_vector");
}

#endif