import React from "react";
import { User, Music, X } from "lucide-react";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  openModal: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, openModal }) => {
  return (
    <div className="fixed bottom-1 w-full flex justify-center items-center z-50">
      <div className="flex items-center justify-between w-[95%] max-w-[320px] px-2 py-2  bg-opacity-80 rounded-full shadow-md">
        {/* 로고 */}
        <button className="text-white p-2">
          <Music size={22} />
        </button>

        {/* 검색창*/}
        <div className="relative flex-1 flex items-center px-3 py-1 border-b border-gray-200">
          <input
            type="text"
            autoFocus
            placeholder="플레이리스트를 검색해 보세요"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              openModal();
            }}
            className="flex-1 text-white focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* 마이페이지 */}
        <button className="text-white p-2">
          <User size={22} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;