import type * as React from "react"

// JSX typing for the <model-viewer> custom element (Google's web component).
type ModelViewerAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src?: string
  poster?: string
  alt?: string
  exposure?: string | number
  "environment-image"?: string
  "tone-mapping"?: "auto" | "neutral" | "aces" | "agx" | "commerce"
  "shadow-intensity"?: string | number
  "camera-controls"?: boolean
  "camera-orbit"?: string
  "camera-target"?: string
  "field-of-view"?: string
  "auto-rotate"?: boolean
  "interaction-prompt"?: "auto" | "none"
  loading?: "auto" | "lazy" | "eager"
  reveal?: "auto" | "interaction" | "manual"
  ar?: boolean
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes
    }
  }
}
