import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import '../../css/chat.css';
import playbutton from '../chat/images/Button Play.png'

const Message = ({ role, content, msgImgUrl, characterId, profileImg }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const characters = useSelector(state => state.chat.currentRoom.characters)
  const selectedCharacter = characters.find(character => character.charNo === characterId);

  const imageUrl = profileImg 
  ? profileImg
  : (selectedCharacter && selectedCharacter.profileImage 
      ? `http://localhost:8080/api/v1/character${selectedCharacter.profileImage}` 
      : null);

  const charName = selectedCharacter ? selectedCharacter.charName : '';

  // // 이모지 제거 함수(이득규)
  // const removeEmojis = (text) => {
  //   const emojiPattern = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{02500}-\u{02BEF}\u{02702}-\u{027B0}\u{024C2}-\u{1F251}]/gu;
  //   return text.replace(emojiPattern, '');
  // };

  // const cleanText = (text) => {
  //   // 공백과 특수문자들 제거 (필요시 다른 조건 추가)
  //   return text.replace(/[^가-힣a-zA-Z0-9가-힣\s]/g, '').trim();
  // };

  // FastAPI 호출 함수(이득규)
  const playAudio = async (text) => {
    try {

      // 이모지 제거
      // const filteredText = cleanText(removeEmojis(text));
      // console.log("Filtered Text: ", filteredText); //로그 찍어보기
      
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
          <div className={`message-bubble-chatRoom ${role} char${characterId}`}>
            {content}
          </div>
          {role === 'ai' && msgImgUrl !== "" && (
                <img src={msgImgUrl} alt="메세지 감정 이미지" style={{width:"50vh"}}/>
            )}
        </div>
      </div>
    );
};

export default Message;