export default function SkeletonScreen() {
  return (
    <div className="flex flex-col gap-3.5 px-4 pb-28 pt-4">
      <div className="skeleton h-[76px] rounded-2xl" />
      <div className="skeleton h-10 rounded-xl" />
      <div className="flex gap-2">
        <div className="skeleton h-8 w-16 rounded-full" />
        <div className="skeleton h-8 w-20 rounded-full" />
        <div className="skeleton h-8 w-14 rounded-full" />
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-[64px] rounded-xl" />
      ))}
    </div>
  );
}
