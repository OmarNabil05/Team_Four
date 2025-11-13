import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/common/PageTransition';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/ui/Button';
import { createReservation } from '../services/reservationService';
import type { ReservationInput } from '../types';

const initialForm: ReservationInput = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  message: '',
};

export const ReservationsPage = () => {
  const [form, setForm] = useState<ReservationInput>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const timeSlots = useMemo(
    () => [
      '05:30 PM',
      '06:00 PM',
      '06:30 PM',
      '07:00 PM',
      '07:30 PM',
      '08:00 PM',
      '08:30 PM',
      '09:00 PM',
    ],
    [],
  );

  const handleChange = (
    field: keyof ReservationInput,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await createReservation(form);
      setFeedback({ type: 'success', message: 'Thank you. Our concierge will confirm shortly.' });
      setForm(initialForm);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to complete reservation',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-sheen rounded-3xl p-10"
          >
            <SectionHeading
              align="left"
              eyebrow="Reservations"
              title="Reserve your evening"
              description="Complete the form and our reservations concierge will contact you to finalize your experience."
            />

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
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

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/70">
                  Phone
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(event) => handleChange('phone', event.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/70">
                  Guests
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={form.guests}
                    onChange={(event) => handleChange('guests', Number(event.target.value))}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/70">
                  Date
                  <input
                    type="date"
                    min={minDate}
                    required
                    value={form.date}
                    onChange={(event) => handleChange('date', event.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/70">
                  Time
                  <select
                    required
                    value={form.time}
                    onChange={(event) => handleChange('time', event.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-accent/60 focus:outline-none focus:ring-0"
                  >
                    <option value="" disabled>
                      Select a seating
                    </option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot} className="bg-night">
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="space-y-2 text-sm text-white/70">
                Occasion or notes
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(event) => handleChange('message', event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  placeholder="Tell us about dietary preferences, celebrations, or requests."
                />
              </label>

              {feedback && (
                <p
                  className={
                    feedback.type === 'success' ? 'text-sm text-emerald-400' : 'text-sm text-red-400'
                  }
                >
                  {feedback.message}
                </p>
              )}

              <Button type="submit" loading={submitting} className="w-full">
                Submit Reservation Request
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass-sheen rounded-3xl p-10">
              <SectionHeading
                align="left"
                eyebrow="Concierge"
                title="We craft evenings tailored to you"
              />
              <p className="mt-4 text-sm text-white/70">
                Prefer to speak to a host? Call us at
                <a href="tel:+12125559819" className="ml-2 text-accent transition hover:text-accent/70">
                  +1 (212) 555-9819
                </a>
                .
              </p>
              <p className="text-sm text-white/70">
                For private dining inquiries, email
                <a
                  href="mailto:events@spotrestaurant.com"
                  className="ml-2 text-accent transition hover:text-accent/70"
                >
                  events@spotrestaurant.com
                </a>
                .
              </p>
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
        </div>
      </section>
    </PageTransition>
  );
};
