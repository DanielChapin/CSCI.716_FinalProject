import { useEffect, useState } from 'react';

import create_algo, { type MainModule } from '../transient/algo/algo';

export function useAlgo() {
    const [algo, setAlgo] = useState<MainModule | null>(null);

    useEffect(() => {
        const initializeWasm = async () => {
            const algo = await create_algo({ locateFile: (path: string) => `/transient/${path}` });
            setAlgo(algo);
        };

        initializeWasm();
    }, []);

    return algo;
}
