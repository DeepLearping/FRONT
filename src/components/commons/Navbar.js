import React, {useState} from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import '../../css/Navbar.css';
import mypageIcon from '../../images/mypage.png';
import ProfileModal from "../ProfileModal";
import LoginModal from '../LoginModal';
import { useSelector } from 'react-redux';
import BalanceGame from '../../pages/balanceGame/balanceGame';
import GroupChatFormModal from '../GroupChatFormModal';

const Navbar = () => {
    const [isModalOpen, setModalOpen] = useState(false); 
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isGroupChatFormModalOpen, setGroupChatFormModalOpen] = useState(false);
    const token = localStorage.getItem('token');
    const userInfo = useSelector(state => state.user.userInfo)
    const navigate = useNavigate();

    // 🟨 로그인 모달 창 관리
    const openLoginModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // 🟩 프로필 모달창 관리
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

    // 🟦 단체방 모달 창 관리
    const openGroupChatFormModal = () => {
        setGroupChatFormModalOpen(true);
    };

    const closeGroupChatFormModal = () => {
        setGroupChatFormModalOpen(false);
    };

    return(
        <div className = "nav-bar">
            <h1 className="title"><NavLink to="/">캐톡</NavLink></h1>
            <ul className="nav-list">
                <li className="nav-item">
                    <NavLink to="/selectCharacterList">캐릭터 목록</NavLink>
                </li>
                <li className="nav-item" onClick={openGroupChatFormModal}>
                    단체 채팅
                </li>
                <li className="nav-item">
                    <NavLink to="/balanceGame">밸런스 게임</NavLink>
                </li>
            </ul> 

            <div className='recent-title'>
                {/* <NavLink to= "/"/></NavLink> */}
                <div className='recent-charater'></div>
            </div>
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
            <GroupChatFormModal isOpen={isGroupChatFormModalOpen} onClose={closeGroupChatFormModal} />
        </div>
    );
};

export default Navbar;
