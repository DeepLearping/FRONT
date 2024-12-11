import "../../css/chat.css";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { deleteHumanQuestions, getMsgImg, loadChatRoomInfo, matchCharacter, sendMessageToAI } from "../../apis/ChatAPICalls";
import { request } from "../../apis/Apis";
import Message from "./Message";
import goDownButton from "./images/down.png";
import playbutton from '../chat/images/Button Play.png'
import toggleImg from "./images/list_icon.png"
import searchIcon from "../selectCharacterList/images/icon.png"
import loading1 from "./images/loading1.gif";
import loading2 from "./images/loading2.gif";
import loading3 from "./images/loading3.gif";
import loading4 from "./images/loading4.gif";
import loading5 from "./images/loading5.gif";
import loading6 from "./images/loading6.gif";
import { logOut } from "../../modules/ChatModule";

const ChatRoom = ({ }) => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // URL에서 charNo 추출
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [input, setInput] = useState("");
  const [lastFetchedId, setLastFetchedId] = useState(-1);
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 맨 처음 채팅 기록 로드 (이 때만 맨 아래로 자동 스크롤)
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [isMembersVisible, setIsMembersVisible] = useState(false);
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  const [loadingImage, setLoadingImage] = useState(null);

  const chatContainerRef = useRef(null);
  const [offset, setOffset] = useState(0);      // 페이징에 필요한 offset
  const [hasMore, setHasMore] = useState(true); // 로드할 메세지가 더 있는지 확인

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
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const hours = kst.getUTCHours(); // KST 시간
  const minutes = kst.getUTCMinutes(); // KST 분
  const currentTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`

  // 채팅 기록 initial 로드 & 채팅방 정보 불러오기
  useEffect(() => {
    const fetchInitialChatHistory = async () => {
      setMessages([]);
      setOffset(0);
      setHasMore(true);
      setIsInitialLoad(true);
      setIsLoading(true);

      try {
        await fetchChatHistory();
        // scrollToBottom(); // 맨 아래로 scroll down
      } catch (error) {
        console.error("채팅 히스토리 fetch 에러:", error);
      } finally {
        setIsInitialLoad(false);
        setIsLoading(false);
      }
    };

    dispatch(loadChatRoomInfo(chatUser.memberNo, sessionId));
    fetchInitialChatHistory();

  }, [sessionId]);

  const fetchChatHistory = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const chatContainer = chatContainerRef.current;
      const previousScrollHeight = chatContainer.scrollHeight; // Store the scroll height before loading messages

      const response = await request("GET", `/chatMessage/history/${sessionId}?limit=10&lastFetchedId=${lastFetchedId}`);

      const parsedMessages = response.map((chat) => ({
        id: chat.id,
        role: chat.role,
        content: JSON.parse(chat.message)?.data?.content || "",
        msgImgUrl: chat.msgImgUrl ? `http://localhost:8080/chatMessage/getMsgImg${chat.msgImgUrl}` : "",
        characterId: chat.characterId,
        createdDate: chat.createdDate
      }));

      if (parsedMessages.length === 0) {
        // 더 이상 로드할 메세지가 없음
        setHasMore(false);
      } else {
        if (parsedMessages.length < 10) {
          setHasMore(false);
        }

        // DESC로 최신 메세지 10개씩 가져와서 ASC order로 정렬해서 보여주기
        parsedMessages.sort((a, b) => a.id - b.id);

        setMessages((prevMessages) => [...parsedMessages, ...prevMessages]);
        setOffset(offset + 1);
        setLastFetchedId(parsedMessages[0].id)
      }

      if (!isInitialLoad) {
        chatContainer.scrollTop = chatContainer.scrollHeight - previousScrollHeight;
      }
    } catch (error) {
      console.error("채팅 히스토리 fetch 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;

    // Trigger when the scrollbar reaches the top
    if (chatContainer.scrollTop === 0 && hasMore && !isLoading) {
      const previousHeight = chatContainer.scrollHeight;

      fetchChatHistory().then(() => {
        // Adjust scroll position to maintain user view
        chatContainer.scrollTop = chatContainer.scrollHeight - previousHeight;
      });
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.addEventListener("scroll", handleScroll);

    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim()) return;

    setInput(""); // 입력값 초기화
    const userMessage = { role: "user", content: input };
    setNewMessages((prevMessages) => [...prevMessages, userMessage]);

    const matchCharacterInfo = {
      charIdList: charNos,
      conversationId: sessionId,
      question: input
    }
    // console.log("matchCharacterInfo: ", matchCharacterInfo)

    let whoToSend = charNos
    if (charNos.length > 1) {
      whoToSend = await dispatch(matchCharacter(matchCharacterInfo));
    }
    // console.log("whoToSend:", whoToSend);

    // whoToSend 배열을 무작위로 섞기
    const shuffledWhoToSend = whoToSend.sort(() => Math.random() - 0.5);
    // console.log("shuffledWhoToSend:", shuffledWhoToSend);

    // for문 써서 whoToSend에 담긴 charNo 만큼 메시지 보내기
    for (const charNo of shuffledWhoToSend) {

      // 랜덤 로딩 이미지 설정
      const loadingImages = [loading1, loading2, loading3, loading4, loading5, loading6];
      setLoadingImage(loadingImages[Math.floor(Math.random() * loadingImages.length)]);

      setIsLoading(true); // 로딩 상태 시작

      const messageInfo = {
        question: input,
        sessionId: sessionId,
        charNo: charNo,
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
        setNewMessages((prevMessages) => [...prevMessages, aiMessage]);
        setIsLoading(false); // 로딩 상태 종료
      } catch (error) {
        console.error("메세지 전송 오류:", error);
      }
    }

    console.log("whoToSend길이:",whoToSend.length-1);

    if (whoToSend.length - 1 !== 0) {
      const DeleteUserMessageRequest = {
        conversationId: sessionId,
        numToBeDeleted: whoToSend.length - 1
      }
      dispatch(deleteHumanQuestions(DeleteUserMessageRequest))
    }
  };

  // 스크롤 내리기
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (isInitialLoad) {
      const interval = setInterval(() => {
        if (messageEndRef.current) {
          messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isInitialLoad, newMessages]);

  const searchChat = () => {
    // dispatch(logOut());
  }

  // 캐릭터 설명 토글
  const toggleDescription = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  const renderCharacterImages = () => {
    const characterCount = characters.length;

    return characters.slice(0, 4).map((character, index) => (
      <div
        key={index}
        className={`charaImg-container-chatRoom ${characterCount === 1 ? 'full-size' : ''}`}
      >
        <img
          className="charaImg-chatRoom"
          src={`http://localhost:8080/api/v1/character${character.profileImage}`}
          alt={`캐릭터 이미지 ${index + 1}`}
        />
      </div>
    ));
  };

  const renderMemberList = () => {

    return characters.map((character) => (
      <div className="member-list-box">
        <img
          className="member-profileImg"
          src={`http://localhost:8080/api/v1/character${character.profileImage}`}
          alt="프로필"
        />
        <span className="member-name">
          {character.charName}
        </span>
      </div>
    ))
  }

  // 멤버 목록 토글
  const toggleMembers = () => {
    setIsMembersVisible((prev) => !prev);
  }

  return (
    <div className="chat-room-chatRoom">
      <div className="chat-scroll-container-chatRoom"
      >
        <div className="chatRoom-header-wrapper">
          <div className="chat-header-chatRoom">
            {roomInfo && (
              <>
                <div className="charaImg-wrapper-chatRoom">
                  {renderCharacterImages()}
                </div>
                <div className="chatroom-description-container">
                  <p>
                    {roomName}
                    <button onClick={toggleDescription}>
                      {isDescriptionVisible ? "▲" : "▼"}
                    </button>
                  </p>
                  {isDescriptionVisible && (
                    <div className="chat-chara-description-chatRoom">
                      <p>{description}</p>
                    </div>
                  )}
                </div>
                <div className="chatRoom-tools">
                  {/* <img
                    className="chatRoom-search-icon"
                    src={searchIcon}
                    alt="검색"
                    onClick={searchChat}
                  /> */}
                  <img
                    className="chatRoom-member-toggle"
                    src={toggleImg}
                    alt="토글"
                    onClick={toggleMembers}
                  />
                </div>
                <div className={`members-list-container ${isMembersVisible ? 'visible' : ''}`}>
                  <div className="members-list">
                    {renderMemberList()}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
        <div className="chat-messages-chatRoom"
          ref={chatContainerRef}
          style={{ overflowY: "scroll" }}>
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} content={msg.content} msgImgUrl={msg.msgImgUrl} characterId={msg.characterId} createdDate={`${msg.createdDate[3]}:${msg.createdDate[4]}`} />
          ))}
          {newMessages.map((msg, index) => (
            <Message key={index} role={msg.role} content={msg.content} msgImgUrl={msg.msgImgUrl} characterId={msg.characterId} createdDate={`${msg.createdDate[3]}:${msg.createdDate[4]}`}/>
          ))}
          {isLoading && (
            <>
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
          <div className="back-voiceButton-chatRoom" onClick={scrollToBottom}>
            <img src={goDownButton} alt="Voice Button" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;