import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import '../../css/chat.css';
import { getAllCharacterInfo } from '../../apis/UserAPICalls';
import playbutton from '../chat/images/Button Play.png'



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

  // 음성 재생 함수(이득규)
const playVoice = () => {
  if (!content) return; // 내용이 없으면 재생하지 않음

  const speech = new SpeechSynthesisUtterance(content); // 읽을 텍스트 설정
  speech.lang = 'ko-KR'; // 한국어 설정
  speech.pitch = 1.0; // 음조 설정
  speech.rate = 1.0; // 읽기 속도 설정
  window.speechSynthesis.speak(speech); // 텍스트 음성 출력
};
  
    return (
      <div>
        {role === 'ai' && (
          <div className="chat-charInfo-chatRoom">
            <img className='charaImg-message-chatRoom' src={imageUrl} alt="캐릭터 이미지" />
            <p>{charName}</p>
            <img className='playButton-chatRoom' src={playbutton} alt="재생버튼" onClick={playVoice}></img>
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
