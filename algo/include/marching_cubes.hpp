#pragma once

#include <geometry.hpp>
#include <glm/vec3.hpp>
#include <utility>

namespace algo
{
    using glm::vec3;
    using std::pair;
    using std::vector;
    using std::function;

    vector<vec3> marchingCubes(
        vec3 origin, 
        vec3 dims, 
        vec3 interval, 
        const function<float(vec3)> &getDensity, 
        float threshold, 
        const function<vec3(vec3, float, vec3, float)> &blend);
}
