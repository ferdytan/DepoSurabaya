import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { KeyRound, Palette, Sliders, User } from 'lucide-react';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage<SharedData>();
    const user = props.auth?.user as { role_id?: number } | undefined;
    const isAdmin = user?.role_id === 1 || user?.role_id === 2;

    const sidebarNavItems = [
        {
            title: 'Profil Saya',
            href: '/settings/profile',
            icon: User,
        },
        {
            title: 'Kata Sandi',
            href: '/settings/password',
            icon: KeyRound,
        },
        ...(isAdmin
            ? [
                  {
                      title: 'Pengaturan Sistem',
                      href: '/settings/system',
                      icon: Sliders,
                  },
              ]
            : []),
        {
            title: 'Tampilan',
            href: '/settings/appearance',
            icon: Palette,
        },
    ];

    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
            <div>
                <Heading
                    title="Pengaturan Akun & Sistem"
                    description="Kelola informasi profil, keamanan kata sandi, tampilan antarmuka, serta preferensi sistem depo."
                />
            </div>

            <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-8">
                <aside className="w-full lg:w-64 shrink-0">
                    <nav className="flex flex-row gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
                        {sidebarNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = url === item.href || url.startsWith(item.href);

                            return (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className={cn(
                                        'justify-start text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-all h-10 whitespace-nowrap',
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-2xs hover:bg-blue-100/70 hover:text-blue-800'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                    )}
                                >
                                    <Link href={item.href} prefetch className="flex items-center gap-2.5">
                                        <Icon className={cn('h-4 w-4', isActive ? 'text-blue-600' : 'text-gray-400')} />
                                        <span>{item.title}</span>
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="lg:hidden" />

                <div className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
                    <section className="w-full">{children}</section>
                </div>
            </div>
        </div>
    );
}
