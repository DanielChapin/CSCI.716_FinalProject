import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { useEffect, useState } from "react";

export type Props = {
    onWireframeChange?: (wireframe: boolean) => void;
    onColorsChange?: (colors: boolean) => void;
    onAutoRotateChange?: (autoRotate: boolean) => void;
    onDownload?: () => void;
};

export default function PlanetMenuBar(props: Props) {
    const {
        onWireframeChange = undefined,
        onColorsChange = undefined,
        onAutoRotateChange = undefined,
        onDownload = undefined,
    } = props;

    const [wireframe, setWireframe] = useState(false);
    const [colors, setColors] = useState(true);
    const [autoRotate, setAutoRotate] = useState(false);

    useEffect(() => onWireframeChange?.(wireframe), [wireframe, onWireframeChange]);
    useEffect(() => onColorsChange?.(colors), [colors, onColorsChange]);
    useEffect(() => onAutoRotateChange?.(autoRotate), [autoRotate, onAutoRotateChange]);

    return <Menubar>
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={_e => onDownload?.()}>Download</MenubarItem>
            </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
                <MenubarCheckboxItem onCheckedChange={setWireframe} checked={wireframe}>Wireframe</MenubarCheckboxItem>
                <MenubarCheckboxItem onCheckedChange={setColors} checked={colors}>Use Colors</MenubarCheckboxItem>
                <MenubarCheckboxItem onCheckedChange={setAutoRotate} checked={autoRotate}>Auto Rotate</MenubarCheckboxItem>
            </MenubarContent>
        </MenubarMenu>
    </Menubar>
}