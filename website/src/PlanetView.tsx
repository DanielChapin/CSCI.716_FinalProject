import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { type BufferGeometry, type BufferGeometryEventMap, type NormalBufferAttributes } from 'three';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

import { type UserConfig } from '@/transient/algo/algo';

import { useAlgo } from './hooks/use-algo';
import { createGeometry } from './lib/geometry';
import PlanetMenuBar from './PlanetMenubar';
import { toast } from 'sonner';

const config: UserConfig = {
    features: {
        elevation: {
            scale: 0.25,
            lacunarity: 2.0,
            persistence: 0.5,
            octaves: 8,
        },
        humidity: {
            scale: 1,
            lacunarity: 2.0,
            persistence: 0.5,
            octaves: 2,
        },
        temperature: {
            scale: 1,
            lacunarity: 2.0,
            persistence: 0.5,
            octaves: 2,
        },
        seed: 'hello',
    },
    planet: {
        radius: 10,
        elevationScale: 20,
    },
};

/**
 * @description A 3D viewer for a generated planet mesh.
 */
export default function PlanetView() {
    const algo = useAlgo();
    const [geometry, setGeometry] = useState<null | BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>>(null);
    const [generating, setGenerating] = useState(true);
    const [wireframe, setWireframe] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const meshRef = useRef<THREE.Mesh | undefined>(undefined);
    const downloadRef = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        if (!algo) {
            return;
        }
        setGenerating(true);
        const mesh = algo.gen_terrain_mesh(config);
        const geometry = createGeometry(mesh);
        setGeometry(geometry);
        setGenerating(false);
        return () => geometry.dispose();
    }, [algo, config]);

    if (!algo) {
        return (
            <div className='h-full w-full flex items-center justify-center'>
                <span className='text-xl'>Loading Binary Modules...</span>
            </div>
        );
    }

    if (generating) {
        return (
            <div className='h-full w-full flex items-center justify-center'>
                <span className='text-xl'>Generating Mesh...</span>
            </div>
        );
    }

    if (!geometry) {
        toast.error('Failed to generate mesh.', { dismissible: true, duration: 1000 });
        return (
            <div className='h-full w-full flex items-center justify-center'>
                <span className='text-xl'>Error</span>
            </div>
        );
    }

    function download() {
        if (!meshRef.current) {
            toast.error('No valid mesh!');
            return;
        }

        setDownloading(true);
        toast.info('Generating file.');

        const binary = true;

        const exporter = new GLTFExporter();
        exporter
            .parseAsync(meshRef.current, { binary })
            .then((binOrJson) => {
                if (binOrJson instanceof ArrayBuffer) {
                    return new Blob([binOrJson], { type: 'model/gltf-binary' });
                } else {
                    const json = JSON.stringify(binOrJson, null, 1);
                    return new Blob([json], { type: 'model/gltf+json' });
                }
            })
            .then((blob) => {
                if (!downloadRef.current) {
                    toast.error('No valid download context.');
                    return;
                }

                const a = downloadRef.current;
                const url = URL.createObjectURL(blob);
                a.href = url;
                a.download = binary ? 'planet.glb' : 'planet.gltf';
                a.click();
                URL.revokeObjectURL(url);
            })
            .finally(() => {
                setDownloading(false);
            });
    }

    return (
        <div className='h-full w-full relative'>
            <a className='hidden' ref={downloadRef}></a>
            <div className='absolute left-1 top-1 z-10'>
                <PlanetMenuBar
                    downloadEnabled={!downloading}
                    onWireframeChange={setWireframe}
                    onAutoRotateChange={setAutoRotate}
                    onDownload={download}
                />
            </div>
            <Canvas className='absolute inset-0' camera={{ position: [0, 0, 5] }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} intensity={200} color={[1, 0.9, 0.45]} />
                <pointLight position={[-10, -10, -10]} intensity={75} color={[0.8, 0.2, 0.95]} />
                <mesh geometry={geometry} ref={meshRef}>
                    <meshPhongMaterial wireframe={wireframe} vertexColors side={2} flatShading={false} />
                </mesh>
                <OrbitControls autoRotate={autoRotate} />
            </Canvas>
        </div>
    );
}
