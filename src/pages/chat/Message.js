import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import '../../css/chat.css';
import { getAllCharacterInfo } from '../../apis/UserAPICalls';
import playbutton from '../chat/Button Play.png'



const Message = ({ role, content }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const allCharacter = useSelector(state => state.user.characters)
  const charNo = searchParams.get("character_id");

  useEffect(() => {
    dispatch(getAllCharacterInfo());

  }, [dispatch]);

  const character = allCharacter?.find(
    (character) => String(character.charNo) === charNo
  );
  const imageUrl =`http://localhost:8080/api/v1/character${character.profileImage}`;
  const charName = character ? character.charName : '';
  
    return (
      <div>
        {role === 'ai' && (
          <div className="chat-charInfo-chatRoom">
            <img className='charaImg-chatRoom' src={imageUrl} alt="캐릭터 이미지" />
            <p>{charName}</p>
            <img className='playButton-chatRoom' src={playbutton} alt="재생버튼"></img>
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
