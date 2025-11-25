export default function TableLegend() {
  return (
    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-emerald-400 rounded"></div>
        <span>Available</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-amber-400 rounded"></div>
        <span>Reserved</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-purple-400 rounded"></div>
        <span>Occupied</span>
      </div>
    </div>
  );
}
