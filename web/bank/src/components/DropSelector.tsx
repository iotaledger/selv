import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import Context from '../context/app-context';
import '../styles/components/dropSelector.scss';


//TODO: currently only works properly with two items due to some scss-bug
const DropSelector = () => {
    const [isExpanded, handleExpand] = useState(false);
    const { language, setLanguage }: any = useContext(Context);
    // const languages: string[] = useContext(Context);
    const languages: string[] = ['en', 'nl'];

    return (

    <div className={classNames(
        'drop-selector',
        { 'drop-selector__expanded': isExpanded }
    )}>
        <div className="drop-selector-title" onClick={() => handleExpand(!isExpanded)}>
            <div className="drop-selector-title__text">{language}</div>
            <div className="drop-selector-title__icon"></div>
        </div>
        <ul className="drop-selector-list">
            {languages.filter(item => item !== language).map(item => (
                <li key={item} className={classNames(
                    'drop-selector-list-item',
                    { 'drop-selector-list-item__selected': item === language }
                )}>
                    <div className="drop-selector-title" onClick={() => { setLanguage(item); handleExpand(false) }}>
                        <div className="drop-selector-title__text">{item}</div>
                        {/* <div className="drop-selector-title__icon"></div> */}
                    </div>
                </li>
            ))}
        </ul>
    </div>
)};

export default DropSelector;