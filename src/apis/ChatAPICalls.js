import axios from 'axios';

const API_URL = "http://localhost:8000/chat"; // FastAPI URL

export const sendMessageToAI = async (question, characterId, characterName) => {
  // TODO: 생성된 채팅방의 session_id를 받아와서 conversation_id에 넣기

  let character_name = ""
  if (characterName === "스폰지밥"){
    character_name = "Spongebob"
  } else if (characterName === "플랑크톤"){
    character_name = "Plankton"
  } else if (characterName === "김전일"){
    character_name = "Kimjeonil"
  } else if (characterName === "버즈"){
    character_name = "Buzz"
  } else if (characterName === "에스카노르"){
    character_name = "Escanor"
  } else if (characterName === "리바이"){
    character_name = "Levi"
  }

  const payload = {
    user_id: 1,
    conversation_id: 1, 
    question,
    character_id: characterId, 
    // character_name: characterName  // 한국어는 name에 들어가지 X (regex)
    character_name: character_name
  };

  const response = await axios.post(API_URL, payload);
  return response.data;
};
