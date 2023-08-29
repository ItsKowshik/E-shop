import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom' // useHistory is going to allow us to do is have access to the history inside of our components.

function Search() {

    const [keysearch, setKeysearch] = useState('')


    let history = useHistory()

    const submitHandler = (e) => {
        e.preventDefault()
        if (keysearch) {
            history.push(`/?keysearch=${keysearch}`)
        } else {
            history.push(history.push(history.location.pathname))
        }
    }

    return (

        <Form
            onSubmit={submitHandler} className='d-flex'
        >
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeysearch(e.target.value)}
                className='mr-sm-2 p-1'
            >
            </Form.Control>
            <Button
                variant='warning'
                type='submit'
                className='search-button p-1'
            >
                <i className="fa-brands fa-searchengin"></i>
            </Button>
        </Form>
    )
}

export default Search