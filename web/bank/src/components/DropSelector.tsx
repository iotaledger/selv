import classNames from 'classnames';
import React, { useState } from 'react';
import '../styles/components/dropSelector.scss';
import { useTranslation } from 'react-i18next';

//TODO: currently only works properly with two items due to some scss-bug
const DropSelector = () => {
    const [isExpanded, handleExpand] = useState(false);
    const { i18n } = useTranslation();
    const languages: string[] = ['en', 'nl']

    function changeLanguage(lng: any){
        i18n.changeLanguage(lng);
    }

    return (

        <div className={classNames(
            'drop-selector',
            { 'drop-selector__expanded': isExpanded }
        )}>
            <div className="drop-selector-title" onClick={() => handleExpand(!isExpanded)}>
                <div className="drop-selector-title__text">{i18n.language}</div>
                <div className="drop-selector-title__icon"></div>
            </div>
            <ul className="drop-selector-list">
                {languages.filter(item => item !== i18n.language).map(item => (
                    <li key={item} className={classNames(
                        'drop-selector-list-item',
                        { 'drop-selector-list-item__selected': item === i18n.language }
                    )}>
                        <div className="drop-selector-title" onClick={() => { changeLanguage(item); handleExpand(false) }}>
                            <div className="drop-selector-title__text">{item}</div>
                            {/* <div className="drop-selector-title__icon"></div> */}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default DropSelector;