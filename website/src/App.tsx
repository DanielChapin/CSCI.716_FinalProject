import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import PlanetView from "./PlanetView";
import UserConfigView from "./UserConfigView";
import { defaultUserConfig, type UserConfig } from "./lib/user-config";

function App() {
    const [userConfig, setUserConfig] = useState<UserConfig>({ ...defaultUserConfig });
    return (
        <div className="max-h-dvh h-dvh items-center justify-center">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel><UserConfigView onGenerate={setUserConfig} /></ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <PlanetView config={userConfig} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default App;
