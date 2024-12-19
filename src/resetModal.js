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

  const resetButton = createImageButtonWithText(
    "resetButton",
    "./assets/updateButton.png",
    "calc(50% - 105px)"
  );
  const shareButton = createImageButtonWithText(
    "shareButton",
    "./assets/shareButton.png",
    "50%"
  );
  const homeButton = createImageButtonWithText(
    "homeButton",
    "./assets/resetButton.png",
    "calc(50% + 105px)"
  );

  document.body.appendChild(resetButton);
  document.body.appendChild(shareButton);
  document.body.appendChild(homeButton);

  const updateButton = document.createElement("button");
  updateButton.id = "updateButton";
  updateButton.innerText = "변경하기";
  modal.appendChild(updateButton);

  updateButton.addEventListener("click", () => {
    scene.updateWheelOptions();
  });

  window.addEventListener("disable-click", () => {
    resetButton.style.pointerEvents = "none";
    shareButton.style.pointerEvents = "none";
    homeButton.style.pointerEvents = "none";
  });

  window.addEventListener("enable-click", () => {
    resetButton.style.pointerEvents = "auto";
    shareButton.style.pointerEvents = "auto";
    homeButton.style.pointerEvents = "auto";
  });

  shareButton.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "미루 세계여행 주사위 룰렛 게임!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("공유 실패", error);
      }
    } else {
      console.log("Web Share API가 지원되지 않습니다.");
    }
  });

  resetButton.addEventListener("click", () => showInitialModal(scene));
  homeButton.addEventListener("click", () => {
    Object.assign(gameOptions, JSON.parse(JSON.stringify(initialGameOptions)));
    Object.assign(
      secondWheelOptions,
      JSON.parse(JSON.stringify(initialSecondWheelOptions))
    );
    scene.updateWheelOptions();
    modal.style.display = "none";
  });
}

function createImageButtonWithText(id, imgSrc, positionLeft) {
  const container = document.createElement("div");
  container.id = id;
  container.style.position = "absolute";
  container.style.bottom = "10px";
  container.style.left = positionLeft;
  container.style.transform = "translateX(-50%)";
  container.style.width = "100px";
  container.style.height = "50px";
  container.style.cursor = "pointer";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.overflow = "hidden";

  const image = document.createElement("img");
  image.src = imgSrc;
  image.style.position = "absolute";
  image.style.width = "100%";
  image.style.height = "100%";
  image.style.zIndex = "0";
  image.style.borderRadius = "10px";
  container.appendChild(image);

  const contentWrapper = document.createElement("div");
  contentWrapper.style.position = "relative";
  contentWrapper.style.zIndex = "1";
  contentWrapper.style.display = "flex";
  contentWrapper.style.alignItems = "center";
  contentWrapper.style.gap = "5px";

  container.appendChild(contentWrapper);

  return container;
}
