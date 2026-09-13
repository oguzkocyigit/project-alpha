/** Small tactical/reticle corner brackets, positioned around a `relative` parent. */
export default function MilCorners() {
  const base = "absolute h-3 w-3 border-mil-brass";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <span className={`${base} -left-1.5 -top-1.5 border-l-2 border-t-2`} />
      <span className={`${base} -right-1.5 -top-1.5 border-r-2 border-t-2`} />
      <span className={`${base} -bottom-1.5 -left-1.5 border-b-2 border-l-2`} />
      <span className={`${base} -bottom-1.5 -right-1.5 border-b-2 border-r-2`} />
    </span>
  );
}
