import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const NotFound = ()=>{
    const navigate = useNavigate()
    useEffect(()=>{
        setTimeout(()=>{
            navigate('/', {replace: true})
        }, 3000)
    }, [navigate])
    return(
        <h1>Wrong URL 404 code, you're being redirected in 3.... 2... 1...</h1>
    )
}
export default NotFound