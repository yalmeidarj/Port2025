import { Phone, Mail, MapPin } from 'lucide-react'
import { getMessages, getTranslations } from 'next-intl/server';
import ContactForm from './contact-form';
 

export default async function Contact() {
    const t = await getTranslations(('contact'));
    const messages = await getMessages();
    const info = (messages.contact?.info || []) as { label: string; value: string }[]
    const icons = [Phone, Mail, MapPin]

    return (
        <section id="contact" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="section-title">{t('title')}</h2>
                <p className="section-sub max-w-2xl mx-auto">{t('subtitle')}</p>
                <div className="mt-16 grid lg:grid-cols-2 gap-16 text-left">
                    <ContactForm
                        action="/api/send"
                        placeholders={{
                            first: t('form.first'),
                            last: t('form.last'),
                            email: t('form.email'),
                            message: t('form.message'),
                            send: t('form.send'),
                        }}
                    />

                    <div className="space-y-8">
                        {info.map(({ label, value }, idx) => {
                            const Icon = icons[idx] || Phone
                            return (
                                <div key={label} className="flex items-start">
                                    <div className="bg-[#6BD8DA]/10 p-3 rounded-lg mr-4">
                                        <Icon className="text-[#6BD8DA]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#1F1B1C] mb-1">{label}</h3>
                                        <p className="text-[#6B7280] whitespace-pre-line">{value}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
