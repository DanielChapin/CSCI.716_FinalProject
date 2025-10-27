#pragma once

#include <cstdint>

#include <glm/vec2.hpp>
#include <glm/vec3.hpp>
#include <glm/vec4.hpp>

namespace algo
{
    using glm::vec2;
    using glm::vec3;
    using glm::vec4;
    using std::uint32_t;

    extern float rand(vec4 pos, uint32_t seed);
    extern float rand(vec3 pos, uint32_t seed);
    extern float rand(vec2 pos, uint32_t seed);
}
