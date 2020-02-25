import React, { useCallback, useState } from 'react';
import useWindowSize from "../utils/useWindowSize";
import { getRandomInt } from '../utils/helper'

import circle1 from '../assets/randomGraphics/circle1.svg'
import circle2 from '../assets/randomGraphics/circle2.svg'
import circle3 from '../assets/randomGraphics/circle3.svg'
import circle4 from '../assets/randomGraphics/circle4.svg'
import circle5 from '../assets/randomGraphics/circle5.svg'
import circle6 from '../assets/randomGraphics/circle6.svg'
import circle7 from '../assets/randomGraphics/circle7.svg'
import circle8 from '../assets/randomGraphics/circle8.svg'
import circle9 from '../assets/randomGraphics/circle9.svg'
import circle10 from '../assets/randomGraphics/circle10.svg'
import square1 from '../assets/randomGraphics/square1.svg'
import square2 from '../assets/randomGraphics/square2.svg'
import square3 from '../assets/randomGraphics/square3.svg'
import square4 from '../assets/randomGraphics/square4.svg'

const graphics = [
    circle1, circle2, circle3, circle4, circle5,
    circle6, circle7, circle8, circle9, circle10, 
    square1, square2, square3, square4
]

const RandomGraphicElement = ({ children, elements }: { 
    children?: JSX.Element | null | undefined;
    elements: number;
}) => {
    const [dimensions, setDimensions] = useState();
    const [windowWidth, windowHeight] = useWindowSize();

    const mainSectionEl = useCallback(node => {
        if (node !== null) {
            setDimensions(node.getBoundingClientRect());
        }
    }, [windowWidth, windowHeight]);

    return (
        <div className="random-element-wrapper" ref={mainSectionEl}>
            { children }
            {
                dimensions && Array.from(Array(elements).keys()).map(e => {
                    const randomGraphic = getRandomInt(graphics.length)
                    const styles: any = {
                        zIndex: 0,
                        position: 'absolute',
                        top: 100 + dimensions.top + getRandomInt(dimensions.height - 200),
                        left: 100 + getRandomInt(dimensions.width - 200),
                        // opacity: 0.7 + Math.floor(Math.random())
                    };
                    return ( 
                        <img 
                            key={`${e}-${randomGraphic}`}
                            src={graphics[randomGraphic]} 
                            style={styles}
                            alt="" 
                        />
                    )
                })
            }
        </div>
    );
};

export default RandomGraphicElement;