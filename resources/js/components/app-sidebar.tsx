import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Book, Database, FileSpreadsheet, LayoutGrid, Package, Paperclip, Shield, SquareUserRound, Tag, Thermometer, Truck, User } from 'lucide-react';
import AppLogo from './app-logo';

// Definisikan item menu utama
const baseNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User',
        href: '/users',
        icon: User,
    },
    {
        title: 'Customers',
        href: '/customers',
        icon: SquareUserRound,
    },
    {
        title: 'Shippers',
        href: '/shippers',
        icon: Truck,
    },
    {
        title: 'Products',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Harga Khusus',
        href: '/special-prices',
        icon: Tag,
    },
    {
        title: 'Orders',
        href: '/orders',
        icon: Book,
    },
    {
        title: 'Temperature',
        href: '/temperature-records',
        icon: Thermometer,
    },
    {
        title: 'Invoices',
        href: '/invoices',
        icon: Paperclip,
    },
    {
        title: 'Report',
        href: '/reports',
        icon: FileSpreadsheet,
    },
    {
        title: 'Karantina',
        href: '/karantina',
        icon: Shield,
    },
];

// Footer tetap sama
const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Ada kendala?',
    //     href: 'https://wa.me/6285179995773',
    //     icon: MessageSquareCode,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth?: { user?: { role_id: number; role_name?: string } } };
    const roleId = auth?.user?.role_id;
    const roleName = auth?.user?.role_name;

    const isChecker = roleId == 3 || roleId == 5 || roleName === 'Ops Checker' || roleName === 'Checker';

    // Tentukan menu yang akan ditampilkan
    let filteredNavItems: NavItem[] = [];

    if (roleId == 1) {
        // Superadmin: semua menu
        filteredNavItems = baseNavItems;
    } else if (roleId == 2) {
        // Admin: tanpa User, Customers, Shippers, Products
        filteredNavItems = baseNavItems.filter((item) => !['/users', '/products'].includes(item.href));
    } else if (isChecker) {
        // Checker & Ops Checker: Orders dan Temperature (Monitoring Suhu)
        filteredNavItems = baseNavItems.filter((item) => ['/orders', '/temperature-records'].includes(item.href));
    } else if (roleId == 4) {
        // Karantina: Dashboard & Karantina
        filteredNavItems = [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Karantina',
                href: '/karantina',
                icon: Shield,
            },
        ];
    }
    // Role lain tidak mendapatkan menu apapun (atau bisa ditampilkan halaman kosong / error)

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isChecker ? '/orders' : '/dashboard'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
