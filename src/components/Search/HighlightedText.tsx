interface Props {
  text: string;     
  keywords: string[]; 
}

export const HighlightedText = ({ text, keywords }: Props) => {
  
  if (keywords.length === 0) return <>{text}</>; // 키워드가 없으면 원본 텍스트 그대로 반환
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi'); // 키워드 배열을 정규식 패턴으로 결합 (대소문자 구분 없이)
  const parts = text.split(regex); // 정규식 기준으로 텍스트 분할 → 키워드와 일반 텍스트로 나뉨

  return (
    <>
      {parts.map((part, i) =>
        // 현재 파트가 키워드와 정확히 일치하는 경우 → 하이라이트
        keywords.some((kw) => kw.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-yellow-200 text-black">{part}</mark>
        ) : (
          // 일치하지 않으면 일반 텍스트로 출력
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};