#!/bin/sh
premake5 --os=emscripten gmake
premake5 --os=emscripten export-compile-commands