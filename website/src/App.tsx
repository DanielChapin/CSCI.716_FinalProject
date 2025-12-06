import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import PlanetView from "./PlanetView";
import UserConfigView from "./UserConfigView";
import { defaultUserConfig, type UserConfig } from "./lib/user-config";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import AlgoOverview from "./AlgoOverview";

function App() {
    const [userConfig, setUserConfig] = useState<UserConfig>({ ...defaultUserConfig });
    return (
        <div className="max-h-dvh h-dvh items-center justify-center">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                    <Tabs className="p-1 flex flex-col h-full overflow-clip" defaultValue="planet-gen">
                        <div>
                            <TabsList className="">
                                <TabsTrigger value="planet-gen">Planet Generation</TabsTrigger>
                                <TabsTrigger value="overview">Algorithm Overview</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent className="pl-1 flex-1" value="planet-gen">
                            <UserConfigView onGenerate={setUserConfig} />
                        </TabsContent>
                        <TabsContent className="pl-1 flex-1 overflow-clip" value="overview">
                            <AlgoOverview />
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <PlanetView config={userConfig} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default App;
