import * as THREE from 'three';

import type { Mesh } from '@/transient/algo/algo';

import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

type GeomOptions = {
    genNormals?: boolean;
};

export function createGeometry(mesh: Mesh, options: Partial<GeomOptions> = {}): THREE.BufferGeometry {
    const { genNormals = true } = options;

    const geom = new THREE.BufferGeometry();
    
    const vertices = new Float32Array(mesh.vertices.size() * 3);
    const colors = new Float32Array(mesh.vertices.size() * 3);
    for (let i = 0; i < mesh.vertices.size(); i++) {
        const idx = i * 3;
        const vtx = mesh.vertices.get(i)!;
        vertices[idx + 0] = vtx.x;
        vertices[idx + 1] = vtx.y;
        vertices[idx + 2] = vtx.z;
        colors[idx + 0] = 1;
        colors[idx + 1] = 0;
        colors[idx + 2] = 1;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const idxs = new Uint32Array(mesh.indices.size()).map((_, i) => mesh.indices.get(i)!);
    geom.setIndex(new THREE.BufferAttribute(idxs, 1));
    
    const geomSmooth = BufferGeometryUtils.mergeVertices(geom);
    if (genNormals) geomSmooth.computeVertexNormals();

    return geomSmooth;
}
