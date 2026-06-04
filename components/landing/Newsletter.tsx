export function Newsletter() {
  return (
    <section
      className={[
        "py-24 px-4 relative overflow-hidden",
        "border-t border-white/[0.08]",
        "bg-background",
      ].join(" ")}
    >
      {/* Violet ambient glow in background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(139,92,246,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[600px] mx-auto text-center flex flex-col items-center">
        <span className="font-label-caps text-label-caps text-secondary mb-4">
          Stay in the Loop
        </span>
        <h2 className="text-headline-lg font-headline-lg text-on-background mb-4">
          Join the Collective
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant mb-8">
          Sign up for exclusive access to new drops, editorial content, and
          early access to sales.
        </p>
        <form className="w-full flex flex-col sm:flex-row gap-3">
          <input
            className={[
              "flex-1 px-6 py-4 rounded-[20px]",
              "bg-surface-container-lowest border border-white/[0.08]",
              "text-on-background placeholder:text-on-surface-variant font-body-md",
              "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
              "transition-all duration-300",
            ].join(" ")}
            placeholder="Enter your email address"
            required
            type="email"
          />
          <button
            type="submit"
            className={[
              "bg-primary text-on-primary rounded-full px-8 py-4",
              "font-bold tracking-wide whitespace-nowrap",
              // Premium cubic-bezier transition
              "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
              // Hover: lift + neon glow
              "hover:-translate-y-0.5 hover:scale-[1.02]",
              "hover:shadow-[0_0_20px_rgba(0,245,255,0.5),0_0_40px_rgba(0,245,255,0.2),0_4px_24px_rgba(0,0,0,0.4)]",
            ].join(" ")}
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
