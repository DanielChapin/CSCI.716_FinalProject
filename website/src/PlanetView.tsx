import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { type BufferGeometry, type BufferGeometryEventMap, type NormalBufferAttributes, PointLight } from 'three';
import * as THREE from 'three';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';

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
    const [wireframe, setWireframe] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);

    const meshRef = useRef<THREE.Mesh | undefined>(undefined);

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
                <PlanetMenuBar onWireframeChange={setWireframe} onAutoRotateChange={setAutoRotate} />
            </div>
            <Canvas className='absolute inset-0' camera={{ position: [0, 0, 5] }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} intensity={200} color={[1, 0.9, 0.45]} />
                <pointLight position={[-10, -10, -10]} intensity={75} color={[0.8, 0.2, 0.95]} />
                <mesh geometry={geometry} ref={meshRef} >
                    <meshPhongMaterial wireframe={wireframe} vertexColors side={2} flatShading={false} />
                </mesh>
                <OrbitControls autoRotate={autoRotate} />
            </Canvas>
        </div>
    );
}
