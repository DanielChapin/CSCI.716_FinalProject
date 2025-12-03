import { randInt } from 'three/src/math/MathUtils.js';

export type FeaturesConfig = {
    elevation: NoiseConfig;
    temperature: NoiseConfig;
    humidity: NoiseConfig;
};

export type NoiseConfig = {
    seed: string;
    scale: number;
    octaves: number;
    persistence: number;
    lacunarity: number;
};

export type PlanetConfig = {
    radius: number;
    elevationScale: number;
};

export type MarchingCubesConfig = {
    blendMode: 'linear' | 'cubic' | 'nearest' | 'middle';
    interval: number;
};

export type MarchingCubesBlendMode = MarchingCubesConfig['blendMode'];

export type UserConfig = {
    features: FeaturesConfig;
    planet: PlanetConfig;
    marchingCubes: MarchingCubesConfig;
};

function randSeed(): string {
    return randInt(0, 1000000000).toString();
}

export const defaultUserConfig: UserConfig = {
    features: {
        elevation: {
            seed: randSeed(),
            scale: 1,
            octaves: 8,
            persistence: 0.5,
            lacunarity: 2.0,
        },
        temperature: {
            seed: randSeed(),
            scale: 1,
            octaves: 8,
            persistence: 0.5,
            lacunarity: 2.0,
        },
        humidity: {
            seed: randSeed(),
            scale: 1,
            octaves: 8,
            persistence: 0.5,
            lacunarity: 2.0,
        },
    },
    planet: {
        radius: 1,
        elevationScale: 3,
    },
    marchingCubes: {
        blendMode: 'linear',
        interval: 0.01,
    },
};
