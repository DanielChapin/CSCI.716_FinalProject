import { defaultUserConfig, type FeaturesConfigVariants, type MarchingCubesBlendMode, type NoiseConfig, type UserConfig } from '@/lib/user-config';
import { Button } from './components/ui/button';
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { useState } from 'react';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Slider } from './components/ui/slider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './components/ui/select';
import { type DeepPartial, mergeOptions } from '@hyperse/deep-merge';

export type Props = {
    config?: UserConfig;
    onGenerate?: (config: UserConfig) => void;
};

/**
 * @description A View (and Controller) for the user configuration of the marching cubes demonstration.
 *              This component displays all of the generation options and allows the user to edit them.
 *              When the generate button is pressed, the onSubmit function is called if supplied.
 */
export default function UserConfigView(props: Props) {
    const { config: suppliedConfig = undefined, onGenerate = undefined } = props;

    const [config, setConfig] = useState<UserConfig>(suppliedConfig ?? { ...defaultUserConfig });
    const [currentFeature, setCurrentFeature] = useState<FeaturesConfigVariants>('elevation');

    function updateConfig(update: DeepPartial<UserConfig>) {
        setConfig(mergeOptions(config, update));
    }

    function updateCurrentFeature(update: DeepPartial<NoiseConfig>) {
        updateConfig({ features: { [currentFeature]: update } });
    }

    function generatePressed() {
        onGenerate?.(config);
    }

    return (
        <div className='flex flex-col w-full h-full'>
            <ScrollArea className='flex flex-col w-full h-full'>
                <p className='text-xl'>
                    <b>RNG Parameters</b>
                </p>

                <Label htmlFor='seed'>Seed</Label>
                <Input
                    className='max-w-sm'
                    id='seed'
                    type='text'
                    placeholder='seed'
                    value={config.features.seed}
                    onChange={(event) => updateConfig({ features: { seed: event.target.value } })}
                />

                <Label htmlFor='noise-feature'>Noise Feature</Label>
                <Select onValueChange={(feature) => setCurrentFeature(feature as FeaturesConfigVariants)} value={currentFeature}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select a noise feature' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Noise Features</SelectLabel>
                            <SelectItem value='elevation'>Elevation</SelectItem>
                            <SelectItem value='temperature'>Temperature</SelectItem>
                            <SelectItem value='humidity'>Humidity</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Label htmlFor='scale'>Scale</Label>
                <Slider
                    className='max-w-sm'
                    id='scale'
                    min={0.01}
                    max={10}
                    step={0.01}
                    value={[config.features[currentFeature].scale]}
                    onValueChange={(values) => updateCurrentFeature({ scale: values[0] })}
                />

                <Label htmlFor='octaves'>Octaves</Label>
                <Slider
                    className='max-w-sm'
                    id='octaves'
                    min={1}
                    max={8}
                    step={1}
                    value={[config.features[currentFeature].octaves]}
                    onValueChange={(values) => updateCurrentFeature({ octaves: values[0] })}
                />

                <Label htmlFor='persistence'>Persistence</Label>
                <Slider
                    className='max-w-sm'
                    id='persistence'
                    min={0.01}
                    max={1}
                    step={0.01}
                    value={[config.features[currentFeature].persistence]}
                    onValueChange={(values) => updateCurrentFeature({ persistence: values[0] })}
                />

                <Label htmlFor='lacunarity'>Lacunarity</Label>
                <Slider
                    className='max-w-sm'
                    id='lacunarity'
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={[config.features[currentFeature].lacunarity]}
                    onValueChange={(values) => updateCurrentFeature({ lacunarity: values[0] })}
                />

                <Separator className='m-2' orientation='horizontal' />

                <p className='text-xl'>
                    <b>Planet Parameters</b>
                </p>

                <Label htmlFor='radius'>Radius</Label>
                <Slider
                    className='max-w-sm'
                    id='radius'
                    min={0.01}
                    max={1}
                    step={0.01}
                    value={[config.planet.radius]}
                    onValueChange={(values) => updateConfig({ planet: { radius: values[0] } })}
                />

                <Label htmlFor='height-amplitude'>Height Amplitude</Label>
                <Slider
                    className='max-w-sm'
                    id='height-amplitude'
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={[config.planet.heightAmplitude]}
                    onValueChange={(values) => updateConfig({ planet: { heightAmplitude: values[0] } })}
                />

                <Separator className='m-2' orientation='horizontal' />

                <p className='text-xl'>
                    <b>Marching Cubes Parameters</b>
                </p>

                <Label htmlFor='vertex-blend'>Vertex Blend Mode</Label>
                <Select
                    value={config.marchingCubes.blendMode}
                    onValueChange={(blendMode) => updateConfig({ marchingCubes: { blendMode: blendMode as MarchingCubesBlendMode } })}
                >
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select a blend mode' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Blend Modes</SelectLabel>
                            <SelectItem value='linear'>Linear</SelectItem>
                            <SelectItem value='cubic'>Cubic*</SelectItem>
                            <SelectItem value='nearest'>Nearest</SelectItem>
                            <SelectItem value='middle'>Middle</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {config.marchingCubes.blendMode === 'cubic' && (
                    <p className='text-sm'>
                        *The cubic vertex blending mode is added as a demonstration of the requirement of symmetry of the vertex blending mode.
                    </p>
                )}

                <Label htmlFor='mc-interval'>Sample Interval</Label>
                <Slider
                    className='max-w-sm'
                    id='mc-interval'
                    min={0.0025}
                    max={0.1}
                    step={0.0001}
                    value={[config.marchingCubes.interval]}
                    onValueChange={(values) => updateConfig({ marchingCubes: { interval: values[0] } })}
                />

                <ScrollBar orientation='vertical' hidden={false} />
            </ScrollArea>
            <div className='bottom-0 h-min w-full'>
                <Separator orientation='horizontal' />
                <div className='w-full p-2'>
                    <Button className='w-full' onClick={generatePressed}>
                        <b>Generate!</b>
                    </Button>
                </div>
            </div>
        </div>
    );
}
