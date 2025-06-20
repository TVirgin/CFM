import * as React from 'react';
import { Person } from '@/pages/records/records.types'; // Adjust path
import { PlotIdentifier } from './InteractiveCemeteryMap'; // Re-use this type
import { cn } from '@/lib/utils'; // For conditional class names

interface GridMapDisplayProps {
  records: Person[]; // Expects records for only ONE block
  selectedPlot?: PlotIdentifier | null;
  onPlotClick: (plotIdentifier: PlotIdentifier) => void;
}

export const GridMapDisplay: React.FC<GridMapDisplayProps> = ({
  records,
  selectedPlot,
  onPlotClick,
}) => {
  // Group records by lot number for rendering
  const groupedByRow = React.useMemo(() => {
    return records.reduce((acc, record) => {
      const { lot } = record;
      if (!acc[lot]) acc[lot] = [];
      acc[lot].push(record);
      // Sort plots within the lot by position
      acc[lot].sort((a, b) => a.pos - b.pos);
      return acc;
    }, {} as Record<number, Person[]>);
  }, [records]);

  if (records.length === 0) {
    return <div className="p-4 text-center text-sm text-gray-500">No plot data available for this block.</div>;
  }

  return (
    <div className="space-y-3 p-2">
      {Object.entries(groupedByRow)
        .sort(([lotA], [lotB]) => Number(lotA) - Number(lotB)) // Sort lots numerically
        .map(([lotNum, plots]) => (
          <div key={lotNum} className="flex items-center space-x-2">
            <div className="w-10 text-xs text-gray-500 font-semibold text-right">Row {lotNum}</div>
            <div className="flex flex-wrap gap-1.5">
              {plots.map(plot => {
                const plotIdentifier: PlotIdentifier = { block: plot.block, lot: plot.lot, pos: plot.pos, rawId: plot.id };
                const isSelected =
                  selectedPlot?.block === plot.block &&
                  selectedPlot?.lot === plot.lot &&
                  selectedPlot?.pos === plot.pos;
                
                return (
                  <button
                    key={plot.id}
                    onClick={() => onPlotClick(plotIdentifier)}
                    title={`${plot.firstName} ${plot.lastName}\nPlot: ${plot.block}-${plot.lot}-${plot.pos}`}
                    className={cn(
                      "w-14 h-20 border rounded-md text-xs p-1 flex flex-col items-center justify-center text-center transition-all duration-150",
                      "bg-green-100 border-green-300 text-green-800 hover:bg-green-200 shadow-sm", // Style for an occupied plot
                      isSelected && "ring-4 ring-offset-1 ring-orange-400 bg-orange-200 scale-105" // Highlight style
                    )}
                  >
                    <span className="font-bold">{`${plot.block}-${plot.lot}-${plot.pos}`}</span>
                    <span className="mt-1 line-clamp-2">{plot.lastName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};