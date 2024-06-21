import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';
import { List } from 'antd';
import React from 'react';
import { ValidationResult } from 'src/context/globalState';

const DomainCheck = ({ result }: {
  result: ValidationResult;
}) => {
  return (
    <>
      {result.valid.length &&
        <List
          itemLayout="horizontal"
          dataSource={result.valid}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<CheckCircleTwoTone />}
                title={item.url}
              />
            </List.Item>
          )}
        />
      }

      {result.invalid.length &&
        <List
          itemLayout="horizontal"
          dataSource={result.invalid}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<ExclamationCircleTwoTone />}
                title={item.url}
                description={item.error}
              />
            </List.Item>
          )}
        />
      }
    </>
  );
};

export default DomainCheck;
