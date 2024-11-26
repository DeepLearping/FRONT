import React, { useEffect, useState } from 'react';
import '../../css/selectCharacterList.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadAllProfileImages } from '../../apis/ImageAPICalls';
import { getAllCharacterInfo } from '../../apis/UserAPICalls';
import searchIcon from '../selectCharacterList/images/icon.png';
import { useNavigate } from 'react-router-dom';
import { enterChatRoom } from '../../apis/ChatAPICalls';


function SelectCharacterList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userInfo = useSelector(state => state.user.userInfo)
    const allCharacter = useSelector(state => state.user.characters)
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCharacters, setFilteredCharacters] = useState([]);

    // useEffect(() => {
    //     dispatch(getAllCharacterInfo());
    // }, [dispatch]);

    useEffect(() => {
        const filtered = allCharacter.filter((character) =>
            character.charName.includes(searchTerm) 
        );
        setFilteredCharacters(filtered);
    }, [searchTerm, allCharacter]);

    const handleCharacterClick = (character) => {

        const chatRoomInfo = {
            charNo: character.charNo,
            charName: character.charName,
            memberNo: userInfo.memberNo
        }
        
        dispatch(enterChatRoom(chatRoomInfo));
        navigate(`/chat_room?character_id=${character.charNo}`,character);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); 
    };

    return (
        <div className="container-selectChar">
            <header className="header-selectChar">
                <div className="title-selectChar">캐릭터 목록</div>
                <div className="search-container-selectChar">
                    <div className="search-bar-selectChar">
                        <input
                            type="text"
                            placeholder="캐릭터 이름"
                            value={searchTerm} 
                            onChange={handleSearchChange} 
                        />
                        <button>
                            <img src={searchIcon} alt="Search" />
                        </button>
                    </div>
                </div>
                <div className='header-all-characterList'>
                    <div className="section-header-selectChar">모든 캐릭터</div>
                    <div className='line-sc'></div>
                </div>
            </header>

            
            <div className="character-grid-selectChar">
                {filteredCharacters.length === 0 ? (
                    <div>검색된 캐릭터가 없습니다.</div> // 필터된 캐릭터가 없을 때 표시
                ) : (
                    filteredCharacters.map((character) => {
                        const imageUrl =`http://localhost:8080/api/v1/character${character.profileImage}`;

                        return(
                        <div key={character.charNo} className="character-item-selectChar">
                            <img 
                                src={imageUrl} 
                                alt={character.charName}
                            />
                            <div className="character-description-selectChar" onClick={() => handleCharacterClick(character)}>
                                <div className="charName-sc">{character.charName}</div>
                                <div className='character-description-sc'>{character.description}</div>
                            </div>
                        </div>
                        );
                    })
                )}
            </div>
        </div>
    );
    
}

export default SelectCharacterList;
