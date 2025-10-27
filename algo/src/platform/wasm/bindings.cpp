#ifdef SYSTEM_EMSCRIPTEN

// Precompiled
#include <algo_pch.hpp>
//

#include <shapes.hpp>
#include <noise.hpp>
#include <spatial_random.hpp>

#include <emscripten/bind.h>

EMSCRIPTEN_BINDINGS(algo)
{
    using namespace glm;
    using namespace std;
    using namespace emscripten;

    using namespace algo;

    emscripten::function("gen_vec3", &gen_vec3);
    emscripten::function("gen_cube_mesh", &gen_cube_mesh);
    emscripten::function("genCircleMesh", &genCircleMesh);

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

    value_object<pair<vector<vec3>, vector<uint32_t>>>("mesh")
        .field("vertices", &pair<vector<vec3>, vector<uint32_t>>::first)
        .field("indices", &pair<vector<vec3>, vector<uint32_t>>::second);

    register_vector<vec3>("vec3_vector");
    register_vector<std::uint8_t>("uint8_vector");
    register_vector<std::uint16_t>("uint16_vector");
    register_vector<std::uint32_t>("uint32_vector");
}

#endif