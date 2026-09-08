import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';

const rawAppName = import.meta.env.VITE_APP_NAME || '';
const appName = rawAppName && rawAppName !== 'Laravel' ? rawAppName : 'Depo Surabaya';

createInertiaApp({
    title: (title) => {
        if (!title) return appName;
        if (title.includes(appName) || title.includes('Depo Surabaya')) {
            return title.replace(/\s*-\s*Laravel\s*$/i, '');
        }
        return `${title} - ${appName}`;
    },
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
// initializeTheme();
