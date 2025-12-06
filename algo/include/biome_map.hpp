#pragma once

#include <glm/vec3.hpp>
#include <glm/vec4.hpp>

#include <string>
#include <vector>

namespace algo
{
    using std::string;
    using std::vector;
    using std::initializer_list;
    using glm::vec3;
    using glm::vec4;

    struct Biome
    {
        string name;
        vec3 min;
        vec3 max;
        vec4 color;

        [[nodiscard]] constexpr bool contains(vec3 pt) const
        {
            return min.x <= pt.x && pt.x < max.x &&
                min.y <= pt.y && pt.y < max.y &&
                min.z <= pt.z && pt.z < max.z;
        }
    };

    class BiomeMap
    {
    private:
        vector<Biome> m_Biomes;

    public:
        constexpr BiomeMap() = default;
        constexpr BiomeMap(const initializer_list<Biome> &biomes)
            : m_Biomes(biomes)
        {}
        
        constexpr void add(const Biome &b) { m_Biomes.push_back(b); }
        [[nodiscard]] constexpr const Biome& find(vec3 pos, const Biome& def) const
        {
            for (const auto& b : m_Biomes)
                if (b.contains(pos))
                    return b;

            return def;
        }
    };

    const float WATER_LEVEL = 0.35f;
    
    // FEATURES:
    // 
    //  x - Elevation
    //  y - Temperature
    //  z - Humidity/Precipitation
    // 
    const Biome OCEAN{ "OCEAN",   { 0,     0,    0    }, { WATER_LEVEL, 1,    1    }, { 0.174f, 0.175f, 1,      1 }};
    const BiomeMap BIOMES = 
    {
        OCEAN,
        Biome{ "BEACH",           vec3{ 0.35f, 0,    0    }, { 0.38f, 1,    1    }, { 0.980f, 0.858f, 0.62f,  1 } },
        Biome{ "FOREST",          vec3{ 0.38f, 0.5f, 0.5f }, { 0.55f, 1,    1    }, { 0.226f, 0.435f, 0.205f, 1 } },
        Biome{ "TAIGA",           vec3{ 0.38f, 0,    0.5f }, { 0.65f, 0.5f, 1    }, { 0.226f, 0.435f, 0.205f, 1 } },
        Biome{ "DESERT",          vec3{ 0.38f, 0,    0    }, { 0.65f, 1,    0.5f }, { 0.830f, 0.554f, 0.202f, 1 } },
        Biome{ "DEEP FOREST",     vec3{ 0.55f, 0.5f, 0.5f }, { 0.65f, 1,    1    }, { 0.004f, 0.210f, 0.004f, 1 } },
        Biome{ "MOUNTAINS",       vec3{ 0.65f, 0,    0    }, { 0.85f, 1,    1    }, { 0.176f, 0.186f, 0.2f,   1 } },
        Biome{ "TUNDRA",          vec3{ 0.85f, 0,    0    }, { 1,     1,    1    }, { 0.718f, 0.923f, 1,      1 } },
    };
}