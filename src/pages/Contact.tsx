import { useState } from 'react';
import { Mail, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { contactAPI } from '@/integrations/sellqo/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactAPI.submit(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <Layout>
      <section className="max-w-site mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <h1 className="font-heading text-3xl lg:text-[42px] tracking-heading uppercase text-foreground mb-12 text-center">
          Get in Touch
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 max-w-4xl mx-auto">
          <div>
            {status === 'success' ? (
              <div className="py-16 text-center">
                <h2 className="font-heading text-xl tracking-heading uppercase text-foreground mb-3">Message Sent</h2>
                <p className="text-sm text-muted-foreground mb-6">Thank you for reaching out. We'll get back to you within 24–48 hours.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-xs uppercase tracking-button text-primary hover:text-gold-hover transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-button font-medium text-foreground mb-2">Name</label>
                  <input type="text" required value={form.name} onChange={update('name')}
                    className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-button font-medium text-foreground mb-2">Email</label>
                  <input type="email" required value={form.email} onChange={update('email')}
                    className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-button font-medium text-foreground mb-2">Subject</label>
                  <input type="text" required value={form.subject} onChange={update('subject')}
                    className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-button font-medium text-foreground mb-2">Message</label>
                  <textarea required value={form.message} onChange={update('message')} rows={5}
                    className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Your message..." />
                </div>
                {status === 'error' && (
                  <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
                )}
                <button type="submit" disabled={status === 'sending'}
                  className="bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors disabled:opacity-50">
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-button font-medium text-foreground mb-3">Contact</h3>
              <div className="space-y-3">
                <a href="mailto:info@mancinimilano.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  info@mancinimilano.com
                </a>
                <a href="https://www.instagram.com/mancinimilanostore/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  @mancinimilanostore
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-button font-medium text-foreground mb-3">Response Time</h3>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary mt-0.5" />
                <p>We typically respond within 24–48 hours during business days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
