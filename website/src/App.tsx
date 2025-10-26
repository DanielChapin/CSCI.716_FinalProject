import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import PlanetView from "./PlanetView";
import UserConfigView from "./UserConfigView";

function App() {
    return (
        <div className="max-h-dvh h-dvh items-center justify-center">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel><UserConfigView /></ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel><PlanetView /></ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default App;
