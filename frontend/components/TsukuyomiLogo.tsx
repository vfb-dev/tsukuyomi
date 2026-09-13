type TsukuyomiLogoProps = {
  compact?: boolean;
};

export function TsukuyomiLogo({ compact = false }: TsukuyomiLogoProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <svg
        aria-hidden="true"
        className="h-9 w-9 shrink-0"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="14" fill="#EF233C" />
        <circle cx="15" cy="16" r="14" fill="#000000" />
      </svg>

      {!compact && (
        <span className="text-[1.05rem] font-semibold tracking-[0.16em] text-white uppercase">
          Tsukuyomi
        </span>
      )}
    </span>
  );
}
