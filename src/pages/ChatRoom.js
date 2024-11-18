import { useDispatch } from 'react-redux';
import { getAllCharacterInfo } from '../apis/UserAPICalls';
import '../css/ChatRoom.css';
import { useEffect } from 'react';

function ChatRoom() {

    const dispatch = useDispatch();

    useEffect(() => {
    
        dispatch(getAllCharacterInfo())
            
      }, [dispatch]);

    return (
        <>
        <div className="chat-container">
            <div className="chat-header">에스카노르 챗봇</div>
            <div className="message-container" id="message-container">
            {/* <!-- 챗봇 메시지와 사용자의 메시지가 여기에 표시됩니다 --> */}
            </div>
            <div className="input-container">
                <input type="text" id="user-input" placeholder="메시지를 입력하세요..." autoComplete="off"/>
                <button id="send-btn">보내기</button>
            </div>
        </div>
        </>
    )
}

export default ChatRoom;