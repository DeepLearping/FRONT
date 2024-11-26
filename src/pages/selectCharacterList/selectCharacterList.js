
import React, { useEffect, useState } from 'react';
import '../../css/selectCharacterList.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadAllProfileImages, updateCharacterChatCount } from '../../apis/ImageAPICalls';
import { getAllCharacterInfo } from '../../apis/UserAPICalls';
import searchIcon from '../selectCharacterList/images/icon.png';
import { useNavigate } from 'react-router-dom';

function SelectCharacterList() {
    const dispatch = useDispatch();
    const allCharacter = useSelector(state => state.user.characters);
    console.log("캐릭터 목록: {}", allCharacter);

    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null); // 에러 상태 관리
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [popularCharacters, setPopularCharacters] = useState([]);

    useEffect(() => {
        // 모든 캐릭터 데이터 및 프로필 이미지 불러오기
        dispatch(loadAllProfileImages());
        dispatch(getAllCharacterInfo());
    }, [dispatch]);

    useEffect(() => {
        // 검색어에 따라 캐릭터 필터링
        const filtered = allCharacter.filter((character) =>
            character.charName.includes(searchTerm)
        );
        setFilteredCharacters(filtered);

        // 인기 캐릭터 필터링 (예: chatCount를 기준으로 상위 3개)
        const popular = allCharacter
            .filter(character => character.chatCount > 0) // chatCount가 있는 캐릭터만
            .sort((a, b) => b.chatCount - a.chatCount) // chatCount 기준 내림차순 정렬
            .slice(0, 3); // 3위까지 선정
        setPopularCharacters(popular);
    }, [searchTerm, allCharacter]);


    const navigate = useNavigate();
    const handleCharacterClick = (charNo) => {
        navigate(`/chat_room?character_id=${charNo}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCharacterSelect = (character) => {
        // 선택된 캐릭터 chatCount 증가 처리
        dispatch(updateCharacterChatCount(character.charNo)); // API 호출로 업데이트

        // 업데이트 후 인기 캐릭터 다시 로드
        dispatch(getAllCharacterInfo());
    };

    if (error) {
        return <div className="error">에러 발생: {error}</div>;
    }

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
            </header>

            {/* 인기 캐릭터 섹션 */}
            <div className="popular-characters-section">
                <div className="section-header-selectChar">인기 캐릭터</div>
                <div className='line-sc'></div>
                <div className="character-grid-selectChar">
                    {popularCharacters.map((character) => {
                        const imageUrl = `http://localhost:8080/api/v1/character${character.profileImage}`;
                        return (
                            <div key={character.charNo} className="character-item-selectChar">
                                <img src={imageUrl} alt={character.charName} />
                                <div className="character-description-selectChar" onClick={() => handleCharacterClick(character.charNo)}>
                                    <div className="charName-sc">{character.charName}</div>
                                    <div className='character-description-sc'>
                                        선택 횟수: {character.chatCount}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 모든 캐릭터 섹션 */}
            <div className="all-characters-section">
                <div className="section-header-selectChar">모든 캐릭터</div>
                <div className='line-sc'></div>
                <div className="character-grid-selectChar">
                    {filteredCharacters.length === 0 ? (
                        <div>검색된 캐릭터가 없습니다.</div>
                    ) : (
                        filteredCharacters.map((character) => {
                            const imageUrl = `http://localhost:8080/api/v1/character${character.profileImage}`;
                            return (
                                <div
                                    key={character.charNo}
                                    className="character-item-selectChar"
                                    onClick={() => handleCharacterSelect(character)} // 캐릭터 선택 이벤트
                                >
                                    <img src={imageUrl} alt={character.charName} />
                                    <div className="character-description-selectChar" onClick={() => handleCharacterClick(character.charNo)}>
                                        <div className="charName-sc">{character.charName}</div>
                                        <div className='character-description-sc'>{character.description}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default SelectCharacterList;