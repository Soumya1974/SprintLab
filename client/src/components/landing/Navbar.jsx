import { useState, useEffect } from "react";
import { Wrench, Menu, X } from "lucide-react";

const LINKS = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {

    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > 8);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
                    : "bg-white/0 border-b border-transparent"
                }`}
        >
            <nav className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
                <button
                    onClick={() => onNavigate?.("home")}
                    className="flex items-center gap-2 group"
                >
                    <Wrench className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:-rotate-12" />
                    <span className="font-semibold text-slate-800 text-[17px]">
                        SprintLab
                    </span>
                </button>

                {/* desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* desktop actions */}
                <div className="hidden md:flex items-center gap-2">
                    <button
                        
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-lg transition-colors duration-150"
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => onNavigate?.("signup")}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 transition-colors duration-150"
                    >
                        Sign up
                    </button>
                    <button
                        onClick={() => onNavigate?.("signup")}
                        className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.97] px-4 py-2 rounded-lg transition-all duration-150 shadow-sm"
                    >
                        Get started
                    </button>
                </div>

                {/* mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    className="md:hidden flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 active:scale-95 transition-all duration-150"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </nav>

            {/* mobile menu overlay */}
            <div
                onClick={() => setMobileOpen(false)}
                className={`md:hidden fixed inset-0 bg-slate-900/50 h-screen z-40 transition-opacity duration-300 ${mobileOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
            />

            <div
                className={`md:hidden fixed top-0 right-0 h-screen w-72 bg-gray-200 z-50 border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between flex-col">
                    <div className="flex items-center justify-between h-16 px-5 border-b border-gray-500">
                        <span className="font-semibold text-slate-800 text-[15px]">
                            Menu
                        </span>
                        <button
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex flex-col px-5 py-5 gap-1 bg-gray-200">
                        {LINKS.map((link, i) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-all duration-200 border-t border-gray-300"
                                style={{
                                    animation: mobileOpen
                                        ? `fadeInRight 0.35s ease-out ${i * 60}ms both`
                                        : "none",
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-auto px-5 py-5 flex flex-col gap-2.5 bg-gray-200">
                    <button
                        onClick={() => {
                            setMobileOpen(false);
                            onNavigate?.("login");
                        }}
                        className="w-full bg-gray-300 text-sm font-medium text-slate-600 hover:bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-200 transition-colors duration-150"
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => {
                            setMobileOpen(false);
                            onNavigate?.("signup");
                        }}
                        className="w-full text-sm bg-gray-300 font-medium text-slate-600 hover:bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-200 transition-colors duration-150"
                    >
                        Sign up
                    </button>
                    <button
                        onClick={() => {
                            setMobileOpen(false);
                            onNavigate?.("signup");
                        }}
                        className="w-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] px-3.5 py-2.5 rounded-lg transition-all duration-150 shadow-sm"
                    >
                        Get started
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </header>
    );
}