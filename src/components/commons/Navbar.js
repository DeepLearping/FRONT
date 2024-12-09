import React, {useEffect, useState} from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import '../../css/Navbar.css';
import mypageIcon from '../../images/mypage.png';
import ProfileModal from "../ProfileModal";
import LoginModal from '../LoginModal';
import { useDispatch, useSelector } from 'react-redux';
import BalanceGame from '../../pages/balanceGame/balanceGame';
import GroupChatFormModal from '../GroupChatFormModal';
import { enterChatRoom, fetchRecentChats } from '../../apis/ChatAPICalls';
import { loadUserChatRooms } from '../../modules/ChatModule';
// import { getAllCharacaterImage } from '../../apis/UserAPICalls';

const Navbar = () => {
    const [isModalOpen, setModalOpen] = useState(false); 
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isGroupChatFormModalOpen, setGroupChatFormModalOpen] = useState(false);
    const token = localStorage.getItem('token');
    const userInfo = useSelector(state => state.user.userInfo);
    const recentChats = useSelector(state => state.chat.chatRooms);
    const currentRoom = useSelector(state => state.chat.currentRoom);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRecentChats(userInfo.memberNo));
    }, [currentRoom]); 

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

    const handleRecentChatClick = async(sessionId) => {
        navigate(`/chat_room?session_id=${sessionId}`);
    }

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

            {/* 챗팅 최근 기록 */}
            <div className='recent-title'>
            <h3> 최근 기록 </h3>
                <ul>
                    {recentChats.map((chat) => {

                        // lastChatMessage가 배열이므로 첫 번째 요소를 가져옵니다.
                        const lastMessage = chat.lastChatMessage.length > 0 
                        ? (() => {
                                const content = JSON.parse(chat.lastChatMessage[0].message).data.content;
                                return content.length > 15 ? content.substring(0, 15) + '...' : content;
                        })()
                        : '메시지가 없습니다';
                        
                        // 이미지 호출하기 
                        // const profileImage = getAllCharacaterImage(chat.characters[0].profileImage);

                        const profileImage = `http://localhost:8080/api/v1/character${chat.characters[0].profileImage}`;
                        

                        return(
                        <li key = {chat.sessionId} onClick= {() =>
                            handleRecentChatClick(chat.sessionId)} style={{cursor:'pointer'}}>
                            <div>
                                <div className = "recentChatRoom-Image-roomName">
                                    <img className="chatRoomImage" 
                                        src = {profileImage} 
                                        style={{ width: '25px', height: '25px', borderRadius: '50%'}}/>
                                    {chat.roomName}  
                                </div>
                                <div className="lastMessage">
                                    {lastMessage}
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
