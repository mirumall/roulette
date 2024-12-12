export function readResult(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "ko-KR"; 
    utterance.pitch = 1.3; 
    utterance.rate = 1; 
    utterance.volume = 1; 

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("이 브라우저는 SpeechSynthesis를 지원하지 않습니다.");
  }
}
