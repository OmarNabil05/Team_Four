import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/common/PageTransition';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/ui/Button';
import { submitContact } from '../services/contactService';

const initialState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export const ContactPage = () => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await submitContact(form);
      setFeedback({ type: 'success', message: 'Message received. Our concierge will respond shortly.' });
      setForm(initialState);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to send message',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <SectionHeading
              align="left"
              eyebrow="Contact"
              title="Connect with the Spot concierge"
              description="Whether you&apos;re planning an intimate celebration or requesting media assets, we’re here to assist."
            />

            <div className="glass-sheen rounded-3xl p-8">
              <div className="space-y-4 text-sm text-white/70">
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-accent/80">Phone</span>
                  <a href="tel:+12125559819" className="text-accent transition hover:text-accent/70">
                    +1 (212) 555-9819
                  </a>
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-accent/80">Email</span>
                  <a href="mailto:concierge@spotrestaurant.com" className="text-accent transition hover:text-accent/70">
                    concierge@spotrestaurant.com
                  </a>
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-accent/80">Location</span>
                  118 West 56th Street, New York, NY 10019
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-accent/80">Hours</span>
                  Tuesday – Sunday · 5:30 PM – 11:00 PM
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title="Spot on Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.897134998485!2d-73.98225322345572!3d40.76512627138602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f94a0e819b%3A0x2e8a09a1e237c54!2s118%20W%2056th%20St%2C%20New%20York%2C%20NY%2010019%2C%20USA!5e0!3m2!1sen!2sus!4v1705087890123!5m2!1sen!2sus"
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-sheen rounded-3xl p-10"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/70">
                  Name
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/70">
                  Email
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-white/70">
                Phone (optional)
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => handleChange('phone', event.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                />
              </label>

              <label className="space-y-2 text-sm text-white/70">
                Subject
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(event) => handleChange('subject', event.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                />
              </label>

              <label className="space-y-2 text-sm text-white/70">
                How can we assist?
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(event) => handleChange('message', event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                />
              </label>

              {feedback && (
                <p className={feedback.type === 'success' ? 'text-sm text-emerald-400' : 'text-sm text-red-400'}>
                  {feedback.message}
                </p>
              )}

              <Button type="submit" loading={submitting} className="w-full">
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};
