import React, { useState, useEffect } from 'react';
import { Table } from 'rsuite';
import useWindowSize from '../utils/useWindowSize';
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
                    {props.rowData.test}
                </p>
            </div>
        </Cell>
    );
};

const Timestamp = ({ ...props }) => {
    return (
        <Cell {...props} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }} >
            <div className='cell-content status-wrapper'>
                <p>
                    {props.rowData.result}
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
                <p>
                    {props.rowData.reference}
                </p>
            </div>
        </Cell>
    );
};

const TableInstance = ({ data }: { data: {
    test: string;
    result: number;
    reference: string;
}[] }) => {
    const [tableDimensions, setTableDimentions] = useState([710, 350, 200, 160]);
    const [windowWidth] = useWindowSize();

    useEffect(() => {
        if (windowWidth) {
            if (windowWidth < 450) {
                setTableDimentions([370, 160, 120, 90]);
            } else if (windowWidth < 750) {
                setTableDimentions([440, 180, 160, 100]);
            } else if (windowWidth < 1050 && windowWidth >= 990) {
                setTableDimentions([640, 280, 200, 160]);
            } else {
                setTableDimentions([710, 350, 200, 160]);
            }
        }
    }, [windowWidth]);

    return (
        <div>
            <div className='table-wrapper details'>
                <Table
                    width={tableDimensions[0]}
                    height={950}
                    data={data}
                    rowHeight={60}
                >
                    <Column width={tableDimensions[1]} fixed>
                        <HeaderCell>Test</HeaderCell>
                        <TestIDCell />
                    </Column>

                    <Column width={tableDimensions[2]} fixed>
                        <HeaderCell>Result</HeaderCell>
                        <Timestamp />
                    </Column>

                    <Column width={tableDimensions[3]} fixed>
                        <HeaderCell>Reference Range</HeaderCell>
                        <ResultCell />
                    </Column>
                </Table>
            </div>
        </div>
    );
};

export default TableInstance;
