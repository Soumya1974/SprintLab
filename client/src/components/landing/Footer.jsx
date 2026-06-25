import { Wrench } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "How it works", "Pricing", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog"],
  },
  {
    title: "Resources",
    links: ["Help center", "API docs", "Status"],
  },
];

export default function Footer() {
  return (
    <footer className="px-5 sm:px-6 py-12 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-10 mb-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-slate-800 text-[17px]">
                SprintLab
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              One clean workspace for tasks, sprints, and the people who ship
              them.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 sm:gap-12">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-400 hover:text-slate-700 transition-colors duration-150"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} SprintLab. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors duration-150"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors duration-150"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}