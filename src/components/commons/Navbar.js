import React, {useEffect, useState} from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import '../../css/Navbar.css';
import ProfileModal from "../ProfileModal";
import LoginModal from '../LoginModal';
import GroupChatFormModal from '../GroupChatFormModal';
import { deleteHumanQuestions, fetchRecentChats } from '../../apis/ChatAPICalls';
import { logOut } from '../../modules/ChatModule';

const Navbar = () => {
    const [isModalOpen, setModalOpen] = useState(false); 
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isGroupChatFormModalOpen, setGroupChatFormModalOpen] = useState(false);
    const token = localStorage.getItem('token');
    const userInfo = useSelector(state => state.user.userInfo);
    const lastChatMessage = useSelector(state => state.chat.lastChatMessage);
    const recentChats = useSelector(state => state.chat.chatRooms);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if(userInfo.length == 0) {
            dispatch(logOut())
        } else {
            dispatch(fetchRecentChats(userInfo.memberNo));
        }
    }, [userInfo,lastChatMessage]);

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

    const handleRecentChatClick = async(sessionId, roomName) => {
        const specialNames = ['피곤한', '난폭한', '바보같은', '우울한', '애교쟁이', '찌질한', '열혈'];
    
        // roomName이 specialNames 중 하나로 시작하는지 확인
        if (specialNames.some(name => roomName.startsWith(name))) {
            window.location.href = `http://localhost:3000/balanceChat?characterName=${roomName}`;
        } else {
            window.location.href = `http://localhost:3000/chat_room?session_id=${sessionId}`;
        }
    }

    return(
        <div className = "nav-bar">
            <div className='nav-title-container' onClick={() => {navigate('/')}}>
                <img src='/c-talk.png' alt='캐톡로고'/>
                <h1 className="title">캐톡</h1>
            </div>
            <ul className="nav-list">
                <li className="nav-item">
                    <img src='/images/캐릭터1.png'/>
                    <NavLink to="/selectCharacterList">캐릭터 목록</NavLink>
                </li>
                <li className="nav-item" onClick={openGroupChatFormModal}>
                    <img src='/images/캐릭터2.png'/>
                    <span>단체 채팅</span>
                </li>
                <li className="nav-item">
                    <img src='/images/캐릭터3.png'/>
                    <NavLink to="/balanceGame">밸런스 게임</NavLink>
                </li>
            </ul> 

            {/* 챗팅 최근 기록 */}
            <div className='recent-title'>
                <h3>최근 기록</h3>
                <ul>
                    {recentChats.map((chat) => {
                        // lastChatMessage가 배열이므로 첫 번째 요소를 가져옵니다.
                        const lastMessage = chat.lastChatMessage.length > 0 
                            ? (() => {
                                const content = JSON.parse(chat.lastChatMessage[0].message).data.content;
                                return content.length > 15 ? content.substring(0, 15) + '...' : content;
                            })()
                            : '메시지가 없습니다';

                        const characters = chat.characters;
                        const characterCount = characters.length;

                        return (
                            <li key={chat.sessionId} onClick={() => handleRecentChatClick(chat.sessionId, chat.roomName)}>
                                <div className='recentChatRoom-container'>
                                    <div className='charaImg-wrapper-recentChatRoom'>
                                        {characters.slice(0, 4).map((character, index) => (
                                            <div 
                                                key={index} 
                                                className={`recentChatRoom-Image-roomName ${characterCount === 1 ? 'full-size' : ''}`}
                                            >
                                                <img
                                                    className="charaImg-recentChatRoom"
                                                    src={`http://localhost:8080/api/v1/character${character.profileImage}`}
                                                    alt={`캐릭터 이미지 ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className='recentChatRoom-content-wrapper'>
                                        <span>{chat.roomName}</span>
                                        <div className="lastMessage">
                                            {lastMessage}
                                        </div>
                                    </div>
                                </div>
                            </li>  
                        );
                    })}
                </ul>
            </div>


            {/* 마이페이지 */}
            <div className='profile-container' onClick={handleProfileClick}>
                <div className="image-container">
                    <img 
                        src = {userInfo.picture? userInfo.picture : '/images/icon-login2.png'} 
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
