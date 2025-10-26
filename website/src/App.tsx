import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';

function App() {
    return (
        <div className="flex flex-col h-dvh items-center justify-center">
            <p className="text-3xl">Hello, Three.js!</p>
            <p><i>Try dragging around</i></p>
            <Canvas>
                <mesh>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshPhongMaterial />
                </mesh>
                <ambientLight intensity={0.1} />
                <directionalLight position={[5, 5, 5]} color="red" />
                <OrbitControls makeDefault />
            </Canvas>
        </div>
    );
}

export default App;
