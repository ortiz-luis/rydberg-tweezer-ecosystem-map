interface StatsBarProps {
  filteredCount: number;
  totalCount: number;
}

export function StatsBar({ filteredCount, totalCount }: StatsBarProps) {
  const percent = totalCount ? Math.round((filteredCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="stat-cell">
        <span>{filteredCount}</span>
        <small>Visible</small>
      </div>
      <div className="stat-cell">
        <span>{totalCount}</span>
        <small>Total</small>
      </div>
      <div className="stat-cell">
        <span>{percent}%</span>
        <small>Matched</small>
      </div>
    </div>
  );
}
