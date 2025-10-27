#include "glm/vec3.hpp"
#include "geometry.hpp"

namespace algo
{
    using glm::vec3;
    using std::vector;

    vector<vec3> marchingCubes(vec3 origin, vec3 dims, vec3 interval, const std::function<float(vec3)> &getDensity, float threshold, const std::function<vec3(vec3, float, vec3, float)> &blend);
} // namespace algo
