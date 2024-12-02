import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import "../../css/balanceChat.css";
import { useNavigate } from 'react-router-dom';
import { fetchChatHistory, getMsgImg, sendMessageToAI } from "../../apis/ChatAPICalls";
import Message from "../chat/Message";
import voiceButton from "../chat/images/voice.png";
import loading1 from "../chat/images/loading1.gif";
import loading2 from "../chat/images/loading2.gif";
import loading3 from "../chat/images/loading3.gif";
import loading4 from "../chat/images/loading4.gif";
import loading5 from "../chat/images/loading5.gif";
import loading6 from "../chat/images/loading6.gif";
import playbutton from '../chat/images/Button Play.png';
import contextBg from './images/Sms.png';
import context1 from './images/상황1.png';


const BalanceChat = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isDescriptionVisible, setDescriptionVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const dispatch = useDispatch();
    const messageEndRef = useRef(null);
    const [loadingImage, setLoadingImage] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const character = useSelector((state) => state.chat.currentRoom.character);
    const chatUser = useSelector((state) => state.chat.currentRoom.member);

    const imageUrl = character
        ? `http://localhost:8080/api/v1/character${character.profileImage}`
        : "";
    const charName = character ? character.charName : "알 수 없음";

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


    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    return (
        <div className="chat-room-bg">
            <div className="chat-scroll-container-bg">
                <div className="chat-header-bg">
                    <img className="charaImg-bg"
                        src={contextBg}
                        alt="상황부여 이미지"
                        onClick={() => setModalOpen(true)}
                    />
                    <div className="header-text-bg">상황 부여하기</div>
                </div>
                <div className="chat-messages-bg">
                    {messages.map((msg, index) => (
                        <Message key={index} role={msg.role} content={msg.content} msgImgUrl={msg.msgImgUrl} />
                    ))}
                    {isLoading && (
                        <>
                            <div className="chat-charInfo-bg">
                                <img className='charaImg-message-bg' src={imageUrl} alt="캐릭터 이미지" />
                                <p>{charName}</p>
                                <img className='playButton-bg' src={playbutton} alt="재생버튼"></img>
                            </div>
                            <div className="message-bg ai">
                                <div className="message-bubble-bg ai">
                                    <img src={loadingImage} alt="로딩 중" style={{ width: "18vh" }} />
                                </div>
                            </div>
                        </>
                    )}
                    <div ref={messageEndRef} />
                </div>
            </div>
            <div className="chat-input-bg">
                <input
                    type="text"
                    placeholder="캐릭터에게 메세지를 보내보세요!"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>보내기</button>
                <div className="voice-button-bg">
                    <div className="back-voiceButton-bg">
                        <img src={voiceButton} alt="Voice Button" />
                    </div>
                </div>
                {isModalOpen && (
                <div className="modal-bg">
                    <div className="modal-content-bg">
                        <h2>당신은 난폭한 스폰지밥과 집게사장 가게에서  
                        게살버거를 먹다가 핑핑이를 만났습니다 </h2>
                        <img
                            src={context1}
                            alt="캐릭터 이미지"
                            className="modal-image-bg"
                        />
                        <button onClick={() => setModalOpen(false)}>닫기</button>
                        <button onClick={() => setModalOpen(false)}>적용</button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default BalanceChat;
