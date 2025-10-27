import type { UserConfig } from "@/lib/user-config";
import { Button } from "./components/ui/button";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { useState } from "react";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Slider } from "./components/ui/slider";
import { Checkbox } from "./components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./components/ui/select";

export type Props = {
    config?: UserConfig,
    onSubmit?: (config: UserConfig) => void,
}

/**
 * @description A View (and Controller) for the user configuration of the marching cubes demonstration.
 *              This component displays all of the generation options and allows the user to edit them.
 *              When the generate button is pressed, the onSubmit function is called if supplied.
 */
export default function UserConfigView(props: Props) {
    const [config, setConfig] = useState(props.config ?? {})
    function updateConfig(update: Partial<UserConfig>) {
        // TODO Not certain if this order is correct
        setConfig({ ...update, ...config });
    }

    // TODO All the inputs for this component should probably be implemented as a form
    //      if it makes validation easier (i.e. via Zod)
    return <div className="flex flex-col w-full h-full">
        <ScrollArea className="flex flex-col p-2 w-full h-full">
            <p className="text-xl"><b>RNG Parameters</b></p>

            <Label htmlFor="seed">Seed</Label>
            <Input className="max-w-sm" id="seed" type="text" placeholder="1790577829003" />

            <Label htmlFor="scale">Scale</Label>
            <Slider className="max-w-sm" id="scale" />

            <Label htmlFor="octaves">Octaves</Label>
            <Slider className="max-w-sm" id="octaves" />

            <Separator className="m-2" orientation="horizontal" />

            <p className="text-xl"><b>Planet Parameters</b></p>

            <Label htmlFor="radius">Radius</Label>
            <Slider className="max-w-sm" id="radius" />

            <Label htmlFor="biomes">Biomes</Label>
            <div className="flex items-start gap-3">
                <Checkbox id="biome-plains" defaultChecked />
                <Label htmlFor="biome-plains">Plains</Label>
            </div>
            <div className="flex items-start gap-3">
                <Checkbox id="biome-desert" defaultChecked />
                <Label htmlFor="biome-desert">Desert</Label>
            </div>
            <div className="flex items-start gap-3">
                <Checkbox id="biome-tundra" defaultChecked />
                <Label htmlFor="biome-tundra">Tundra</Label>
            </div>

            <Separator className="m-2" orientation="horizontal" />

            <p className="text-xl"><b>Marching Cubes Parameters</b></p>

            <Label htmlFor="vertex-blend">Vertex Blend Mode</Label>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a blend mode" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Blend Modes</SelectLabel>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="cubic">Cubic</SelectItem>
                        <SelectItem value="nearest">Nearest</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* TODO Why is scrollbar not showing up? */}
            <ScrollBar orientation="vertical" hidden={false} />
        </ScrollArea>
        <div className="bottom-0 h-min w-full">
            <Separator orientation="horizontal" />
            <div className="w-full p-2"><Button className="w-full"><b>Generate!</b></Button></div>
        </div>
    </div>;
}