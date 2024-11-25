import React, { useState } from 'react';
import '../css/ProfileModal.css'; // 모달 스타일을 위한 CSS 파일
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, modifyUserNickname } from '../apis/UserAPICalls';
import { logOut } from '../modules/UserModule';

const ProfileModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.userInfo);
    const [nickname, setNickname] = useState(userInfo.nickname || ''); // 기본 닉네임 상태

    if (!isOpen) return null; // 모달이 열리지 않으면 아무것도 렌더링하지 않음

    const handleSave = () => {
        // 닉네임 저장 로직
        console.log('닉네임 저장:', nickname);

        dispatch(modifyUserNickname(userInfo.memberNo,nickname));

        onClose(); // 모달 닫기
    };

    const handleLogout = () => {
        dispatch(logOut())
        onClose(); 
        window.location.href = ""
    };

    const handleWithdraw = () => {
        dispatch(deleteUser(userInfo.memberNo))
        onClose(); 
        window.location.href = ""
    };

    return (
        <div className="profile-modal-overlay">
            <div className="profile-modal-container">
                <button className="close-button" onClick={onClose}>X</button>
                <div className="profile-image-container">
                    <img src={userInfo.picture} alt="Profile" className="profile-image" />
                </div>
                <div className="profile-info">
                    <div className="profile-item">
                        <span className="profile-label">이름:</span>
                        <span className="profile-value">{userInfo.name}</span>
                    </div>
                    <div className="profile-item">
                        <span className="profile-label">닉네임:</span>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="nickname-input"
                        />
                    </div>
                    <div className="profile-item">
                        <span className="profile-label">계정:</span>
                        <span className="profile-value">{userInfo.email}</span>
                    </div>
                </div>
                <div className="profile-buttons">
                    <button className="save-button" onClick={handleSave}>수정하기</button>
                    <button className="withdraw-button" onClick={handleWithdraw}>회원탈퇴</button>
                    <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;