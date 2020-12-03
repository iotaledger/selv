import React from 'react';

const cardsContent = [
	{
		title: 'Sed',
		body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui offici.'
	},
    {
		title: 'Voluptatum',
		body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui offici.'
    },
    {
		title: 'perspiciatis',
		body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui offici.'
    },
    {
		title: 'Voluptatum',
		body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui offici.'
	},
];

export default () => (  
	<div className='registry-card-wrapper'>
	    <div className='card-content'>
		{cardsContent.slice(0, 4).map(({ title, body }, index) => (
			<div key={`card-${index}`} className='card'>
			    <div className='faq-question'>{title}</div>
				<div className='faq-answer'>{body}</div>
            </div>
		))}
	    </div>
    </div>
);
