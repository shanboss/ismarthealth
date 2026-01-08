export default function Footer() {
  return (
    <footer className="w-full border-t border-foreground/10 bg-background py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-foreground/70 sm:flex-row sm:justify-between sm:text-left">
        <p>Copyright 2025 © iSmartHealth v3.11.1 All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="tel:+918026971311" className="hover:underline">
            +918026971311
          </a>
          <a href="tel:+917618702727" className="hover:underline">
            +917618702727
          </a>
          <a href="tel:+917618703187" className="hover:underline">
            +917618703187
          </a>
          <a href="mailto:sales@ismarthealth.in" className="hover:underline">
            sales@ismarthealth.in
          </a>
        </div>
      </div>
    </footer>
  );
}
