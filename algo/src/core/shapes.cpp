
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

    mesh_t gen_circle_mesh(const function<float(vec3)>& jitter_generator)
    {
        // TODO: Probably could/should parameterize on these?
        float radius = 1;
        float scale = 3.f;
        vec3 origin((scale / 2) * -radius);
        vec3 dims(scale * radius);
        vec3 interval(radius / 60);
        vec3 center = origin + dims / vec3(2);

        auto getDensity = [&center, &radius, &jitter_generator](vec3 pos)
        {
            return glm::distance(pos, center) - (radius + jitter_generator(pos));
        };

        vector<vec3> verts = marchingCubes(origin, dims, interval, getDensity, 0, blendVec3Linear);
        vector<uint32_t> idxs(verts.size());
        std::iota(idxs.begin(), idxs.end(), 0);

        return { verts, idxs };
    }

    mesh_t gen_circle_mesh()
    {
        return gen_circle_mesh([](vec3){ return 0.f; });
    }

    mesh_t gen_terrain_mesh()
    {
        return gen_circle_mesh([](vec3 pos){ return glm::clamp(noise3D(pos, 0, 4.0f, 2.0f, 0.5f, 3), 0.45f, 1.0f) * .15f; });
    }
}
