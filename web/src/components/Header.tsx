import React from 'react';
import { IdcardOutlined, SolutionOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { useTranslation } from 'react-i18next';

const Header = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string | undefined;
}) => {

    const { t } = useTranslation();
    
    return (
        <div className='header-wrapper'>
            <div className='logo'>
                { theme === 'government' && 
                    <Flex gap={'small'} align='center'>
                        <IdcardOutlined/>
                        <span>{t("steps.government.title")}</span>
                    </Flex>
                }
                { theme === 'company' && 
                    <Flex gap={'small'} align='center'>
                        <SolutionOutlined/>
                        <span>{t("steps.company.title")}</span>
                    </Flex>
                }
            </div>
            { children }
        </div>
    );
};

export default Header;
