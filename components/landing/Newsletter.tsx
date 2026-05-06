export function Newsletter() {
  return (
    <section className="py-24 px-4 bg-background border-t border-outline-variant">
      <div className="max-w-[600px] mx-auto text-center flex flex-col items-center">
        <span className="font-label-caps text-label-caps text-outline mb-4">
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
            className="flex-1 px-6 py-4 rounded-xl border border-outline-variant bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-background placeholder:text-outline font-body-md"
            placeholder="Enter your email address"
            required
            type="email"
          />
          <button
            className="bg-primary text-white rounded-full px-8 py-4 font-bold tracking-wide hover:bg-inverse-surface transition-colors whitespace-nowrap"
            type="submit"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

