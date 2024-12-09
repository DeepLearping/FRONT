import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/balanceGame.css';
import { callKakaoLoginAPI, callLoginAPI, getAllCharacterInfo } from '../../apis/UserAPICalls';
import image1 from './images/플랑크톤.jpg';
import image2 from './images/스폰지밥.jpg';
import image3 from './images/에스카노르.jpg';
import image4 from './images/버즈.jpg';
import image5 from './images/리바이.webp';
import image6 from './images/김전일.jpg';
import random from './images/Refresh.png';
import { useNavigate } from 'react-router-dom';
import { enterBalanceChatRoom } from '../../apis/ChatAPICalls';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

const characters = [
    { name: '플랑크톤', img: image1, charNo:5 },
    { name: '스폰지밥', img: image2, charNo:6 },
    { name: '에스카노르', img: image3, charNo:2 },
    { name: '버즈', img: image4, charNo:1 },
    { name: '리바이', img: image5, charNo:3 },
    { name: '김전일', img: image6, charNo:4 },
];

const modifiers = ['피곤한', '난폭한', '바보같은', '우울한', '애교쟁이', '찌질한', '열혈'];

const BalanceGame = () => {
    const dispatch = useDispatch();
    const [pair, setPair] = useState({});
    const [randomColor1, setRandomColor1] = useState('');
    const [randomColor2, setRandomColor2] = useState('');
    const userInfo = useSelector(state => state.user.userInfo);
    const [selectedLeftCharacter,setSelectedLeftCharacter] = useState('')
    const [selectedRightCharacter,setSelectedRightCharacter] = useState('')
    const [selectedLeftModifier,setSelectedLeftModifier] = useState('')
    const [selectedRightModifier,setSelectedRightModifier] = useState('')


    const navigate = useNavigate();

    const generateRandomPair = () => {
        const colors = [
            'rgb(174,0,0)',
            'rgb(6,117,0)',
            'rgb(0,51,117)',
            'rgb(68,3,106)',
            'rgb(106,3,72)',
            'rgb(106,3,5)',
            'rgb(76,80,19)',
            'rgb(29,139,164)',
        ];

        const [color1, color2] = [
            colors[Math.floor(Math.random() * colors.length)],
            colors[Math.floor(Math.random() * colors.length)],
        ];
        setRandomColor1(color1);
        setRandomColor2(color2);

        const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);
        const shuffledModifiers = [...modifiers].sort(() => Math.random() - 0.5);

        
        const leftCharacter = shuffledCharacters[0];
        console.log("@@@",leftCharacter);
        const rightCharacter = shuffledCharacters[1];
        const leftModifier = shuffledModifiers[0];
        const rightModifier = shuffledModifiers[1];

        setPair({
            left: {
                img: leftCharacter.img,
                text: `${leftModifier} ${leftCharacter.name}`,
            },
            right: {
                img: rightCharacter.img,
                text: `${rightModifier} ${rightCharacter.name}`,
            },
        });
        
        setSelectedLeftCharacter(shuffledCharacters[0].charNo);
        setSelectedRightCharacter(shuffledCharacters[1].charNo);
        
        setSelectedLeftModifier(shuffledModifiers[0]);
        setSelectedRightModifier(shuffledModifiers[1]);
        
    };

    useEffect(() => {
        generateRandomPair();
    }, []);

    const handleLeftCardClick = () => {
        
        // 채팅방 생성
        const enterChatRoomInfo = {
            charNo: selectedLeftCharacter,
            charName: pair.left?.text,
            memberNo: userInfo.memberNo
        }

        dispatch(enterBalanceChatRoom(enterChatRoomInfo))

        // 생성된 채팅방의 정보를 
        const chatRoomInfo = {
            imgUrl: pair.left?.img,
            text: pair.left?.text,
            characterId: selectedLeftCharacter,
            keyword: selectedLeftModifier
        }

        console.log("chatRoomInfo :",chatRoomInfo);

        navigate(`/balanceChat?charaterName=${chatRoomInfo.text}`, { state:chatRoomInfo });
    };

    const handleRightCardClick = () => {
        
        // 채팅방 생성
        const enterChatRoomInfo = {
            charNo: selectedRightCharacter,
            charName: pair.right?.text,
            memberNo: userInfo.memberNo
        }

        dispatch(enterBalanceChatRoom(enterChatRoomInfo))

        // 생성된 채팅방의 정보를 
        const chatRoomInfo = {
            imgUrl: pair.right?.img,
            text: pair.right?.text,
            characterId: selectedRightCharacter,
            keyword: selectedRightModifier
        }

        console.log("chatRoomInfo :",chatRoomInfo);


        navigate(`/balanceChat?charaterName=${chatRoomInfo.text}`, { state:chatRoomInfo });
    };
    

    return (
        <div className="card-container-bg">
            <div className="card-bg" onClick={handleLeftCardClick}>
                <img src={pair.left?.img} alt="캐릭터" className="card-image-bg" />
                <div className="card-text-bg">
                    <span className="change-text1-bg" style={{ color: randomColor1 }}>
                        {pair.left?.text}
                    </span>
                </div>
            </div>

            <div className="middle-bg">
                <div className="vs-bg">VS</div>
                <div className="random-button-bg" onClick={generateRandomPair}>
                    <img src={random} alt="랜덤 버튼" style={{ width: '30px' }} />
                </div>
            </div>

            <div className="card-bg" onClick={handleRightCardClick}>
                <img src={pair.right?.img} alt="캐릭터" className="card-image-bg" />
                <div className="card-text-bg">
                    <span className="change-text2-bg" style={{ color: randomColor2 }}>
                        {pair.right?.text}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BalanceGame;
