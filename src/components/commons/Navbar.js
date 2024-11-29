import React, {useState} from 'react';
import { NavLink } from "react-router-dom";
import '../../css/Navbar.css';
import mypageIcon from '../../images/mypage.png';
import ProfileModal from "../ProfileModal";
import LoginModal from '../LoginModal';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [isModalOpen, setModalOpen] = useState(false); 
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const token = localStorage.getItem('token');
    const userInfo = useSelector(state => state.user.userInfo)

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
                    <NavLink to="/selectCharacterList">캐릭터 목록</NavLink>
                </li>
                {/* <li className="nav-item">
                    <NavLink to="/balance-game">단체 채팅</NavLink>
                </li> */}
                <li className="nav-item">
                    <NavLink to="/balance-game">밸런스 게임</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/character-guiz">캐릭터 퀴즈</NavLink>
                </li>
            </ul> 

            {/* 마이페이지 */}
            <div className='profile-container' onClick={handleProfileClick}>
                <div className="image-container">
                    <img 
                        src = {mypageIcon} 
                        alt="마이페이지" 
                        className="mypage-icon"
                        />
                </div>
                <div className='profile-description'>
                    {token ? (
                        <span>{userInfo.name}님</span> // username이 없을 경우 '유저이름' 표시
                    ) : (
                        <span>로그인</span>
                    )}
                </div>
            </div>
            <LoginModal isOpen={isModalOpen} onClose={closeModal} />
            <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
        </div>
    );
};

export default Navbar;