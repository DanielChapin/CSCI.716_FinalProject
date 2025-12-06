import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import astroneer from "@/assets/Astroneer.jpg";

export default function AlgoOverview() {
    return <div className="flex flex-col w-full h-full p-2 pb-4">
        <ScrollArea>
            <article className="prose dark:prose-invert">
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

                <h2>Simplex Noise</h2>

                <h2>Putting it Together</h2>

                <h2>Inputs & Outputs</h2>

                <h2>Optimization</h2>

                <h2>Analysis</h2>
            </article>
            <ScrollBar orientation="vertical" hidden={false} />
        </ScrollArea >
    </div>
}