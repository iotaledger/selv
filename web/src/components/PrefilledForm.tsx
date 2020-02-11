import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import icon from '../assets/formIcon.svg'

const Icon = () => <img src={icon} alt="" />

const PrefilledForm = ({ form, dataFields, labels, shortFields }: {
    form: any;
    dataFields: any;
    labels: { [ key: string ]: string; }
    shortFields: string[]
}) => {
    const { getFieldDecorator, setFieldsValue } = form;

    useEffect(() => {
        setFieldsValue(dataFields);
    }, [])

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
                            { getFieldDecorator(field, {})(
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