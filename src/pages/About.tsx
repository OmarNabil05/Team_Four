import { motion } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";
import { SectionHeading } from "../components/common/SectionHeading";
import VID from "../assets/vid/bg.mp4";

const milestones = [
  {
    year: "2015",
    title: "البداية",
    description:
      "الشيف كريم محمود وشيف الحلويات مايا بدأوا يخلقوا تجربة طعام تجمع بين المطبخ الناري وفن تحضير الكوكتيلات.",
  },
  {
    year: "2018",
    title: "افتتاح Spot",
    description:
      "افتتح Spot في وسط القاهرة، مع صالة طعام فيها 50 كرسي، ديكور من النحاس المصقول والمرايا الدخانية وكاونتر الشيف مباشرة.",
  },
  {
    year: "2022",
    title: "تقدير ميشلان",
    description:
      "حصل المطعم على أول نجمة ميشلان من أجل منيو تذوق يحتفل بالنكهات الموسمية والتوابل العالمية.",
  },
  {
    year: "2024",
    title: "تجربة الساعة الذهبية",
    description:
      "قدّمنا تجربة أطباق قبل العشاء مع عطور صناعية وموسيقى مناسبة لكل موسم، لتجربة غامرة وحصرية.",
  },
];

const values = [
  {
    title: "أكل حسب الموسم",
    description:
      "كل طبق بيتغير حسب كل موسم صغير، وبنجيب المكونات من مزارع وبحرية متجددة بنتعامل معاها من سنين.",
  },
  {
    title: "استدامة وفخامة",
    description:
      "عندنا برنامج كوكتيلات من غير هدر، ومطبخ متكامل ودائري، والمكونات الفخمة كلها مأخوذة بأخلاقية، ده اللي بيميزنا.",
  },
  {
    title: "ضيافة شخصية",
    description:
      "فريق الكونسيارج بيظبطلك تجربة خاصة لكل ضيف – من عشاء اقتراحات خاصة لموسيقى جاز بعد العشاء – كله متظبط حسب القصة بتاعتك.",
  },
];

export const AboutPage = () => {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={VID} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-night" />
        </div>

        <div className="relative mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center gap-6 px-6 py-24 lg:px-10">
          <p className="text-xl uppercase tracking-[0.4em] text-accent">
            قصتنا
          </p>
          <h1 className="text-5xl tracking-wide text-white sm:text-6xl">
            روح Spot
          </h1>
          <p className="max-w-2xl text-base text-white/70">
            أسس الشيف كريم محمود Spot كملاذ لعشاق الخصوصية والتفاصيل والتجارب
            الحسية. صالة الطعام بتلمع مع موسيقى الجاز المختارة، ثريات قديمة،
            وأطباق تحفة.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mx-auto mt-16 max-w-6xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <SectionHeading
              align="left"
              eyebrow="فلسفتنا"
              title="أكل مستوحى من الغروب والأرض والملمس"
            />
            <p className="text-sm text-white/70">
              في Spot، بنقدّم رحلات تذوق بتحوّل المألوف لتجارب لا تُنسى. كل طبق
              بيجمع بين الدخان والملح والحموضة والرائحة ليعكس أفق المدينة اللي
              بنطلّع عليه. المختبر بتاع الحلويات بيحوّل السكر لزجاج، والبار
              بيخلط الأرواح المنقوعة، المرّات المنزلية، والفقاعات الفينتاج.
            </p>
            <p className="text-sm text-white/70">
              التفاني بتاع الشيف كريم محمود في سرد القصص من خلال الأكل متوازٍ مع
              التزام فريقنا بالدقة والدفء. كل ضيف بيستقبل بملاحظة شخصية، وكل
              مساء بيكون لوحة سينمائية حقيقية.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-sheen overflow-hidden rounded-3xl"
          >
            <img
              src="https://cdn-bnklg.nitrocdn.com/WQiharaAoSUWjdmYdQaoZKLXawgJIPOR/assets/images/source/rev-0a84595/www.upmenu.com/wp-content/uploads/2023/10/executive-chef-job-description-cover-photo-1024x731.jpg.webp"
              alt="Chef Kareem Mahmoud"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="mx-auto mt-24 max-w-5xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="الإنجازات"
          title="خط زمني لأمسيات مليانة ضوء"
          description="من افتتاحنا الهادئ لتقدير ميشلان، Spot مستمر في خلق تجارب لا تُنسى."
        />
        <div className="mt-12 space-y-8 border-r border-white/10 pr-6">
          {milestones.map((milestone) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative pr-6 pl-4"
            >
              <span className="absolute right-[-0.95rem] top-2 h-3 w-3 rounded-full bg-accent shadow-glow-gold" />
              <p className="text-lg uppercase tracking-[0.3em] text-accent/70">
                {milestone.year}
              </p>
              <h3 className=" text-2xl text-white">{milestone.title}</h3>
              <p className="text-xl text-white/65">{milestone.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="mx-auto mt-24 max-w-6xl px-6 lg:px-10">
        <div className="glass-sheen grid gap-12 rounded-3xl p-10 md:grid-cols-3">
          {values.map((value) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <h3 className=" text-2xl text-white">{value.title}</h3>
              <p className="text-lg text-white/65">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
};
