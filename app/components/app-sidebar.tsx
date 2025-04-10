import * as React from "react";
import {
  IconActivity,
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
  IconTag,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "~/components/nav-main";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import Logo from "./ui/logo";
import { useRequireUser, useUser } from "~/hooks/use-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar:
      "https://riptar.gregermendle.com/dither?url=https://riptar.gregermendle.com/riptar/gexx?format=png&height=32&width=32",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: IconTag,
    },
    {
      title: "Analytics",
      disabled: true,
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Activity",
      url: "#",
      icon: IconActivity,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useRequireUser();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <Logo size={20} />
                <a href="/" className="flex items-center gap-3">
                  <span className="text-base font-semibold">gexx</span>
                </a>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
