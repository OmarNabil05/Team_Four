import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";
import { SectionHeading } from "../components/common/SectionHeading";
import { Button } from "../components/ui/Button";
import { createReservation } from "../services/reservationService";
import type { ReservationInput } from "../types";

const initialForm: ReservationInput = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: 2,
  message: "",
};

export const ReservationsPage = () => {
  const [form, setForm] = useState<ReservationInput>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const timeSlots = useMemo(
    () => [
      "05:30 PM",
      "06:00 PM",
      "06:30 PM",
      "07:00 PM",
      "07:30 PM",
      "08:00 PM",
      "08:30 PM",
      "09:00 PM",
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
      setFeedback({
        type: "success",
        message: "تمام! فريقنا هيتواصل معاك لتأكيد الحجز.",
      });
      setForm(initialForm);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "حصلت مشكلة ومقدرناش نكمل الحجز دلوقتي.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
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
              eyebrow="الحجوزات"
              title="احجز أمسياتك"
              description="املى الفورم وفريقنا هيتواصل معاك لتأكيد الحجز وتحضير تجربتك."
            />

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
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

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/70">
                  رقم الهاتف
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/70">
                  عدد الضيوف
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={form.guests}
                    onChange={(event) =>
                      handleChange("guests", Number(event.target.value))
                    }
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/70">
                  التاريخ
                  <input
                    type="date"
                    min={minDate}
                    required
                    value={form.date}
                    onChange={(event) =>
                      handleChange("date", event.target.value)
                    }
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/70">
                  الوقت
                  <select
                    required
                    value={form.time}
                    onChange={(event) =>
                      handleChange("time", event.target.value)
                    }
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-accent/60 focus:outline-none focus:ring-0"
                  >
                    <option value="" disabled>
                      احجز ترابيزتك{" "}
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
                اكتب المناسبة أو أي ملاحظات عندك
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(event) =>
                    handleChange("message", event.target.value)
                  }
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  placeholder="احكي لنا عن أي احتياجات أكل، مناسبات، أو أي طلبات خاصة عندك."
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
                ارسل طلب الحجز{" "}
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
                eyebrow="الكونسيرج"
                title="بنجهزلك أمسيات على حسب ذوقك"
              />
              <p className="mt-4 text-sm text-white/70">
                تحب تتكلم مع حد من فريقنا؟ اتصل على
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
              <p className="text-sm text-white/70">
                لو عندك استفسار عن العزومات الخاصة، ابعتلنا إيميل على
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=yassminebassem991@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-accent transition hover:text-accent/70"
                >
                  reservations@spot-eg.com
                </a>
              </p>
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
        </div>
      </section>
    </PageTransition>
  );
};
