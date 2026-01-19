export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur-sm mt-auto">
      <div className="mx-auto max-w-7xl px-5 py-6 md:py-6 lg:py-6">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          {/* Left side - Copyright + version */}
          <div className="flex flex-col items-center gap-1.5 md:items-start">
            <p className="text-sm font-medium text-foreground/90">
              © {new Date().getFullYear()} iSmartHealth
            </p>
            <p className="text-xs text-muted-foreground">
              Version 3.11.1 • All rights reserved
            </p>
          </div>

          {/* Right side - Contact links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-end">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <a
                  href="tel:+918026971311"
                  className="transition-colors hover:text-primary"
                >
                  +91 80269 71311
                </a>
                <a
                  href="tel:+917618702727"
                  className="transition-colors hover:text-primary"
                >
                  +91 76187 02727
                </a>
                <a
                  href="tel:+917618703187"
                  className="transition-colors hover:text-primary"
                >
                  +91 76187 03187
                </a>
              </div>
            </div>

            <a
              href="mailto:sales@ismarthealth.in"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              sales@ismarthealth.in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}