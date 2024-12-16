import { gameOptions, secondWheelOptions } from "./gameOptions.js";
import { showInitialModal } from "./showModal.js";

const initialGameOptions = JSON.parse(JSON.stringify(gameOptions));
const initialSecondWheelOptions = JSON.parse(
  JSON.stringify(secondWheelOptions)
);

export function createModal(scene) {
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.style.display = "none";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#ffffff";
  modal.style.padding = "20px";
  modal.style.border = "1px solid #000000";
  modal.style.maxHeight = "80%";
  modal.style.overflowY = "auto";
  modal.style.zIndex = "1000";

  document.body.appendChild(modal);

  const updateButton = document.createElement("button");
  updateButton.id = "updateButton";
  updateButton.innerText = "변경하기";
  modal.appendChild(updateButton);

  updateButton.addEventListener("click", () => {
    scene.updateWheelOptions();
  });

  // 공유 버튼 (이미지로 대체)
  const shareButton = document.createElement("img");
  shareButton.id = "shareButton";
  shareButton.src = "./assets/share.png"; // 공유 버튼 이미지 경로
  shareButton.alt = "공유";
  shareButton.style.position = "absolute";
  shareButton.style.bottom = "10px";
  shareButton.style.left = "50%";
  shareButton.style.transform = "translateX(-50%)";
  shareButton.style.width = "45px"; // 이미지 가로 길이
  shareButton.style.height = "45px"; // 이미지 세로 길이
  shareButton.style.cursor = "pointer";
  document.body.appendChild(shareButton);

  // 처음으로 버튼
  const homeButton = document.createElement("button");
  homeButton.id = "homeButton";
  homeButton.innerText = "처음으로";
  homeButton.style.position = "absolute";
  homeButton.style.bottom = "10px";
  homeButton.style.left = "calc(50% + 80px)";
  homeButton.style.transform = "translateX(-50%)";
  homeButton.style.width = "100px"; // 가로 길이 설정
  homeButton.style.height = "50px"; // 세로 길이 설정
  homeButton.style.fontSize = "18px";
  homeButton.style.color = "#fff";
  homeButton.style.fontFamily = "jalnan2";
  homeButton.style.backgroundColor = "#00ff00";
  homeButton.style.border = "none";
  homeButton.style.borderRadius = "10px";
  homeButton.style.cursor = "pointer";
  document.body.appendChild(homeButton);

  // 재설정 버튼
  const resetButton = document.createElement("button");
  resetButton.id = "resetButton";
  resetButton.innerText = "재설정";
  resetButton.style.position = "absolute";
  resetButton.style.bottom = "10px";
  resetButton.style.left = "calc(50% - 80px)";
  resetButton.style.transform = "translateX(-50%)";
  resetButton.style.width = "100px"; // 가로 길이 설정
  resetButton.style.height = "50px"; // 세로 길이 설정
  resetButton.style.fontSize = "18px";
  resetButton.style.color = "#fff";
  resetButton.style.fontFamily = "jalnan2";
  resetButton.style.backgroundColor = "#ff0000";
  resetButton.style.border = "none";
  resetButton.style.borderRadius = "10px";
  resetButton.style.cursor = "pointer";
  document.body.appendChild(resetButton);

  shareButton.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "룰렛 게임",
          text: "이 룰렛 게임을 확인해보세요!",
          url: window.location.href,
        });
        console.log("공유 성공");
      } catch (error) {
        console.error("공유 실패", error);
      }
    } else {
      console.log("Web Share API가 지원되지 않습니다.");
    }
  });

  homeButton.addEventListener("click", () => {
    console.log("Home button clicked");
    Object.assign(gameOptions, JSON.parse(JSON.stringify(initialGameOptions)));
    Object.assign(
      secondWheelOptions,
      JSON.parse(JSON.stringify(initialSecondWheelOptions))
    );
    scene.updateWheelOptions();
    modal.style.display = "none";
  });

  resetButton.addEventListener("click", () => {
    showInitialModal(scene);
  });
}
