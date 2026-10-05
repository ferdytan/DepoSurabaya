
export const MENU_SHORTCUTS: Record<string, { title: string; href: string }> = {
    d: { title: 'Dashboard', href: '/dashboard' },
    u: { title: 'User', href: '/users' },
    c: { title: 'Customers', href: '/customers' },
    s: { title: 'Shippers', href: '/shippers' },
    p: { title: 'Products', href: '/products' },
    o: { title: 'Orders', href: '/orders' },
    t: { title: 'Temperature', href: '/temperature-records' },
    i: { title: 'Invoices', href: '/invoices' },
    r: { title: 'Report', href: '/reports' },
    k: { title: 'Karantina', href: '/karantina' },
};

export function useMenuKeyboardShortcuts() {
    // Navigasi keyboard shortcuts dinonaktifkan sesuai permintaan pengguna
}
