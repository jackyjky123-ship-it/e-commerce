import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, PackageCheck, Tags } from "lucide-react";

import { Button } from "@/components/ui/button";

const bayFacts = [
  {
    icon: Tags,
    name: "គ្រឿងអេឡិចត្រូនិក",
    note: "ឧបករណ៍ដែលនាំចូលត្រូវបានធ្វើតេស្តរួចរាល់ជាមុន",
  },
  {
    icon: PackageCheck,
    name: "ម៉ូដសម្លៀកបំពាក់",
    note: "នាំចូលតែសម្លៀកបំពាក់ដែលមានស្តង់ដារខ្ពស់",
  },
  {
    icon: BadgeCheck,
    name: "សម្ភារៈក្នុងផ្ទះនិងក្រៅផ្ទះ",
    note: "នាំចូលតែសម្ភារៈដែលមានគុណភាពខ្ពស់បំផុត",
  },
];

export function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
          <p className="text-rail mb-2 text-[10px] font-bold opacity-90">
            ABOUT / THE STORE
          </p>
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            A general store
            <br />
            that keeps it plain.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/90">
            ShopVerse គឺជាហាងទំនិញទូទៅដែលមានការចុះបញ្ជីនៅទីក្រុងភ្នំពេញ។
            យើងទិញទំនិញប្រើប្រាស់ប្រចាំថ្ងៃ
            ដាក់តម្លៃដោយស្មោះត្រង់សម្រាប់មុខទំនិញនីមួយៗ
            និងដឹកជញ្ជូនជូនភ្លាមៗនៅថ្ងៃដែលអ្នកបានបញ្ជាទិញ — គ្មានការឃោសនាអួតអាង
            គ្មានការដាក់លក់ផ្តាច់មុខបែបសម្ញែង
            និងគ្មានលក្ខខណ្ឌតូចតាចដែលពិបាកអាននោះឡើយ។
          </p>
        </div>
      </section>

      <div className="tape" aria-hidden />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              របៀបដែលហាងដំណើរការ
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              ផលិតផលនីមួយៗនៅក្នុងកាតាឡុកគឺត្រូវឆ្លងកាត់ការត្រួតពិនិត្យតែមួយគត់។
              យើងពិនិត្យមើលស្តុក
              បិទស្លាកតម្លៃនៅលើធ្នើរដែលជាតម្លៃពិតប្រាកដដែលអ្នកត្រូវបង់
              ហើយដាក់តាំងបង្ហាញតែទំនិញណាដែលយើងអាចវេចខ្ចប់រួចរាល់ក្នុងថ្ងៃតែមួយប៉ុណ្ណោះ។
              ប្រសិនបើទំនិញណាមួយចាកចេញពីយើង គឺវាត្រូវបានបិទស្លាក
              និងតាមដានយ៉ាងម៉ត់ចត់ ដែលលេខបញ្ជាទំនិញ
              និងស្ថានភាពនឹងតាមដានវាគ្រប់ជំហានចាប់ពីបញ្ជររហូតដល់មុខមាត់ទ្វារផ្ទះរបស់អ្នក។
            </p>
            <p className="leading-relaxed text-muted-foreground">
              រក្សាភាពសាមញ្ញគឺជាគោលការណ៍ទាំងមូលរបស់យើង។ មួយបញ្ជរ មួយតម្លៃ
              មួយថ្លៃដឹកជញ្ជូនដ៏ស្មោះត្រង់ —
              ដោយឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញចាប់ពី 100USD ឡើងទៅ
              ដើម្បីឱ្យការបញ្ជាទិញរបស់អ្នកមានអារម្មណ៍ថាគ្មានការស្មុគស្មាញដល់ជំហានចុងក្រោយផងដែរ។
            </p>
            <Button asChild>
              <Link to="/shop">
                មើល catalog <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-rail mb-2 text-[10px] font-bold text-primary">
              ទំនិញដែលយើងមានលក់
            </p>
            {bayFacts.map((b) => (
              <div
                key={b.name}
                className="flex gap-3 rounded-xl bg-muted/60 p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <b.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">{b.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {b.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
