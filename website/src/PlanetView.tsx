import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Mesh, Vector3, Vector4, type BufferGeometry, type BufferGeometryEventMap, type NormalBufferAttributes } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

import { toast } from 'sonner';
import { useAlgo } from './hooks/use-algo';
import { createGeometry } from './lib/geometry';
import PlanetMenuBar from './PlanetMenubar';

import hash from 'string-hash';
import commonShader from './assets/shaders/common.glsl?raw';
import fragmentShader from './assets/shaders/frag.glsl?raw';
import simplexShader from './assets/shaders/simplex.glsl?raw';
import vertexShader from './assets/shaders/vert.glsl?raw';
import CustomMeshPhongMaterial from './components/three/CustomMeshPhongMaterial';
import { toEdgeRepr, type UserConfig } from './lib/user-config';

export type Props = {
    config: UserConfig;
};

const BIOMES = [
    { min: new Vector3(0.0, 0.0, 0.0), max: new Vector3(0.5, 1, 1), color: new Vector4(0.174, 0.175, 1, 1) }, // OCEAN
    { min: new Vector3(0.5, 0, 0), max: new Vector3(0.55, 1, 1), color: new Vector4(0.995, 0.921, 0.56, 1) }, // DESERT
    { min: new Vector3(0.75, 0.3, 0), max: new Vector3(1, 1, 1), color: new Vector4(0.176, 0.186, 0.2, 1) }, // MOUNTAINS
    { min: new Vector3(0.75, 0, 0), max: new Vector3(1, 0.3, 1), color: new Vector4(0.55, 0.99, 1, 1) }, // TUNDRA
    { min: new Vector3(0.55, 0, 0), max: new Vector3(0.75, 1, 1), color: new Vector4(0.226, 0.435, 0.205, 1) }, // FOREST
];

/**
 * @description A 3D viewer for a generated planet mesh.
 */
export default function PlanetView(props: Props) {
    const { config } = props;

    const algo = useAlgo();
    const [geometry, setGeometry] = useState<null | BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>>(null);
    const [generating, setGenerating] = useState(true);
    const [wireframe, setWireframe] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const meshRef = useRef<Mesh | undefined>(undefined);
    const downloadRef = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        if (algo) {
            setGenerating(true);
            const mesh = algo.gen_terrain_mesh(toEdgeRepr(config, algo));
            const geometry = createGeometry(mesh);
            setGeometry(geometry);
            setGenerating(false);
            return () => geometry.dispose();
        }
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
                <ambientLight intensity={0.25} />
                <directionalLight castShadow intensity={500} color={[1, 1, 1]} position={[0, 0, 1]} />
                <mesh geometry={geometry} ref={meshRef}>
                    <CustomMeshPhongMaterial
                        commonShaders={[commonShader, simplexShader]}
                        vertexShader={vertexShader}
                        fragmentShader={fragmentShader}
                        uniforms={{
                            u_Biomes: BIOMES,
                            u_FeaturesConfig: { ...config.features, seed: hash(config.features.seed) },
                            u_PlanetConfig: config.planet,
                            u_BiomeCount: BIOMES.length,
                        }}
                        wireframe={wireframe}
                    />
                </mesh>
                <OrbitControls autoRotate={autoRotate} />
            </Canvas>
        </div>
    );
}
