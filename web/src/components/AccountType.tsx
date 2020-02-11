import React from 'react'
import { Form, Button, Checkbox, Radio } from 'antd';

const EmptyForm = ({ form, onSubmit }: {
    form: any;
    onSubmit: (values: object) => void;
}) => {
    const { getFieldDecorator, getFieldsError, validateFields, resetFields } = form;

    function handleSubmit(e: any) {
        e.preventDefault();
        validateFields((err: any, values: string[]) => {
            if (!err) {
                onSubmit(values);
            }
        });
    }

    function hasErrors(fieldsError: any) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    return (
        <div className="empty-form">
            <Form onSubmit={handleSubmit}>
                <Form.Item label="Choose account type" colon={false}>
                    {getFieldDecorator('account-type', {
                        rules: [{
                            required: true,
                            message: 'Please choose an account type'
                        }]})(
                        <Radio.Group>
                            <Radio style={{ display: 'block '}} value={1}>Type 1</Radio>
                            <Radio style={{ display: 'block '}} value={2}>Type 2</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="Special feature" colon={false}>
                    {getFieldDecorator('feature', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>
                            Add special feature
                        </Checkbox>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                        Continue
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const WrappedForm = Form.create({name: 'form'})(EmptyForm)

export default WrappedForm;