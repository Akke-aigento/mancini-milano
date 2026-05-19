import { useState } from 'react';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { newsletterAPI } from '@/integrations/sellqo/api';

interface Props {
  source?: string;
  className?: string;
}

const ClassicNewsletter = ({ source = 'classic-launch', className = '' }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      // newsletterAPI currently accepts only `email`; source kept for future segmentation.
      void source;
      await newsletterAPI.subscribe(email);
      setSubmitted(true);
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`flex items-center justify-center gap-2 text-sm text-classic-gold ${className}`}>
        <Check className="h-4 w-4" />
        <span>Thank you. We will be in touch.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 max-w-md mx-auto ${className}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-classic-gold focus:outline-none transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 text-[11px] uppercase font-medium tracking-[0.2em] border border-classic-gold text-classic-gold hover:bg-classic-gold hover:text-background transition-colors disabled:opacity-50"
      >
        {loading ? 'Subscribing…' : 'Notify Me'}
      </button>
    </form>
  );
};

export default ClassicNewsletter;
