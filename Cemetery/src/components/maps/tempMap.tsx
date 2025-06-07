// src/components/maps/CemeteryMapSVG.tsx

import * as React from 'react';

// --- Import your new base64 image data constants ---

// Ensure these paths and variable names are correct

import { base64MapImage1 } from './map64Data'; // Assuming this export name

import { base64MapImage2 } from './secondMap64'; // Assuming this export name



interface CemeteryMapSVGProps extends React.SVGProps<SVGSVGElement> {

    // className, style, onClick, etc., will be passed via ...restOfProps

}



export const CemeteryMapSVG = React.forwardRef<SVGSVGElement, CemeteryMapSVGProps>(

    (props, ref) => {

        const { className, style, onClick, ...restOfProps } = props;



        return (

            <svg

                ref={ref}

                onClick={onClick} // For event delegation from InteractiveCemeteryMap

                style={style}     // For positioning from InteractiveCemeteryMap

                className={className}

                width="577.8584mm"

                height="697.46033mm"

                viewBox="0 0 577.85841 697.46032"

                version="1.1"

                id="svg1" // This was the root ID in your SVG

                xmlSpace="preserve"

                xmlns="http://www.w3.org/2000/svg"

                xmlnsXlink="http://www.w3.org/1999/xlink"

                {...restOfProps}

            >

                <defs id="defs1">

                    <style>{
                    }</style>

                </defs>

                <g

                    id="layer1"

                    transform="translate(133.7639,334.11701)"

                >

                    {/* Group for Background Images - Rendered First */}

                    <g

                        id="g4"

                        transform="translate(6.5316947,-2.305304)"

                    >

                        <image

                            width="436.5625"

                            height="436.5625"

                            preserveAspectRatio="none"

                            style={{ imageRendering: 'auto' }} // Use 'auto' or remove for default

                            xlinkHref={base64MapImage1} // Use imported constant

                            id="image1" // Original ID from your SVG

                            x="-29.613373"

                            y="-113.83128"

                        // onmouseover="Highlight" // Remove direct JS, handle hover with CSS or React

                        />

                        <image

                            width="489.75769"

                            height="436.5625"

                            preserveAspectRatio="none"

                            style={{ imageRendering: 'auto' }}

                            xlinkHref={base64MapImage2} // Use imported constant

                            id="image1-2" // Original ID

                            x="-140.29559"

                            y="-331.81171"

                        />

                    </g>



                    {/* Group for Plot Overlays (Wards/Rects) - Rendered Second (on top of images) */}

                    <g

                        id="layer3"

                        // inkscape:label="Layer 2" // Editor metadata, can be removed

                        transform="translate(-143.44845,-339.60336)" // This transform is from your SVG                                                      

                    >

                        {/* Apply a common className to your interactive rects for styling and easier selection if needed */}

                        <rect

                            className="plot-interaction-layer" // Example class for styling

                            style={{

                                // Keeping original fill/stroke for visual reference from your SVG,

                                // but you'll likely want to override with transparent fill for overlay effect via CSS class

                                fill: '#092e26', fillOpacity: 0.0319149,

                                stroke: '#00392d', strokeWidth: 1.9005,

                                strokeDasharray: 'none', strokeOpacity: 0.43,

                            }}

                            id="ward1"

                            width="20.747736"

                            height="204.01941"

                            x="504.86157"

                            y="442.37729"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 3.31643, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="ward1E"

                            width="9.9875994"

                            height="171.86607"

                            x="529.39099"

                            y="475.35953"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 1.9005, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="ward2"

                            width="23.05304"

                            height="194.79819"

                            x="473.73996"

                            y="450.83008"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 3.5204, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="wardA"

                            width="7.3170519"

                            height="290.00107"

                            x="463.40762"

                            y="353.66461"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 1.9005, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="ward3"

                            width="15.752911"

                            height="194.02975"

                            x="446.46054"

                            y="450.44586"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 1.9005, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="ward9"

                            width="21.131952"

                            height="68.00647"

                            x="475.27682"

                            y="379.36566"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 2.06053, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="ward10"

                            width="12.519143"

                            height="116.64204"

                            x="445.77213"

                            y="331.41849"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 3.4006, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="ward4"

                            width="21.049564"

                            height="196.14905"

                            x="416.96793"

                            y="440.46844"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 3.13695, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="ward5"

                            width="16.830456"

                            height="195.46182"

                            x="385.59259"

                            y="441.83087"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 3.42581, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="wardB"

                            width="11.107926"

                            height="349.89624"

                            x="403.80392"

                            y="287.38791"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 1.9005, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="ward12"

                            width="17.659374"

                            height="149.42548"

                            x="385.24606"

                            y="290.97217"

                        />

                        <rect

                            className="plot-interaction-layer"

                            style={{ fill: '#092e26', fillOpacity: 0.0319149, stroke: '#00392d', strokeWidth: 1.90050208, strokeDasharray: 'none', strokeOpacity: 0.43 }}

                            id="ward11"

                            width="23.636395"

                            height="136.38472"

                            x="415.94617"

                            y="302.65448"

                        />

                    </g>

                </g>

            </svg>

        );

    }

);



CemeteryMapSVG.displayName = "CemeteryMapSVG";



export default CemeteryMapSVG; // Making it a default export for easier import if it's the main export