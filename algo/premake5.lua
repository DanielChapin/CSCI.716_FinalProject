
TARGET_OUTPUT = "bin/%{cfg.architecture}-%{cfg.buildcfg}-%{cfg.system}"
OBJECT_OUTPUT = "bin-int/%{cfg.architecture}-%{cfg.buildcfg}-%{cfg.system}"

workspace "CSCI-716"
	startproject "CSCI-716_FINALPROJECT"
	architecture "x64"
	staticruntime "on"
	cppdialect "C++23"
	flags "MultiProcessorCompile"

	configurations {
		"Debug",
		"Release"
	}

	filter "configurations:Debug"
		defines "CONFIG_DEBUG"
		optimize "off"
		symbols "on"

	filter "configurations:Release"
		defines "CONFIG_RELEASE"
		optimize "on"
		symbols "off"

	filter "system:windows"
		systemversion "latest"
		defines "SYSTEM_WINDOWS"

	filter "system:linux"
		defines "SYSTEM_LINUX"

    filter "system:emscripten"
        defines "SYSTEM_EMSCRIPTEN"
		
		-- If we need to target wasm64 in the future we should add these options:
		-- 
		-- buildoptions { 
        --     "-sWASM=1",
        --     "-sMEMORY64=1" 
        -- }
        -- linkoptions { 
        --     "-mwasm64", 
        --     "-sMEMORY64=1" 
        -- }
		-- 
		architecture "wasm32"
		targetextension ".html" 

		linkoptions {
			"--shell-file html_template.html"
		}
		
	filter {}

-- Project definition
project "CSCI-716_FINALPROJECT"
	language "C++"
	kind "ConsoleApp"

	files {
		"src/**.cpp",
		"src/**.hpp",
		"src/**.h",
		"include/**.hpp",
		"include/**.h",
	}

	includedirs {
		"include",
	}

	-- For windows MinGW toolchain, we need to link against stdc++exp (experimental C++ runtime library)
	-- to use newer functions like std::println
	filter { "action:gmake", "system:windows" }
		links "stdc++exp"

	filter {}

	targetdir(TARGET_OUTPUT)
	objdir(OBJECT_OUTPUT)