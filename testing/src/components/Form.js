import React from 'react'
import { Form, Button, Input } from 'antd';

const FormInstance = ({ form, setChannel }) => {

  const { getFieldDecorator, validateFields, resetFields } = form;

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err && values.channel) {
        setChannel(values.channel)
        resetFields()
      }
    });
  }
  
  
  return (
    <Form style={{marginBottom: '25px'}} layout="horizontal" onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('channel', {
        rules: [],
        })(
          <Input
            className="input"
            size="large"
          />,
          <Button>Send</Button>
        )}
      </Form.Item>

  </Form>
  )
}

const WrappedForm = Form.create({name: 'form'})(FormInstance)

export default WrappedForm;