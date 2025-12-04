import { useMemo, useRef } from 'react';
import { MeshPhongMaterial, type WebGLProgramParametersWithUniforms } from 'three';

export default function CustomMeshPhongMaterial({
    commonShaders,
    vertexShader,
    fragmentShader,
    uniforms,
    ...others
}: {
    commonShaders: string[];
    vertexShader: string;
    fragmentShader: string;
    uniforms?: { [key: string]: any };
} & React.ComponentProps<'meshPhongMaterial'>) {
    const materialRef = useRef<MeshPhongMaterial | null>(null);

    const onCompile = useMemo(
        () => (parameters: WebGLProgramParametersWithUniforms) => {
            for (const [name, v] of Object.entries(uniforms || [])) {
                parameters.uniforms[name] = { value: v };
            }

            parameters.vertexShader = parameters.vertexShader
                .replace('#include <common>', `#include <common>\n${commonShaders.join('\n')}\n${vertexShader}`)
                .replace('#include <begin_vertex>', 'vec3 transformed = vert(position, normal);');

            parameters.fragmentShader = parameters.fragmentShader
                .replace('#include <common>', `#include <common>\n${commonShaders.join('\n')}\n${fragmentShader}`)
                .replace('#include <dithering_fragment>', 'gl_FragColor = frag(gl_FragColor);\n#include <dithering_fragment>');
        },
        []
    );

    return <meshPhongMaterial ref={materialRef} onBeforeCompile={onCompile} {...others} />;
}
