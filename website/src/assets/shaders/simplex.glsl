#ifndef SIMPLEX_NOISE_INCLUDED
#define SIMPLEX_NOISE_INCLUDED

#define IEEE_754_ONE 0x3f800000
#define IEEE_754_MANTISSA 0x007fffff
#define HASH_INIT_VALUE 0xDEADBEEF

// We redefine the C++ code to work for GLSL

int jenkins_hash(int data[5])
{
    // This is taken from:
    //  - https://en.wikipedia.org/wiki/Jenkins_hash_function
    //  - https://www.burtleburtle.net/bob/hash/doobs.html
    // 
    // Bob Jenkin's one-at-a-time hash algorithm, adapted to operate on a 4-byte stride
    // 
    int hash = 0;
    for (int i = 0; i < 5; ++i)
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

float rand(int data[5])
{
    // We generate the hash from the provided data using some
    // arbitrary non-cryptographic hash algorithm
    int i = jenkins_hash(data);
    
    // This masks out the portion of the hash that would correspond to the 
    // mantissa of a floating point number, we OR with floating-point 
    // representation of ONE to get a random float in the range [1, 2).
    float r = intBitsToFloat((i & IEEE_754_MANTISSA) | IEEE_754_ONE);
    
    // Subtract 1 to get float in range [0, 1)
    return r - 1.0;
}

float rand(vec4 uv, int seed)
{
    int data[5];
    data[0] = seed;
    data[1] = floatBitsToInt(uv.x);
    data[2] = floatBitsToInt(uv.y);
    data[3] = floatBitsToInt(uv.z);
    data[4] = floatBitsToInt(uv.w);
    return rand(data);
}

float rand(vec3 uv, int seed)
{
    int data[5];
    data[0] = seed;
    data[1] = floatBitsToInt(uv.x);
    data[2] = floatBitsToInt(uv.y);
    data[3] = floatBitsToInt(uv.z);
    data[4] = 0;
    return rand(data);
}

float rand(vec2 uv, int seed)
{
    int data[5];
    data[0] = seed;
    data[1] = floatBitsToInt(uv.x);
    data[2] = floatBitsToInt(uv.y);
    data[3] = 0;
    data[4] = 0;
    return rand(data);
}

const vec2 GRADIENTS_2D[] = vec2[]
(
    vec2( 1.,  0.),
    vec2( 1.,  1.),
    vec2( 0.,  1.),
    vec2(-1.,  0.),
    vec2(-1.,  1.),
    vec2( 0., -1.),
    vec2(-1., -1.),
    vec2( 1., -1.)
);

const float gSQUASH_2D = (sqrt(3.) - 1.) / 2.;
const float fSQUASH_2D = (1. - 1. / sqrt(3.)) / 2.;

const vec3 GRADIENTS_3D[] = vec3[]
(
    
    vec3( 1.,  1.,  0.),
    vec3(-1.,  1.,  0.),
    vec3( 1., -1.,  0.),
    vec3(-1., -1.,  0.),
    vec3( 1.,  0.,  1.),
    vec3(-1.,  0.,  1.),
    vec3( 1.,  0., -1.),
    vec3(-1.,  0., -1.),
    vec3( 0.,  1.,  1.),
    vec3( 0., -1.,  1.),
    vec3( 0.,  1., -1.),
    vec3( 0., -1., -1.)

);

const float UNSKEW = 1. / 3.;
const float SKEW = 1. / 6.;

float attenuate(vec3 pos)
{
    // Radially symmetric 4D attenuation function:
    //      f(x, y, z) = (0.6 - x^2 + y^2 + z^2)^4
    // 
    // This is taken from https://cgvr.cs.uni-bremen.de/teaching/cg_literatur/simplexnoise.pdf
    // Though it is not extremely important what function we use as long as it is
    // radially symmetric and it can guarantee that it reaches 0 just before the boundary
    // of our simplices.
    // 
    return pow(max(0., 0.6 - dot(pos, pos)), 4.);
}

float simplex3D(vec3 pos, int seed)
{
    // We have some position in our UV coordinate space of equilateral simplices
    // so we unskew it to map it into our hypercube space
    float unskew = (pos.x + pos.y + pos.z) * UNSKEW;

    // We can now get the origin point of our hypercube
    vec3  origin = floor(pos + unskew);
    
    // We need to calculate the four direction vectors pointing from each
    // vertex of our 3D simplex to our original point
    float skew = (origin.x + origin.y + origin.z) * SKEW;
    vec3 d0    = pos - (origin - skew);
    
    // Based on the ordering of the components in our position,
    // we can determine which particular simplex of our 3D hypercube
    // our point is in, and thus know which midpoints to use.
    // There are n! (6) total orderings (and simplices) for n-dimensions
    // 
    // Example:
    //      x > y > z     means our simplex in hypercube space has the following vertices:
    //      (0, 0, 0) -> (1, 0, 0) -> (1, 1, 0) -> (1, 1, 1)
    //
    // We can make this branchless here by using swizzling and step()
    //
    //      comp = (x >= y, y >= z, z >= x)
    //
    vec3 comp = step(d0.yzx, d0);
    vec3 mid1 = comp * (1. - comp.zxy);
    vec3 mid2 = 1. - comp.zxy * (1. - comp);
    
    // Now we can figure out the remaining displacement vectors (for the other vertices)
    vec3 d1 = d0 - mid1 + 1. * SKEW;
    vec3 d2 = d0 - mid2 + 2. * SKEW;
    vec3 d3 = d0 - 1.   + 3. * SKEW;
    
    // Now we select random gradients associated with each vertex
    const float len = float(GRADIENTS_3D.length());
    vec3 g0 = GRADIENTS_3D[int(rand(origin + vec3(0.), seed) * len)];
    vec3 g1 = GRADIENTS_3D[int(rand(origin + mid1,     seed) * len)];
    vec3 g2 = GRADIENTS_3D[int(rand(origin + mid2,     seed) * len)];
    vec3 g3 = GRADIENTS_3D[int(rand(origin + vec3(1.), seed) * len)];
    
    // We calculate the contributions from each vertex now given our
    // initial point. We use an attenuation function that ensures
    // each contribution reaches 0 at the simplex boundary
    vec4 c;
    c.x = attenuate(d0) * dot(g0, d0);
    c.y = attenuate(d1) * dot(g1, d1);
    c.z = attenuate(d2) * dot(g2, d2);
    c.w = attenuate(d3) * dot(g3, d3);
    
    // The following is based on the selected attenuation function and the gradients
    // Convert the value to the range [0, 1)
    return (dot(c, vec4(32.)) + 1.) / 2.;
}

float noise3D(vec3 pos, int seed, float scale, float lacunarity, float persistence, int octaves)
{
    float result = 0.f;
    float result_max = 0.f;
    float effective_scale = scale;
    float effective_mag = 1.f;
    
    for (int octave = 0; octave < octaves; ++octave)
    {
        result += simplex3D(pos * effective_scale, seed) * effective_mag;
        result_max += effective_mag;
        effective_scale *= lacunarity;
        effective_mag *= persistence;
    }
    
    return result / result_max;
}

#endif