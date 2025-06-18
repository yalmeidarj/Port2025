// components/contact-form.tsx
'use client';
import * as React from 'react';
import { toast } from 'sonner';  
import { Button } from './ui/button';

interface Props {
    placeholders: {
        first: string;
        // last: string;
        email: string;
        message: string;
        subject: string;
        send: string;
    };
}

export default function ContactForm({ placeholders }: Props) {
    const [submitting, setSubmitting] = React.useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        const form = e.currentTarget;
        const res = await fetch('/api/send', { method: 'POST', body: new FormData(form) });
        const { ok } = await res.json();

        if (ok) {
            toast.success('Mensagem enviada! 🎉');
            form.reset();
        } else {
            toast.error('Ops! Não foi possível enviar. Tente de novo.');
        }
        setSubmitting(false);
    }

    return (
        // <form onSubmit={handleSubmit} className="space-y-6">
            <form onSubmit={handleSubmit}  className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                        {placeholders.first}
                        </label>
                        <input
                            id="name"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                        placeholder={placeholders.first}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                        {placeholders.email}
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                        placeholder={placeholders.email}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                    {placeholders.subject}
                    </label>
                    <input
                        id="subject"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    placeholder={placeholders.subject}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                    {placeholders.message}
                    </label>
                    <textarea
                        id="message"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    placeholder={placeholders.message}
                    />
                </div>
                <Button type="submit" className="w-full">
                {placeholders.send}
                </Button>
            </form>

    );
}
