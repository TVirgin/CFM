// src/components/maps/wards/Block2SVG.tsx
import * as React from 'react';

// This component can accept all standard SVG props (className, style, onClick, etc.)
interface WardSVGProps extends React.SVGProps<SVGSVGElement> { }

// Use React.forwardRef to allow the parent to get a ref to the <svg> element
export const Block2SVG = React.forwardRef<SVGSVGElement, WardSVGProps>(
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

    const getPlotNumber = (label: string | undefined): string => {
      if (!label) return '';
      const parts = label.split('-');
      return parts[parts.length - 1] || '';
    };

    const rectWidth = 24.870832;
    const rectHeight = 23.8125;
    const rectStyle = { fill: '#181767', fillOpacity: 0.430851, strokeWidth: 1.9005, strokeOpacity: 0.43 };

    const plotsG21 = [
      { id: "1E-30", label: "1E-30", x: "109.65276", y: "-176.42534" },
      { id: "1E-29", label: "1E-29", x: "109.65276", y: "-152.85217" },
      { id: "1E-47", label: "1E-47", x: "109.65276", y: "-176.42534" },
      { id: "1E-46", label: "1E-46", x: "109.65276", y: "-152.85217" },
      { id: "1E-45", label: "1E-45", x: "109.65276", y: "-129.27899" },
      { id: "1E-44", label: "1E-44", x: "109.65277", y: "-105.70583" },
      { id: "1E-43", label: "1E-43", x: "110.02694", y: "-81.758476" },
      { id: "1E-42", label: "1E-42", x: "110.02694", y: "-58.18531" },
      { id: "1E-41", label: "1E-41", x: "110.02694", y: "-34.612129" },
      { id: "1E-40", label: "1E-40", x: "110.02695", y: "-11.038969" },
      { id: "1E-39", label: "1E-39", x: "110.02695", y: "12.90838" },
      { id: "1E-38", label: "1E-38", x: "110.40112", y: "36.855736" },
      { id: "1E-37", label: "1E-37", x: "110.40112", y: "60.428902" },
      { id: "1E-36", label: "1E-36", x: "110.40112", y: "84.002083" },
      { id: "1E-35", label: "1E-35", x: "110.40112", y: "107.57524" },
      { id: "1E-34", label: "1E-34", x: "110.40112", y: "131.04739" },
      { id: "1E-33", label: "1E-33", x: "110.40112", y: "154.62056" },
      { id: "1E-32", label: "1E-32", x: "110.40112", y: "178.19374" },
      { id: "1E-31", label: "1E-31", x: "110.40112", y: "201.76691" },
    ];

    const plotsG41 = [
      { id: "1E-30", label: "1E-30", x: "109.65276", y: "-176.42534" },
      { id: "1E-29", label: "1E-29", x: "109.65276", y: "-152.85217" },
      { id: "1E-30", label: "1E-30", x: "109.65276", y: "-176.42534" },
      { id: "1E-29", label: "1E-29", x: "109.65276", y: "-152.85217" },
      { id: "1E-28", label: "1E-28", x: "109.65276", y: "-129.27899" },
      { id: "1E-27", label: "1E-27", x: "109.65277", y: "-105.70583" },
      { id: "1E-26", label: "1E-26", x: "110.02694", y: "-81.758476" },
      { id: "1E-25", label: "1E-25", x: "110.02694", y: "-58.18531" },
      { id: "1E-24", label: "1E-24", x: "110.02694", y: "-34.612129" },
      { id: "1E-23", label: "1E-23", x: "110.02695", y: "-11.038969" },
      { id: "1E-22", label: "1E-22", x: "110.02695", y: "12.90838" },
      { id: "1E-21", label: "1E-21", x: "110.40112", y: "36.855736" },
      { id: "1E-20", label: "1E-20", x: "110.40112", y: "60.428902" },
      { id: "1E-19", label: "1E-19", x: "110.40112", y: "84.002083" },
      { id: "1E-18", label: "1E-18", x: "110.40112", y: "107.57524" },
      { id: "1E-17", label: "1E-17", x: "110.40112", y: "131.04739" },
      { id: "1E-16", label: "1E-16", x: "110.40112", y: "154.62056" },
      { id: "1E-15", label: "1E-15", x: "110.40112", y: "178.19374" },
      { id: "1E-14", label: "1E-14", x: "110.40112", y: "201.76691" },
    ];

    return (
      <svg
        ref={ref}
        onClick={onClick}
        style={style}
        className={className}
        width="500"
        height="697"
        viewBox="0 0 500 697"
        version="1.1"
        id="svg1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="layer1"
          transform="translate(396.41125,498.02961)"
        >
          <g
            id="g21"
            transform="translate(-241.82916,-157.1625)"
          >
            {plotsG21.map(plot => (
              <g key={`plot-${plot.id}`} id={`plot-${plot.id}`} className="plot-interaction-layer">
                <rect style={rectStyle} width={rectWidth} height={rectHeight} x={plot.x} y={plot.y} />
                <text style={textStyle} x={parseFloat(plot.x) + rectWidth / 2} y={parseFloat(plot.y) + rectHeight / 2}>
                  {getPlotNumber(plot.label)}
                </text>
              </g>
            ))}
          </g>
          <g
            id="g41"
            transform="translate(-217.07782,-157.1625)"
          >
            {plotsG41.map(plot => (
              <g key={`plot-${plot.id}`} id={`plot-${plot.id}`} className="plot-interaction-layer">
                <rect style={rectStyle} width={rectWidth} height={rectHeight} x={plot.x} y={plot.y} />
                <text style={textStyle} x={parseFloat(plot.x) + rectWidth / 2} y={parseFloat(plot.y) + rectHeight / 2}>
                  {getPlotNumber(plot.label)}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    );
  }
);

Block2SVG.displayName = "Block2SVG";

export default Block2SVG;