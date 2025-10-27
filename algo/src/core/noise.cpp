
// Precompiled
#include <algo_pch.hpp>
//

#include <noise.hpp>
#include <spatial_random.hpp>

namespace algo
{
    using glm::vec3;
    using glm::vec4;
    using std::array;

    // We have a template of preset gradients that we will
    // associate at random with every point on our simplex lattice.
    // This is generally better than using random values as the output
    // will appear more organic and natural
    // 
    static const constinit auto GRADIENTS_3D = array
    {
        vec3{ 1.,  1.,  0.},
        vec3{-1.,  1.,  0.},
        vec3{ 1., -1.,  0.},
        vec3{-1., -1.,  0.},
        vec3{ 1.,  0.,  1.},
        vec3{-1.,  0.,  1.},
        vec3{ 1.,  0., -1.},
        vec3{-1.,  0., -1.},
        vec3{ 0.,  1.,  1.},
        vec3{ 0., -1.,  1.},
        vec3{ 0.,  1., -1.},
        vec3{ 0., -1., -1.}
    };

    static constexpr float UNSKEW = 1.f / 3.f;
    static constexpr float SKEW = 1.f / 6.f;

    static constexpr float attenuate(vec3 pos)
    {
        // Radially symmetric 4D attenuation function:
        //      f(x, y, z) = (0.6 - x^2 + y^2 + z^2)^4
        // 
        // This is taken from https://cgvr.cs.uni-bremen.de/teaching/cg_literatur/simplexnoise.pdf
        // Though it is not extremely important what function we use as long as it is
        // radially symmetric and it can guarantee that it reaches 0 just before the boundary
        // of our simplices.
        // 
        return glm::pow(glm::max(0.f, 0.6f - glm::dot(pos, pos)), 4.f);
    }

    float simplex3D(vec3 pos, uint32_t seed)
    {
        // We have some position in our UV coordinate space of equilateral simplices
        // so we unskew it to map it into our hypercube space
        float unskew = (pos.x + pos.y + pos.z) * UNSKEW;

        // We can now get the origin point of our hypercube
        vec3 origin = glm::floor(pos + unskew);
        
        // We need to calculate the four direction vectors pointing from each
        // vertex of our 3D simplex to our original point
        float skew = (origin.x + origin.y + origin.z) * SKEW;
        vec3 dir0 = pos - (origin - skew);
        
        // Based on the ordering of the components in our position,
        // we can determine which particular simplex of our 3D hypercube
        // our point is in, and thus know which midpoints to use.
        // There are n! (6) total orderings (and simplices) for n-dimensions
        // 
        // Example:
        //      x > y > z     means our simplex in hypercube space has the following vertices:
        //      (0, 0, 0) -> (1, 0, 0) -> (1, 1, 0) -> (1, 1, 1)
        //
        vec3 mid1;
        vec3 mid2;
        if (dir0.x > dir0.y)
        {
            if (dir0.y > dir0.z) { /* x > y > z */ mid1 = { 1, 0, 0 }; mid2 = { 1, 1, 0 }; }
            else if (dir0.x > dir0.z) { /* x > z > y */ mid1 = { 1, 0, 0 }; mid2 = { 1, 0, 1 }; }
            else { /* z > x > y */ mid1 = { 0, 0, 1 }; mid2 = { 1, 0, 1 }; }
        }
        else
        {
            if (dir0.x > dir0.z) { /* y > x > z */ mid1 = { 0, 1, 0 }; mid2 = { 1, 1, 0 }; }
            else if (dir0.y > dir0.z) { /* y > z > x */ mid1 = { 0, 1, 0 }; mid2 = { 0, 1, 1 }; }
            else { /* z > y > x */ mid1 = { 0, 0, 1 }; mid2 = { 0, 1, 1 }; }
        }
        
        // Now we can figure out what each of the direction vectors are
        vec3 dir1 = dir0 - mid1 + 1.f * SKEW;
        vec3 dir2 = dir0 - mid2 + 2.f * SKEW;
        vec3 dir3 = dir0 - 1.f + 3.f * SKEW;

        // Now we select random gradients associated with each vertex
        static constinit auto LEN = static_cast<float>(GRADIENTS_3D.size());
        vec3 grad0 = GRADIENTS_3D[static_cast<size_t>(rand(origin, seed) * LEN)];
        vec3 grad1 = GRADIENTS_3D[static_cast<size_t>(rand(origin + mid1, seed) * LEN)];
        vec3 grad2 = GRADIENTS_3D[static_cast<size_t>(rand(origin + mid2, seed) * LEN)]; 
        vec3 grad3 = GRADIENTS_3D[static_cast<size_t>(rand(origin + 1.f, seed) * LEN)];

        // We calculate the contributions from each vertex now given our
        // initial point. We use an attenuation function that ensures
        // each contribution reaches 0 at the simplex boundary
        vec4 contribution;
        contribution.x = attenuate(dir0) * glm::dot(grad0, dir0);
        contribution.y = attenuate(dir1) * glm::dot(grad1, dir1);
        contribution.z = attenuate(dir2) * glm::dot(grad2, dir2);
        contribution.w = attenuate(dir3) * glm::dot(grad3, dir3);

        // The following is based on the selected attenuation function and the gradients
        // Convert the value to the range [0, 1)
        return (glm::dot(contribution, vec4(32.f)) + 1.f) / 2.f;
    }

    float noise3D(vec3 pos, uint32_t seed, float scale = 1.0f, float lacunarity = 2.0f, float persistence = 0.5f, uint8_t octaves = 8)
    {
        float result = 0.f;
        float result_max = 0.f;
        float effective_scale = scale;
        float effective_mag = 1.f;

        for (uint8_t octave = 0; octave < octaves; ++octave)
        {
            result += simplex3D(pos * effective_scale, seed) * effective_mag;
            result_max += effective_mag;
            effective_scale *= lacunarity;
            effective_mag *= persistence;
        }

        return result / result_max;
    }
}