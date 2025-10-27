import { useAlgo } from './hooks/use-algo';
import { createGeometry } from './lib/geometry';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import PlanetMenuBar from './PlanetMenubar';

export type Props = {};

/**
 * @description A 3D viewer for a generated planet mesh.
 */
export default function PlanetView(_props: Props) {
    const algo = useAlgo();

    if (!algo) {
        return <div>Loading Binary Modules...</div>;
    }

    const mesh = algo.genCircleMesh();
    console.log(mesh);
    const geometry = createGeometry(mesh);
    console.log(geometry);

    return (
        <div className='h-full w-full relative'>
            <div className='absolute left-1 top-1 z-10'><PlanetMenuBar /></div>
            <Canvas className='absolute inset-0' camera={{ position: [0, 0, 5] }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <mesh geometry={geometry}>
                    <meshPhongMaterial color="white" wireframe={true} />
                </mesh>
                <OrbitControls />
            </Canvas>
        </div>
    );
}
