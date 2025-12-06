import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import astroneer from "@/assets/Astroneer.jpg";
import { Code, CopyBlock, atomOneDark, atomOneLight } from "react-code-blocks";
import { useTheme } from "./components/theme-provider";
import { useEffect, useState } from "react";
import Latex from "react-latex";

const marchingCubesSignature: string = `vector<vec3> marchingCubes(
    vec3 origin,
    vec3 dims,
    vec3 interval,
    const function<float(vec3)> &getDensity,
    float threshold,
    const function<vec3(vec3, float, vec3, float)> &blend);`;

export default function AlgoOverview() {
    const { theme } = useTheme()
    const codeDark = atomOneDark;
    const codeLight = atomOneLight;
    const [codeTheme, setCodeTheme] = useState(codeDark);
    useEffect(() => {
        if (theme === "light") {
            setCodeTheme(codeLight);
        } else {
            setCodeTheme(codeDark);
        }
    }, [theme]);

    return <div className="flex flex-col w-full h-full p-2 pb-4">
        <ScrollArea>
            <article className="prose dark:prose-invert max-w-full">
                <h1>Marching Cubes & Simplex Noise Planet Generator</h1>
                <a href="https://github.com/DanielChapin/CSCI.716_FinalProject">Repo link</a>
                <p>
                    Authors: Daniel Chapin (dsc4984@rit.edu) and Klim Fedorchuk (kf2848@g.rit.edu) <br />
                    Final project for CSCI.716 Computational Geometry with Prof. Varsha Dani.
                </p>

                <h2>Overview</h2>
                <p>
                    Terrain generation is a very rich and complicated topic within the realm of game design and implementation.
                    Much of the time, creating terrain is boiled down to generating <a href="https://en.wikipedia.org/wiki/Voxel">voxels</a>, or values cooresponding to points on a regular 3D grid.
                    This approach is extremely powerful because it empowers developers with an easily extensible abstract representation of terrain.
                </p>
                <p>
                    However, a problem arises with such an abstraction.
                    Rendering such terrain often results in clearly defined voxels and lower resolution terrain.
                    Sometimes this can be a purposeful stylistic choice.
                    Games such as <a href="https://www.minecraft.net/en-us">Minecraft</a> have a wonderful blocky charm to them.
                    That being said, sometimes the setting or style of the game demands more dynamic terrain meshes.
                    Games such as <a href="https://astroneer.space/">Astroneer</a>, which take place on spherical planets, would really struggle with such terrain.
                    Because gravity always points towards the center of the planet, cubic terrain would become a serious annoyance - as the player would not be aligned with the terrain when straying away from the poles aligned with the axes of the coordinate system.
                </p>
                <figure className="flex flex-col items-center">
                    <img className="w-[80%]" src={astroneer} alt="Astroneer terrain" />
                    <figcaption>Astroneer terrain (<a href="https://astroneer.space/">Source</a>)</figcaption>
                </figure>
                <p>
                    Both Minecraft and Astroneer use voxel based terrain!
                    It's unclear what algorithm Astroneer uses to generate the meshes for its terrain, but it's likely some sort of <a href="https://en.wikipedia.org/wiki/Isosurface">Isosurface algorithm</a> such as Marching Cubes or Dual-contouring.
                    Minecraft, on the other hand, simply draws the voxels as cubes on the grid.
                </p>

                <h2>Marching Cubes</h2>
                <p>
                    Marching Cubes is the first core algorithm being used to generate planets on this site.
                    The Marching Cubes algorithm's primary input is a voxel grid of density values.
                    It also takes a threshold which defines what densities should be considered within a mesh and therefore also which densities should be considered open air.
                    This value is typically refered to as the "iso-level."
                    With this density map, the algorithm partitions the space into cubes.
                    For each of these cubes, the density map is sampled for each corner of the cube, giving 8 values.
                    These sampled densities are compared against the iso-level to create an 8 bit integer.
                    This integer cooresponds to a fragment of the mesh, which is looked up in a table.
                    By putting all of these mesh fragments together, the full mesh is constructed.
                </p>
                <p>
                    Let's look at the function signature for this implementation of Marching Cubes.
                </p>
                <span className="not-prose">
                    <CopyBlock codeBlock wrapLongLines language="cpp" theme={codeTheme} text={marchingCubesSignature} />
                </span>
                <p>
                    The first three parameters define the bounds of region to perform the algorithm on.
                </p>
                <ol>
                    <li className="not-prose"><Code language="cpp" text="origin" theme={codeTheme} /> refers to the point to start at.</li>
                    <li className="not-prose"><Code language="cpp" text="dims" theme={codeTheme} /> is the distance along the three axes to march over.</li>
                    <li className="not-prose"><Code language="cpp" text="interval" theme={codeTheme} /> is the size of the cubes (<i>in this implementation, rectangular prisms</i>).</li>
                </ol>
                <p>
                    The next two indicate how the algorithm samples density values and the lower bound on within-mesh densities values.
                </p>
                <ol>
                    <li className="not-prose"><Code language="cpp" text="getDensity" theme={codeTheme} /> first order function for getting the density value at a point.</li>
                    <li className="not-prose"><Code language="cpp" text="threshold" theme={codeTheme} /> is the iso-value. This indicates where the edges of the mesh are.</li>
                </ol>
                <p>
                    The final parameter, <span className="not-prose"><Code language="cpp" text="blend" theme={codeTheme} /></span>, functions as a means by which to interpolate between vertices.
                    More specifically, given two vertices with two specified densities, where would the mesh lay inbetween those two points?
                    This function allows the mesh to be smoothed.
                    It also reveals an important part of how Marching Cubes works.
                    The density values are actually used to indicate which edges of the cube there must be a mesh vertex on.
                    Based on these vertices, a triangular mesh is constructed for the current cube.
                </p>

                <h2>Simplex Noise</h2>

                <h2>Putting it Together</h2>

                <h2>Inputs & Outputs</h2>
                <p>
                    All of the (user relevant) inputs can be seen and customized in the Planet Generation tab.
                    Once they have been changed, press "Generate!" and the output will be shown to the right.
                    The planet can be rotated by left-click-dragging on it.
                    All view related customization can be found under the View menubar item.
                    The resultant mesh can be downloaded under File {">"} Download.
                </p>

                <h2>Analysis</h2>
                <p>
                    Because of the fixed size of the lookup tables of marching cubes, the time complexity boils down to sampling the density 8 times per cube.
                    Let's say that we have an <Latex>$n \times n \times n$</Latex> voxel grid.
                    This results in <Latex>$(n - 1)^3 = O(n^3)$</Latex> cubes.
                    For each of these cubes, we must sample the density 8 times (and also blend vertices, but this is assumed to be a constant time operation).
                    Let's call the time complexity of sampling the density <Latex>$T(n)$</Latex>.
                    This results in a time complexity of <Latex>$O(T(n) \times n^3)$</Latex>.
                </p>

                <h2>Optimization</h2>
                <p>
                    The underlying marching cubes algorithm cannot be optimized significantly in terms of time complexity,
                    however; it can be parallelized pretty simply.
                    Because all of the mesh fragments are computed seperately and all cubes positions are known in advance, the only real difficulty is combining the results.
                    Sebastian Lague <a href="https://www.youtube.com/@SebastianLague">(<i>YouTube</i>)</a> has an <a href="https://www.youtube.com/watch?v=vTMEdHcKgM4">excellent video</a> in which he demonstrates parallelizing marching cubes using a compute shader, leveraging the huge number of cores in a GPU to generate meshes.
                </p>
                <p>
                    Simplex noise can also be computed pretty easily within shader code.
                    It can also be optimized to contain very few branches, making it very well suited for a GPU core.
                </p>
            </article>
            <ScrollBar orientation="vertical" hidden={false} />
        </ScrollArea >
    </div>
}