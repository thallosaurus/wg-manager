import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { IconPlus, IconNetwork } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router";

export function AppSidebar() {
    const [interfaces, setInterfaces] = useState(["wg0", "test1"]);
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/">Home</Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel>Interfaces</SidebarGroupLabel>
            <SidebarGroupContent>
            <SidebarMenu>
                {interfaces.map((v, i) => {
                    return (
                        <div key={i} className="flex gap-2 items-center">
                            <IconNetwork /><span>{v}</span>
                        </div>
                    )
                })}
                <div className="flex gap-2 items-center">
                    <IconPlus /><span>Add new</span>
                </div>
            </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>

        <SidebarMenu>

        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}