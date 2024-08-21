import React, { useState } from 'react';
import { Card, Popover, Space } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import DomainCheck from './DomainCheck';
import { ParsedDIDResult, ValidationResult } from '../context/globalState';
import { getExplorerLinkFromDID } from '../utils/explorer';
import Link from 'antd/es/typography/Link';

const shortenDID = (did: string):string => {
    const substringLength = 6;
    const splitDID = did.split(':');
    const methodSpecificIdentifier = splitDID.pop();
    if (!methodSpecificIdentifier) {
        return "";
    }
    const shortMethodSpecificIdentifier = methodSpecificIdentifier.substring(0,substringLength) + "..." + methodSpecificIdentifier.substring(methodSpecificIdentifier?.length-substringLength,methodSpecificIdentifier?.length);
    return [...splitDID, shortMethodSpecificIdentifier].join(':');
}

const extractDIDMethod = (did: string):string => {
    const splitDID = did.split(':');
    return splitDID[1] ?? "";
}

const DIDCard = ({ did, parsedDID, domains, loading }: { 
    did: string | null, 
    parsedDID: ParsedDIDResult | "in-flight" | null, 
    domains: ValidationResult | "in-flight" | null, 
    loading: boolean
}) => {
    const actions: React.ReactNode[] = [];
    if (did && parsedDID && parsedDID !== "in-flight") {
        actions.push(
            <Popover content={<p>IOTA Explorer</p>}>
                 <Link
                    href={getExplorerLinkFromDID(did, parsedDID)}
                    target="_blank"
                >
                    <ExportOutlined key="explorer" />
                </Link>        
            </Popover> 
        );
    };

    return (
        
        <Card loading={loading} actions={actions} style={{ minWidth: 300 }} className={ `did-card did-method_${extractDIDMethod(did ?? "")}` }>
            <Card.Meta
                // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                title={
                    <Popover 
                    content={
                        <pre style={{ maxWidth: 300, wordBreak: "break-all", whiteSpace: "pre-wrap" }}>{did}</pre>
                    }>
                            <pre>{did && shortenDID(did)}</pre>
                    </Popover>
                }
                description={
                    <>
                        {domains && domains !== "in-flight" && <DomainCheck validatedDomains={domains} />}
                    </>
                }
                />
        </Card>
  
    )
};

export default DIDCard;
