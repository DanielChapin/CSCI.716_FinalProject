
// Precompiled
#include <algo_pch.hpp>
//

#include <spatial_random.hpp>
#include <random>

namespace algo
{
    using std::array;

    static constexpr uint32_t IEEE_754_MANTISSA_MASK = 0x007fffff;
    static constexpr uint32_t IEEE_754_ONE = 0x3f800000;
    static constexpr uint32_t HASH_INIT_VALUE = 0xDEADBEEF;

    template<size_t S>
    static constexpr uint32_t jenkins_hash(array<uint32_t, S> data)
    {
        // This is taken from:
        //  - https://en.wikipedia.org/wiki/Jenkins_hash_function
        //  - https://www.burtleburtle.net/bob/hash/doobs.html
        // 
        // Bob Jenkin's one-at-a-time hash algorithm, adapted to operate on a 4-byte stride
        // 
        uint32_t hash = HASH_INIT_VALUE;

        for (size_t i = 0; i < data.size(); ++i)
        {
            hash += data[i];
            hash += hash << 10;
            hash ^= hash >> 6;
        }

        hash += hash << 3;
        hash ^= hash >> 11;
        hash += hash << 15;
        return hash;
    }

    template<size_t S>
    static constexpr float hash_and_floatify(array<uint32_t, S> data)
    {
        // We generate the hash from the provided data using some
        // arbitrary non-cryptographic hash algorithm
        uint32_t hash = jenkins_hash(data);

        // This masks out the portion of the hash that would correspond to the 
        // mantissa of a floating point number, we OR with floating-point 
        // representation of ONE to get a random float in the range [1, 2).
        float value = std::bit_cast<float>((hash & IEEE_754_MANTISSA_MASK) | IEEE_754_ONE);

        // Subtract 1 to get float in range [0, 1)
        return value - 1.0f;
    }

    float rand(vec4 pos, uint32_t seed)
    {
        return hash_and_floatify(array
            { 
                std::bit_cast<uint32_t>(pos.x), 
                std::bit_cast<uint32_t>(pos.y), 
                std::bit_cast<uint32_t>(pos.z), 
                std::bit_cast<uint32_t>(pos.w), 
                seed
            });
    }

    float rand(vec3 pos, uint32_t seed)
    {
        return hash_and_floatify(array
            { 
                std::bit_cast<uint32_t>(pos.x), 
                std::bit_cast<uint32_t>(pos.y), 
                std::bit_cast<uint32_t>(pos.z), 
                seed
            });
    }

    float rand(vec2 pos, uint32_t seed)
    {
        return hash_and_floatify(array
            { 
                std::bit_cast<uint32_t>(pos.x), 
                std::bit_cast<uint32_t>(pos.y), 
                seed
            });
    }

}