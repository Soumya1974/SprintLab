const COMPANIES = ["Northwind", "Vertex Labs", "Orbiq", "Hearth & Co", "Felix"];

export default function TrustStrip() {
  return (
    <section className="px-5 sm:px-6 py-10 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-medium text-slate-800 mb-6 uppercase tracking-wide">
          Trusted by product teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {COMPANIES.map((name) => (
            <span
              key={name}
              className="text-slate-700 font-semibold text-lg tracking-tight opacity-70 hover:opacity-100 transition-opacity duration-200"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}