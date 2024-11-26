import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import '../css/UserMain.css';
import { useDispatch } from "react-redux";
import { callKakaoLoginAPI, callLoginAPI } from "../apis/UserAPICalls";
import LoginModal from "../components/LoginModal";
import ProfileModal from "../components/ProfileModal";


function UserMain() {

    const dispatch = useDispatch();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code'); // 쿼리 파라미터에서 code 추출

        if (code) {
          // 백엔드에 code 전송하여 액세스 토큰 요청
          dispatch(callLoginAPI(code))
          dispatch(callKakaoLoginAPI(code))
        }

      }, [dispatch]);

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

    return (
        <>
            <div className="user-main-container">
                <div className="user-main-brand-container">
                    <div className="user-main-brand-background">
                        <span className="user-main-title">Character Talk</span>
                    </div>
                </div>
                <ul className="user-main-nav-list">
                    <li className="user-main-nav-item">
                        <NavLink to="/test">
                            <h1>TEST</h1>
                        </NavLink>
                        <NavLink to="#" onClick={handleProfileClick}>
                            <h1>프로필</h1>
                        </NavLink>
                        {/* <NavLink to="/chat_room">
                            <h1>채팅방</h1>
                        </NavLink> */}
                        <NavLink to="/selectCharacterList">
                            <h1>캐릭터 목록</h1>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <LoginModal isOpen={isModalOpen} onClose={closeModal} />
            <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
        </>
    );
}

export default UserMain;
