// src/components/maps/wards/Block1ESVG.tsx
import * as React from 'react';

// This component can accept all standard SVG props (className, style, onClick, etc.)
interface WardSVGProps extends React.SVGProps<SVGSVGElement> { }

// Use React.forwardRef to allow the parent to get a ref to the <svg> element
export const Block1ESVG = React.forwardRef<SVGSVGElement, WardSVGProps>(
  (props, ref) => {
    // Spread all props from the parent onto the root <svg> element
    const { className, style, onClick } = props;

    const textStyle: React.CSSProperties = {
      fontSize: '10px', // Adjust font size as needed
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fill: 'rgb(255, 255, 255)', // Dark text, slightly transparent
      textAnchor: 'middle', // Horizontal centering
      dominantBaseline: 'middle', // Vertical centering
      pointerEvents: 'none', // Allows clicks to pass through to the rectangle below
    };

    return (
      <svg
        ref={ref}
        onClick={onClick}
        style={style}
        className={className}
        width="377mm"
        height="397mm"
        viewBox="-100 -70 277 397"
        version="1.1"
        id="svg1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="layer1"
          transform="translate(133.7639,334.11701)"
        >
          {/* This group contains all the individual plots for Ward 1E */}
          <g
            id="g21"
            transform="translate(-241.82916,-157.1625)"
          >
            {/* --- Ward 1E-14 --- */}
            <g id="plot-1E-1-14" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="109.65276" y="-176.42534" />
              <text style={textStyle} x={109.65276 + 24.870832 / 2} y={-176.42534 + 23.8125 / 2}>14</text>
            </g>

            {/* --- Ward 1E-13 --- */}
            <g id="plot-1E-1-13" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="109.65276" y="-152.85217" />
              <text style={textStyle} x={109.65276 + 24.870832 / 2} y={-152.85217 + 23.8125 / 2}>13</text>
            </g>

            {/* --- Ward 1E-12 --- */}
            <g id="plot-1E-1-12" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="109.65276" y="-129.27899" />
              <text style={textStyle} x={109.65276 + 24.870832 / 2} y={-129.27899 + 23.8125 / 2}>12</text>
            </g>

            {/* --- Ward 1E-10 --- */}
            <g id="plot-1E-1-10" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="109.65277" y="-105.70583" />
              <text style={textStyle} x={109.65277 + 24.870832 / 2} y={-105.70583 + 23.8125 / 2}>10</text>
            </g>

            {/* --- Ward 1E-9 --- */}
            <g id="plot-1E-1-9" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="110.02694" y="-81.758476" />
              <text style={textStyle} x={110.02694 + 24.870832 / 2} y={-81.758476 + 23.8125 / 2}>9</text>
            </g>

            {/* --- Ward 1E-8 --- */}
            <g id="plot-1E-1-8" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="110.02694" y="-58.18531" />
              <text style={textStyle} x={110.02694 + 24.870832 / 2} y={-58.18531 + 23.8125 / 2}>8</text>
            </g>

            {/* --- Ward 1E-7 --- */}
            <g id="plot-1E-1-7" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="110.02694" y="-34.612129" />
              <text style={textStyle} x={110.02694 + 24.870832 / 2} y={-34.612129 + 23.8125 / 2}>7</text>
            </g>

            {/* --- Ward 1E-6 --- */}
            <g id="plot-1E-1-6" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="110.02695" y="-11.038969" />
              <text style={textStyle} x={110.02695 + 24.870832 / 2} y={-11.038969 + 23.8125 / 2}>6</text>
            </g>

            {/* --- Ward 1E-5 --- */}
            <g id="plot-1E-1-5" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="110.02695" y="12.90838" />
              <text style={textStyle} x={110.02695 + 24.870832 / 2} y={12.90838 + 23.8125 / 2}>5</text>
            </g>

            {/* --- Ward 1E-4 --- */}
            <g id="plot-1E-1-4" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="110.40112" y="36.855736" />
              <text style={textStyle} x={110.40112 + 24.870832 / 2} y={36.855736 + 23.8125 / 2}>4</text>
            </g>

            {/* --- Ward 1E-3 --- */}
            <g id="plot-1E-1-3" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="110.40112" y="60.428902" />
              <text style={textStyle} x={110.40112 + 24.870832 / 2} y={60.428902 + 23.8125 / 2}>3</text>
            </g>

            {/* --- Ward 1E-2 --- */}
            <g id="plot-1E-1-2" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="110.40112" y="84.002083" />
              <text style={textStyle} x={110.40112 + 24.870832 / 2} y={84.002083 + 23.8125 / 2}>2</text>
            </g>

            {/* --- Ward 1E-1 --- */}
            <g id="plot-1E-1-1" className="plot-interaction-layer">
              <rect style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 }} width="24.870832" height="23.8125" x="110.40112" y="107.57524" />
              <text style={textStyle} x={110.40112 + 24.870832 / 2} y={107.57524 + 23.8125 / 2}>1</text>
            </g>
          </g>
        </g>
      </svg>
    );
  }
);

Block1ESVG.displayName = "Block1ESVG";

export default Block1ESVG;