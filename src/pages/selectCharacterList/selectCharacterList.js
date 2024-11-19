import React, { useEffect, useState } from 'react';
import '../../css/selectCharacterList.css';

function SelectCharacterList() {
    const [characters, setCharacters] = useState([]); // 캐릭터 데이터를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch('https://api.example.com/characters'); // API URL 수정 필요
                if (!response.ok) {
                    throw new Error('데이터를 가져오는 데 실패했습니다.');
                }
                const data = await response.json();
                setCharacters(data); // API 데이터를 상태에 저장
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchCharacters();
    }, []);

    if (loading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (error) {
        return <div className="error">에러 발생: {error}</div>;
    }

    return (
        <div className="container">
            {/* 고정된 헤더 영역 */}
            <header className="header">
                <div className="title">캐릭터 목록</div>
                <div className="search-container">
                    <div className="search-bar">
                        <input type="text" placeholder="캐릭터 이름" />
                        <button>
                            <img src="search-icon.png" alt="Search" />
                        </button>
                    </div>
                </div>
                <div className="section-header">모든 캐릭터</div>
            </header>

            {/* 스크롤 가능한 캐릭터 그리드 */}
            <div className="character-grid">
                {characters.map((character) => (
                    <div key={character.id} className="character-item">
                        <img src={character.image} alt={character.name} />
                        <div className="character-name">{character.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectCharacterList;
