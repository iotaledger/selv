import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import { RandomGraphicElement } from '../'

export default ({ }) => (
    <RandomGraphicElement elements={5}>
        <div className="app-section">
            <h1>The app</h1>
        </div>
    </RandomGraphicElement>
);