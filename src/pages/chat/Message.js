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
  
  const imageUrl =`http://localhost:8080/api/v1/character${character.profileImage}`;
  const charName = character ? character.charName : '';

  // FastAPI 호출 함수(이득규)
  const playAudio = async (text) => {
    try {
      const response = await fetch(`http://localhost:8000/chat/stream_audio?text=${encodeURIComponent(text)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("오디오 스트리밍 요청 실패");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("오디오 재생 오류:", error);
    }
  };
  // if(msgImgUrl){
  //   console.log("🎃🎉🎃msgImgUrl: ", msgImgUrl)
  // }
  
    return (
      <div>
        {role === 'ai' && (
          <div className="chat-charInfo-chatRoom">
            <img className='charaImg-message-chatRoom' src={imageUrl} alt="캐릭터 이미지" />
            <p>{charName}</p>
            <img 
            className='playButton-chatRoom' 
            src={playbutton} 
            alt="재생버튼" 
            onClick={() => playAudio(content)}></img>
          </div>
        )}
        <div className={`message-chatRoom ${role}`}>
          <div className={`message-bubble-chatRoom ${role}`}>
            {content}
          </div>
          {role === 'ai' && msgImgUrl !== "" && (
                <img src={msgImgUrl} alt="메세지 감정 이미지" style={{width:"100px"}}/>
            )}
        </div>
      </div>
    );
};

export default Message;
