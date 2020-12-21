import React, { useEffect } from 'react';
import Sketch from 'react-p5';
import { Link } from 'react-router-dom';
import useStep from '../utils/useStep';
import { Disclaimer } from '../components';
import logo from '../assets/landing/logoHeader.svg';
import interReg from '../assets/fonts/Inter-SemiBold.otf'
import metroExtraBold from '../assets/fonts/Metropolis-ExtraBold.otf'

/**
 * Component which will display a Intro LifeSpan.
 */
const IntroLifeSpan = ({ history, match }) => {
	const { nextStep } = useStep(match);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	}, []);

	let state = 0;
	let size = 0;
    let metro_font, inter_font;
    let parentsLifeColor, yourLifeColor, nextGenLifeColor, treesLifeColor, forestLifeColor;
    let blueGradientColor, greenGradientColor, darkGreenGradientColor, white, black;
    const parentsRadius = 100;
    const yourRadius = 200;
    const nextGenRadius = 300;
    const treesRadius = 600;
    const forestRadius = 1200;

    function drawTimeline(p5){
		p5.stroke(black);
		p5.fill(black);
		p5.circle(size/2, p5.height/2, 5);

		p5.drawingContext.setLineDash([5, 10]);
		p5.line(0, p5.height/2, size/2, p5.height/2);
		p5.drawingContext.setLineDash([]);
	}
	
    function setGradient(p5, x, y, w, h, c1, c2, axis) {
		p5.noFill();
		if (axis === p5.Y_AXIS) {
			// Top to bottom gradient
			for (let i = y; i <= y + h; i++) {
				let inter = p5.map(i, y, y + h, 0, 1);
				let c = p5.lerpColor(c1, c2, inter);
				p5.stroke(c);
				p5.line(x, i, x + w, i);
			}
		} else if (axis === p5.X_AXIS) {
			// Left to right gradient
			for (let i = x; i <= x + w; i++) {
				let inter = p5.map(i, x, x + w, 0, 1);
				let c = p5.lerpColor(c1, c2, inter);
				p5.stroke(c);
				p5.line(i, y, i, y + h);
			}
		}
	}
	
    function drawRadialGradient(p5,to,from,unit) {
		const radius = p5.width + (unit * 10)+ size;
		for (let x = radius; x > 0; x -= unit) {
			let inter = p5.map(x, 0, radius, 0, 1.0);
			let colorHue = p5.lerpColor(from, to, inter);
			p5.fill(colorHue);
			p5.arc(0, p5.height/2, x,x,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
		}
	}
	
	const preload = async (p5) => {
		inter_font = await p5.loadFont(interReg);
		metro_font = await p5.loadFont(metroExtraBold);
		console.log('metro_font', metro_font);
	}

	const setup = (p5, parentRef) => {
		p5.disableFriendlyErrors = true;
		p5.frameRate(30);
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(parentRef); //👀 edit here to change size of the canvas

		parentsLifeColor = p5.color(255,255,255,200);
		yourLifeColor = p5.color(255,255,255,150);
		nextGenLifeColor = p5.color(255,255,255,100);
		treesLifeColor = p5.color(164,214,222,200);
		forestLifeColor = p5.color(165,196,195,200);
		blueGradientColor = p5.color(92,158,255);
		greenGradientColor = p5.color(165,196,195);
		darkGreenGradientColor = p5.color(164,214,222);
		white = p5.color(255);
		black = p5.color(0);
		p5.noLoop();
	}

	const draw = p5 => {
		if (state === 0) {
			console.log(10000);

			setGradient(p5,0,0,p5.width,p5.height,white,blueGradientColor,p5.Y_AXIS);
			drawRadialGradient(p5, blueGradientColor,white,40);
			
			console.log(333, 'draw', metro_font)
			p5.fill(black);
			metro_font && p5.textFont(metro_font);
			p5.textSize(36);
			p5.text('We are a gift from the past,', p5.width/2-160, p5.height/2);
			p5.text('and we will gift the future.', p5.width/2-145, p5.height/2+45);
		} else if (state === 1) {
			console.log(1111);

			p5.clear();
			if (size < parentsRadius) {
				size +=5;
			} else {
                p5.noLoop();
			}

			drawRadialGradient(p5, white,blueGradientColor,40);

			p5.fill(parentsLifeColor);
			p5.arc(0, p5.height/2, size, size,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);

			drawTimeline(p5);
			
			metro_font && p5.textFont(metro_font);
			p5.textSize(36);
			p5.text('This is the lifetime of', p5.width/2-105, p5.height/2);
			p5.text('your parents.', p5.width/2-32, p5.height/2+45);
		} else if (state === 2){
			console.log(2222);

			if (size < yourRadius) {
				size +=5;
			} else {
                p5.noLoop();
			}
			p5.noStroke();

			drawRadialGradient(p5, white,blueGradientColor,40);
			
			p5.fill(yourLifeColor);
			p5.arc(0, p5.height/2, size,size,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(parentsLifeColor);
			p5.arc(0, p5.height/2, parentsRadius, parentsRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);

			drawTimeline(p5);

			metro_font && p5.textFont(metro_font);
			p5.textSize(36);
			p5.text('This is your lifetime.', p5.width/2-100, p5.height/2);
		} else if (state === 3) {
			console.log(3333);

			if (size < nextGenRadius) {
				size +=5;
			} else {
                p5.noLoop();
			}
			p5.noStroke();

			drawRadialGradient(p5, white,blueGradientColor,40);
			
			p5.fill(nextGenLifeColor);
			p5.arc(0, p5.height/2, size, size,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(yourLifeColor);
			p5.arc(0, p5.height/2, yourRadius, yourRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(parentsLifeColor);
			p5.arc(0, p5.height/2, parentsRadius, parentsRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);

			drawTimeline(p5);
			metro_font && p5.textFont(metro_font);
			p5.textSize(36);
			p5.text('This will be the lifetime', p5.width/2-120, p5.height/2);
			p5.text('of the next generation.', p5.width/2-110, p5.height/2+45);
		} else if (state === 4) {
			console.log(4444);

			if (size < treesRadius) {
				size +=5;
			} else {
                p5.noLoop();
			}
			p5.noStroke();
			drawRadialGradient(p5, white,greenGradientColor,40);
			
			p5.fill(treesLifeColor);
			p5.arc(0, p5.height/2, size, size,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(nextGenLifeColor);
			p5.arc(0, p5.height/2, nextGenRadius, nextGenRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(yourLifeColor);
			p5.arc(0, p5.height/2, yourRadius, yourRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(parentsLifeColor);
			p5.arc(0, p5.height/2, parentsRadius, parentsRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);

			drawTimeline(p5);

			metro_font && p5.textFont(metro_font);
			p5.textSize(36);
			p5.text('This is the lifetime', p5.width/2-85, p5.height/2);
			p5.text('of a tree.', p5.width/2+10, p5.height/2+45);
		} else if (state === 5) {
			console.log(5555);

			if (size < forestRadius) {
				size +=5;
			} else {
                p5.noLoop();
			}
			p5.noStroke();
			drawRadialGradient(p5, white,greenGradientColor,40);
			
			p5.fill(forestLifeColor);
			p5.arc(0, p5.height/2, size, size,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(treesLifeColor);
			p5.arc(0, p5.height/2, treesRadius, treesRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(nextGenLifeColor);
			p5.arc(0, p5.height/2, nextGenRadius, nextGenRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(yourLifeColor);
			p5.arc(0, p5.height/2, yourRadius, yourRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(parentsLifeColor);
			p5.arc(0, p5.height/2, parentsRadius, parentsRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);

			drawTimeline(p5);

			p5.strokeWeight(0.5);
			p5.textSize(16);
			// p5.textFont(inter_font);

			metro_font && p5.textFont(metro_font);
			p5.textSize(36);
			p5.text('And this is the lifetime', p5.width/2-120, p5.height/2);
			p5.text('of the forest it belongs to.', p5.width/2-150, p5.height/2+45);
		} else if (state === 6) {
			console.log(6666);
			if (size > 1400) {
                p5.noLoop();
            }
			p5.noStroke();

			p5.fill(forestLifeColor);
			p5.arc(0, p5.height/2, forestRadius, forestRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(treesLifeColor);
			p5.arc(0, p5.height/2, treesRadius, treesRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			setGradient(p5,0,0,p5.width,p5.height,blueGradientColor,darkGreenGradientColor,p5.X_AXIS);
			drawRadialGradient(p5, white,darkGreenGradientColor,100);
			p5.fill(nextGenLifeColor);
			p5.arc(0, p5.height/2, nextGenRadius, nextGenRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(yourLifeColor);
			p5.arc(0, p5.height/2, yourRadius, yourRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);
			p5.fill(parentsLifeColor);
			p5.arc(0, p5.height/2, parentsRadius, parentsRadius,-p5.HALF_PI, p5.HALF_PI, p5.OPEN);

			p5.fill(black);
			metro_font && p5.textFont(metro_font);
			p5.textSize(36);
			p5.text('Persistent Selv will help you take care', p5.width/2-200, p5.height/2-20);
			p5.text('of future generations', p5.width/2-60, p5.height/2+30);
			p5.text('by protecting their environment.', p5.width/2-160, p5.height/2+80);

			inter_font && p5.textFont(inter_font);
			p5.textSize(18);

			size +=2;
		}

		if (state !== 6) {
			console.log(77777);
			inter_font && p5.textFont(inter_font);
			p5.textSize(18);
			p5.noStroke();
			p5.fill(black);
			p5.text('Click anywhere to continue', p5.width/2-40, p5.height/2+130);
		} else {
			console.log(77777);
			inter_font && p5.textFont(inter_font);
			p5.textSize(18);
			p5.noStroke();
			p5.fill(black);
			p5.text('Click anywhere to continue', p5.width/2-10, p5.height/2+170);
		}
	}

	const mouseClicked = p5 => {
		if (state < 6) {
			state++;
			p5.loop();
		} else {
			p5.noLoop();
			p5.clear();
			history.push(nextStep);
		}
	}

	return (
		<div className="theme-demo lifespan">
			<div className='demo-logo-wrapper'>
				<Link to={'/'} className='logo demo-page'>
					<img src={logo} alt='Selv logo' />
				</Link>
			</div>

			<Sketch
				preload={preload}
				setup={setup}
				draw={draw}
				mouseClicked={mouseClicked}
			/>
			<Disclaimer />
		</div>
	);
};

export default IntroLifeSpan;
