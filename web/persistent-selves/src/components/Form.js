import React from 'react';
import { Form, Button, Input } from 'antd';

const EmptyForm = ({ form, dataFields, labels, processValues, status, messages }) => {
    const { getFieldDecorator, getFieldsError, validateFields } = form;

    function handleSubmit (e) {
        e.preventDefault();
        validateFields((err, values) => {
            if (!err) {
                processValues(values);
            }
        });
    }

    function hasErrors (fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    return (
        <div className='empty-form'>
            <Form layout='vertical' onSubmit={handleSubmit}>
                {
                    dataFields.map((field) => (
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
