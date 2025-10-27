#include "geometry.hpp"

namespace algo
{
    using glm::vec3;

    vec3 blendVec3Linear(vec3 a, float aWeight, vec3 b, float bWeight)
    {
        if (aWeight < 0.00001)
            return a;
        if (bWeight < 0.00001)
            return b;
        if (std::abs(aWeight - bWeight) < 0.00001)
            return a;

        float u = -aWeight / (bWeight - aWeight);
        return a + u * (b - a);
    }

    Vertex::Vertex(vec3 pos, vec3 norm, vec3 color)
        : pos(pos), norm(norm), color(color)
    {
    }

    Vertex::Vertex(vec3 pos)
        : pos(pos), norm({0, 0, 0})
    {
        color = static_cast<int>(pos.x + pos.y + pos.z) % 2 == 0 ? vec3(0, 0, 0) : vec3(1, 0, 0.84);
    }
} // namespace algo
