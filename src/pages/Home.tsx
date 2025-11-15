import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { PageTransition } from "../components/common/PageTransition";
import { SectionHeading } from "../components/common/SectionHeading";
import type { MenuItem } from "../types";
import { fetchMenu } from "../services/menuService";
import bg1 from "../assets/imgs/bg1.webp";
import chef from "../assets/imgs/chef.jpg";
import steak from "../assets/imgs/steak.jpg";
import Appetizers from "../assets/imgs/Appetizers.jpg";
import dessert from "../assets/imgs/dessert.jpg";

const ambianceHighlights = [
  {
    title: "مسرح الطهي",
    description: "الأطباق بيتحضّروا قدامك في مطبخ مفتوح، محاط بالرخام والنحاس.",
  },
  {
    title: "تجارب خاصة",
    description:
      "منيوهات تذوّق وكوكتيلات معمولة مخصوص ليك في لاونج صغير بعشر كراسي وإطلالة على أفق المدينة.",
  },
  {
    title: "أجواء مميزة",
    description:
      "مكان بيعكس أناقة التصميم والتفاصيل الصغيرة اللي بتخلي كل لحظة فيه تجربة مختلفة.",
  },
];

const fallbackFeatured: MenuItem[] = [
  {
    _id: "1",
    title: "شرائح لحمة تندرلوين بصوص الديمي جلاس",
    description:
      "شرائح لحمة تندرلوين مشوية ومتبلة صح، بتتقدم مع صوص ديمي جلاس تقيل ورشة ملح بحر، ومتزينة بأعشاب فريش وبصلة صغيرة متكرملة.",
    price: 580,
    category: "Main Courses",
    imageUrl: steak,
    isFeatured: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "كور الأرز المقرمشة بصوص الأيولي",
    description:
      "كور أرز مقلية ومغلفة بالبقسماط ومحشية جبنة، بتتقدم مع صوص أيولي بالمسطردة والأعشاب الطازة.",
    price: 180,
    category: "Appetizers",
    imageUrl: Appetizers,
    isFeatured: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "جاتوه الأوبرا (Opera Cake)",
    description:
      "طبقات من كيك اللوز الخفيف، وكريمة الزبدة بطعم القهوة، وشوكولاتة غاناش غامقة، ومتغطية بطبقة شوكولاتة بتلمع.",
    price: 160,
    category: "Desserts",
    imageUrl: dessert,
    isFeatured: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const HomePage = () => {
  const [featured, setFeatured] = useState<MenuItem[]>(fallbackFeatured);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const menu = await fetchMenu();
        const highlighted = menu.filter((item) => item.isFeatured).slice(0, 4);
        if (highlighted.length) {
          setFeatured(highlighted);
        }
      } catch (error) {
        console.error("Unable to load menu highlights", error);
      }
    };

    void loadMenu();
  }, []);

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-night" />
          <img
            src={bg1}
            alt="Spot restaurant interior"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col items-start justify-center gap-8 px-6 py-32 lg:px-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl uppercase tracking-[0.5em] text-accent"
          >
            عيش لحظة سبوت
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className=" text-3xl leading-tight tracking-wide text-white sm:text-6xl lg:text-7xl"
          >
            لما الأكل الراقي يقابل لحظة الغروب الساحرة{" "}
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className=" text-2xl text-white/70"
          >
            سبوت بيقدّم لك أكل معمول بشغف، نكهات مشوية بالنار، وكوكتيلات مخصوص
            ليك… كله في أجواء راقية. جرّب بنفسك.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button asChild>
              <Link to="/menu">
                <span className=" text-2xl ">المنيو</span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/reservations">
                <span className=" text-2xl ">احجز دلوقتي</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-6 lg:px-10">
        <div className="glass-sheen rounded-3xl p-8 shadow-2xl sm:p-12">
          <SectionHeading
            eyebrow="لحظات بطعم تاني"
            title="مكان للّمة والاحتفال وسهرات مالهاش زي"
            description="عيش تجربة أكل بتتجدّد على طول، ونكهات معمولة بإتقان، وخدمة فاهمة ذوقك قبل ما تتكلم."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {ambianceHighlights.map((highlight) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className=" text-2xl text-white">{highlight.title}</h3>
                <p className="mt-3 text-xl text-white/60">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="أطباق مميزة"
          title="أشهى أطباقنا"
          description="كل طبق متقدّم بشكل فني وبيتجهّز قدامك على الترابيزة، مع إبراز مكونات نادرة جايه من صناع موثوق فيهم."
        />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {featured.map((item) => (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:flex"
            >
              <div className="sm:w-1/2">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-accent/80">
                    {item.category}
                  </span>
                  <div>
                    {" "}
                    <span className="font-semibold text-accent">
                      {item.price.toFixed(0)}
                    </span>
                    <span className="font-semibold text-accent">EGP</span>
                  </div>
                </div>
                <h3 className="font-display text-2xl text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-white/65">{item.description}</p>
                <Link
                  to="/menu"
                  className="mt-auto text-sm uppercase tracking-[0.3em] text-accent transition hover:text-accent/70"
                >
                  اكتشف نكهة المكان ←
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-nightLight/30 to-night" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <SectionHeading
              align="left"
              eyebrow="الشيف كريم محمود"
              title="صنع ذكريات تتعدى الطبق"
              description="بعد أكتر من عشر سنين في مطاعم مصرية وعالمية، الشيف كريم بيقود Spot بفلسفة مبنية على النار، المواسم، وقصة ورا كل طبق."
            />
            <p className="text-sm text-white/70">
              فريقنا في المطبخ بيشتغل مع المزارع المحلية والموردين الموثوق فيهم
              عشان يقدموا أفضل المنتجات وقتها. استعد لرحلات تذوّق من ٥ لـ٧
              أطباق، وتفاعل مباشر مع الشيف، وتجارب مميزة مع مشروبات مختارة
              بعناية.
            </p>
            <Button asChild>
              <Link to="/about">اعرف حكيتنا</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-sheen overflow-hidden rounded-3xl"
          >
            <img
              src={chef}
              alt="الشيف بيقدّم طبق"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6 lg:px-10">
        <div className="glass-sheen relative overflow-hidden rounded-3xl p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('https://images.unsplash.com/photo-1532634896-26909d0d4b3e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 lg:block" />
          <div className="relative max-w-2xl space-y-6">
            <SectionHeading
              align="left"
              eyebrow="الحجز"
              title="احجز سهرتك في Spot"
              description="عدد المقاعد محدود كل ليلة عشان كل التفاصيل تاخد حقها من الاهتمام."
            />
            <p className="text-lg text-white/70">
              بنلبي احتياجات النظام الغذائي، الفعاليات الخاصة، والاحتفالات
              المخصصة. موظفينا هيتأكد من كل حجز شخصيًا.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link to="/reservations">احجز دلوقتي</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/contact">تواصل مع المسؤول</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};
