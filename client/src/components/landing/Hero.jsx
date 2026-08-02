import { ArrowRight } from "lucide-react";
import HeroKanban from "./HeroKanban";
import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
                <div className="animate-fade-in-up">
                    <div className="text-slate-800 text-xs font-medium px-3 py-1.5 mb-5">
                        Now with real time workspace sync
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-semibold text-slate-800 leading-[1.1] tracking-tight mb-5">
                        Keep your projects organized from start to finish.
                    </h1>

                    <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
                        SprintLab gives product teams one clean workspace for tasks,
                        sprints, and people so status updates stop living in chat
                        threads and start living where the work happens.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium px-5 py-3 rounded-lg transition-all duration-150 shadow-sm shadow-blue-200"
                        >
                            <Link
                                to="/signup"
                            >
                                Get started for free
                            </Link>
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                        <button
                            className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium px-5 py-3 rounded-lg border border-slate-200 transition-colors duration-150"
                        >
                            <Link
                                to="/login"
                            >
                                Log in
                            </Link>
                        </button>
                    </div>
                </div>

                <div className="animate-fade-in-up [animation-delay:120ms]">
                    <HeroKanban />
                </div>
            </div>
        </section>
    );
}