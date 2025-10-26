import { useAlgo } from './hooks/use-algo';

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
    const vertices_arr = new Array(mesh.vertices.size()).fill(0).map((_, i) => mesh.vertices.get(i));
    const indices_arr = new Array(mesh.indices.size()).fill(0).map((_, i) => mesh.indices.get(i));

    return (
        <>
            <p>Vertices:</p>
            <ul>
                {vertices_arr.map((v, k) => (
                    <li key={k}>
                        {'<'}
                        {v!.x}, {v!.y}, {v!.z}
                        {'>'}
                    </li>
                ))}
            </ul>
            <p>Indices:</p>
            <ul>
                {indices_arr.map((i, k) => (
                    <li key={k}>{i}</li>
                ))}
            </ul>
        </>
    );
}
