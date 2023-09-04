import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OnBoarding from './pages/OnBoarding'
import Chat from './pages/Chat'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {useCookies} from 'react-cookie'

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const authToken = cookies.AuthToken

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                {authToken && <Route path="/dashboard" element={<Dashboard/>}/>}
                {authToken && <Route path="/onboarding" element={<OnBoarding/>}/>}
                {authToken && <Route path="/chat" element={<Chat/>}/>}

            </Routes>
        </BrowserRouter>
    )
}

export default App
