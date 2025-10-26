import { useAlgo } from './hooks/use-algo';
import { createGeometry } from './lib/geometry';
import { Canvas } from '@react-three/fiber'

export type Props = {};

/**
 * @description A 3D viewer for a generated planet mesh.
 */
export default function PlanetView(_props: Props) {
    const algo = useAlgo();

    if (!algo) {
        return <div>Loading Binary Modules...</div>;
    }

    const mesh = algo.gen_cube_mesh();
    const geometry = createGeometry(mesh);

    return (
        <>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <mesh geometry={geometry}>
                    <meshStandardMaterial color="orange" wireframe={false} />
                </mesh>
            </Canvas>
        </>
    );
}
