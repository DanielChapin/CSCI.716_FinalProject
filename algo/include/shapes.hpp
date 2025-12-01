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

    extern mesh_t gen_cube_mesh();
    extern mesh_t gen_circle_mesh(float radius, float scale, vec3 center, float step);
    extern mesh_t gen_terrain_mesh();
}
