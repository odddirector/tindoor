const BottomNav = () => {

    const navigateTo = (route) => {
        window.location.href = route;
    }

    const doWeirdShit = (kind) => {
        if (kind == 1) {
            window.alert("It's just an octopus being thrown out of the window.");
        } else if (kind == 2) {
            window.alert("It's just a man with a moustache walking away from an explosion");
        }
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
                    <img src="/icons/menu_button_2.png" className='menuButton' onClick={()=>doWeirdShit(1)}/>
                    <img src="/icons/menu_button_3.png" className='menuButton' onClick={()=>doWeirdShit(2)}/>
                    <img src={isActive("/icons/menu_button_4", "/chat")} onClick={()=>navigateTo("/chat")} className='menuButton'/>
                    <img src={isActive("/icons/menu_button_5", "/onboarding")}  className='menuButton' onClick={()=>navigateTo("/onboarding")}/>
                </div>
            </div>
        </>
    )

};
export default BottomNav;
