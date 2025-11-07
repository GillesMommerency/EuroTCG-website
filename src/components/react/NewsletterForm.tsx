import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  locale: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ locale }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Simple translations for now
  const t = {
    en: {
      title: 'Stay Updated',
      description: 'Be the first to know when we launch',
      placeholder: 'Enter your email address',
      button: 'Notify Me',
      success: "Thank you! We'll keep you updated.",
      error: 'Please enter a valid email address.',
      loading: 'Subscribing...',
    },
    fr: {
      title: 'Restez informé',
      description: 'Soyez le premier à savoir quand nous lancerons',
      placeholder: 'Entrez votre adresse e-mail',
      button: 'Me notifier',
      success: 'Merci ! Nous vous tiendrons au courant.',
      error: 'Veuillez entrer une adresse e-mail valide.',
      loading: 'Inscription...',
    },
  };

  const text = t[locale as keyof typeof t] || t.en;

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
    } catch (error) {
      setStatus('error');
      setMessage(text.error);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <h3 className="text-foreground mb-2 text-2xl font-bold">{text.title}</h3>
        <p className="text-muted-foreground">{text.description}</p>
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

      <p className="text-muted-foreground mt-4 text-center text-xs">
        {locale === 'fr'
          ? 'Nous respectons votre vie privée. Pas de spam, désabonnement facile.'
          : 'We respect your privacy. No spam, easy unsubscribe.'}
      </p>
    </div>
  );
};

export default NewsletterForm;
