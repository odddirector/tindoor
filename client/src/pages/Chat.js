import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'
import BottomNav from '../components/BottomNav'

const Chat = () => {

    const [user, setUser] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const userId = cookies.UserId

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {userId}
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            {user ? <ChatContainer user={user}/> : ""}
            <BottomNav></BottomNav>
        </>
    )
}
export default Chat