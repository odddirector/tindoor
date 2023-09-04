import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios'
import BottomNav from '../components/BottomNav'

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [wtfElements, setWtfElements] = useState([])
    const [wtfElementsFour, setWtfElementsFour] = useState([])

    const userId = cookies.UserId


    const getUser = async () => {
        try {
            const response = await axios.get('https://tindoor-server.onrender.com/user', {
                params: {userId}
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('https://tindoor-server.onrender.com/gendered-users', {
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
            await axios.put('https://tindoor-server.onrender.com/addmatch', {
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

    const getUserAge = (user) => {
        let age = new Date().getFullYear() - user.dob_year;
        return age;
    }

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const doWeirdShit = (kind) => {
        switch(kind) {
            case 1:
                // code block
                window.alert("No, you don't need to see this again.");
                break;
            case 2:
                window.alert("Jesus, who uses these?! Swipe!");
                break;
            case 3:
                // code block
                console.log("case 3");
                let randX = Math.floor(Math.random() * window.innerWidth);
                let randY = Math.floor(Math.random() * window.innerHeight);

                setWtfElements(wtfElements.concat(
                    <div 
                        key={wtfElements.length} 
                        className='wtfElementThree'
                        style={{
                            left: randX+"px",
                            top: randY+"px",
                        }}
                    >🦔</div>
                ));

                break;
            case 4:
                window.alert("God! Just swipe right, will you?");
                break;
            default:
                // do nothing
        }

        if (kind == 5) {
            let randEmoji = "&" + "#127" + getRandomInt(789, 876) + ";";
            console.log(randEmoji);
            let randX = Math.floor(Math.random() * window.innerWidth);
            let randY = Math.floor(Math.random() * window.innerHeight);

            setWtfElementsFour(wtfElementsFour.concat(
                <div 
                    key={wtfElementsFour.length + "four"} 
                    className='wtfElementsFour'
                    style={{
                        left: randX+"px",
                        top: randY+"px",
                    }}
                    dangerouslySetInnerHTML={{__html: randEmoji}}
                ></div>
            ));
        }
    }

    

    const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId)

    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserIds.includes(genderedUser.user_id))


    console.log('filteredGenderedUsers ', filteredGenderedUsers)
    return (
        <>
            {user &&
            <div className="dashboard">
                
                {wtfElements}
                {wtfElementsFour}

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
                                        <h3>
                                            {genderedUser.first_name}, 
                                            <span>{getUserAge(genderedUser)}</span>
                                        </h3>
                                        <div className='qualities'>
                                            A {genderedUser.qualities} 
                                            {genderedUser.show_gender ? genderedUser.gender_identity : "person"}
                                        </div>

                                        <div className='location'>
                                            <img src="/icons/location_icon.png"/>
                                            <span>God knows where</span>
                                        </div>
                                        
                                    </div>
                                    <div className='swipeButtons'>
                                        <img src="/icons/swipe_button_1.png" onClick={()=>doWeirdShit(1)} className='pressable swipeButton small'/>
                                        <img src="/icons/swipe_button_2.png" onClick={()=>doWeirdShit(2)} className='pressable swipeButton big'/>
                                        <img src="/icons/swipe_button_3.png" onClick={()=>doWeirdShit(3)} className='pressable swipeButton small'/>
                                        <img src="/icons/swipe_button_4.png" onClick={()=>doWeirdShit(4)} className='pressable swipeButton big'/>
                                        <img src="/icons/swipe_button_5.png" onClick={()=>doWeirdShit(5)} className='pressable swipeButton small'/>
                                    </div>
                                </div>
                            </TinderCard>
                        )}
                        

                        <BottomNav></BottomNav>


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
