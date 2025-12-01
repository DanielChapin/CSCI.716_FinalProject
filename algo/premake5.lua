
TARGET_OUTPUT = "bin/%{cfg.architecture}-%{cfg.buildcfg}-%{cfg.system}"
OBJECT_OUTPUT = "bin-int/%{cfg.architecture}-%{cfg.buildcfg}-%{cfg.system}"

workspace "CSCI-716_Project"
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
		architecture "wasm32"
		targetextension ".html" 
		
	filter {}

-- Project definition
project "algo"
	language "C++"
	kind "ConsoleApp"

	pchheader "algo_pch.hpp"
	pchsource "src/algo_pch.cpp"

	files {
		"src/core/**.cpp",
		"src/core/**.hpp",
		"src/core/**.h",
		"include/**.hpp",
		"include/**.h",
	}

	includedirs {
		"include",

		-- Vendor
		"vendor/glm",
	}

	defines {
		"GLM_ENABLE_EXPERIMENTAL"
	}

	filter "system:linux or windows"
		files {
			"src/platform/native/**.cpp",
			"src/platform/native/**.hpp",
			"src/platform/native/**.h"
		}

	-- For windows MinGW toolchain, we need to link against stdc++exp (experimental C++ runtime library)
	-- to use newer functions like std::println
	filter { "action:gmake", "system:windows" }
		links "stdc++exp"

	filter "system:emscripten"
		includedirs "vendor/emsdk/upstream/emscripten/system/include" 
		libdirs "vendor/emsdk/upstream/emscripten/system/lib" 
		links "embind"

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

		files {
			"src/platform/wasm/**.cpp",
			"src/platform/wasm/**.hpp",
			"src/platform/wasm/**.h"
		}

		linkoptions {
			"--shell-file html_template.html",
			"--emit-tsd %{prj.name}.d.ts",
			"-s MODULARIZE=1",
			"-s EXPORT_NAME='create_%{prj.name}'",
			"-s EXPORT_ES6=1",
			"-s ALLOW_MEMORY_GROWTH"
		}

		postbuildcommands {
			'{MKDIR} "../website/src/transient/algo/"',
			'{MKDIR} "../website/public/transient/"',
            '{COPYFILE} "%{cfg.buildtarget.directory}/%{prj.name}.js" "../website/src/transient/algo/"',
            '{COPYFILE} "%{cfg.buildtarget.directory}/%{prj.name}.d.ts" "../website/src/transient/algo/"',
            '{COPYFILE} "%{cfg.buildtarget.directory}/%{prj.name}.wasm" "../website/public/transient/"',
        }

	filter {}

	targetdir(TARGET_OUTPUT)
	objdir(OBJECT_OUTPUT)