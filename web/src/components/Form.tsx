import React from 'react';
import { Form, Button, Input } from 'antd';

const EmptyForm = ({ form, dataFields, labels, processValues, status, messages }: {
    form: any;
    dataFields: string[];
    labels: { [ key: string ]: string; };
    processValues: (values: object) => void;
    status: string;
    messages: { [ key: string ]: string; };
}) => {
    const { getFieldDecorator, getFieldsError, validateFields } = form;

    function handleSubmit (e: any) {
        e.preventDefault();
        validateFields((err: any, values: string[]) => {
            if (!err) {
                processValues(values);
            }
        });
    }

    function hasErrors (fieldsError: any) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    return (
        <div className='empty-form'>
            <Form layout='vertical' onSubmit={handleSubmit}>
                {
                    dataFields.map((field: string) => (
                        <Form.Item label={labels[field]} key={field}>
                            { getFieldDecorator(field, {
                                rules: [{ required: true, message: 'Please provide required information!' }]
                            })(<Input />)}
                        </Form.Item>
                    ))
                }
                <Form.Item>
                    <Button
                        htmlType='submit'
                        disabled={hasErrors(getFieldsError()) || status === messages.waiting}
                    >
                        Register new Company
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const WrappedForm = Form.create({ name: 'form' })(EmptyForm);

export default WrappedForm;
