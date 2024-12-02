import React, { useState } from 'react';
import '../css/GroupChatFormModal.css'; // 모달 스타일을 위한 CSS 파일
import { useDispatch, useSelector } from 'react-redux';

const GroupChatFormModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.userInfo);
    const allCharacters = useSelector(state => state.user.characters);

    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [selectedCharacters, setSelectedCharacters] = useState([]);

    if (!isOpen) return null; // 모달이 열리지 않으면 아무것도 렌더링하지 않음

    const handleCharacterSelect = (character) => {
        if (selectedCharacters.includes(character)) {
            setSelectedCharacters(selectedCharacters.filter(c => c !== character));
        } else {
            setSelectedCharacters([...selectedCharacters, character]);
        }
    };

    const handleSubmit = () => {
        console.log('Group Name:', groupName);
        console.log('Group Description:', groupDescription);
        console.log('Selected Characters:', selectedCharacters);
        // 예: dispatch(createGroupChat({ groupName, groupDescription, selectedCharacters }));
        onClose(); // 모달 닫기
    };

    return (
        <div className="GroupChat-modal-overlay" onClick={onClose}>
            <div className="GroupChat-modal-container" onClick={e => e.stopPropagation()}>
                <h2 className='groupchat-h2'>단체 채팅방 만들기</h2>
                <form>
                    <div>
                        <label className='groupChat-label'>단체방 이름</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='group-description'>
                        <label className='groupChat-label'>단체방 설명</label>
                        <textarea
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className='groupChat-label'>참여할 캐릭터 선택</label>
                        <div className='group-line-separation'></div>
                        <div className="group-character-selection-box">
                            {allCharacters.map((character) => {
                                const imageUrl = `http://localhost:8080/api/v1/character${character.profileImage}`;
                                const isChecked = selectedCharacters.includes(character);
                                
                                return (
                                    <div className='group-character-selection' key={character.charNo}>
                                        <img className='group-character-image' src={imageUrl} alt={character.charName}/>
                                        <label htmlFor={character.charNo}>{character.charName}</label>
                                        <input
                                            type="checkbox"
                                            id={character.charNo}
                                            checked={isChecked}
                                            onChange={() => handleCharacterSelect(character)}
                                            style={{ display: 'none' }} // input 태그 숨기기
                                        />
                                        <div 
                                            className={`custom-checkbox ${isChecked ? 'checked' : ''}`} 
                                            onClick={() => handleCharacterSelect(character)} // 클릭 이벤트 추가
                                        ></div>
                                    </div>
                                ); 
                            })}
                        </div>
                    </div>
                </form>
                <div className='group-line-separation'></div>
                    <div className="group-modal-buttons">
                        <button className="group-button-create" onClick={handleSubmit}>생성</button>
                        <button className="group-button-cancel" onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default GroupChatFormModal;
