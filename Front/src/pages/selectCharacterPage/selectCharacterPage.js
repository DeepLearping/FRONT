import React, { useEffect, useRef } from 'react';
import './style.css';

function SelectCharacterPage() {
  const gridRef = useRef(null);

  useEffect(() => {
    const gridElement = gridRef.current;

    let scrollInterval = setInterval(() => {
      if (gridElement) {
        gridElement.scrollTop += 1; // 1px씩 아래로 스크롤
        if (gridElement.scrollTop + gridElement.clientHeight >= gridElement.scrollHeight) {
          gridElement.scrollTop = 0; // 끝까지 스크롤 시 맨 위로 이동
        }
      }
    }, 50); // 50ms마다 스크롤

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="container">
      <div className="header">캐릭터 목록</div>
      <div className="search-container">
        <div className="search-bar">
          <input type="text" placeholder="캐릭터 이름" />
          <button>
            <img src="search-icon.png" alt="Search" />
          </button>
        </div>
      </div>
      <div className="section-header">모든 캐릭터</div>
      <div className="character-grid" ref={gridRef}>
        {/* 여기에 캐릭터 목록 렌더링 */}
      </div>
    </div>
  );
}

export default SelectCharacterPage;
