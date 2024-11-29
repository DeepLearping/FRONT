import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import '../../css/chat.css';
import { getAllCharacterInfo } from '../../apis/UserAPICalls';
import playbutton from '../chat/images/Button Play.png'



const Message = ({ role, content }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const character = useSelector(state => state.chat.currentRoom.character)
  const charNo = character.charNo

  // useEffect(() => {
  //   dispatch(getAllCharacterInfo());

  // }, [dispatch]);

  
  const imageUrl =`http://localhost:8080/api/v1/character${character.profileImage}`;
  const charName = character ? character.charName : '';

  // FastAPI 호출 함수(이득규)
  const playAudio = async (text) => {
    try {
      const response = await fetch("http://localhost:8000/chat/stream_audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }), // AI 응답 텍스트 전달
      });

      if (!response.ok) {
        throw new Error("음성 생성 실패");
      }

      const audioBlob = await response.blob(); // 음성 데이터 가져오기
      const audioUrl = URL.createObjectURL(audioBlob); // Blob을 URL로 변환

      // 오디오 재생
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };
  
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
        </div>
      </div>
    );
};

export default Message;
