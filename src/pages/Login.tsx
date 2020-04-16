import React, { useContext } from 'react';
import cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Form, Button, Input } from 'antd';
import { sha256 } from 'js-sha256';
import Context from '../context/app-context';
import { Disclaimer } from '../components';
import { passwordHash } from '../config.json';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
import logo from '../assets/landing/logoHeader.svg';

/**
 * Component which will display a Login.
 */
const LoginForm: React.FC = ({ form, match }: any) => {
    const { setRequestPassword }: any = useContext(Context);
    const { getFieldDecorator, validateFields } = form;

    function handleSubmit (e: any) {
        e.preventDefault();
        validateFields(['password'], async (err: any, values: any) => {
            if (!err && values?.password) {
                cookies.set('password', sha256(values?.password))
                setRequestPassword(false);
            }
        });
    }

    function compareToHash (rule: any, value: any, callback: any) {
        const candidate = sha256(value);
        if (value && candidate !== passwordHash) {
          callback('Wrong password!');
        } else {
          callback();
        }
    };

    return (
        <div className='theme-demo'>
            <Link to={'/'} className="logo">
                <img src={logo} alt="Selv logo" />
            </Link>
            <div className='demo-intro login' id='app'>
                <div className='login-content-wrapper'>
                    <div className='heading'><h2>Login to the Selv Demo</h2></div>
                    <Form 
                        layout='vertical' 
                        hideRequiredMark
                        onSubmit={handleSubmit}
                    >
                        <Form.Item label='Password'>
                            { getFieldDecorator('password', {
                                validateTrigger: 'onBlur',
                                rules: [
                                    { required: true, message: 'Please provide valid password!' },
                                    { validator: compareToHash },
                                ]
                            })(<Input.Password />)}
                        </Form.Item>
                        <Form.Item>
                            <Button 
                                className='cta' 
                                htmlType='submit' 
                            >
                                Continue
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <img src={dots} alt='' className='dots-top' />
                <img src={dots} alt='' className='dots-bottom' />
                <img src={ellipse} alt='' className='ellipse' />
            </div>
            <Disclaimer />
        </div>
    );
};

const Login = Form.create({ name: 'login' })(LoginForm);

export default Login;