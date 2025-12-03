import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type BufferGeometry, type BufferGeometryEventMap, type NormalBufferAttributes } from 'three';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

import { useAlgo } from './hooks/use-algo';
import { createGeometry } from './lib/geometry';
import PlanetMenuBar from './PlanetMenubar';
import { toast } from 'sonner';

import vsDecls from './assets/shaders/vert.decls?raw';
import fsDecls from './assets/shaders/frag.decls?raw';
import vsCode from './assets/shaders/vert.code?raw';
import fsCode from './assets/shaders/frag.code?raw';
import simplexShader from './assets/shaders/simplex.glsl?raw';
import { toEdgeRepr, type UserConfig } from './lib/user-config';

export type Props = {
    config: UserConfig;
};

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

    const meshRef = useRef<THREE.Mesh | undefined>(undefined);
    const downloadRef = useRef<HTMLAnchorElement | null>(null);
    const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);

    const biomes = [
        { min: new THREE.Vector3(0.0, 0.0, 0.0), max: new THREE.Vector3(0.5, 1, 1), color: new THREE.Vector4(0.174, 0.175, 1, 1) }, // OCEAN
        { min: new THREE.Vector3(0.5, 0, 0), max: new THREE.Vector3(0.55, 1, 1), color: new THREE.Vector4(0.995, 0.921, 0.56, 1) }, // DESERT
        { min: new THREE.Vector3(0.75, 0.3, 0), max: new THREE.Vector3(1, 1, 1), color: new THREE.Vector4(0.176, 0.186, 0.2, 1) }, // MOUNTAINS
        { min: new THREE.Vector3(0.75, 0, 0), max: new THREE.Vector3(1, 0.3, 1), color: new THREE.Vector4(0.55, 0.99, 1, 1) }, // TUNDRA
        { min: new THREE.Vector3(0.55, 0, 0), max: new THREE.Vector3(0.75, 1, 1), color: new THREE.Vector4(0.226, 0.435, 0.205, 1) }, // FOREST
    ];

    const onCompile = useMemo(
        () => (shader: any) => {
            shader.uniforms.u_Biomes = { value: biomes };
            shader.uniforms.u_BiomeCount = { value: biomes.length };
            shader.uniforms.u_elevScale = { value: config.features.elevation.scale };
            shader.uniforms.u_tempScale = { value: config.features.temperature.scale };
            shader.uniforms.u_humiScale = { value: config.features.humidity.scale };
            shader.uniforms.u_elevOctaves = { value: config.features.elevation.octaves };
            shader.uniforms.u_tempOctaves = { value: config.features.temperature.octaves };
            shader.uniforms.u_humiOctaves = { value: config.features.humidity.octaves };
            shader.uniforms.u_elevPersistence = { value: config.features.elevation.persistence };
            shader.uniforms.u_tempPersistence = { value: config.features.temperature.persistence };
            shader.uniforms.u_humiPersistence = { value: config.features.humidity.persistence };
            shader.uniforms.u_elevLac = { value: config.features.elevation.lacunarity };
            shader.uniforms.u_tempLac = { value: config.features.temperature.lacunarity };
            shader.uniforms.u_humiLac = { value: config.features.humidity.lacunarity };
            shader.uniforms.u_seed = { value: config.features.seed };
            shader.uniforms.u_ElevationScale = { value: config.planet.elevationScale };

            shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>\n${simplexShader}\n${vsDecls}`);
            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\n${simplexShader}\n${fsDecls}`);
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `${vsCode}`);
            shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', `${fsCode}\n#include <dithering_fragment>`);
        },
        []
    );

    useEffect(() => {
        if (!algo) {
            return;
        }
        setGenerating(true);
        const mesh = algo.gen_terrain_mesh(toEdgeRepr(config, algo));
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
                <ambientLight intensity={0.25} />
                <pointLight position={[5, 5, 5]} intensity={500} color={[1, 0.9, 0.45]} />
                <pointLight position={[-5, -5, -5]} intensity={250} color={[0.25, 0.2, 0.5]} />
                <mesh geometry={geometry} ref={meshRef}>
                    <meshPhongMaterial ref={materialRef} onBeforeCompile={onCompile} wireframe={wireframe} />
                </mesh>
                <OrbitControls autoRotate={autoRotate} />
            </Canvas>
        </div>
    );
}
