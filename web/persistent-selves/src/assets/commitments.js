import React from 'react';
import image from './commitmentPlaceholder.svg';
import biodiversity from '../assets/registry/biodiversity-loss-sq.jpg';
import climate_change from '../assets/registry/climate-change-sq.jpg';
import fresh_water from '../assets/registry/freshwater-sq.jpg';
import land_use from '../assets/registry/land-use-change-sq.jpg';

export default {
    'future': {
        title: 'Future Commitments',
        description: (<React.Fragment>
            <p>
                The Far Future Foundation supports missions dedicated to protecting the Earth’s boundaries into the future. We understand future generations will have to make important decisions to safeguard their environment. You can help them today, by making a commitment to donate to their future.  
            </p>
            <br />
            <p>
                Select two boundaries you are most concerned about and help future generations adapt to a changing climate.
            </p>
        </React.Fragment>),
        commitments: [
            {
                image: climate_change,
                title: 'Climate change',
                status: 'exceeded',
                boundary: '350-450ppm',
                value: '410 and rising',
                description: 'Global warming will have adverse effects in the future. We are already experiencing extreme weather events that will intensify. However there are a number of possible ways to address climate change, including clean energy and carbon capture, that future generations might decide to implement.',
                commitmentId: 'climate_change',
                condition: {
                    if: 'IF the Amazon cover is reduced by less than',
                    support: ['reforestation', 'rehydration']
                }
            },
            {
                image: fresh_water,
                title: 'Freshwater use',
                status: 'unsafe',
                boundary: '4,000-6,000km3 per year',
                value: 'Around 2,600 per year and rising',
                description: 'Serious water shortages already exist in some regions and are only likely to get worse, impacting ecosystems and altering the hydrological cycle and climate. In the future, we will need to adapt our irrigation, drainage and water management systems to combat water scarcity.',
                commitmentId: 'fresh_water',
                condition: {
                    if: 'IF the Amazon cover is reduced by less than',
                    support: ['reforestation', 'rehydration']
                }
            },
            {
                image: land_use,
                title: 'Land use change',
                status: 'exceeded',
                boundary: '75-54%',
                value: '62% and falling',
                description: 'We are on a path of eradicating our valuable forests. We are converting land for human use at an unprecedented speed, destroying rich wildlife and undermining the stability of ecosystems. Future generations will have to decide how to change some of our current land management practices.',
                commitmentId: 'land_use_change',
                condition: {
                    if: 'IF land use change is greater than',
                    support: ['melioration', 'rehydration']
                }
            },
            {
                image: biodiversity,
                title: 'Biodiversity loss',
                status: 'exceeded',
                boundary: '10-100',
                value: 'Around 100-1,000 and rising',
                description: 'An estimated 50% of species could go extinct by 2100. Our activities are accelerating species extinction and undermining life in ecosystems. The protection of our planet’s diversity will be a major concern for generations to come.',
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