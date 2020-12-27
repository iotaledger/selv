import React from 'react';
import { Modal } from 'rsuite';
import futures from '../assets/thankYou/futures-literacy.svg';
import goodAncestor from '../assets/thankYou/good-ancestor.svg';
import inheritance from '../assets/thankYou/inheritance.svg';
import deep from '../assets/thankYou/deep.svg';

export const cards = [
    {
        id: 'GoodAncestor',
        title: 'Good Ancestor',
        body: '“The Good Ancestor” is a guide by Roman Krznaric on how to think long-term in a short-term world.',
        image: goodAncestor
    },
    {
        id: 'DeepDemonstration',
        title: 'Deep Demonstration',
        body: "Climate KIC is Europe's leading climate innovation initiative.",
        image: deep
    },
    {
        id: 'Inheritance',
        title: 'Inheritance',
        body: 'Dark Matter Labs explores the institutional infrastructure to respond to the technological revolution.',
        image: inheritance
    },
    {
        id: 'FuturesLiteracy',
        title: 'Futures Literacy',
        body: 'Futures Literacy is the skill that allows people to better understand the role of the future in what they see and do.',
        image: futures
    }
];

export default {
    FuturesLiteracy: (<React.Fragment>
        <Modal.Header>
            <Modal.Title>Futures Literacy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            In this app, you have been generating futures, considering options, and making choices. Recent understandings of the skill called futures literacy offers insights into the role your assumptions play in imagining futures, and the role these imagined futures play in perceiving options. 
            <br /><br />
            Like other literacies (e.g. media, data, science), futures literacy is about expanding the variety of approaches and purposes for imagining and using futures. These futures can be thought of as a variety of lenses, each one specifically able to show you some aspect of our ever-changing world. In this app you used two kinds of futures by their different time horizons: a far future and the immediate future. There are even more varieties to explore such as possible, probable, desirable, or surprising; or even emergent and unfamiliar.
            <br /><br />
            Becoming skilled at being aware of the futures you are using and being able to readily switch to different approaches and aims for imagining futures is valuable. It can help you identify and select opportunities for action in the present. 
        </Modal.Body>
    </React.Fragment>),
    GoodAncestor: (<React.Fragment>
        <Modal.Header>
            <Modal.Title>The Good Ancestor (by Roman Krznaric)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Link: <a href='https://www.romankrznaric.com/good-ancestor' target='_blank'
                rel='noopener noreferrer'>https://www.romankrznaric.com/good-ancestor</a>
            <br /><br />
            We live in an era of pathological short-termism. Our politicians can barely see past the next election or latest tweet. Markets spike then crash in speculative bubbles. Nations sit around international conference tables bickering away while the planet burns and species disappear. And we are constantly clicking the Buy Now button. This is the age of the tyranny of the now.
            <br /><br />
            How can we expand our time horizons beyond our obsession with the present tense so we can deal with the crises of our time? We must recognise that humankind has colonised the future. In wealthy countries especially, we treat it like a distant colonial outpost where we can freely dump ecological damage and technological risk as if there was nobody there.
            <br /><br />
            The tragedy is that future generations are not here to challenge this pillaging of their inheritance. They have no political rights or representation. They have no influence in the marketplace. We need to bring tomorrow’s citizens into the room when we are making decisions today, in both private and public life. We must confront the great question of time: How can we be good ancestors? 
            <br /><br />
            This is a moment to consider our legacies to the billions upon billions of people who will be born in the decades and centuries to come. This is a moment to consider our long-term relationship with the living world. This is a moment for a new conception of the self that extends far beyond the present and transcends death itself. Let us become time rebels dedicated to the long view and intergenerational justice.
            <br /><br />
            Roman Krznaric, author of <a href='https://www.romankrznaric.com/good-ancestor' target='_blank'
                rel='noopener noreferrer'>The Good Ancestor: How to Think Long Term in a Short-Term World</a>
        </Modal.Body>
    </React.Fragment>),
    Inheritance: (<React.Fragment>
        <Modal.Header>
            <Modal.Title>Persistent Selv Legacies (by DML)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Link: <a href='https://medium.com/futures-in-long-termism/futures-in-long-termism-95f64710f9b2' target='_blank'
                rel='noopener noreferrer'>https://medium.com/futures-in-long-termism/futures-in-long-termism-95f64710f9b2</a>

            What if our biological demise didn't mark the end of our influence in the world? In order to truly transcend death, we first need to accept it. Simply by recognising that life indeed ends, we open up the possibility of thinking beyond death, to imagine the future and ways in which we can intervene in it, well after we have gone. This practice of true long-term planning, prospecting and legacy-thinking are central components of behavior change. Heritage becomes decisive for the formation of an expanded influence and of our consciousness beyond our lifetime.
            <br /><br />
            With technology promising to revolutionize our persistence into the future, it is time to diversify inheritance instruments (building on diverse traditions and alternative conceptions of inheritance) as a way to foster actions and identities that prevail beyond our lifetime and in the long-term. A set of new inheritance and legacy mechanisms built on the backbone of emerging tech can release opportunities to establish Persistent Selves. We can start thinking, how can we incentivise individuals to plan long-term self-executing digital actions beyond their life, for the benefit of future generations? What types of inheritances, beyond monetary wealth, can we pass on? And what types of conditions do we need to develop so that descendants can make use of inheritance contingent on their circumstances, enhancing a positive impact and decolonizing the future?
        </Modal.Body>
    </React.Fragment>),
    DeepDemonstration: (<React.Fragment>
        <Modal.Header>
            <Modal.Title>Climate Kic Deep Demonstration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            ...
        </Modal.Body>
    </React.Fragment>)
}