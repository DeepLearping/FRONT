import { Outlet } from "react-router-dom";

function UserLayout() {

    return (
        <div className="layout-container">
            {/* <UserHeader /> */}
            <div>
                <Outlet />
            </div>
        </div>
    ) 
}

export default UserLayout;