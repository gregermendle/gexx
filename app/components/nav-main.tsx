import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import { useLinkClickHandler } from "react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { AddInventoryDialog } from "./add-inventory-dialog";
import { DialogTrigger } from "./ui/dialog";

interface NavItem {
  title: string;
  url: string;
  icon?: Icon;
  disabled?: boolean;
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <AddInventoryDialog>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Quick add</span>
                </SidebarMenuButton>
              </DialogTrigger>
            </AddInventoryDialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarButton item={item} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function SidebarButton({ item }: { item: NavItem }) {
  const click = useLinkClickHandler<HTMLButtonElement>(item.url);

  return (
    <SidebarMenuButton
      tooltip={item.title}
      disabled={item.disabled}
      onClick={click}
    >
      {item.icon && <item.icon />}
      <span>{item.title}</span>
    </SidebarMenuButton>
  );
}
