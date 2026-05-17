import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export default function Anchor({
  className,
  children,
  tooltip,
  tab = false,
  link = "/",
}: {
  className?: string
  children?: React.ReactNode
  tooltip?: string
  link?: string
  tab?: boolean
}) {
  const el = (
    <a
      href={link}
      className={cn("h-8 w-8", className)}
      target={tab ? "_blank" : "_self"}
    >
      {children}
    </a>
  )

  if (!tooltip) return el

  return (
    <Tooltip>
      <TooltipTrigger asChild>{el}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
