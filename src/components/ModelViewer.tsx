// Importing the package registers the <model-viewer> custom element.
// This module is lazy-loaded so its (heavy) three.js dependency only ships
// when a visitor actually opens a 3D model.
import "@google/model-viewer"

export default function ModelViewer({
  src,
  poster,
  alt,
  cameraTarget,
  cameraOrbit,
  fieldOfView,
  environmentImage,
  exposure = "1",
}: {
  src: string
  poster?: string
  alt?: string
  // Override auto-framing when a model has stray geometry inflating its bounds.
  cameraTarget?: string
  cameraOrbit?: string
  fieldOfView?: string
  environmentImage?: string
  exposure?: string
}) {
  return (
    <model-viewer
      src={src}
      poster={poster}
      alt={alt}
      camera-controls
      auto-rotate
      camera-target={cameraTarget}
      camera-orbit={cameraOrbit}
      field-of-view={fieldOfView}
      environment-image={environmentImage}
      tone-mapping="neutral"
      shadow-intensity="1"
      exposure={exposure}
      loading="eager"
      reveal="auto"
      style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
    />
  )
}
