import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/chat.css';
import { getAllCharacterInfo } from '../../apis/UserAPICalls';



const Message = ({ role, content }) => {
  const dispatch = useDispatch();
  const allCharacter = useSelector(state => state.user.characters)
  console.log("캐릭터 목록: {}",allCharacter)

  useEffect(() => {
    dispatch(getAllCharacterInfo());

  }, [dispatch]);

  const character = allCharacter && allCharacter.find(char => char.role === 'ai');
  const imageUrl =`http://localhost:8080/api/v1/character${character.profileImage}`;
  const charName = character ? character.charName : '';
  
    return (
      <div>
        {role === 'ai' && (
          <div className="chat-charInfo-chatRoom">
            <img src={imageUrl} alt="캐릭터 이미지" />
            <p>{charName}</p>
          </div>
        )}
        <div className={`message-chatRoom ${role}`}>
          <div className={`message-bubble-chatRoom ${role}`}>
            {content}
          </div>
        </div>
      </div>
    );
};

export default Message;
