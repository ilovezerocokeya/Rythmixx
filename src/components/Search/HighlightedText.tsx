interface Props {
  text: string;     
  keywords: string[]; 
}

export const HighlightedText = ({ text, keywords }: Props) => {
  
  if (keywords.length === 0) 
    return 
      <>{text}</>; 
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi'); 
  const parts = text.split(regex); 

  return (
    <>
      {parts.map((part, i) =>
        // 현재 파트가 키워드와 정확히 일치하는 경우에 하이라이트 적용
        keywords.some((kw) => kw.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-yellow-200 text-black">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};