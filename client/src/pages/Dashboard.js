import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
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
    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/gendered-users', {
                params: {gender: user?.gender_interest}
            })
            setGenderedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()

    }, [])

    useEffect(() => {
        if (user) {
            getGenderedUsers()
        }
    }, [user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
        } catch (err) {
            console.log(err)
        }
    }


    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId)

    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserIds.includes(genderedUser.user_id))


    console.log('filteredGenderedUsers ', filteredGenderedUsers)
    return (
        <>
            {user &&
            <div className="dashboard">
                
                <div className='logoContainer'>
                    <img src="/logo.png"/>
                </div>

                {/* <ChatContainer user={user}/> */}
                <div className="swipe-container">
                    <div className="card-container">

                        {filteredGenderedUsers?.map((genderedUser) =>
                            <TinderCard
                                className="swipe"
                                key={genderedUser.user_id}
                                onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                                onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                                <div
                                    style={{backgroundImage: "url(" + genderedUser.url + ")"}}
                                    className="card">
                                    <div className='userInfo'>
                                        <h3>{genderedUser.first_name}</h3>
                                        <div className='location'>
                                            <img src="/icons/location_icon.png"/>
                                            <span>God knows where</span>
                                        </div>
                                    </div>
                                    <div className='swipeButtons'>
                                        <img src="/icons/swipe_button_1.png" className='swipeButton small'/>
                                        <img src="/icons/swipe_button_2.png" className='swipeButton big'/>
                                        <img src="/icons/swipe_button_3.png" className='swipeButton small'/>
                                        <img src="/icons/swipe_button_4.png" className='swipeButton big'/>
                                        <img src="/icons/swipe_button_5.png" className='swipeButton small'/>
                                    </div>
                                </div>
                            </TinderCard>
                        )}
                        <div className='menuButtons'>
                            <div className='widthLimitWrapper'>
                                <img src="/icons/menu_button_1.png" className='menuButton'/>
                                <img src="/icons/menu_button_2.png" className='menuButton'/>
                                <img src="/icons/menu_button_3.png" className='menuButton'/>
                                <img src="/icons/menu_button_4.png" className='menuButton'/>
                                <img src="/icons/menu_button_5.png" className='menuButton'/>
                            </div>
                        </div>
                        {/* <div className="swipe-info">
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                        </div> */}
                    </div>
                </div>
            </div>}
        </>
    )
}
export default Dashboard
