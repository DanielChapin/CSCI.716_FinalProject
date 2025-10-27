import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

export type Props = {};

export default function PlanetMenuBar(_props: Props) {
    return <Menubar>
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem>Download</MenubarItem>
            </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
                <MenubarCheckboxItem>Wireframe</MenubarCheckboxItem>
                <MenubarCheckboxItem>Use Textures</MenubarCheckboxItem>
                <MenubarCheckboxItem>Auto Rotate</MenubarCheckboxItem>
            </MenubarContent>
        </MenubarMenu>
    </Menubar>
}