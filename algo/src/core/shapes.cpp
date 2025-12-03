
// Precompiled
#include <algo_pch.hpp>
//

#include <shapes.hpp>
#include <marching_cubes.hpp>
#include <biome_map.hpp>
#include <noise.hpp>

#include <numeric>

#include <glm/geometric.hpp>

namespace algo
{
    using glm::vec3;
    using namespace std::views;

    mesh_t gen_circle_mesh(float radius, float scale, vec3 center, float step, MarchingCubesBlendMode blendMode)
    {
        vec3 dims(scale * radius);
        vec3 origin = center - dims / vec3{2};
        vec3 interval(radius * step);

        auto getDensity = [&center, &radius](vec3 pos)
        {
            return glm::distance(pos, center) - radius;
        };

        const function<vec3(vec3, float, vec3, float)> blend =
            (blendMode == MarchingCubesBlendMode::LINEAR)
                ? blendVec3Linear
            : (blendMode == MarchingCubesBlendMode::CUBIC)
                ? blendVec3Cubic
            : (blendMode == MarchingCubesBlendMode::NEAREST)
                ? blendVec3Nearest
                : blendVec3Middle;

        auto verts = marchingCubes(origin, dims, interval, getDensity, 0, blend);
        vector<uint32_t> idxs(verts.size());
        std::iota(idxs.begin(), idxs.end(), 0);

        return { verts, idxs };
    }

    mesh_t get_noise_mesh(float radius, float scale, vec3 center, float step)
    {
        vec3 dims(scale * radius);
        vec3 origin = center - dims / vec3{2};
        vec3 interval(radius * step);

        auto getDensity = [center, radius](vec3 pos)
        {
            float dist = glm::distance(pos, center) - radius;
            float noise = noise3D(pos, 0, 0.5f);
            float dens = 0.375f < noise && noise < 0.625f ? 1 : -1;
            return dist < 0 ? dens : -1;
        };

        auto verts = marchingCubes(origin, dims, interval, getDensity, 0, blendVec3Linear);
        vector<uint32_t> idxs(verts.size());
        std::iota(idxs.begin(), idxs.end(), 0);

        return { verts, idxs };
    } 

    mesh_t gen_terrain_mesh(const UserConfig& config)
    {
        return gen_circle_mesh(config.planet.radius, 3, vec3{0.0f}, 0.03f, config.marchingCubes.blendMode);
    }
}
