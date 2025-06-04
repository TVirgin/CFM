// src/components/maps/CemeteryMapSVG.tsx (or your preferred path)
import * as React from 'react';
import { base64CemeteryBackgroundImage } from './image64Data';

// interface CemeteryMapSVGProps {
//   // You can add props here if you want to make parts of the SVG dynamic
//   // For example, onClick handlers for specific wards, or styles
//   className?: string;
//   style?: React.CSSProperties; // Added to accept style from InteractiveCemeteryMap
//   onClick?: React.MouseEventHandler<SVGSVGElement>;
//   // Example: onWardClick?: (wardId: string) => void;
// // Make CemeteryMapSVGProps extend React.SVGProps to accept all standard SVG attributes.
// // Any custom props specific to CemeteryMapSVG can be added here.
interface CemeteryMapSVGProps extends React.SVGProps<SVGSVGElement> {
  // Example custom prop (not used currently, but shows where to add):
  // customData?: string;
}

export const CemeteryMapSVG = React.forwardRef<SVGSVGElement, CemeteryMapSVGProps>(
  (props, ref) => {
    // Destructure props for clarity and to apply them to the SVG element
    const { className, style, onClick } = props;

    return (
      <svg
        ref={ref} // Apply the forwarded ref to the root SVG element
        width="577.8584mm" // Consider using relative units like "100%" if it's inside a sized container
        height="697.46033mm" // Or set width/height via props or className
        viewBox="0 0 577.85841 697.46032"
        version="1.1"
        id="svg1"
        xmlSpace="preserve" // Changed from xml:space
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" // Add if you use xlink:href
        className={props.className} // Allow passing a className for external styling
      >
        {/* defs can be kept if you define gradients, patterns, styles etc. */}
        <defs id="defs1" />
        <g
          id="layer1" // Main layer group from Inkscape
          transform="translate(143.44845,348.29721)"
        // style={{ display: 'inline' }} // 'display:inline' is often default for <g> in SVG context. Keep if specific effect needed.
        >
          {/* The g4 group was where your background image was.
            If you intend to overlay this SVG on an <img> tag, this group might be empty or removed.
            The layer3 (plots) is transformed relative to layer1.
        */}
          <g
            id="g4"
            transform="translate(6.5316947,-2.305304)" // Transform from your snippet
          >
            {/* Embedded Background Image */}
            <image
              width="436.5625"
              height="436.5625"
              preserveAspectRatio="none" // Or "xMidYMid meet/slice" depending on desired behavior
              // style={{ imageRendering: 'optimizeQuality' }}
              xlinkHref={base64CemeteryBackgroundImage} // Use xlinkHref for base64 data
              id="cemeteryBackgroundImage" // Give it an ID
            />
            <g
              id="layer3" // Your layer with the plot rectangles
              inkscape-label="Layer 2" // This is editor metadata, can be removed or kept as data- attribute
              transform="translate(0,8.6938458)"
            >
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 1.9005,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward1" // These IDs are important for interactivity
                width="20.747736"
                height="204.01941"
                x="504.86157"
                y="442.37729"
              // onClick={handleWardClick} // Example if you want to make it clickable
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 3.31643,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward1E"
                width="9.9875994"
                height="171.86607"
                x="529.39099"
                y="475.35953"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 1.9005,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward2"
                width="23.05304"
                height="194.79819"
                x="473.73996"
                y="450.83008"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 3.5204,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="wardA"
                width="7.3170519"
                height="290.00107"
                x="463.40762"
                y="353.66461"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 1.9005,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward3"
                width="15.752911"
                height="194.02975"
                x="446.46054"
                y="450.44586"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 1.9005,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward9"
                width="21.131952"
                height="68.00647"
                x="475.27682"
                y="379.36566"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 2.06053,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward10"
                width="12.519143"
                height="116.64204"
                x="445.77213"
                y="331.41849"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 3.4006,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward4"
                width="21.049564"
                height="196.14905"
                x="416.96793"
                y="440.46844"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 3.13695,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward5"
                width="16.830456"
                height="195.46182"
                x="385.59259"
                y="441.83087"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 3.42581,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="wardB"
                width="11.107926"
                height="349.89624"
                x="403.80392"
                y="287.38791"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 1.9005,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward12"
                width="17.659374"
                height="149.42548"
                x="385.24606"
                y="290.97217"
              />
              <rect
                style={{
                  fill: '#092e26',
                  fillOpacity: 0.0319149,
                  stroke: '#00392d',
                  strokeWidth: 1.90050208,
                  strokeDasharray: 'none',
                  strokeOpacity: 0.43,
                }}
                id="ward11"
                width="23.636395"
                height="136.38472"
                x="415.94617"
                y="302.65448"
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }
);

export default CemeteryMapSVG;