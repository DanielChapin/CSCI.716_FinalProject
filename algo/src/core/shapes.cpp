
// Precompiled
#include <algo_pch.hpp>
//

#include <shapes.hpp>
#include <marching_cubes.hpp>
#include <noise.hpp>

#include <numeric>

#include <glm/geometric.hpp>

namespace algo
{
    using glm::vec3;
    using namespace std::views;

    mesh_t gen_circle_mesh(float radius, float scale, vec3 center, float step)
    {
        vec3 dims(scale * radius);
        vec3 origin = center - dims / vec3{2};
        vec3 interval(radius * step);

        auto getDensity = [&center, &radius](vec3 pos)
        {
            return glm::distance(pos, center) - radius;
        };

        auto verts = marchingCubes(origin, dims, interval, getDensity, 0, blendVec3Linear);
        vector<uint32_t> idxs(verts.size());
        std::iota(idxs.begin(), idxs.end(), 0);

        vector<vec3> colors;
        colors.reserve(verts.size());
        colors.append_range(repeat(vec3{ 0, 1, 1 }, verts.size()));
        return { verts, colors, idxs };
    }

    mesh_t gen_terrain_mesh()
    {
        // TODO: Parameterize these
        const float scale = 3;
        const vec3 center = vec3{0.0};
        mesh_t mesh = gen_circle_mesh(1, scale, center, 0.01);

        for (vec3& v : mesh.verts)
        {
            float noise = glm::clamp(noise3D(v, 0, 4), 0.35f, 1.0f);
            float smooth = glm::smoothstep(0.f, 1.f, noise);
            float jitter = smooth * smooth * .05f;
            // TODO: Our marching cubes should generate smooth normals for irregular shapes?
            vec3 normal = glm::normalize(v - center);
            v += jitter * normal;
        }

        return mesh;
    }
}
