import Image from "next/image";

type HeroPreviewProps = {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export default function HeroPreview({
  src,
  alt = "Preview",
  className,
  priority,
  width,
  height,
}: HeroPreviewProps) {
  return (
    <div
      className={
        "overflow-hidden rounded-xl border border-foreground/10 bg-background shadow-sm " +
        (className ?? "")
      }
    >
      {/* Titlebar */}
      <div className="flex h-9 items-center gap-2 border-b border-foreground/10 px-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]" aria-hidden />
      </div>
      {/* Content area - intrinsic sizing, no letterboxing */}
      <div className="w-full">
        <Image
          src={src}
          alt={alt}
          width={width ?? 1200}
          height={height ?? 675}
          sizes="100vw"
          priority={priority}
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}
