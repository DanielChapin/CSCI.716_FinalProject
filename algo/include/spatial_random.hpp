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

    /// @brief Generate random value noise at the specified position
    /// @param pos 4D point representing the spatial position
    /// @param seed Seed value for the noise generator
    /// @return Noise value in range [0, 1)
    extern float rand(vec4 pos, uint32_t seed);

    /// @brief Generate random value noise at the specified position
    /// @param pos 3D point representing the spatial position
    /// @param seed Seed value for the noise generator
    /// @return Noise value in range [0, 1)
    extern float rand(vec3 pos, uint32_t seed);

    /// @brief Generate random value noise at the specified position
    /// @param pos 2D point representing the spatial position
    /// @param seed Seed value for the noise generator
    /// @return Noise value in range [0, 1)
    extern float rand(vec2 pos, uint32_t seed);
}
