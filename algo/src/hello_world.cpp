#ifdef SYSTEM_EMSCRIPTEN
    #include <emscripten/bind.h>
#endif

#include <string>
#include <print>

void cpp_printer(const std::string& string)
{
    std::println("Hello from C++: {}", string);
}

#ifdef SYSTEM_EMSCRIPTEN
    using namespace emscripten;

    EMSCRIPTEN_BINDINGS(algo) {
        function("cpp_printer", &cpp_printer);
    }
#else
    int main()
    {
        std::println("Hello, world!");
    }
#endif