#ifdef SYSTEM_EMSCRIPTEN

#include <emscripten/bind.h>

#include <shapes.hpp>
#include <glm/vec3.hpp>

using emscripten::function;
using emscripten::value_object;
using glm::vec3;

EMSCRIPTEN_BINDINGS(algo) {
    function("gen_vec3", &gen_vec3);
    
    value_object<vec3>("vec3")
        .field("x", &vec3::x)
        .field("y", &vec3::y)
        .field("z", &vec3::z);
}

#endif