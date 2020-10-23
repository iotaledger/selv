import React, { useState, useEffect } from 'react';
import { Table } from 'rsuite';
import useWindowSize from '../utils/useWindowSize';
import data from '../testResults.json';
const { Column, HeaderCell, Cell } = Table;

// https://rsuitejs.com/en/components/table#%3CTable%3E

const TestIDCell = ({ ...props }) => {
    return (
        <Cell {...props} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }} >
            <div className='cell-content'>
                <p className='company-name'>
                    Test ID #{props.rowData.testId}
                </p>
                <p className='company-type'>
                    {props.rowData.testedBy}
                </p>
            </div>
        </Cell>
    );
};

const Timestamp = ({ ...props }) => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return (
        <Cell {...props} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }} >
            <div className='cell-content status-wrapper'>
                <p>
                    {(new Date(props.rowData.timestamp )).toLocaleDateString('en-GB', dateOptions)}
                </p>
            </div>
        </Cell>
    );
};

const ResultCell = ({ ...props }) => {
    return (
        <Cell {...props} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }} >
            <div className='cell-content status-wrapper'>
                <p className={`status ${props.rowData.testResult.toLowerCase()}`}>
                    {props.rowData.testResult}
                </p>
            </div>
        </Cell>
    );
};

const TableInstance = ({ onRowClick }: {
    onRowClick: (rowData: object) => void;
}) => {
    const [tableDimensions, setTableDimentions] = useState([710, 300, 300, 110]);
    const [windowWidth] = useWindowSize();

    useEffect(() => {
        if (windowWidth) {
            if (windowWidth < 450) {
                setTableDimentions([370, 160, 120, 90]);
            } else if (windowWidth < 750) {
                setTableDimentions([440, 180, 160, 100]);
            } else if (windowWidth < 1050 && windowWidth >= 990) {
                setTableDimentions([640, 280, 260, 100]);
            } else {
                setTableDimentions([710, 300, 300, 110]);
            }
        }
    }, [windowWidth]);

    return (
        <div>
            <div className='table-wrapper'>
                <Table
                    width={tableDimensions[0]}
                    height={950}
                    data={data}
                    rowHeight={90}
                    onRowClick={onRowClick}
                >
                    <Column width={tableDimensions[1]} fixed>
                        <HeaderCell>Panel Test Result</HeaderCell>
                        <TestIDCell />
                    </Column>

                    <Column width={tableDimensions[2]} fixed>
                        <HeaderCell>Taken on</HeaderCell>
                        <Timestamp />
                    </Column>

                    <Column width={tableDimensions[3]} fixed>
                        <HeaderCell>Result</HeaderCell>
                        <ResultCell />
                    </Column>
                </Table>
            </div>
        </div>
    );
};

export default TableInstance;
