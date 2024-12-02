import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import '../../css/chat.css';
import playbutton from '../chat/images/Button Play.png'

const Message = ({ role, content, msgImgUrl }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const character = useSelector(state => state.chat.currentRoom.character)
  const charNo = character.charNo
  // const [savedMsgImgUrl, setSavedMsgImgUrl] = useState(msgImgUrl)

  const imageUrl = `http://localhost:8080/api/v1/character${character.profileImage}`;
  const charName = character ? character.charName : '';

  if (msgImgUrl) {
    console.log("🎃🎉🎃msgImgUrl: ", msgImgUrl)
  }

  return (
    <div>
      {role === 'ai' && (
        <div className="chat-charInfo-chatRoom">
          <img className='charaImg-message-chatRoom' src={imageUrl} alt="캐릭터 이미지" />
          <p>{charName}</p>
          <img className='playButton-chatRoom' src={playbutton} alt="재생버튼"></img>
        </div>
      )}
      <div className={`message-chatRoom ${role}`}>
        <div className={`message-bubble-chatRoom ${role}`}>
          {content}
        </div>
        {role === 'ai' && msgImgUrl !== "" && (
          <div className='message-img-chatRoom'>
            <img src={msgImgUrl} alt="메세지 감정 이미지" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;