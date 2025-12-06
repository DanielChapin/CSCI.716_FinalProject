import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import PlanetView from "./PlanetView";
import UserConfigView from "./UserConfigView";
import { defaultUserConfig, type UserConfig } from "./lib/user-config";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import AlgoOverview from "./AlgoOverview";
import { ModeToggle } from "./components/mode-switcher";

function App() {
    const [userConfig, setUserConfig] = useState<UserConfig>({ ...defaultUserConfig });
    return (
        <div className="max-h-dvh h-dvh items-center justify-center relative">
            <div className="absolute right-1 top-1 z-50">
                <ModeToggle />
            </div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                    <Tabs className="p-1 flex flex-col h-full flex-nowrap" defaultValue="planet-gen">
                        <div>
                            <TabsList>
                                <TabsTrigger value="planet-gen">Planet Generation</TabsTrigger>
                                <TabsTrigger value="overview">Algorithm Overview</TabsTrigger>
                            </TabsList>
                        </div>
                        <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
                            <TabsContent className="h-full" value="planet-gen">
                                <UserConfigView onGenerate={setUserConfig} />
                            </TabsContent>
                            <TabsContent className="h-full" value="overview">
                                <AlgoOverview />
                            </TabsContent>
                        </div>
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
