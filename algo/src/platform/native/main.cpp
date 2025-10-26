#if defined(SYSTEM_WINDOWS) || defined(SYSTEM_LINUX)

#include <print>
#include <string>

#include <shapes.hpp>
#include <glm/vec3.hpp>
#include <glm/gtx/string_cast.hpp>

using std::string;
using glm::vec3;

int main()
{
    std::println("{}", glm::to_string(gen_vec3()));
}

#endif