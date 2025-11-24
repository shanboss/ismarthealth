import HeroPreview from "./components/HeroPreview";

export default function Home() {
  return (
    <div className="mx-auto w-full ">
      <section className="relative overflow-hidden bg-background border-b border-neutral-900 rounded-none">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6">
          <div className="text-left">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-5xl">
              Cloud-powered care, from appointment to analysis.
            </h1>
            <h2 className="text-3xl mt-4">Secure, simple, seamless.</h2>
          </div>
          <HeroPreview
            src="/preview.png"
            alt="Preview window"
            priority
            className="mx-4 w-full max-w-xl"
          />
        </div>
      </section>
      <section id="about" className="scroll-mt-24 text-center my-20">
        <h1 className="text-4xl font-semibold tracking-tight">About Us</h1>
        <p className="mt-4 mx-auto max-w-4xl text-lg leading-8 text-foreground/80">
          iSmartHealth.in is a comprehensive, fully integrated healthcare
          management suite delivered on a cloud-based platform providing a
          robust and secure solution for healthcare needs. It is easy to adopt
          and use so that Doctors and Laboratories can focus on providing
          quality care for their patients. iSmartHealth.in provides secure
          online access for Patients, Physicians & Laboratories anytime,
          anywhere. Manage and inform appointments, follow-up status of Patients
          to Doctors by E-mail and SMS.
        </p>
      </section>
      <section id="contact" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Contact Us For Demo
        </h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <form className="rounded-lg border border-foreground/10 p-6 shadow-sm">
            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Your Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-foreground"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
                  placeholder="I would like a demo"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground"
                >
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="mt-1 w-full resize-y rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
                  placeholder="Tell us a bit about your needs"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-80 disabled:opacity-50"
                >
                  Request Demo
                </button>
              </div>
            </div>
          </form>

          <aside className="rounded-lg border border-foreground/10 p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Call or Email Us</h3>
            <p className="mt-2 text-sm text-foreground/70">
              We're available anytime, anywhere.
            </p>
            <ul className="mt-4 space-y-2 text-foreground">
              <li>
                <a href="tel:+918026971311" className="hover:underline">
                  +918026971311
                </a>
              </li>
              <li>
                <a href="tel:+917618702727" className="hover:underline">
                  +917618702727
                </a>
              </li>
              <li>
                <a href="tel:+917618703187" className="hover:underline">
                  +917618703187
                </a>
              </li>
              <li>
                <a
                  href="mailto:sales@ismarthealth.in"
                  className="hover:underline"
                >
                  sales@ismarthealth.in
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </section>
      {/* Placeholder anchors for Navbar links */}
      <div id="login" />
      <div id="new-user" />
    </div>
  );
}
