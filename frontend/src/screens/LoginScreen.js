import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions'

function LoginScreen({ location, history }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userLogin = useSelector(state => state.userLogin)
    const {error, loading, userInfo} = userLogin

    useEffect(() => {
        if(userInfo){
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1 className='text-center'>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>

                <Form.Group controlId='email'> 
                   <Form.Label>Email Adress</Form.Label>
                   <Form.Control 
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                   >
                   </Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className='py-2'> 
                   <Form.Label>Password</Form.Label>
                   <Form.Control 
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                   >
                   </Form.Control>
                </Form.Group>
                <div className='text-center py-2'>
                    <Button type='submit' className='rounded'>Sign In</Button>
                </div>
            </Form>

            <Row className='text-center'>
                <Col>
                    New to GShop? <Link to={redirect ? `/register?redirect=${redirect}`: '/register' } className='text-link'>Register</Link>
                </Col>
            </Row>

        </FormContainer>
    );
}

export default LoginScreen;
