import React, {useState, useEffect} from 'react';
import { NavLink, useNavigate } from "react-router-dom";
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
    const [recentChats, setRecentChats] = useState([]);
    const navigate = useNavigate();

    // 챗팅 최근 기록 불러오기
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/chatRoom/select')
        .then(response => response.json())
        .then(data => {

            const chatRooms = data.results.chatRooms;
           // chatrooms 형태 
            console.log(chatRooms)

           if (Array.isArray(chatRooms)) {
            const sortedChats = chatRooms.sort((a, b) => new Date(a.last_modified) - new Date(b.last_modified));
            const topThreeChats = sortedChats.slice(0, 3); // 최대 3개 지정
            setRecentChats(topThreeChats); // 상태 업데이트
        } else {
            console.error("chatRooms가 배열이 아닙니다:", chatRooms);
        }
    })
    .catch(error => console.error("최근 챗팅 기록을 불러 올 수 없습니다: ", error));
    }, []);

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

    const handleGroupChatModule = () => {
        
    }

    const handleRecentChatClick = (sessionId) => {
        navigate(`/chat_room?sessionId=${sessionId}`);
    }

    return(
        <div className = "nav-bar">
            <h2 className="title"> 캐릭터와의 대화</h2>
            <h1 className="title"> 캐 톡</h1>
            <ul className="nav-list">
                <li className="nav-item">
                    <NavLink to="/selectCharacterList">캐릭터 목록</NavLink>
                </li>
                <li className="nav-item" onClick={handleGroupChatModule}>
                    단체 채팅
                </li>
                <li className="nav-item">
                    <NavLink to="/balance-game">밸런스 게임</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/character-guiz">캐릭터 퀴즈</NavLink>
                </li>
            </ul> 

            {/* 최근 기록 */}
            <div className = "recent-chats">
                <h3> 최근 기록 </h3>
                <ul>
                    {recentChats.map((chat) => (
                        <li key = {chat.session_id} onClick= {() =>
                            handleRecentChatClick(chat.session_id)} style={{cursor:'pointer'}}>
                                {chat.room_name} - {chat.description}
                        </li>
                    ))}
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
        </div>
    );
};

export default Navbar;