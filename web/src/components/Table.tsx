import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css'
import { Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

// https://rsuitejs.com/en/components/table#%3CTable%3E

const TableInstance = ({ data, onRowClick }: {
    data?: { name: string, date: string, type: string, status: string }[];
    onRowClick: (rowData: object) => void
}) => {
    return (
        <div className="table-wrapper">
            <Table width={730} height={370} data={data} onRowClick={onRowClick}>
                <Column width={200} fixed>
                    <HeaderCell>Company Name</HeaderCell>
                    <Cell dataKey="name" />
                </Column>

                <Column width={200} fixed>
                    <HeaderCell>Incorporated on</HeaderCell>
                    <Cell dataKey="date" />
                </Column>

                <Column width={230} fixed>
                    <HeaderCell>Type</HeaderCell>
                    <Cell dataKey="type" />
                </Column>

                <Column width={100} fixed>
                    <HeaderCell>Status</HeaderCell>
                    <Cell dataKey="status" />
                </Column>
            </Table>
      </div>
    );
};

export default TableInstance