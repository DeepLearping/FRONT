import { combineReducers } from "redux";
import userReducer from "./UserModule";
import imageReducer from "./ImageModule";
import chatReducer from "./ChatModule";

const rootReducer = combineReducers({
    user: userReducer, // user 리듀서를 user 키로 결합
    image: imageReducer,
    chat: chatReducer,
});

export default rootReducer;