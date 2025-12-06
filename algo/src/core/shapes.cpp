
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

        vector<vec3> colors;
        colors.reserve(verts.size());
        colors.append_range(repeat(vec3{0, 1, 1}, verts.size()));
        return {verts, colors, idxs};
    }

    mesh_t gen_terrain_mesh(UserConfig config)
    {
        // TODO: Parameterize these
        const float scale = 3;
        const vec3 center{0.0};
        const std::hash<std::string> hasher;
        const auto seed = static_cast<uint32_t>(hasher(config.features.seed));
        mesh_t mesh = gen_circle_mesh(config.planet.radius, scale, center, config.marchingCubes.interval, config.marchingCubes.blendMode);

        for (auto &&[v, c] : std::views::zip(mesh.verts, mesh.colors))
        {
            float elevation = noise3D(
                v, seed,
                config.features.elevation.scale,
                config.features.elevation.lacunarity,
                config.features.elevation.persistence,
                config.features.elevation.octaves);

            float temperature = noise3D(
                v, seed + 1,
                config.features.temperature.scale,
                config.features.temperature.lacunarity,
                config.features.temperature.persistence,
                config.features.temperature.octaves);

            float humidity = noise3D(
                v, seed + 2,
                config.features.humidity.scale,
                config.features.humidity.lacunarity,
                config.features.humidity.persistence,
                config.features.humidity.octaves);

            elevation = glm::clamp(elevation, 0.35f, 1.0f);
            elevation = glm::smoothstep(0.f, 1.f, elevation);
            float jitter = elevation * elevation * .05f * config.planet.elevationScale;

            // TODO: Our marching cubes should generate smooth normals for irregular shapes?
            vec3 normal = glm::normalize(v - center);
            v += jitter * normal;

            const auto &b = BIOMES.find({elevation, temperature, humidity}, OCEAN);
            c = b.color;
        }

        return mesh;
    }
}
