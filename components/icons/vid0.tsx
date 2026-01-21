import { forwardRef, type SVGProps } from "react"

export interface Vid0IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

export const Vid0Icon = forwardRef<SVGSVGElement, Vid0IconProps>(
  ({ size = 24, width, height, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Play button / video icon */}
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none" />
    </svg>
  )
)

Vid0Icon.displayName = "Vid0Icon"

export default Vid0Icon
