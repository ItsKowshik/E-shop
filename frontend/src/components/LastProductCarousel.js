import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import { ListLastProducts } from '../actions/productActions'


function LastProductCarousel() {
    const dispatch = useDispatch()

    const lastProducts = useSelector(state => state.lastProducts)
    const { error, loading, products } = lastProducts

    useEffect(() => {
        dispatch(ListLastProducts())
    }, dispatch)

    return (loading ? <Loader />
        : error ? <Message variant='danger'>{error}</Message>
            : (
                <Carousel variant='dark' interval={2500}>
                    {products.map(product => (
                        <Carousel.Item key={product._id} >

                            <Link to={`/product/${product._id}`}>
                                <Image
                                    src={product.image}
                                    fluid
                                />
                                <Carousel.Caption>
                                    <h5>{product.name}</h5>
                                    <h6>New product</h6>
                                </Carousel.Caption>

                            </Link>
                        </Carousel.Item>
                    ))}
                </Carousel>
            )
    )
}

export default LastProductCarousel