import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { type BufferGeometry, type BufferGeometryEventMap, type NormalBufferAttributes, PointLight } from 'three';

import { useAlgo } from './hooks/use-algo';
import { createGeometry } from './lib/geometry';
import PlanetMenuBar from './PlanetMenubar';

/**
 * @description A 3D viewer for a generated planet mesh.
 */
export default function PlanetView() {
    const algo = useAlgo();
    const [geometry, setGeometry] = useState<null | BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>>(null);
    const [generating, setGenerating] = useState(true);

    useEffect(() => {
        if (!algo) {
            return;
        }
        setGenerating(true);
        const mesh = algo.gen_terrain_mesh();
        const geometry = createGeometry(mesh);
        setGeometry(geometry);
        setGenerating(false);
    }, [algo]);

    if (!algo) {
        return <div>Loading Binary Modules...</div>;
    }

    if (generating) {
        return <div>Generating Mesh...</div>;
    }

    if (!geometry) {
        return <div>Failed to generate the mesh!</div>;
    }

    return (
        <div className='h-full w-full relative'>
            <div className='absolute left-1 top-1 z-10'>
                <PlanetMenuBar />
            </div>
            <Canvas className='absolute inset-0' camera={{ position: [0, 0, 5] }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} intensity={200} />
                <mesh geometry={geometry} >
                    <meshPhongMaterial vertexColors side={2} flatShading={false}  />
                </mesh>
                <OrbitControls />
            </Canvas>
        </div>
    );
}
