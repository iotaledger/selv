import React, { useState } from 'react';
import { Table } from 'rsuite';

const { Column, HeaderCell, Cell, Pagination } = Table;

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
                    {props.rowData.CompanyName}
                </p>
                <p className="company-type">
                    {props.rowData.CompanyType}
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
                <p className={`status ${props.rowData.CompanyStatus.toLowerCase()}`}>
                    {props.rowData.CompanyStatus}
                </p>
            </div>
        </Cell>
    );
};

const TableInstance = ({ data, onRowClick, loading }: {
    data?: { CompanyName: string, CompanyCreationDate: string, CompanyType: string, CompanyStatus: string }[];
    onRowClick: (rowData: object) => void;
    loading?: boolean;
}) => {
    const [displayLength, setDisplayLength] = useState(10)
    const [page, setPage] = useState(1)

    function handleChangePage(dataKey: number) {
        setPage(dataKey)
    }
    
    function handleChangeLength(dataKey: number) {
        setPage(1)
        setDisplayLength(dataKey)
    }

    function getData() {
        return data?.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    }

    return (
        <div>
            <div className="table-wrapper">
                <Table 
                    width={710} 
                    height={950} 
                    data={getData()} 
                    rowHeight={90} 
                    onRowClick={onRowClick}
                    loading={loading}
                >
                    <Column width={300} fixed>
                        <HeaderCell>Company Name</HeaderCell>
                        <CompanyCell />
                    </Column>

                    <Column width={200} fixed>
                        <HeaderCell>Incorporated on</HeaderCell>
                        <Cell dataKey="CompanyCreationDate" style={{ 
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
            <Pagination
                lengthMenu={[
                    {
                        value: 10,
                        label: 10
                    },
                    {
                        value: 20,
                        label: 20
                    }
                ]}
                activePage={page}
                displayLength={displayLength}
                total={data?.length}
                onChangePage={handleChangePage}
                onChangeLength={handleChangeLength}
            />
      </div>
    );
};

export default TableInstance