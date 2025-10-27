#pragma once

#include <cstdint>

#include <glm/vec3.hpp>

namespace algo
{
    using glm::vec3;
    using std::uint32_t;

    extern float simplex3D(vec3 pos, uint32_t seed);
}