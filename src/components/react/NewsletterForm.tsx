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
      success: 'Thank you! We\'ll keep you updated.',
      error: 'Please enter a valid email address.',
      loading: 'Subscribing...'
    },
    fr: {
      title: 'Restez informé',
      description: 'Soyez le premier à savoir quand nous lancerons',
      placeholder: 'Entrez votre adresse e-mail',
      button: 'Me notifier',
      success: 'Merci ! Nous vous tiendrons au courant.',
      error: 'Veuillez entrer une adresse e-mail valide.',
      loading: 'Inscription...'
    }
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
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {text.title}
        </h3>
        <p className="text-muted-foreground">
          {text.description}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={text.placeholder}
            className={cn(
              "w-full px-4 py-3 rounded-lg border border-input bg-background",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "transition-colors duration-200",
              status === 'error' && "border-destructive focus:ring-destructive"
            )}
            disabled={status === 'loading'}
            aria-label={text.placeholder}
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className={cn(
            "w-full px-6 py-3 rounded-lg font-medium transition-all duration-200",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-2"
          )}
        >
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
          )}
          {status === 'loading' ? text.loading : text.button}
        </button>
        
        {message && (
          <div
            className={cn(
              "text-sm text-center p-3 rounded-lg",
              status === 'success' && "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
              status === 'error' && "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
            )}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}
      </form>
      
      <p className="text-xs text-muted-foreground text-center mt-4">
        {locale === 'fr' 
          ? "Nous respectons votre vie privée. Pas de spam, désabonnement facile."
          : "We respect your privacy. No spam, easy unsubscribe."
        }
      </p>
    </div>
  );
};

export default NewsletterForm;