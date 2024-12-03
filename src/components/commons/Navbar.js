import React, {useEffect, useState} from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import '../../css/Navbar.css';
import mypageIcon from '../../images/mypage.png';
import ProfileModal from "../ProfileModal";
import LoginModal from '../LoginModal';
import { useSelector } from 'react-redux';
import BalanceGame from '../../pages/balanceGame/balanceGame';
import GroupChatFormModal from '../GroupChatFormModal';
import { enterChatRoom } from '../../apis/ChatAPICalls';

const Navbar = () => {
    const [isModalOpen, setModalOpen] = useState(false); 
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isGroupChatFormModalOpen, setGroupChatFormModalOpen] = useState(false);
    const token = localStorage.getItem('token');
    const userInfo = useSelector(state => state.user.userInfo)
    const [recentChats, setRecentChats] = useState([]);
    const navigate = useNavigate();

    // 최근 챗팅방 기록을 불러오는 함수
    const fetchRecentChats = async () => {
        try{
            const response = await fetch(`http://localhost:8080/api/v1/chatRoom/${userInfo.memberNo}`);
            
            if(!response.ok){
                throw new Error('네트워크 응답이 옳바르지 않습니다.');
            }
            const data = await response.json();
            const chatRooms = data.results.chatRooms;

            if(Array.isArray(chatRooms)){
                const sortedChats = chatRooms.sort((a,b) => new Date(b.last_modified_date) - new Date(a.last_modified_date));
                const topThreeChats = sortedChats.slice(0,3);
                setRecentChats(topThreeChats);
            }else{
                console.error("chatRooms 가 배열이 아닙니다:", chatRooms);
            }
        }catch(error){
            console.error("최근 챗팅 기록을 불러 올 수 없습니다:",error);
        }
    };

    useEffect(() => {
        // 토큰 바뀌면 유저 정보 변경
        if (token && userInfo.memberNo){
            fetchRecentChats();
        }
    }, [token, userInfo.memberNo]); 

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
        try{
            await enterChatRoom(sessionId);
            navigate(`/chat_room?session_id=${sessionId}`);
        } catch(error){
            console.error("챗팅방에 들어가는 중 오류 발생:", error)
        }
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
                    {recentChats.map((chat) => (
                        <li key = {chat.sessionId} onClick= {() =>
                            handleRecentChatClick(chat.sessionId)} style={{cursor:'pointer'}}>
                                {chat.roomName}
                        </li>  
                    ))}
                </ul>
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
