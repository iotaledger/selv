import React, { useState, useEffect } from "react";
import { Table } from "rsuite";
import useWindowSize from "../utils/useWindowSize";
import { useTranslation } from 'react-i18next';
const { Column, HeaderCell, Cell, Pagination } = Table;

// https://rsuitejs.com/en/components/table#%3CTable%3E

type Company = {
  CompanyNumber: string;
};

const CompanyCell = ({ ...props }) => {
  return (
    <Cell
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className="cell-content">
        <p className="company-name">{props.rowData.CompanyName}</p>
        <p className="company-type">{props.rowData.CompanyType}</p>
      </div>
    </Cell>
  );
};

const StatusCell = ({ ...props }) => {
  const { i18n } = useTranslation();
  return (
    <Cell
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className="cell-content status-wrapper">
        <p className={`status ${props.rowData.CompanyStatus.toLowerCase()}`}>
          {i18n.t("general." + props.rowData.CompanyStatus.toLowerCase())}
        </p>
      </div>
    </Cell>
  );
};

const TableInstance = ({
  data,
  onRowClick,
  loading,
}: {
  data?: {
    CompanyName: string;
    CompanyCreationDate: string;
    CompanyType: string;
    CompanyStatus: string;
  }[];
  onRowClick: (rowData: object) => void;
  loading?: boolean;
}) => {
  const [displayLength, setDisplayLength] = useState(10);
  const [page, setPage] = useState(1);
  const [tableDimensions, setTableDimentions] = useState([
    710,
    300,
    200,
    130,
    50,
  ]);
  const [windowWidth] = useWindowSize();

  useEffect(() => {
    if (windowWidth) {
      if (windowWidth < 450) {
        setTableDimentions([370, 160, 120, 90, 0]);
      } else if (windowWidth < 750) {
        setTableDimentions([440, 190, 120, 90, 40]);
      } else if (windowWidth < 1050 && windowWidth >= 990) {
        setTableDimentions([640, 280, 180, 130, 50]);
      } else {
        setTableDimentions([710, 300, 200, 130, 50]);
      }
    }
  }, [windowWidth]);

  function handleChangePage(dataKey: number) {
    setPage(dataKey);
  }

  function handleChangeLength(dataKey: number) {
    setPage(1);
    setDisplayLength(dataKey);
  }

  function getData() {
    const companyDetails = data?.filter((company) => {
      return company.CompanyName;
    });

    return companyDetails?.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  }

  const { t } = useTranslation();

  return (
    <div>
      <div className="table-wrapper">
        <Table
          width={tableDimensions[0]}
          height={950}
          data={getData()}
          rowHeight={90}
          onRowClick={onRowClick}
          loading={loading}
        >
          <Column width={tableDimensions[1]} fixed>
            <HeaderCell>{t("components.table.companyName")}</HeaderCell>
            <CompanyCell />
          </Column>

          <Column width={tableDimensions[2]} fixed>
            <HeaderCell>{t("components.table.incorporatedOn")}</HeaderCell>
            <Cell
              dataKey="CompanyCreationDate"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            />
          </Column>

          <Column width={tableDimensions[3]} fixed>
            <HeaderCell>{t("components.table.status")}</HeaderCell>
            <StatusCell />
          </Column>

          <Column width={tableDimensions[4]} fixed>
            <HeaderCell />
            <Cell
              className="dots"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontSize: 30,
                position: "relative",
                top: -8,
              }}
            >
              <div className="cell-content info">{'\u24D8'}</div>
            </Cell>
          </Column>
        </Table>
      </div>
      <Pagination
        lengthMenu={[
          {
            value: 10,
            label: 10,
          },
          {
            value: 20,
            label: 20,
          },
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

export default TableInstance;
