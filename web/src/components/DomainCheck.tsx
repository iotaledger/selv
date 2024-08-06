import { CheckCircleTwoTone, ExclamationCircleTwoTone, ExportOutlined } from '@ant-design/icons';
import { List, Popover } from 'antd';
import Link from 'antd/es/typography/Link';
import React from 'react';
import { ValidationResult } from 'src/context/globalState';

const DomainCheck = ({ result }: {
  result: ValidationResult;
}) => {
  return (
    <>
      {result.valid?.length &&
        <List
          itemLayout="horizontal"
          dataSource={result.valid}
          renderItem={(item, index) => (
            <List.Item>
              <Popover content={
                <Link
                  href="https://explorer.iota.org/shimmer-testnet/addr/rms1ppyx34shww5l3e28gynp5r5zljyru2vuyc2vjjeyqr3yy02vtwlx52sh4rj?tab=DID"
                  target="_blank"
                >{/* TODO */}
                  did:iota:rms:0x4868d61773a9f8e54741261a0e82fc883e299c2614c94b2400e2423d4c5bbe6a <ExportOutlined />{/* TODO */}
                </Link>
              }><List.Item.Meta
                  avatar={<CheckCircleTwoTone />}
                  title={item.url}
                /></Popover>
            </List.Item>
          )}
        />
      }

      {result.invalid?.length &&
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
