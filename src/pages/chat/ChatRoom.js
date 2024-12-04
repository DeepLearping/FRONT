import "../../css/chat.css";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { deleteHumanQuestions, getMsgImg, loadChatInfo, loadChatRoomInfo, matchCharacter, sendMessageToAI } from "../../apis/ChatAPICalls";
import { request } from "../../apis/Apis";
import Message from "./Message";
import voiceButton from "./images/voice.png";
import playbutton from '../chat/images/Button Play.png'
import loading1 from "./images/loading1.gif";
import loading2 from "./images/loading2.gif";
import loading3 from "./images/loading3.gif";
import loading4 from "./images/loading4.gif";
import loading5 from "./images/loading5.gif";
import loading6 from "./images/loading6.gif";

const ChatRoom = ({ }) => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // URL에서 charNo 추출
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  const [loadingImage, setLoadingImage] = useState(null);


  // 현재 캐릭터 정보 추출
  const roomInfo = useSelector(state => state.chat.currentRoom);
  const characters = useSelector(state => state.chat.currentRoom.characters);
  const chatUser = useSelector(state => state.chat.currentRoom.member);
  const charNos = characters.map(character => character.charNo);

  const imageUrl = characters[0]
    ? `http://localhost:8080/api/v1/character${characters[0].profileImage}`
    : "";
  const roomName = roomInfo ? roomInfo.roomName : "알 수 없음";
  const description = roomInfo ? roomInfo.description : "";

  // 채팅 기록 로드 & 채팅방 정보 불러오기
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await request("GET", `/chatMessage/history/${sessionId}`);

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

    // 채팅방 정보 state(currentRoom) 반영 
    dispatch(loadChatRoomInfo(chatUser.memberNo,sessionId));

    // 현재 채팅방 맴버에게 메시지 전송시 inference에 필요한 데이터 미리 로드시켜주기
    const requestDataForFastAPI = {
      char_id_list: charNos
    }
    dispatch(loadChatInfo(requestDataForFastAPI))
  }, [sessionId]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim()) return;

    setInput(""); // 입력값 초기화
    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const matchCharacterInfo = {
      charIdList: charNos,
      conversationId: sessionId,
      question: input
    }
    console.log("matchCharacterInfo: ",matchCharacterInfo)
    
    const whoToSend = await dispatch(matchCharacter(matchCharacterInfo));
    console.log("whoToSend:",whoToSend);
  
    // for문 써서 whoToSend에 담긴 charNo 만큼 메시지 보내기
    for (const charNo of whoToSend) {
      // 랜덤 로딩 이미지 설정
      const loadingImages = [loading1, loading2, loading3, loading4, loading5, loading6];
      setLoadingImage(loadingImages[Math.floor(Math.random() * loadingImages.length)]);

      setIsLoading(true); // 로딩 상태 시작
      console.log("character:",charNo);
      const messageInfo = {
        question: input,
        sessionId: sessionId,
        charNo: charNo, // whoToSend에서 받은 charNo
        userId: chatUser.memberNo
      };
  
      try {
        const aiResponse = await sendMessageToAI(messageInfo);
        const aiMessage = {
          role: "ai",
          content: aiResponse.answer,
          msgImgUrl: aiResponse.msgImg > 0 ? `http://localhost:8080/chatMessage/getMsgImg/${charNo}/${aiResponse.msgImg}.jpg` : "",
          characterId: charNo
        };
  
        // 각 메시지 전송 후 상태 업데이트
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        setIsLoading(false); // 로딩 상태 종료

      } catch (error) {
        console.error("메세지 전송 오류:", error);
      }
    }

    console.log("whoToSend길이:",whoToSend.length-1);

    if (whoToSend.length-1 != 0) {
      const DeleteUserMessageRequest = {
        conversationId:sessionId,
        numToBeDeleted:whoToSend.length-1
      }
      dispatch(deleteHumanQuestions(DeleteUserMessageRequest))
    }
    
  };

useEffect(() => {
  if (messageEndRef.current) {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  if (isLoading) {
    const interval = setInterval(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); 
    return () => clearInterval(interval); 
  }
}, [messages, isLoading]);

  // 캐릭터 설명 토글
  const toggleDescription = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  return (
    <div className="chat-room-chatRoom">
      <div className="chat-scroll-container-chatRoom">
        <div className="chat-header-chatRoom">
          {roomInfo && (
            <>
              <img
                className="charaImg-chatRoom"
                src={imageUrl}
                alt="캐릭터 이미지"
              />
              <p>
                {roomName}
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
            <Message key={index} role={msg.role} content={msg.content} msgImgUrl={msg.msgImgUrl} characterId={msg.characterId} />
          ))}
          {isLoading && (
            <>
              <div className="chat-charInfo-chatRoom">
                <img className='charaImg-message-chatRoom' src={imageUrl} alt="캐릭터 이미지" />
                <p>{roomName}</p>
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