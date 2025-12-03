#pragma once

#include "glm/vec3.hpp"
#include <vector>

namespace algo
{
    using glm::vec3;
    using std::vector;

    vec3 blendVec3Linear(vec3 a, float aWeight, vec3 b, float bWeight);

    struct Vertex
    {
        vec3 pos;
        vec3 norm;
        // TODO Long term this should almost certainly get replaced by a texture map
        vec3 color;

        Vertex(vec3 pos, vec3 norm, vec3 color);
        Vertex(vec3 pos);
    };

    struct Mesh
    {
        vector<vec3> verts; // TODO Replace with our Vertex type
        vector<uint32_t> idxs;
    };

    using mesh_t = Mesh;
}
