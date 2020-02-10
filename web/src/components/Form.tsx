import React from 'react'
import { Form, Button, Input } from 'antd';

const EmptyForm = ({ form, dataFields, labels, processValues }: {
    form: any;
    dataFields: string[];
    labels: { [ key: string ]: string; };
    processValues: (values: object) => void;
}) => {
    const { getFieldDecorator, getFieldsError, validateFields, resetFields } = form;

    function handleSubmit(e: any) {
        e.preventDefault();
        validateFields((err: any, values: string[]) => {
            if (!err) {
                processValues(values);
                // resetFields()
            }
        });
    }

    function hasErrors(fieldsError: any) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    return (
        <div className="empty-form">
            <Form layout='vertical' onSubmit={handleSubmit}>
                { 
                    dataFields.map((field: string) => (
                        <Form.Item label={labels[field]} key={field}>
                            { getFieldDecorator(field, {
                                rules: [{ required: true, message: 'Please provide required information!' }],
                            })( <Input /> )}
                        </Form.Item>
                    ))
                }
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                        Register new Company
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const WrappedForm = Form.create({name: 'form'})(EmptyForm)

export default WrappedForm;