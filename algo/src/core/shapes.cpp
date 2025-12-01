
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

    mesh_t gen_cube_mesh()
    {
        return
        {
            {
                { -0.5f, -0.5f,  0.5f },
                {  0.5f, -0.5f,  0.5f },
                {  0.5f,  0.5f,  0.5f },
                { -0.5f,  0.5f,  0.5f },
    
                {  0.5f, -0.5f,  0.5f },
                {  0.5f, -0.5f, -0.5f },
                {  0.5f,  0.5f, -0.5f },
                {  0.5f,  0.5f,  0.5f },
                
                {  0.5f, -0.5f, -0.5f },
                { -0.5f, -0.5f, -0.5f },
                { -0.5f,  0.5f, -0.5f },
                {  0.5f,  0.5f, -0.5f },
    
                { -0.5f, -0.5f, -0.5f },
                { -0.5f, -0.5f,  0.5f },
                { -0.5f,  0.5f,  0.5f },
                { -0.5f,  0.5f, -0.5f },
    
                { -0.5f,  0.5f,  0.5f },
                {  0.5f,  0.5f,  0.5f },
                {  0.5f,  0.5f, -0.5f },
                { -0.5f,  0.5f, -0.5f },
    
                { -0.5f, -0.5f, -0.5f },
                {  0.5f, -0.5f, -0.5f },
                {  0.5f, -0.5f,  0.5f },
                { -0.5f, -0.5f,  0.5f },
            },
            {
                0 , 1 , 2 , 2 , 3 , 0 ,    // front
                4 , 5 , 6 , 6 , 7 , 4 ,    // right
                8 , 9 , 10, 10, 11, 8 ,    // back
                12, 13, 14, 14, 15, 12,    // left
                16, 17, 18, 18, 19, 16,    // up
                20, 21, 22, 22, 23, 20,    // down
            }
        };
    }

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

        return { verts, idxs };
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
