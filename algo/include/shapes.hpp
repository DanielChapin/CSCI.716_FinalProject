#pragma once

#include <cstdint>
#include <utility>
#include <vector>

#include <glm/vec3.hpp>

namespace algo
{
    using glm::vec3;

    using std::pair;
    using std::vector;
    using std::function;

    using mesh_t = pair<vector<vec3>, vector<uint32_t>>;

    extern mesh_t gen_cube_mesh();
    extern mesh_t gen_circle_mesh();
    extern mesh_t gen_circle_mesh(const function<float(vec3)>& jitter_generator);
    extern mesh_t gen_terrain_mesh();
}
