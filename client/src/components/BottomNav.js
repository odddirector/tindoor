const BottomNav = () => {

    const navigateTo = (route) => {
        window.location.href = route;
    }

    const isActive = (route, pathname) => {
        let ext = ".png";
        if(window.location.pathname == pathname) {
            return route + "_active" + ext
        } else {
            return route + ext
        }
    }

    return (
        <>
            <div className='menuButtons'>
                <div className='widthLimitWrapper'>
                    <img src={isActive("/icons/menu_button_1", "/dashboard")}  className='menuButton'onClick={()=>navigateTo("/dashboard")} />
                    <img src="/icons/menu_button_2.png" className='menuButton'/>
                    <img src="/icons/menu_button_3.png" className='menuButton'/>
                    <img src={isActive("/icons/menu_button_4", "/chat")} onClick={()=>navigateTo("/chat")} className='menuButton'/>
                    <img src={isActive("/icons/menu_button_5", "/onboarding")}  className='menuButton' onClick={()=>navigateTo("/onboarding")}/>
                </div>
            </div>
        </>
    )

};
export default BottomNav;
