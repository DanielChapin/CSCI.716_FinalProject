#ifdef SYSTEM_EMSCRIPTEN
    #include <emscripten/bind.h>
#endif

#include <string>
#include <print>

#include <glm/vec3.hpp>

using glm::vec3;

void cpp_printer(const std::string& string)
{
    std::println("Hello from C++: {}", string);
}

vec3 get_vec3()
{
    return vec3{ 1, 0, 1 };
}

#ifdef SYSTEM_EMSCRIPTEN
    using namespace emscripten;

    EMSCRIPTEN_BINDINGS(algo) {
        function("cpp_printer", &cpp_printer);
        function("get_vec3", &get_vec3);

        value_object<vec3>("vec3")
            .field("x", &vec3::x)
            .field("y", &vec3::y)
            .field("z", &vec3::z);
    }
#else
    int main()
    {
        std::println("Hello, world!");
    }
#endif