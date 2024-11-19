import { combineReducers } from "redux";
import userReducer from "./UserModule";
import imageReducer from "./ImageModule";

const rootReducer = combineReducers({
    user: userReducer, // user 리듀서를 user 키로 결합
    image: imageReducer,
});

export default rootReducer;