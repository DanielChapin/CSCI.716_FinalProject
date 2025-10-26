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
    using std::uint8_t;

    extern vec3 gen_vec3();

    extern pair<vector<vec3>, vector<uint8_t>> gen_cube_mesh();
}
