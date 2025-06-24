import * as React from 'react';
import { Person, BlockLayout } from '@/pages/records/records.types'; // Adjust path
import { PlotIdentifier } from './InteractiveCemeteryMap'; // Re-use this type
import { cn } from '@/lib/utils'; // For conditional class names

interface GridMapDisplayProps {
  layout: BlockLayout; // Expects the layout config doc
  occupiedRecords: Person[]; // Expects records for only this block
  selectedPlot?: PlotIdentifier | null;
  onPlotClick: (plotIdentifier: PlotIdentifier) => void;
}

export const GridMapDisplay: React.FC<GridMapDisplayProps> = ({
 layout,
  occupiedRecords,
  selectedPlot,
  onPlotClick,
}) => {

  const occupiedPlotMap = React.useMemo(() => {
    return new Map(
      occupiedRecords.map(record => [`${record.lot}-${record.pos}`, record])
    );
  }, [occupiedRecords]);
  
  const lots = Array.from({ length: layout.lotCount }, (_, i) => i + 1);
  
   return (
    <div className="space-y-3 p-2">
      {lots.map(lotNum => (
        <div key={lotNum} className="p-3 border rounded-md bg-white shadow-sm">
          <h5 className="text-sm font-bold mb-3 text-gray-800 border-b pb-2">Lot {lotNum}</h5>
          <div className="flex flex-wrap gap-1.5">
            {/* Generate all plots for this lot based on the layout config */}
            {Array.from({ length: layout.plotsPerLot }, (_, i) => i + 1).map(posNum => {
              const plotKey = `${lotNum}-${posNum}`;
              const plotData = occupiedPlotMap.get(plotKey); // Check if this plot is occupied

              const plotIdentifier: PlotIdentifier = { block: layout.id, lot: lotNum, pos: posNum, rawId: plotData?.id || `empty-${plotKey}` };
              const isSelected =
                selectedPlot?.block === layout.id &&
                selectedPlot?.lot === lotNum &&
                selectedPlot?.pos === posNum;

              const title = plotData
                ? `${plotData.firstName} ${plotData.lastName}\nPlot: ${layout.id}-${lotNum}-${posNum}`
                : `Empty Plot: ${layout.id}-${lotNum}-${posNum}`;
              
              return (
                <button
                  key={plotKey}
                  onClick={() => onPlotClick(plotIdentifier)}
                  title={title}
                  className={cn(
                    "w-16 h-20 border rounded-md text-xs p-1 flex flex-col items-center justify-center text-center transition-all duration-150",
                    plotData
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200 shadow-sm" // Occupied plot
                      : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200", // Empty plot
                    isSelected && "ring-4 ring-offset-1 ring-orange-400 scale-105" // Highlight style
                  )}
                >
                  <span className="font-bold">{`${layout.id}-${lotNum}-${posNum}`}</span>
                  <span className="mt-1 line-clamp-2">{plotData ? plotData.lastName : 'Empty'}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};