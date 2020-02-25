import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import icon from '../assets/formIcon.svg'

const shortFields: string[] = ['Date', 'Nationality']

const labels: { [ key: string ]: string; } = {
    FirstName: 'First Name',
    LastName: 'Last Name',
    Date: 'Date of birth',
    Nationality: 'Nationality',
    Gender: 'Gender',
    Birthplace: 'Birthplace',
    Country: 'Country of residence',
    Phone: 'Phone number',
    Address: 'Address',
    CompanyName: 'Company name',
    CompanyAddress: 'Company address',
    CompanyType: 'Company type',
    CompanyBusiness: 'Nature of business',
    CompanyCreationDate: 'Company creation date',
    CompanyNumber: 'Company number',
    CompanyOwner: 'Managing director',
    BankName: 'Name of the bank',
    AccountType: 'Bank account type',
}

const Icon = () => <img src={icon} alt="" />

const PrefilledForm = ({ form, dataFields }: {
    form: any;
    dataFields: any;
}) => {
    useEffect(() => {
        form.setFieldsValue(dataFields);
    }, [form, dataFields])

    return (
        <div className="prefilled-form">
            <Form layout='vertical'>
                { 
                    Object.keys(dataFields).map((field: string) => (
                        <Form.Item 
                            label={labels[field]} 
                            key={field} 
                            className={shortFields.includes(field) ? 'short-field' : ''}
                        >
                            { form.getFieldDecorator(field, {})(
                                <Input disabled suffix={<Icon />} />
                            ) }
                        </Form.Item>
                    ))
                }
            </Form>
            <p className="notice bold small">Credentials provided by Selv ID</p>
        </div>
    )
}

const WrappedPrefilledForm = Form.create()(PrefilledForm)

export default WrappedPrefilledForm;