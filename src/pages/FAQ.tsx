import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';

const faqs = [
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Visa, Mastercard, PayPal, Bancontact, iDEAL, and Apple Pay. All transactions are securely processed through our payment provider.',
  },
  {
    q: 'How long does shipping take?',
    a: 'We offer free worldwide shipping on orders over \u20AC150. European orders typically arrive within 3\u20135 business days. International orders outside Europe take 5\u201310 business days depending on the destination.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached. Please contact us at info@mancinimilano.com to initiate a return.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes! We ship worldwide with free shipping on orders over \u20AC150. Customs duties and import taxes may apply depending on your country and are the responsibility of the buyer.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order has been shipped, you will receive a confirmation email with a tracking number and link. You can use this to follow your package in real-time.',
  },
  {
    q: 'How do I find my size?',
    a: 'Please refer to our Size Guide for detailed measurements. If you\'re between sizes, we generally recommend sizing up for a more relaxed fit. Feel free to contact us for personalized sizing advice.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Layout>
      <section className="max-w-site mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <h1 className="font-heading text-3xl lg:text-[42px] tracking-heading uppercase text-foreground mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-12 max-w-md mx-auto">
          Can't find what you're looking for? Contact us at info@mancinimilano.com
        </p>

        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors pr-4">
                  {faq.q}
                </span>
                {open === i ? (
                  <Minus className="h-4 w-4 text-primary flex-shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="pb-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
