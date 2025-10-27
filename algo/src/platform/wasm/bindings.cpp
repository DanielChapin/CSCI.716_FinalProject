#ifdef SYSTEM_EMSCRIPTEN

// Precompiled
#include <algo_pch.hpp>
//

#include <shapes.hpp>

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

    value_object<vec3>("vec3")
        .field("x", &vec3::x)
        .field("y", &vec3::y)
        .field("z", &vec3::z);

    value_object<pair<vector<vec3>, vector<uint32_t>>>("mesh")
        .field("vertices", &pair<vector<vec3>, vector<uint32_t>>::first)
        .field("indices", &pair<vector<vec3>, vector<uint32_t>>::second);

    register_vector<vec3>("vec3_vector");
    register_vector<std::uint8_t>("uint8_vector");
    register_vector<std::uint16_t>("uint16_vector");
    register_vector<std::uint32_t>("uint32_vector");
}

#endif