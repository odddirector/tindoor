import Nav from '../components/Nav'
import AuthModal from "../components/AuthModal"
import {useState} from 'react'
import {useCookies} from "react-cookie"

const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const authToken = cookies.AuthToken

    const handleClick = () => {
        if (authToken) {
            removeCookie('UserId', cookies.UserId)
            removeCookie('AuthToken', cookies.AuthToken)
            window.location.reload()
            return
        }
        setShowModal(true)
        setIsSignUp(true)
    }

    return (
        <div className="overlay">
            <Nav
                authToken={authToken}
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />
            <div className="home">
                <h1 className="primary-title">Swine Right</h1>
                <h2>The Tinder for Ugly People </h2>
                <button className="primary-button" onClick={handleClick}>
                    {authToken ? 'Signout' : 'Create Account'}
                </button>


                {showModal && (
                    <AuthModal setShowModal={setShowModal} isSignUp={isSignUp}/>
                )}
            </div>
            <div className='credit'>
                Created by <a href='https://www.youtube.com/@odddirector'>Odddirector</a>, 
                based on a Tinder Clone by <a href='https://www.youtube.com/@AniaKubow'>Ania Kubow</a>
            </div>
        </div>
    )
}
export default Home
