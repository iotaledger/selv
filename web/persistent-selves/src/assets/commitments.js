import React from 'react';
import image from './commitmentPlaceholder.svg';

export default {
    'future': {
        title: 'Future Commitments',
        description: (<React.Fragment>
            Choose from a number of future commitments you wish to support. Future generations will have to deal with a number of environmental issues if we continue 'business as usual'.<br /><br /><br />You can choose two pledges to help the future as part of your legacy.
        </React.Fragment>),
        commitments: [
            {
                image,
                title: 'Climate Change',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                commitmentId: 'climate_change',
                condition: {
                    if: 'IF the Amazon cover is reduced by less than',
                    support: ['reforestation', 'rehydration']
                }
            },
            {
                image,
                title: 'Land Use Change',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                commitmentId: 'land_use_change',
                condition: {
                    if: 'IF land use change is greater than',
                    support: ['melioration', 'rehydration']
                }
            },
            {
                image,
                title: 'Biodiversity Loss',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                commitmentId: 'biodiversity_loss',
                condition: {
                    if: 'IF biodiversity loss is greater than',
                    support: ['education', 'motivation']
                }
            }
        ]
    },
    'present': {
        title: 'Present Commitments',
        description: (<React.Fragment>
            Choose from a number of present commitments you wish to support. Present generations will have to deal with a number of environmental issues if we continue 'business as usual'.<br /><br /><br />You can choose two commitments to help the present as part of your legacy.
        </React.Fragment>),
        commitments: [
            {
                image,
                title: 'Education',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                commitmentId: 'education',
                condition: {
                    if: 'IF the education level drops below than',
                    support: ['education', 'motivation']
                }
            },
            {
                image,
                title: 'Energy',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                commitmentId: 'energy',
                condition: {
                    if: 'IF the energy usage is greater than',
                    support: ['green energy', 'colonization of Mars']
                }
            },
            {
                image,
                title: 'Networks',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                commitmentId: 'networks',
                condition: {
                    if: 'IF the networks usage is greater than',
                    support: ['hacker communities', 'anonymous cryptocurrencies']
                }
            }
        ]
    }
}