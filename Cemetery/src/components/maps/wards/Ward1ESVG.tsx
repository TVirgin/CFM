// src/components/maps/wards/Ward1ESVG.tsx
import * as React from 'react';

// This component can accept all standard SVG props (className, style, onClick, etc.)
interface WardSVGProps extends React.SVGProps<SVGSVGElement> {}

// Use React.forwardRef to allow the parent to get a ref to the <svg> element
export const Ward1ESVG = React.forwardRef<SVGSVGElement, WardSVGProps>(
  (props, ref) => {
    // Spread all props from the parent onto the root <svg> element
    const { className, style, onClick } = props;

    return (
      <svg
        ref={ref}
        onClick={onClick}   // Apply the onClick handler from props
        style={style}       // Apply the style object from props
        className={className}
        width="377.8584mm"
        height="397.46033mm"
        viewBox="0 0 577.85841 697.46032"
        version="1.1"
        id="svg1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs id="defs1">
          {/* You can reuse the same CSS classes for plots across all your SVG maps for consistency */}
          <style>{`
            .plot-interaction-layer {
              fill: rgba(74, 144, 226, 0.1); /* Light blue overlay */
              stroke: rgba(44, 82, 130, 0.5);
              stroke-width: 0.5px;
              cursor: pointer;
              transition: fill 0.2s ease;
            }
            .plot-interaction-layer:hover {
              fill: rgba(74, 144, 226, 0.4);
            }
            .plot-highlighted {
              fill: rgba(255, 165, 0, 0.7) !important; /* Orange highlight */
              stroke: rgba(200, 100, 0, 1) !important;
              stroke-width: 1.5px !important;
            }
          `}</style>
        </defs>
        <g
          id="layer1"
          transform="translate(133.7639,334.11701)"
        >
          {/* This group contains all the individual plots for Ward 1E */}
          <g
            id="g21"
            transform="translate(-241.82916,-157.1625)"
          >
            {/* Note: The IDs are like "1E-1", "1E-2". Your parsePlotDomId function will need to handle this pattern */}
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-1" width="24.870832" height="23.8125" x="109.65276" y="-176.42534" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-2" width="24.870832" height="23.8125" x="109.65276" y="-152.85217" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-3" width="24.870832" height="23.8125" x="109.65276" y="-129.27899" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-4" width="24.870832" height="23.8125" x="109.65277" y="-105.70583" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-5" width="24.870832" height="23.8125" x="110.02694" y="-81.758476" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-6" width="24.870832" height="23.8125" x="110.02694" y="-58.18531" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-7" width="24.870832" height="23.8125" x="110.02694" y="-34.612129" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-8" width="24.870832" height="23.8125" x="110.02695" y="-11.038969" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-9" width="24.870832" height="23.8125" x="110.02695" y="12.90838" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-10" width="24.870832" height="23.8125" x="110.40112" y="36.855736" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-11" width="24.870832" height="23.8125" x="110.40112" y="60.428902" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-12" width="24.870832" height="23.8125" x="110.40112" y="84.002083" />
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} id="plot-1E-1-13" width="24.870832" height="23.8125" x="110.40112" y="107.57524" />
          </g>
        </g>
      </svg>
    );
  }
);

Ward1ESVG.displayName = "Ward1ESVG";

export default Ward1ESVG;