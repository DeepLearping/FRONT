import React, {useState} from 'react';
import { NavLink } from "react-router-dom";
import '../../css/Navbar.css';
import mypageIcon from '../../images/mypage.png';
import ProfileModal from "../ProfileModal";
import LoginModal from '../LoginModal';

const Navbar = () => {
    const [isModalOpen, setModalOpen] = useState(false); 
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    const openLoginModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const openProfileModal = () => {
        setProfileModalOpen(true);
    };

    const closeProfileModal = () => {
        setProfileModalOpen(false);
    };

    const handleProfileClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            openProfileModal();
        } else {
            openLoginModal();
        }
    };

    return(
        <div className = "nav-bar">
            <h2 className="title"> 캐릭터와의 대화</h2>
            <h1 className="title"> 캐 톡</h1>
            <ul className="nav-list">
                <li className="nav-item">
                    <NavLink to="/selectCharacterList" activateClassName="active">캐릭터 목록</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/balance-game" activateClassName="activate">밸런스 게임</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/character-guiz" activateClassName="activate">캐릭터 퀴즈</NavLink>
                </li>
            </ul> 

            {/* 마이페이지 */}
            <div class="image-container">
                <img 
                    src = {mypageIcon} 
                    alt="마이페이지" 
                    className="mypage-icon"
                    onClick={handleProfileClick} 
                    style={{cursor: 'pointer'}}
                    />
            </div>
            <LoginModal isOpen={isModalOpen} onClose={closeModal} />
            <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
        </div>
    );
};

export default Navbar;