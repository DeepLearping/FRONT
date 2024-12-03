import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";
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
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const dispatch = useDispatch();
    const messageEndRef = useRef(null);
    const [loadingImage, setLoadingImage] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const location = useLocation();
    const chatRoomInfo = location.state;

    const roomInfo = useSelector((state) => state.chat.currentRoom);
    const sessionId = roomInfo.sessionId;
    const allCharacter = useSelector((state) => state.user.characters);
    const character = allCharacter.find(character => character.charNo === chatRoomInfo.characterId);
    const chatUser = useSelector((state) => state.chat.currentRoom.member);

    const imageUrl = chatRoomInfo.imgUrl;
    const charName = character ? character.charName : "알 수 없음";

    console.log("$$$",chatRoomInfo)

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
            charNo: chatRoomInfo.characterId,
            userId: chatUser.memberNo,
        };

        try {
            const aiResponse = await sendMessageToAI(messageInfo);
            const aiMessage = { 
                role: "ai", 
                content: aiResponse.answer, 
                msgImgUrl: aiResponse.msgImg > 0 ? `http://localhost:8080/chatMessage/getMsgImg/${character.charNo}/${aiResponse.msgImg}.jpg` : "",
                characterId: character.charNo
            };

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
            {/* 채팅 스크롤 컨테이너 */}
            <div className="chat-scroll-container-bg">
                <div className="chat-header-chatRoom">
                    {roomInfo && (
                        <>
                            <img
                                className="charaImg-chatRoom"
                                src={chatRoomInfo.imgUrl}
                                alt="캐릭터 이미지"
                            />
                            <p>
                                {roomInfo.roomName}
                            </p>
                        </>
                    )}
                    <div className="chat-header-bg">
                        <img
                            className="contextLetter-bg"
                            src={contextBg}
                            alt="상황부여 이미지"
                            onClick={() => setModalOpen(true)}
                        />
                        <div className="header-text-bg">상황 부여하기</div>
                    </div>
                </div>


                {/* 채팅 메시지 영역 */}
                <div className="chat-messages-chatRoom">
                    {messages.map((msg, index) => (
                        <Message
                            key={index}
                            role={msg.role}
                            content={msg.content}
                            msgImgUrl={msg.msgImgUrl}
                            characterId={character.charNo}
                            profileImg={imageUrl}
                        />
                    ))}

                    {isLoading && (
                        <>
                            {/* 캐릭터 정보 영역 */}
                            <div className="chat-charInfo-bg">
                                <img
                                    className="charaImg-message-bg"
                                    src={chatRoomInfo.imgUrl}
                                    alt="캐릭터 이미지"
                                />
                                <p>{charName}</p>
                                <img
                                    className="playButton-bg"
                                    src={playbutton}
                                    alt="재생버튼"
                                />
                            </div>

                            {/* 로딩 중 메시지 */}
                            <div className="message-bg ai">
                                <div className="message-bubble-bg ai">
                                    <img
                                        src={loadingImage}
                                        alt="로딩 중"
                                        style={{ width: "18vh" }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {/* 메시지 끝으로 스크롤 */}
                    <div ref={messageEndRef} />
                </div>

                {/* 채팅 입력창 */}
                <div className="chat-input-bg">
                    <input
                        type="text"
                        placeholder="캐릭터에게 메세지를 보내보세요!"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage}>보내기</button>

                    {/* 음성 버튼 */}
                    <div className="voice-button-bg">
                        <div className="back-voiceButton-bg">
                            <img src={voiceButton} alt="Voice Button" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 모달 창 */}
            {isModalOpen && (
                <div className="modal-bg">
                    <div className="modal-content-bg">
                        <div className="modal-title-bg">상황 부여하기</div>

                        {/* 이미지와 입력창을 수평으로 정렬 */}
                        <div className="modal-input-container-bg">
                            <img
                                src={context1}
                                alt="캐릭터 이미지"
                                className="modal-image-bg"
                                style={{ width: "400px", height: "350px" }}
                            />
                            <textarea
                                type="text"
                                className="modal-description-input-bg"
                                placeholder="상황을 부여해보세요."
                            // value={modalDescription}
                            // onChange={(e) => setModalDescription(e.target.value)}
                            />
                        </div>

                        <div className="modal-buttons-bg">
                            <button className="modal-button-bg" onClick={() => setModalOpen(false)}>닫기</button>
                            <button className="modal-button-bg" onClick={() => setModalOpen(false)}>적용</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default BalanceChat;
