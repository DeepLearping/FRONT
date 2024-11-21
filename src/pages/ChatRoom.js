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
        <div className="chat-container-chatRoom">
            <div className="chat-header">특정캐릭터의 챗봇</div>
            <div className="message-container-chatRoom" id="message-container">
            </div>
            <div className="input-container-chatRoom">
                <input type="text" id="user-input" placeholder="메시지를 입력하세요..." autoComplete="off"/>
                <button id="send-btn">보내기</button>
            </div>
        </div>
        </>
    )
}

export default ChatRoom;