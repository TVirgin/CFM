// src/components/maps/InteractiveCemeteryMap.tsx
import * as React from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { Button } from "@/components/ui/button";

// Assuming PlotIdentifier and parsePlotDomId are correctly defined, e.g., in mapUtils or here
// For example:
export interface PlotIdentifier { // Ensure this matches what onPlotClick expects
  block: string; // If your IDs are like 'wardA', 'ward1', this will be 'A' or '1'
  row?: number;   // These might be undefined if clicking on a whole 'ward'
  pos?: number;
  rawId: string; // The original ID like 'wardA' or 'plot-A-1-1'
}

export const parsePlotDomId = (domId: string): PlotIdentifier | null => {
  // Handle IDs like "plot-A-1-1"
  if (domId.startsWith('plot-')) {
    const parts = domId.substring(5).split('-');
    if (parts.length === 3) {
      const block = parts[0];
      const row = parseInt(parts[1], 10);
      const pos = parseInt(parts[2], 10);
      if (block && !isNaN(row) && !isNaN(pos)) {
        return { block, row, pos, rawId: domId };
      }
    }
  }
  // Handle IDs like "wardA", "ward1", "ward1E" directly as blocks
  // You might want to refine this logic based on your exact IDing scheme for plots vs. wards
  const wardMatch = domId.match(/^ward([A-Z0-9]+(?:E)?)$/i); // Case-insensitive match
  if (wardMatch && wardMatch[1]) {
    return { block: wardMatch[1], rawId: domId }; // row and pos can be undefined or default
  }
  return null; // Or return {rawId: domId} if any ID should be clickable
};


interface InteractiveCemeteryMapProps {
  SvgMapOverlayComponent: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  selectedPlotId?: string | null; // This is the ID of the plot/ward, e.g., "wardA", "ward1", or "A-1-1" (if you change your SVG IDs)
  onPlotClick: (plotIdentifier: PlotIdentifier) => void;
  highlightClass?: string; // CSS class for highlighting
}

export const InteractiveCemeteryMap: React.FC<InteractiveCemeteryMapProps> = ({
  SvgMapOverlayComponent, // This is your CemeteryMapSVG component
  selectedPlotId,
  onPlotClick,
  highlightClass = "plot-highlighted", // Must match CSS class in CemeteryMapSVG's <style> or global CSS
}) => {
  const svgRootRef = React.useRef<SVGSVGElement>(null);
  const lastHighlightedElementRef = React.useRef<Element | null>(null);
  const transformWrapperRef = React.useRef<ReactZoomPanPinchRef | null>(null);

  React.useEffect(() => {
    if (lastHighlightedElementRef.current) {
      lastHighlightedElementRef.current.classList.remove(highlightClass);
    }
    lastHighlightedElementRef.current = null;

    if (selectedPlotId && svgRootRef.current) {
      // selectedPlotId is the direct ID of the SVG element (e.g., "wardA", "ward1")
      // No need to prefix with "plot-" unless your `selectedPlotId` prop is different from actual DOM IDs
      const plotElement = svgRootRef.current.querySelector(`#${selectedPlotId}`);
      if (plotElement) {
        plotElement.classList.add(highlightClass);
        lastHighlightedElementRef.current = plotElement;

        // Optional: Center on selected element
        const T = transformWrapperRef.current;
        const BBox = (plotElement as SVGGElement).getBBox ? (plotElement as SVGGElement).getBBox() : null; // getBBox works on SVGGElement, SVGRectElement etc.
        if (T && BBox && T.instance.wrapperComponent) {
            const currentScale = T.state.scale;
            const targetX = -(BBox.x + BBox.width / 2) * currentScale + T.instance.wrapperComponent.clientWidth / 2;
            const targetY = -(BBox.y + BBox.height / 2) * currentScale + T.instance.wrapperComponent.clientHeight / 2;

            T.setTransform(targetX, targetY, currentScale, 300, "easeOut");
        }

      } else {
        // console.warn(`Plot element with ID "${selectedPlotId}" not found in SVG.`);
      }
    }
  }, [selectedPlotId, highlightClass, SvgMapOverlayComponent]);

  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    let target = event.target as Element;
    while (target && target !== svgRootRef.current) {
      if (target.id) {
        const plotIdentifier = parsePlotDomId(target.id); // parsePlotDomId will handle 'wardX' or 'plot-X-Y-Z'
        if (plotIdentifier) {
          onPlotClick(plotIdentifier);
          return;
        }
      }
      target = target.parentElement as Element;
    }
  };

  const svgOverallStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] border rounded-md overflow-hidden relative bg-gray-100 shadow-inner">
      <TransformWrapper
        ref={transformWrapperRef}
        initialScale={1}
        minScale={0.1}
        maxScale={8}
        limitToBounds={true}
        doubleClick={{ disabled: true }}
        wheel={{ step: 0.1 }}
        centerOnInit // This will center the content initially
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-2 right-2 z-30 space-x-1 bg-white/80 p-1 rounded shadow-md">
              <Button variant="outline" size="sm" onClick={() => zoomIn(0.2)} className="p-1.5 text-xs h-auto">Zoom In</Button>
              <Button variant="outline" size="sm" onClick={() => zoomOut(0.2)} className="p-1.5 text-xs h-auto">Zoom Out</Button>
              <Button variant="outline" size="sm" onClick={() => resetTransform(200)} className="p-1.5 text-xs h-auto">Reset</Button>
            </div>
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full"
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* SvgMapOverlayComponent is your CemeteryMapSVG component */}
                <SvgMapOverlayComponent
                  ref={svgRootRef} // Pass the ref to your SVG component
                  onClick={handleMapClick} // Pass the click handler
                  style={svgOverallStyle}
                  // Any other props your CemeteryMapSVG might need
                />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};