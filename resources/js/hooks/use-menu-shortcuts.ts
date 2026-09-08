import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export const MENU_SHORTCUTS: Record<string, { title: string; href: string }> = {
    d: { title: 'Dashboard', href: '/dashboard' },
    u: { title: 'User', href: '/users' },
    c: { title: 'Customers', href: '/customers' },
    s: { title: 'Shippers', href: '/shippers' },
    p: { title: 'Products', href: '/products' },
    o: { title: 'Orders', href: '/orders' },
    t: { title: 'Temperature', href: '/temperature-records' },
    i: { title: 'Invoices', href: '/invoices' },
    k: { title: 'Karantina', href: '/karantina' },
};

export function useMenuKeyboardShortcuts() {
    const { auth } = usePage().props as { auth?: { user?: { role_id: number } } };
    const roleId = auth?.user?.role_id;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Abaikan jika tombol modifier sedang ditekan (Ctrl, Cmd/Meta, Alt)
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            // Abaikan jika fokus sedang berada pada elemen form atau konten yang dapat diedit
            const target = event.target as HTMLElement | null;
            if (!target) return;

            const tagName = target.tagName?.toLowerCase();
            if (
                tagName === 'input' ||
                tagName === 'textarea' ||
                tagName === 'select' ||
                target.isContentEditable ||
                target.getAttribute('contenteditable') === 'true' ||
                target.closest('input, textarea, select, [contenteditable="true"]') !== null
            ) {
                return;
            }

            // Abaikan jika ada modal/dialog yang sedang terbuka
            if (
                target.closest('[role="dialog"]') !== null ||
                document.querySelector('[role="dialog"][data-state="open"]') !== null ||
                document.querySelector('[aria-modal="true"]') !== null
            ) {
                return;
            }

            const key = event.key?.toLowerCase();
            const targetMenu = MENU_SHORTCUTS[key];

            if (targetMenu) {
                // Batasan role sederhana (Checker: hanya dashboard & orders, dsb)
                if (roleId === 3 && !['/dashboard', '/orders'].includes(targetMenu.href)) {
                    return;
                }
                if (roleId === 2 && ['/users', '/products'].includes(targetMenu.href)) {
                    return;
                }
                if (roleId === 4 && targetMenu.href !== '/dashboard') {
                    return;
                }

                // Jangan navigasi ulang jika sudah di halaman tersebut
                if (window.location.pathname === targetMenu.href) {
                    return;
                }

                event.preventDefault();
                router.visit(targetMenu.href);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [roleId]);
}
