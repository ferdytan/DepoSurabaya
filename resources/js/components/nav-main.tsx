import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(item.href)}
                            tooltip={{ children: item.shortcut ? `${item.title} (${item.shortcut})` : item.title }}
                            className="group-has-data-[sidebar=menu-badge]/menu-item:pr-7"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="size-4 shrink-0" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        {item.shortcut && (
                            <SidebarMenuBadge className="text-[10px] font-mono text-muted-foreground/60 border border-border/40 rounded px-1.5 py-0 h-4 min-w-4 pointer-events-none group-data-[collapsible=icon]:hidden">
                                {item.shortcut}
                            </SidebarMenuBadge>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
