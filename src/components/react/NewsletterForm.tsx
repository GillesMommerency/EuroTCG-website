import { cn } from '@/lib/utils';
import de from '@/locales/de';
import en from '@/locales/en';
import es from '@/locales/es';
import fr from '@/locales/fr';
import it from '@/locales/it';
import nl from '@/locales/nl';
import React, { useState } from 'react';

interface NewsletterFormProps {
  locale: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ locale }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Get translations from locale files
  const translations = {
    en,
    fr,
    de,
    es,
    it,
    nl,
  };

  const t = translations[locale as keyof typeof translations] || en;
  const text = t.underConstruction.newsletter;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage(text.error);
      return;
    }

    setStatus('loading');

    try {
      // Simulate API call - replace with actual newsletter service
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would integrate with your newsletter service
      // For example: MailerLite, Buttondown, ConvertKit, etc.

      setStatus('success');
      setMessage(text.success);
      setEmail('');
    } catch {
      setStatus('error');
      setMessage(text.error);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <h3 className="text-foreground mb-2 text-2xl font-bold">{text.title}</h3>
        <p className="text-muted-foreground">{text.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={text.placeholder}
            className={cn(
              'border-input bg-background w-full rounded-lg border px-4 py-3',
              'text-foreground placeholder:text-muted-foreground',
              'focus:ring-primary focus:border-transparent focus:outline-none focus:ring-2',
              'transition-colors duration-200',
              status === 'error' && 'border-destructive focus:ring-destructive'
            )}
            disabled={status === 'loading'}
            aria-label={text.placeholder}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className={cn(
            'w-full rounded-lg px-6 py-3 font-medium transition-all duration-200',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'flex items-center justify-center gap-2'
          )}
        >
          {status === 'loading' && (
            <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          )}
          {status === 'loading' ? text.loading : text.button}
        </button>

        {message && (
          <div
            className={cn(
              'rounded-lg p-3 text-center text-sm',
              status === 'success' &&
                'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
              status === 'error' && 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
            )}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}
      </form>

      <p className="text-muted-foreground mt-4 text-center text-xs">{text.privacy}</p>
    </div>
  );
};

export default NewsletterForm;
