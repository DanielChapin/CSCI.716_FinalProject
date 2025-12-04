import { randInt } from 'three/src/math/MathUtils.js';
import * as Edge from '@/transient/algo/algo';

export type FeaturesConfig = {
    seed: string;
    waterLevel: number;
    elevation: NoiseConfig;
    temperature: NoiseConfig;
    humidity: NoiseConfig;
};

export type FeaturesConfigVariants = keyof Omit<Omit<FeaturesConfig, 'seed'>, 'waterLevel'>;

export type NoiseConfig = {
    scale: number;
    persistence: number;
    lacunarity: number;
    octaves: number;
};

export type PlanetConfig = {
    heightAmplitude: number;
    radius: number;
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
        seed: randSeed(),
        waterLevel: 0.5,
        elevation: {
            scale: 4,
            octaves: 8,
            persistence: 0.5,
            lacunarity: 2.0,
        },
        temperature: {
            scale: 1,
            octaves: 4,
            persistence: 0.5,
            lacunarity: 2.0,
        },
        humidity: {
            scale: 1,
            octaves: 4,
            persistence: 0.5,
            lacunarity: 2.0,
        },
    },
    planet: {
        radius: 0.5,
        heightAmplitude: 0.15,
    },
    marchingCubes: {
        blendMode: 'linear',
        interval: 0.075,
    },
};

export function toEdgeRepr(config: UserConfig, module: Edge.MainModule): Edge.UserConfig {
    const {
        features,
        marchingCubes: { blendMode, interval },
        planet,
    } = config;

    return {
        features,
        marchingCubes: { interval, blendMode: module.MarchingCubesBlendMode[blendMode] },
        planet,
    } satisfies Edge.UserConfig;
}
