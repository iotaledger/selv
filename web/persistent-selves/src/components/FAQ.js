import React from 'react';
import { PanelGroup, Panel } from 'rsuite';

const faqs = [
	{
		question: 'What is Good Ancestor Registry?',
		answer: 'The good ancestor registry is a imaginary, decentralized repository of commitments, create by people across the globe that want to preserve their values and intentions for a better society with future generations and create their own sustainable heritage.'
	},
	{
		question: 'How is my digital identity connected to Good Ancestor Registry?',
		answer: 'This demonstration explores how a self-sovereign digital identity can help humans to create peer-to-peer networks of value without granting any one or centralized entity control over highly personal data.'
	},
	{
		question: 'How will my digital commitments impact future generations?',
		answer: 'Your digital commitments for a positive environmental inheritance will be recorded and stored in Good Ancestor Registry. Your pledges will be public and shared with future generations as a testament to the legacies you have helped to build.'
	},
	{
		question: 'What is the Earth System and its boundaries?',
		answer: 'There are nine planetary boundaries within which humans can continue to develop and thrive for generations to come. These nine processes (Climate change, Freshwater use, Land use change, Biodiversity loss, Ocean acidification, Chemical pollution, Nitrogen and Phosphorus loading, Air pollution, and Ozone layer depletion) regulate the stability and resilience of the Earth system. Crossing these boundaries increases the risk of generating large-scale abrupt or irreversible environmental changes.'
	}
];

export default () => (
	<div className='registry-faq-wrapper'>
		<h3>Frequently Asked Questions</h3>
		<PanelGroup className='faq-content' accordion>
			{faqs.map(({ question, answer }, index) => (
				<Panel 
					key={`faq-${index}`} 
					className='faq' 
					bordered={false}
					defaultExpanded={index === 0}
					header={question}>
					<div className='faq-answer'>{answer}</div>
				</Panel>
			))}
		</PanelGroup>
	</div>
);
