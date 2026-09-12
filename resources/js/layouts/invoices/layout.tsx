import { PropsWithChildren } from 'react';

export default function InvoicesLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') return null;

    return (
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            {children}
        </div>
    );
}
