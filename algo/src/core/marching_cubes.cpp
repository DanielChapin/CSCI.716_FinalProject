#include "marching_cubes_tables.hpp"
#include <shapes.hpp>
#include <vector>
#include <ostream>

namespace algo
{
    vector<vec3> marchingCubes(vec3 origin, vec3 dims, vec3 interval, const std::function<float(vec3)> &getDensity, float threshold, const std::function<vec3(vec3, float, vec3, float)> &blend)
    {
        vector<vec3> vertices;

        // TODO Shared vertex optimizations
        for (float x = origin.x; x <= origin.x + dims.x; x += interval.x)
        {
            for (float y = origin.y; y <= origin.y + dims.y; y += interval.y)
            {
                for (float z = origin.z; z <= origin.z + dims.z; z += interval.z)
                {
                    vec3 localCorners[8] = {
                        {x, y, z},
                        {x + interval.x, y, z},
                        {x + interval.x, y, z + interval.z},
                        {x, y, z + interval.z},
                        {x, y + interval.y, z},
                        {x + interval.x, y + interval.y, z},
                        {x + interval.x, y + interval.y, z + interval.z},
                        {x, y + interval.y, z + interval.z},
                    };
                    float densities[8] = {
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
                    for (uint8_t i = 0; i < 8; i++)
                    {
                        if (densities[i] <= threshold)
                            cubeIndex |= (1 << i);
                    }

                    for (uint8_t i = 0; triTable[cubeIndex][i] != -1; i += 3)
                    {
                        for (uint8_t j = 0; j < 3; j++)
                        {
                            int a = cornerA[triTable[cubeIndex][i + j]];
                            vec3 vertPosA = localCorners[a];
                            float densityA = densities[a];

                            int b = cornerB[triTable[cubeIndex][i + j]];
                            vec3 vertPosB = localCorners[b];
                            float densityB = densities[b];

                            vec3 combinedVertPos = blend(vertPosA, densityA, vertPosB, densityB);
                            vertices.push_back(combinedVertPos);
                        }
                    }
                }
            }
        }

        return vertices;
    }
}