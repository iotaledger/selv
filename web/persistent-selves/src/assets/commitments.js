import React from 'react';
import biodiversity from '../assets/registry/biodiversity-loss-sq.jpg';
import climate_change from '../assets/registry/climate-change-sq.jpg';
import fresh_water from '../assets/registry/freshwater-sq.jpg';
import land_use from '../assets/registry/land-use-change-sq.jpg';

import biodiversity2 from '../assets/registry/biodiversity-loss-sq2.jpg';
import climate_change2 from '../assets/registry/climate-change-sq2.jpg';
import fresh_water2 from '../assets/registry/freshwater-sq2.jpg';
import land_use2 from '../assets/registry/land-use-change-sq2.jpg';

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
        personalise: (<React.Fragment>
            <p>
                Far Future Foundation will register your commitment and safeguard your donation as a gift to future generations. 
            </p>
            <br />
            <p>
            Now decide the conditions for how and when you would like your donation to be distributed.
            </p>
        </React.Fragment>),
        commitments: [
            {
                image: climate_change,
                title: 'Climate change',
                status: 'exceeded',
                boundary: '350-450 ppm',
                value: '410 and rising',
                description: 'Global warming will have adverse effects in the future. We are already experiencing extreme weather events that will intensify. However there are a number of possible ways to address climate change, including clean energy and carbon capture, that future generations might decide to implement.',
                commitmentId: 'climate_change',
                condition: {
                    if: 'IF atmospheric carbon dioxide concentration exceeds',
                    values: ['410 ppm', '500 ppm', '600 ppm', '700 ppm', '800 ppm', '900 ppm', '1000 ppm', '1100 ppm', '1200 ppm', '1260 ppm', '500 ppm'],
                    support: ['carbon sequestration projects', 'climate-induced migration']
                }
            },
            {
                image: fresh_water,
                title: 'Freshwater use',
                status: 'unsafe',
                boundary: '4,000-6,000 km3 per year',
                value: 'Around 2,600 per year and rising',
                description: 'Serious water shortages already exist in some regions and are only likely to get worse, impacting ecosystems and altering the hydrological cycle and climate. In the future, we will need to adapt our irrigation, drainage and water management systems to combat water scarcity.',
                commitmentId: 'fresh_water',
                condition: {
                    if: 'IF blue water consumption exceeds',
                    values: ['2,600 km3 per year', '3,000 km3 per year', '4,000 km3 per year', '5,000 km3 per year', '6,000 km3 per year', '7,000 km3 per year', '8,000 km3 per year', '9,000 km3 per year', '10,000 km3 per year'],
                    support: ['water body conservation/restoration', 'improved agricultural water management']
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
                    if: 'IF the area of forested land as a proportion of forest-covered land prior to human alteration decreases to',
                    values: ['62%', '55%', '50%', '45%', '40%'],
                    support: ['deforestation reduction', 'indigenous land management practices']
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
                    if: 'IF the rate of species extinction per million species per year rises to',
                    values: ['1,000', '1,500', '2,000', '2,500', '3,000', '3,500', '4,000', '4,500', '5,000'],
                    support: ['species restoration', 'subsistence-based rural populations']
                }
            }
        ]
    },
    'present': {
        title: 'Present Commitments',
        description: (<React.Fragment>
            <p>
                The Now Foundation supports you in building your environmental legacy today. Act today, conscious of the benefits you will provide to the lives of future generations.  
            </p>
            <br />
            <p>
                Choose two earth boundaries you are passionate about.
            </p>
        </React.Fragment>),
        personalise: (<React.Fragment>
            <p>
                Now decide the conditions for how and when you would like your donation to be distributed.
            </p>
        </React.Fragment>),
        commitments: [
            {
                image: climate_change2,
                title: 'Climate change',
                status: 'exceeded',
                boundary: '350-450 ppm',
                value: '410 and rising',
                description: 'We are already experiencing climate change in many parts of the world. Longer heatwaves, heavy rainfalls and frequent droughts are becoming common. By making lifestyle choices today, we can reduce our carbon footprint and contribute towards decreasing harmful emissions.',
                commitmentId: 'climate_change',
                options: ['volunteering as part of a local climate action group', 'achieving a 1.5-degree lifestyle (for example cycling or using an electric car, becoming vegan or vegetarian, or switching to a renewable energy provider)']
            },
            {
                image: fresh_water2,
                title: 'Freshwater use',
                status: 'unsafe',
                boundary: '4,000-6,000 km3 per year',
                value: 'Around 2,600 per year and rising',
                description: 'Freshwater is an essential resource for the survival of human, animal and plant life. Some countries have already introduced water use restrictions to protect their reserves. Being conscious of water consumption and pollution today can be hugely beneficial in preserving our valuable water resources.',
                commitmentId: 'freshwater_use',
                options: ['volunteering as part of a Freshwater watch group', 'consuming under 100 litres per day']
            },
            {
                image: land_use2,
                title: 'Land use change',
                status: 'exceeded',
                boundary: '75-54%',
                value: '62% and falling',
                description: 'There are fewer and fewer places on earth untouched by humans. The demand to support our everyday living is altering land use at an unprecedented speed. We are already realising the importance of planting new trees and conserving existing forests.',
                commitmentId: 'land_use_change',
                options: ['volunteering as part of an afforestation/ reforestation/ tree planting project', 'buying sustainable-label products (for example palm-oil free products)']
            },
            {
                image: biodiversity2,
                title: 'Biodiversity loss',
                status: 'exceeded',
                boundary: '10-100',
                value: 'Around 100-1,000 and rising',
                description: 'A decline in the number and variety of living species is caused by widespread pollution and declining ecosystems. By participating in activities that clean up litter and support the growth of ecosystems, we can establish healthier environments to sustain life.',
                commitmentId: 'biodiversity_loss',
                options: ['volunteering in litter cleaning efforts', 'rewilding my garden/ balcony/ roof']
            }
        ]
    }
}