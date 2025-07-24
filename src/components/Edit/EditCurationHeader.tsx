import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditCurationHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-between px-6 pt-6 shrink-0">
      <button
        onClick={() => navigate('/')}
        className="text-base font-bold text-blue-600 hover:text-blue-700"
      >
        Rythmixx
      </button>
      <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-800 text-center pointer-events-none">
        큐레이션 관리자
      </h1>
    </div>
  );
};

export default EditCurationHeader;