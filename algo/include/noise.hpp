#pragma once

#include <cstdint>

#include <glm/vec3.hpp>

namespace algo
{
    using glm::vec3;
    using std::uint32_t;

    /// @brief Compute 3D simplex noise value at the provided position
    /// @param pos 3D point representing the spatial position
    /// @param seed Seed value for the noise generator
    /// @return Noise value in range [0, 1)
    extern float simplex3D(vec3 pos, uint32_t seed);

    /// @brief Compute 3D noise value (based on simplex noise) at the provided position
    /// @param pos 3D point representing the spatial position
    /// @param seed Seed value for the noise generator
    /// @param scale Start scale for the noise
    /// @param lacunarity How much each successive octave should increase in scale by
    /// @param persistence How much each successive octave should affect the output
    /// @param octaves How many layers of noise to be accumulated 
    /// @return Noise value in range [0, 1)
    extern float noise3D(vec3 pos, uint32_t seed, float scale = 1.0f, float lacunarity = 2.0f, float persistence = 0.5f, uint8_t octaves = 8);
}