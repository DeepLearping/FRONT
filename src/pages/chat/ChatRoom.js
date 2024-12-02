import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import "../../css/chat.css";
import { fetchChatHistory, getMsgImg, sendMessageToAI } from "../../apis/ChatAPICalls";
import Message from "./Message";
import voiceButton from "./images/voice.png";
import { request } from '../../apis/Apis';
import loading1 from "./images/loading1.gif";
import loading2 from "./images/loading2.gif";
import loading3 from "./images/loading3.gif";
import loading4 from "./images/loading4.gif";
import loading5 from "./images/loading5.gif";
import loading6 from "./images/loading6.gif";
import playbutton from '../chat/images/Button Play.png'


const ChatRoom = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  const [loadingImage, setLoadingImage] = useState(null);


  const character = useSelector((state) => state.chat.currentRoom.character);
  const chatUser = useSelector((state) => state.chat.currentRoom.member);

  const imageUrl = character
    ? `http://localhost:8080/api/v1/character${character.profileImage}`
    : "";
  const charName = character ? character.charName : "알 수 없음";
  const description = character ? character.description : "";

  // 채팅 기록 로드
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await request("GET",`/chatMessage/history/${sessionId}`);
        
        const parsedMessages = response.map((chat) => ({
          role: chat.role,
          content: JSON.parse(chat.message)?.data?.content || "",
          msgImgUrl: chat.msgImgUrl ? `http://localhost:8080/chatMessage/getMsgImg${chat.msgImgUrl}` : "",
          characterId: chat.characterId,
      }));

        // console.log("채팅기록 : ", parsedMessages);
        setMessages(parsedMessages || []);
      } catch (error) {
        console.error("채팅 기록 로드 오류: ", error);
      }
    };

    fetchChatHistory();
  }, [sessionId]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    setInput(""); // 입력값 초기화
  
    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    // 랜덤 로딩 이미지 설정
    const loadingImages = [loading1, loading2, loading3, loading4, loading5, loading6];
    setLoadingImage(loadingImages[Math.floor(Math.random() * loadingImages.length)]);
  
    setIsLoading(true); // 로딩 상태 시작
  
    const messageInfo = {
      question: input,
      sessionId,
      charNo: character.charNo,
      userId: chatUser.memberNo,
    };
  
    try {
      const aiResponse = await sendMessageToAI(messageInfo);
      const aiMessage = { role: "ai", content: aiResponse.answer, msgImgUrl: aiResponse.msgImg > 0 ? `http://localhost:8080/chatMessage/getMsgImg/${character.charNo}/${aiResponse.msgImg}.jpg` : "" };
  
      setIsLoading(false); // 로딩 상태 종료
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("메세지 전송 오류:", error);
      setIsLoading(false); // 로딩 상태 종료
    }
  };
  

  // 메시지 추가 시 마지막으로 스크롤
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 캐릭터 설명 토글
  const toggleDescription = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  return (
    <div className="chat-room-chatRoom">
      <div className="chat-scroll-container-chatRoom">
        <div className="chat-header-chatRoom">
          {character && (
            <>
              <img
                className="charaImg-chatRoom"
                src={imageUrl}
                alt="캐릭터 이미지"
              />
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
            <Message key={index} role={msg.role} content={msg.content} msgImgUrl={msg.msgImgUrl} />
          ))}
          {isLoading && (
            <>
              <div className="chat-charInfo-chatRoom">
                <img className='charaImg-message-chatRoom' src={imageUrl} alt="캐릭터 이미지" />
                <p>{charName}</p>
                <img className='playButton-chatRoom' src={playbutton} alt="재생버튼"></img>
              </div>
              <div className="message-chatRoom ai">
                <div className="message-bubble-chatRoom ai">
                  <img src={loadingImage} alt="로딩 중" style={{ width: "18vh" }} />
                </div>
              </div>
            </>
          )}


          <div ref={messageEndRef} />
        </div>
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
