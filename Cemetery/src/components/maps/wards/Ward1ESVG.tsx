import * as React from 'react';
// This component might have its own zoomed-in background or reuse a portion of the main one
// For simplicity, we'll assume it's self-contained.

interface WardSVGProps extends React.SVGProps<SVGSVGElement> {}

export const Ward1ESVG = React.forwardRef<SVGSVGElement, WardSVGProps>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 100 400" // Example viewBox for a tall, narrow ward
        // Pass down props like onClick, style, className
        {...props}
      >
        <defs>
          <style>{`
            .plot-base { fill: rgba(0,0,255,0.1); stroke: rgba(0,0,100,0.5); stroke-width: 0.5; cursor: pointer; }
            .plot-base:hover { fill: rgba(0,0,255,0.3); }
            .plot-highlighted { fill: rgba(255,165,0,0.7) !important; stroke: rgba(220,100,0,1) !important; }
          `}</style>
        </defs>
        {/* Individual plot rectangles for Ward 1E */}
        <g>
          <rect id="plot-1E-1-1" className="plot-base" x="10" y="10" width="80" height="20" />
          <rect id="plot-1E-1-2" className="plot-base" x="10" y="35" width="80" height="20" />
          <rect id="plot-1E-1-3" className="plot-base" x="10" y="60" width="80" height="20" />
          {/* ... and so on for all plots in Ward 1E */}
        </g>
      </svg>
    );
  }
);
Ward1ESVG.displayName = "Ward1ESVG";