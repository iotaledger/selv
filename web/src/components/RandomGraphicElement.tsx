import React, { useCallback, useMemo, useState } from 'react';
import { getRandomInt } from '../utils/helper';
// import useWindowSize from "../utils/useWindowSize";

import circle1 from '../assets/randomGraphics/circle1.svg';
import circle2 from '../assets/randomGraphics/circle2.svg';
import circle3 from '../assets/randomGraphics/circle3.svg';
import circle4 from '../assets/randomGraphics/circle4.svg';
import circle5 from '../assets/randomGraphics/circle5.svg';
import circle6 from '../assets/randomGraphics/circle6.svg';
import circle7 from '../assets/randomGraphics/circle7.svg';
import circle8 from '../assets/randomGraphics/circle8.svg';
//circle9.svg was considered a bit distracting when positioned behind text
// import circle9 from '../assets/randomGraphics/circle9.svg'; 
import circle10 from '../assets/randomGraphics/circle10.svg';
import circle11 from '../assets/randomGraphics/circle11.svg';
import circle12 from '../assets/randomGraphics/circle12.svg';

const graphics = [
    circle1, circle2, circle3, circle4, circle5, circle6,
    circle7, circle8, circle10, circle11, circle12
];

const RandomGraphicElement = ({ children, elements }: {
    children?: JSX.Element | null | undefined;
    elements: number;
}) => {
    const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

    //@ts-ignore
    const mainSectionEl = useCallback(node => {
        if (node !== null) {
            setDimensions(node.getBoundingClientRect());
        }
    }, []); // [windowWidth, windowHeight]

    const calculatedRandomValues = useMemo(() => {
        return Array.from(Array(elements).keys()).map(() => ({
            element: getRandomInt(graphics.length),
            top: 50 + getRandomInt(dimensions.height - 100),
            left: 50 + getRandomInt(dimensions.width - 100)
        

        }))
    }, [elements, dimensions])


    return (
        <div className='random-element-wrapper' ref={mainSectionEl}>
            { children }
            {   
                dimensions && calculatedRandomValues.map((e, i) => {
                    const randomGraphic = e.element;
                    const styles: any = {
                        zIndex: -1,
                        position: 'absolute',
                        top: e.top,
                        left: e.left
                    };
                    return (
                        <img
                            key={`${i}-${randomGraphic}`}
                            src={graphics[randomGraphic]}
                            style={styles}
                            alt=''
                        />
                    );
                })
            }
        </div>
    );
};

export default RandomGraphicElement;
