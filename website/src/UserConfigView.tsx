import type { UserConfig } from "@/lib/user-config";
import { Button } from "./components/ui/button";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { useState } from "react";

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
        <ScrollArea className="flex flex-col m-2 w-full h-full">
            {Array.from({ length: 100 }, (_, i) => i).map(i => <div>{i}</div>)}
            {/* TODO Why is scrollbar not showing up? */}
            <ScrollBar orientation="vertical" hidden={false} />
        </ScrollArea>
        <div className="bottom-0 h-min w-full">
            <Separator orientation="horizontal" />
            <div className="w-full p-2"><Button className="w-full"><b>Generate!</b></Button></div>
        </div>
    </div>;
}