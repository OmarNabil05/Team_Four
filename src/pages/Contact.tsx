import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";
import { SectionHeading } from "../components/common/SectionHeading";
import { Button } from "../components/ui/Button";
import { submitContact } from "../services/contactService";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export const ContactPage = () => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await submitContact(form);
      setFeedback({
        type: "success",
        message: "Message received. Our concierge will respond shortly.",
      });
      setForm(initialState);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to send message",
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
animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <SectionHeading
              align="left"
              eyebrow="تواصل معانا"
              title="تعالى اتعرف على خدمة Spot Concierge"
              description="سواء ناويين تعملوا مناسبة صغيرة، إحنا هنا عشان نساعدكم."
            />

            <div className="glass-sheen rounded-3xl p-8">
              <div className="space-y-4 text-sm text-white/70">
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-accent/80">
                    Phone
                  </span>
                  <a
                    href="https://wa.me/201234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-accent transition hover:text-accent/70"
                    style={{ direction: "ltr", textAlign: "right" }}
                  >
                    +20 123 456 7890
                  </a>
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-accent/80">
                    Email
                  </span>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=yassminebassem991@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-accent transition hover:text-accent/70"
                  >
                    reservations@spot-eg.com
                  </a>
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-accent/80">
                    المكان
                  </span>
                  شارع 26 يوليو، الزمالك، القاهرة
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-accent/80">
                    ساعات العمل
                  </span>
                  يومياً · 5:00 مساءً – 12:00 منتصف الليل{" "}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title="Spot على خرائط جوجل"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.4515683240297!2d31.242308799999996!3d30.052588099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584095707d8ae5%3A0x10132076f04d5553!2zMjYg2YrZiNmE2YrZiNiMINmF2K3Yp9mB2LjYqSDYp9mE2YLYp9mH2LHYqeKArA!5e0!3m2!1sar!2seg!4v1763230570624!5m2!1sar!2seg"
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
animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-sheen rounded-3xl p-10"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/70">
                  الاسم
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) =>
                      handleChange("name", event.target.value)
                    }
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/70">
                  الايميل
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-white/70">
                رقم الهاتف
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    handleChange("phone", event.target.value)
                  }
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                />
              </label>

              <label className="space-y-2 text-sm text-white/70">
                الموضوع{" "}
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(event) =>
                    handleChange("subject", event.target.value)
                  }
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                />
              </label>

              <label className="space-y-2 text-sm text-white/70">
                ازاي نقدر نساعدك؟{" "}
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(event) =>
                    handleChange("message", event.target.value)
                  }
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                />
              </label>

              {feedback && (
                <p
                  className={
                    feedback.type === "success"
                      ? "text-sm text-emerald-400"
                      : "text-sm text-red-400"
                  }
                >
                  {feedback.message}
                </p>
              )}

              <Button type="submit" loading={submitting} className="w-full">
                ارسل{" "}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};
