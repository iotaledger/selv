import React from 'react';

const faqs = [
    {
        question: 'Sed ut perspiciatis unde omnis iste natus errorus sit ipsum itos?',
        answer: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui offici.'
    },    
    {
        question: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut?',
        answer: 'Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.'
    },
    {
        question: 'Sed ut perspiciatis unde omnis iste natus errorus sit ipsum itos?',
        answer: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui offici.'
    },
    {
        question: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut?',
        answer: 'Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.'
    }
];

export default () => (
    <div className='faq-wrapper'>
        <h4>Frequently Asked Questions</h4>
        <div className='faq-content'>
            {
                faqs.map(({ question, answer}) => (
                    <div className='faq'>
                        <div className='faq-question'>{question}</div>
                        <div className='faq-answer'>{answer}</div>
                    </div>
                ))
            }
        </div>
    </div>
);
