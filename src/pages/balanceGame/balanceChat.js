import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";
import "../../css/balanceChat.css";
import { useNavigate } from 'react-router-dom';
import { getMsgImg, sendBalanceMessageToAI, sendMessageToAI } from "../../apis/ChatAPICalls";
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
    const [isLoading, setIsLoading] = useState(false);
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
    const keyword = chatRoomInfo.keyword;
    const [modalInput, setModalInput] = useState("# 상황 설명:\n상황을 입력하세요. (ex: 집게리아에서 게살버거를 먹다가 핑핑이를 만났다.)");
    const [situation, setSituation] = useState("");

    const cleanSituation = situation.replace(/^[^:]+:\s*/, '');

    const sendMessage = async (messageInput) => {
        if (!messageInput || !messageInput.trim()) return; // 공백 메시지 차단

        const userMessage = { role: "user", content: messageInput, situation }; // 상황 추가

        // 입력 필드 값 초기화 (필드별 구분)
        if (messageInput === input) {
            setInput(""); // 채팅 입력 필드 초기화
        } else if (messageInput === modalInput) {

        }

        // 사용자 메시지 추가
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // 로딩 상태 처리
        setIsLoading(true);
        const loadingImages = [loading1, loading2, loading3, loading4, loading5, loading6];
        setLoadingImage(loadingImages[Math.floor(Math.random() * loadingImages.length)]);

        try {
            // 메시지 정보 전송
            const messageInfo = {
                question: messageInput,
                sessionId,
                charNo: chatRoomInfo.characterId,
                userId: chatUser.memberNo,
                keyword: chatRoomInfo.keyword,
                situation: modalInput
            };

            const aiResponse = await sendBalanceMessageToAI(messageInfo);

            // AI 응답 메시지 추가
            const aiMessage = {
                role: "ai",
                content: aiResponse.answer,
                msgImgUrl:
                    aiResponse.msgImg > 0
                        ? `http://localhost:8080/chatMessage/getMsgImg/${character.charNo}/${aiResponse.msgImg}.jpg`
                        : "",
                characterId: character.charNo,
            };

            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error("메세지 전송 오류:", error);
        } finally {
            setIsLoading(false); // 로딩 상태 종료
        }
    };

    const handleModalInput = () => {
        setSituation(modalInput); // 상황을 상태로 설정
        sendMessage(modalInput); // 입력 값으로 메시지 전송
        setModalInput("# 상황 설명:\n상황을 입력하세요. (ex: 집게리아에서 게살버거를 먹다가 핑핑이를 만났다.)");
        setModalOpen(false); // 모달 닫기
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
                    <div className="situation-bc">
                        부여된 상황: {cleanSituation && cleanSituation.length > 0 ? (cleanSituation.length > 30 ? cleanSituation.slice(0, 30) + '...' : cleanSituation) : "없음"}

                    </div>
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
                <div className="chat-messages-balChat">
                    {messages.map((msg, index) => (
                        <Message
                            key={index}
                            role={msg.role}
                            content={msg.content}
                            msgImgUrl={msg.msgImgUrl}
                            characterId={character.charNo}
                            profileImg={imageUrl}
                            keyword={keyword}
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
                        placeholder="메세지를 입력하세요"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                sendMessage(input);
                            }
                        }}
                    />
                    <button onClick={() => sendMessage(input)}>보내기</button>


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

                        <div className="modal-input-container-bg">
                            <img
                                src={context1}
                                alt="캐릭터 이미지"
                                className="modal-image-bg"
                                style={{ width: "400px", height: "350px" }}
                            />
                            <textarea
                                value={modalInput}
                                onChange={(e) => {
                                    const fixedText = "# 상황 설명:\n";
                                    const userInput = e.target.value;

                                    if (userInput.startsWith(fixedText)) {
                                        setModalInput(userInput); // Keep the full value if it starts with the fixed text
                                    } else {
                                        setModalInput(fixedText + userInput.replace(fixedText, ""));
                                    }
                                }}
                                onKeyDown={(e) => {
                                    const fixedText = "# 상황 설명:\n";
                                    const cursorPosition = e.target.selectionStart;

                                    if (e.key === "Backspace") {
                                        if (modalInput.startsWith(fixedText) && cursorPosition <= fixedText.length) {
                                            e.preventDefault();
                                        }
                                    }

                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleModalInput();
                                    }
                                }}
                                onFocus={(e) => {
                                    const fixedText = "# 상황 설명:\n";
                                    if (modalInput.startsWith(fixedText)) {
                                        setModalInput(fixedText);
                                        e.target.setSelectionRange(fixedText.length, fixedText.length);
                                    }
                                }}
                            />


                        </div>


                        <div className="modal-buttons-bg">
                            <button className="modal-button-bg" onClick={handleModalInput}>적용</button>
                            <button className="modal-button-bg" onClick={() => setModalOpen(false)}>닫기</button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default BalanceChat;