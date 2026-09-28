import { LogoMark } from "@/components/brand/Logo";
import { Icon } from "@/components/icons/Icon";
import { ecosystemPillars } from "@/data/home";

/** Placement of the three pillar cards around the platform (wide layout only) */
const placement = [
  "@min-[480px]:top-[44%] @min-[480px]:left-0",
  "@min-[480px]:top-[44%] @min-[480px]:right-0",
  "@min-[480px]:bottom-[4%] @min-[480px]:left-1/2 @min-[480px]:-translate-x-1/2",
];

const plate = "absolute left-1/2 aspect-square iso";

/**
 * Isometric stacked platform (README §5). Every layer is a CSS plate with the same
 * isometric transform. On wide containers the pillar cards float around the platform;
 * on narrow containers (phones) they move below it at a readable size.
 */
export function EcosystemVisual() {
  return (
    <div className="@container relative mx-auto w-full max-w-[560px]">
      <div aria-hidden className="relative aspect-[1.25]">
        {/* Floor grid */}
        <div
          className={`${plate} top-[62%] w-[96%] rounded-[4cqw] border border-accent/18 bg-[repeating-linear-gradient(0deg,rgb(34_199_255/0.07)_0_1px,transparent_1px_7%),repeating-linear-gradient(90deg,rgb(34_199_255/0.07)_0_1px,transparent_1px_7%)] [mask-image:radial-gradient(circle,#000_30%,transparent_70%)]`}
        />
        {/* Glow ring */}
        <div
          className={`${plate} top-[60%] w-[62%] animate-glow-pulse rounded-[5cqw] border-[1.5px] border-accent/55 shadow-[0_0_50px_rgb(34_199_255/0.45),inset_0_0_40px_rgb(34_199_255/0.2)]`}
        />
        {/* Stacked plates, darkest at the bottom */}
        <div
          className={`${plate} top-[48%] w-[42%] rounded-[4cqw] border border-accent/45 bg-[#050d16] shadow-[0_0_30px_rgb(34_199_255/0.35)]`}
        />
        <div
          className={`${plate} top-[44.5%] w-[42%] rounded-[4cqw] border border-accent/55 bg-[#06111c] shadow-[0_0_30px_rgb(34_199_255/0.35)]`}
        />
        <div
          className={`${plate} top-[41%] w-[42%] rounded-[4cqw] border border-accent/65 bg-[#081624] shadow-[0_0_34px_rgb(34_199_255/0.4)]`}
        />
        <div
          className={`${plate} top-[37%] flex w-[42%] items-center justify-center rounded-[4cqw] border-[1.5px] border-[#3fd2ff] bg-[radial-gradient(circle_at_50%_50%,#12324a_0%,#0a1c2c_60%,#07131f_100%)] shadow-[0_0_60px_rgb(34_199_255/0.55),inset_0_0_30px_rgb(34_199_255/0.3)]`}
        >
          <LogoMark
            accent="#8fe6ff"
            ink="#8fe6ff"
            className="h-[12cqw] w-auto -rotate-45 drop-shadow-[0_0_12px_rgb(34_199_255/0.9)]"
          />
        </div>
      </div>

      <ul
        aria-label="What QuintByte brings together"
        className="mt-4 grid gap-3 @min-[480px]:absolute @min-[480px]:inset-0 @min-[480px]:mt-0 @min-[480px]:block"
      >
        {ecosystemPillars.map((pillar, i) => (
          <li
            key={pillar.label}
            className={`z-[2] flex items-center gap-3 rounded-2xl border border-accent/55 bg-linear-to-b from-[rgb(14_30_46/0.96)] to-[rgb(6_14_22/0.96)] p-4 shadow-[0_0_28px_rgb(34_199_255/0.28),inset_0_1px_0_rgb(143_230_255/0.25)] @min-[480px]:absolute @min-[480px]:w-[30%] @min-[480px]:flex-col @min-[480px]:items-start @min-[480px]:gap-[0.8cqw] @min-[480px]:rounded-[2.5cqw] @min-[480px]:px-[3.2cqw] @min-[480px]:py-[3cqw] ${placement[i]}`}
          >
            <Icon
              name={pillar.icon}
              className="text-[26px] text-accent @min-[480px]:text-[5.5cqw]"
            />
            <span className="flex flex-col gap-0.5 @min-[480px]:gap-[0.8cqw]">
              <span className="text-[15px] font-bold text-ink @min-[480px]:text-[3.4cqw]">
                {pillar.label}
              </span>
              <span className="text-[13px] text-mute-2 @min-[480px]:text-[2.5cqw]">
                {pillar.caption}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
