import { useEffect, useState } from 'react';

import create_algo, { type MainModule } from '../transient/algo/algo';
import algoWasmUrl from '../assets/transient/algo.wasm?url';

export function useAlgo() {
    const [algo, setAlgo] = useState<MainModule | null>(null);

    useEffect(() => {
        const initializeWasm = async () => {
            const algo = await create_algo({ locateFile: (_: string) => algoWasmUrl });
            setAlgo(algo);
        };

        initializeWasm();
    }, []);

    return algo;
}
