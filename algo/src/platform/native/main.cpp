#if defined(SYSTEM_WINDOWS) || defined(SYSTEM_LINUX)

// Precompiled
#include <algo_pch.hpp>
//

#include <shapes.hpp>

#include <glm/gtx/string_cast.hpp>

using std::string;
using glm::vec3;

int main()
{
    std::println("{}", glm::to_string(algo::gen_vec3()));
}

#endif