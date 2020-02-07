import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css'
import { Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

// https://rsuitejs.com/en/components/table#%3CTable%3E

const CompanyCell = ({ ...props }) => {
    return (
        <Cell {...props} style={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }} >
            <div className="cell-content">
                <p className="company-name">
                    {props.rowData.name}
                </p>
                <p className="company-type">
                    {props.rowData.type}
                </p>
            </div>
        </Cell>
    );
};

const StatusCell = ({ ...props }) => {
    return (
        <Cell {...props} style={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }} >
            <div className="cell-content status-wrapper">
                <p className={`status ${props.rowData.status.toLowerCase()}`}>
                    {props.rowData.status}
                </p>
            </div>
        </Cell>
    );
};

const TableInstance = ({ data, onRowClick }: {
    data?: { name: string, date: string, type: string, status: string }[];
    onRowClick: (rowData: object) => void
}) => {
    return (
        <div className="table-wrapper">
            <Table width={710} height={570} data={data} rowHeight={90} onRowClick={onRowClick}>
                <Column width={300} fixed>
                    <HeaderCell>Company Name</HeaderCell>
                    <CompanyCell />
                </Column>

                <Column width={200} fixed>
                    <HeaderCell>Incorporated on</HeaderCell>
                    <Cell dataKey="date" style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }} />
                </Column>

                <Column width={130} fixed>
                    <HeaderCell>Status</HeaderCell>
                    <StatusCell />
                </Column>

                <Column width={50} fixed>
                    <HeaderCell></HeaderCell>
                    <Cell className="dots" style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        fontSize: 30,
                        position: 'relative',
                        top: -8
                    }} >
                        <div className="cell-content">
                            ...
                        </div>
                    </Cell>
                </Column>
            </Table>
      </div>
    );
};

export default TableInstance