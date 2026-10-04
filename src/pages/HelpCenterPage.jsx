import React, { useState, useMemo } from 'react';
import {
  Search, MessageSquare, FileText, LifeBuoy, ChevronDown, Mail,
} from 'lucide-react';
import { inputLgIcon } from '../components/formStyles';

const faqs = [
  { q: 'How do I export my data?', a: 'You can export your data as a CSV or PDF from the Analytics page.' },
  { q: 'How do I invite team members?', a: 'Go to Settings > Team and enter the email addresses of your colleagues.' },
  { q: 'Where can I find billing info?', a: 'Your billing details are available under the Settings > Billing tab.' },
  { q: 'Is there an API available?', a: 'Yes, we provide a REST API for all core functionalities. Check our developer docs.' },
];

const CHANNELS = [
  {
    icon: FileText,
    title: 'Documentation',
    desc: 'Detailed guides on using every feature of DashCore.',
    tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  },
  {
    icon: MessageSquare,
    title: 'Community Forum',
    desc: 'Discuss and share tips with other users.',
    tone: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400',
  },
  {
    icon: LifeBuoy,
    title: 'Contact Support',
    desc: 'Get direct help from our expert support team.',
    tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
];

export default function HelpCenterPage() {
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Help Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Find answers to common questions or contact our support team.
        </p>
        <div className="relative max-w-xl mx-auto pt-4">
          <Search className="absolute left-4 top-1/2 translate-y-[calc(-50%+8px)] text-slate-400" size={20} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for help..."
            className={inputLgIcon}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <button
              key={channel.title}
              type="button"
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3 hover:border-blue-400 hover:shadow-md transition-all text-left sm:text-center"
            >
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${channel.tone}`}>
                <Icon size={24} />
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white">{channel.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{channel.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h3>

        {filteredFaqs.length === 0 ? (
          <div className="py-10 text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm">No articles match “{query}”.</p>
            <a
              href="mailto:support@dashcore.app"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Mail size={15} />
              Contact support instead
            </a>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="font-medium text-slate-900 dark:text-white">{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
