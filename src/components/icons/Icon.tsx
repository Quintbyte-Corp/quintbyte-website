import { BRAND_VIEWBOX, MATERIAL_VIEWBOX, brandPaths, materialPaths } from "./paths";
import { SvgIcon, type SvgIconProps } from "./SvgIcon";

export type IconName = keyof typeof materialPaths;
export type BrandIconName = keyof typeof brandPaths;

/**
 * Material Symbols Outlined (weight 300) glyph by name.
 * For server components only: it references the full icon map. Client components use
 * <SvgIcon d={…} /> with a constant from ./ui-paths instead.
 */
export function Icon({ name, ...props }: SvgIconProps & { name: IconName }) {
  return <SvgIcon d={materialPaths[name]} viewBox={MATERIAL_VIEWBOX} {...props} />;
}

export function BrandIcon({ name, ...props }: SvgIconProps & { name: BrandIconName }) {
  return <SvgIcon d={brandPaths[name]} viewBox={BRAND_VIEWBOX} {...props} />;
}
