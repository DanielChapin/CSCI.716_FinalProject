
// Precompiled
#include <algo_pch.hpp>
//

#include <shapes.hpp>
#include "marching_cubes.hpp"
#include <numeric>
#include <glm/geometric.hpp>

namespace algo
{
    using glm::vec3;

    vec3 gen_vec3()
    {
        return { 1, 0, 1 };
    }
    
    pair<vector<vec3>, vector<uint32_t>> gen_cube_mesh()
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

    pair<vector<vec3>, vector<uint32_t>> genCircleMesh()
    {
        float radius = 1;
        vec3 origin(-radius);
        vec3 dims(2 * radius);
        vec3 interval(radius / 21);
        vec3 center = origin + dims / vec3(2);

        auto getDensity = [&center, &radius](vec3 pos) -> float
        {
            return glm::distance(pos, center) - radius;
        };

        vector<vec3> verts = marchingCubes(origin, dims, interval, getDensity, 0, blendVec3Linear);
        vector<uint32_t> idxs(verts.size());
        std::iota(idxs.begin(), idxs.end(), 0);

        return { verts, idxs };
    }
}
