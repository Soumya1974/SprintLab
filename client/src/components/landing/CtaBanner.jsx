import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaBanner() {
    return (
        <section className="px-5 sm:px-6 py-20">
            <div className="max-w-6xl mx-auto">
                <div className="relative bg-blue-500 px-6 sm:px-12 py-14 sm:py-16 text-center overflow-hidden animate-fade-in-up">
                    <div
                        className="absolute z-0 top-0 right-0 w-72 h-72 bg-blue-500/40 rounded-full blur-3xl"
                        aria-hidden="true"
                    />
                    <div
                        className="absolute z-0 bottom-0 left-0 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"
                        aria-hidden="true"
                    />

                    <h2 className="relative text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
                        Ready to plan your next sprint?
                    </h2>
                    <p className="relative text-sm sm:text-base text-blue-100 mb-8 max-w-md mx-auto">
                        Set up your workspace in under five minutes. Free for teams up to
                        5 people.
                    </p>
                    <button
                        className="relative inline-flex items-center gap-2 bg-white hover:bg-blue-50 active:scale-[0.98] text-blue-600 text-sm font-medium px-5 py-3 rounded-lg transition-all duration-150 shadow-sm"
                    >
                        <Link
                            to="/signup"
                        >
                            Get started for free
                        </Link>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}