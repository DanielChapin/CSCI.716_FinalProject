// Precompiled
#include <algo_pch.hpp>
//

#include <marching_cubes_tables.hpp>
#include <shapes.hpp>

namespace algo
{
    using std::pair;
    using std::array;
    using std::vector;
    using std::function;
    using glm::vec3;
    using namespace std::views;

    vector<vec3> marchingCubes(
        const vec3 origin, 
        const vec3 dims, 
        const vec3 interval, 
        const function<float(vec3)> &getDensity, 
        const float threshold, 
        const function<vec3(vec3, float, vec3, float)> &blend)
    {
        vector<vec3> vertices;
        vertices.reserve(1024);

        // TODO Shared vertex optimizations
        for (float x = origin.x; x <= origin.x + dims.x; x += interval.x)
        {
            for (float y = origin.y; y <= origin.y + dims.y; y += interval.y)
            {
                for (float z = origin.z; z <= origin.z + dims.z; z += interval.z)
                {
                    auto localCorners = array
                    {
                        vec3{x, y, z},
                        vec3{x + interval.x, y, z},
                        vec3{x + interval.x, y, z + interval.z},
                        vec3{x, y, z + interval.z},
                        vec3{x, y + interval.y, z},
                        vec3{x + interval.x, y + interval.y, z},
                        vec3{x + interval.x, y + interval.y, z + interval.z},
                        vec3{x, y + interval.y, z + interval.z},
                    };

                    auto densities = array 
                    {
                        getDensity(localCorners[0]),
                        getDensity(localCorners[1]),
                        getDensity(localCorners[2]),
                        getDensity(localCorners[3]),
                        getDensity(localCorners[4]),
                        getDensity(localCorners[5]),
                        getDensity(localCorners[6]),
                        getDensity(localCorners[7]),
                    };

                    size_t cubeIndex = 0;
                    for (uint8_t i = 0; i < densities.size(); i++)
                    {
                        if (densities[i] <= threshold)
                            cubeIndex |= (1 << i);
                    }

                    for (uint8_t i = 0; triTable[cubeIndex][i] != -1; i += 3)
                    {
                        array<vec3, 3> triangle;
                        
                        for (uint8_t j = 0; j < triangle.size(); j++)
                        {
                            int a = cornerA[triTable[cubeIndex][i + j]];
                            vec3 vertPosA = localCorners[a];
                            float densityA = densities[a];

                            int b = cornerB[triTable[cubeIndex][i + j]];
                            vec3 vertPosB = localCorners[b];
                            float densityB = densities[b];

                            vec3 combinedVertPos = blend(vertPosA, densityA, vertPosB, densityB);
                            triangle[j] = combinedVertPos;
                        }

                        // TODO: Calculate smooth normal
                        // vec3 dir = (triangle[1] - triangle[0]) * (triangle[2] - triangle[0]);
                        // vec3 norm = glm::normalize(dir);
                        // vertices.append_range(repeat(norm, 3));

                        vertices.append_range(triangle);
                    }
                }
            }
        }

        return vertices;
    }
}