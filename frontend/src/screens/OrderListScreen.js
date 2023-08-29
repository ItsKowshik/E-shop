import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listOrders } from '../actions/orderActions'


function OrderListScreen({ history }) {

    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (userInfo && userInfo.is_admin) {
            dispatch(listOrders())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, userInfo])


    return (
        <div>
            <h1>Orders</h1>
            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.user && order.user.name}</td>
                                        <td>{order.created_at.substring(0, 10)}</td>
                                        <td>{order.total_price}</td>

                                        <td>{order.is_paid ? (
                                            order.paid_date.substring(0, 10)
                                        ) : (
                                            <i className="fa-solid fa-xmark is-admin-false"></i>
                                        )}</td>

                                        <td>{order.is_delivered ? (
                                            order.delivered_at.substring(0, 10)
                                        ) : (
                                            <i className="fa-solid fa-xmark is-admin-false"></i>
                                        )}</td>

                                        <td className='text-center'>
                                            <LinkContainer to={`/order/${order._id}`} className='m-1'>
                                                <Button className='btn-sm rounded'>
                                                    Details
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
        </div>
    )
}

export default OrderListScreen