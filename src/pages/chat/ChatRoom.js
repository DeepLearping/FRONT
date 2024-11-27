import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import "../../css/chat.css";
import { fetchChatHistory, sendMessageToAI } from "../../apis/ChatAPICalls";
import Message from "./Message";
import voiceButton from "./images/voice.png";

const ChatRoom = ({ }) => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // URL에서 charNo 추출
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // 채팅 히스토리 로드 
  //   dispatch(fetchChatHistory(sessionId));
  // }, [dispatch]);

  // 현재 캐릭터 정보 추출
  const character = useSelector(state => state.chat.currentRoom.character);
  const chatUser = useSelector(state => state.chat.currentRoom.member);

  const imageUrl = character
    ? `http://localhost:8080/api/v1/character${character.profileImage}`
    : "";
  const charName = character ? character.charName : "알 수 없음";
  const description = character ? character.description : "";

  // 채팅 기록 로드
  useEffect(() => {
    const fetchChatHistory = async () => {
      // if (!conversationId) return;
      try {
        const response = await fetch(
          `http://localhost:8000/chat_message/${sessionId}`
          // `http://localhost:8000/chat_message/1`
        );
        const data = await response.json();
        console.log("채팅기록 : ",data);
        setMessages(data.messages || []);
      } catch (error) {
        console.error("채팅 기록 로드 오류:", error);
      }
    };

    fetchChatHistory();
  }, []);

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    const messageInfo = {
      question: input,
      sessionId: sessionId,
      charNo: character.charNo,
      userId: chatUser.memberNo
    }

    try {
      const aiResponse = await sendMessageToAI(messageInfo);
      const aiMessage = { role: "ai", content: aiResponse.answer };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("메세지 전송 오류:", error);
    } finally {
      setInput(""); // 입력값 초기화
    }
  };

  // 캐릭터 설명 토글
  const toggleDescription = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  return (
    <div className="chat-room-chatRoom">
      <div className="chat-header-chatRoom">
        {character && (
          <>
            <img className="charaImg-chatRoom" src={imageUrl} alt="캐릭터 이미지" />
            <p>
              {charName}
              <button onClick={toggleDescription}>
                {isDescriptionVisible ? "▲" : "▼"}
              </button>
            </p>
          </>
        )}
      </div>
      {isDescriptionVisible && (
        <div className="chat-chara-description-chatRoom">
          <p>{description}</p>
        </div>
      )}
      <div className="chat-messages-chatRoom">
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
      </div>
      <div className="chat-input-chatRoom">
        <input
          type="text"
          placeholder="캐릭터에게 메세지를 보내보세요!"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>보내기</button>
        <div className="voice-button-chatRoom">
          <div className="back-voiceButton-chatRoom">
            <img src={voiceButton} alt="Voice Button" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
