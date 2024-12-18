import { gameOptions, secondWheelOptions } from "./gameOptions.js";

export function showInitialModal(scene) {
  const modal = document.getElementById("modal");
  modal.innerHTML = "";

  // 모달 스타일 설정
  modal.style.position = "absolute";
  modal.style.zIndex = "1000";
  modal.style.pointerEvents = "auto"; // 이벤트 활성화
  modal.style.width = "200px";
  modal.style.height = "220px";
  modal.style.padding = "20px";
  modal.style.background = "#fff";
  modal.style.borderRadius = "10px";
  modal.style.overflowY = "auto";

  // Phaser 씬 일시정지
  scene.scene.pause();

  const modalTitle = document.createElement("div");
  modalTitle.style.marginBottom = "20px";

  // 배경 이미지 설정
  const backgroundDiv = document.createElement("div");
  backgroundDiv.style.width = "100%";
  backgroundDiv.style.height = "100px";
  backgroundDiv.style.background = `url('./assets/gameText.png') center/contain no-repeat`;

  modalTitle.appendChild(backgroundDiv);
  modal.appendChild(modalTitle);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-around";

  const innerButton = createButton("A 재설정", "#6e8efb", "#a777e3", () => {
    showEditModal(scene, "inner");
  });

  const outerButton = createButton("B 재설정", "#ff7e5f", "#feb47b", () => {
    showEditModal(scene, "outer");
  });

  buttonContainer.appendChild(innerButton);
  buttonContainer.appendChild(outerButton);
  modal.appendChild(buttonContainer);

  const closeButton = createButton("닫기", "#ff0000", "#d40000", () => {
    modal.style.display = "none";
    scene.scene.resume(); // Phaser 씬 재개
  });

  closeButton.style.position = "absolute";
  closeButton.style.bottom = "10px";
  closeButton.style.left = "50%";
  closeButton.style.padding = "10px 20px";
  closeButton.style.marginTop = "30px";
  closeButton.style.transform = "translateX(-50%)";

  modal.appendChild(closeButton);
  modal.style.display = "block";
}

function createButton(text, startColor, endColor, onClick) {
  const button = document.createElement("button");
  button.innerText = text;
  button.style.padding = "10px 12px";
  button.style.fontSize = "1.1rem";
  button.style.border = "none";
  button.style.fontFamily = "'Jua', sans-serif";
  button.style.borderRadius = "8px";
  button.style.background = `linear-gradient(135deg, ${startColor}, ${endColor})`;
  button.style.color = "#ffffff";
  button.style.cursor = "pointer";
  button.style.transition = "all 0.3s ease";

  button.addEventListener("click", onClick);
  return button;
}

export function showEditModal(scene, type) {
  const modal = document.getElementById("modal");
  const resetButton = document.getElementById("resetButton");

  modal.innerHTML = "";

  modal.style.width = "250px";
  modal.style.height = "500px";
  modal.style.fontSize = "1.5rem";
  modal.style.padding = "20px";
  modal.style.marginBottom = "20px";
  modal.style.overflowY = "hidden";
  modal.style.zIndex = "1000";

  const modalTitle = document.createElement("h4");
  modalTitle.innerText = type === "inner" ? "A 재설정" : "B 재설정";
  modalTitle.style.textAlign = "center";
  modalTitle.style.fontWeight = "normal";
  modalTitle.style.fontFamily = "'Jua', sans-serif";

  modalTitle.style.margin = "10px 0";
  modal.appendChild(modalTitle);

  const formContainer = document.createElement("div");
  formContainer.style.flex = "1";
  formContainer.style.overflowY = "auto"; // 인풋 컨테이너의 스크롤을 활성화
  formContainer.style.maxHeight = "calc(100% - 120px)"; // 하단 버튼 영역을 제외한 높이 설정

  // 스크롤 바 스타일 추가
  const formStyle = document.createElement("style");
  formStyle.innerHTML = `
    #modal div::-webkit-scrollbar {
      width: 15px;
    }
    #modal div::-webkit-scrollbar-track {
      background: #ffffff;
    }
    #modal div::-webkit-scrollbar-thumb {
      background-color:rgb(84, 171, 200);
      border-radius: 10px;
      border: 3px solid #ffffff;
    }
  `;
  document.head.appendChild(formStyle);

  const form = document.createElement("form");
  form.style.display = "flex";
  form.style.flexDirection = "column";
  form.style.gap = "10px";

  const options = type === "inner" ? gameOptions : secondWheelOptions;
  const maxLength = options.slices.length;

  for (let i = 0; i < maxLength; i++) {
    const inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";
    inputContainer.style.justifyContent = "space-between";
    inputContainer.style.alignItems = "center";

    const input = document.createElement("input");
    input.type = "text";
    input.value = options.slices[i]?.text || "";
    input.dataset.type = type;
    input.dataset.index = i;
    input.style.flex = "1";
    input.style.padding = "8px 10px";
    input.style.fontSize = "1rem";
    input.style.border = "2px solid transparent";
    input.style.borderRadius = "12px";
    input.style.backgroundColor = "#f9f9f9";
    input.style.color = "#333";

    input.style.transition = "all 0.3s ease-in-out";

    input.style.outline = "none";

    input.addEventListener("focus", () => {
      input.style.border = "2px solid #ffcc00";
      input.style.boxShadow = "0 0 15px rgba(255, 204, 0, 0.9)";

      input.value = "";
    });

    input.addEventListener("blur", () => {
      input.style.border = "2px solid transparent";
      input.style.boxShadow = "none";
      input.style.transform = "scale(1)";
    });

    inputContainer.appendChild(input);
    form.appendChild(inputContainer);
  }

  formContainer.appendChild(form);
  modal.appendChild(formContainer);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.position = "absolute";
  buttonContainer.style.bottom = "0";
  buttonContainer.style.left = "0";
  buttonContainer.style.width = "100%";
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";
  buttonContainer.style.padding = "10px 0px";
  buttonContainer.style.backgroundColor = "#ffffff";
  buttonContainer.style.borderTop = "1px solid #ccc";

  const backButton = document.createElement("button");
  backButton.id = "backButton";
  backButton.innerText = "뒤로가기";
  backButton.style.padding = "15px 30px";
  backButton.style.fontSize = "1rem";
  backButton.style.marginLeft = "17px";
  backButton.style.borderRadius = "8px";
  backButton.style.border = "1px solid #ccc";
  backButton.style.backgroundColor = "#ffffff";
  backButton.style.cursor = "pointer";
  buttonContainer.appendChild(backButton);

  const updateButton = document.createElement("button");
  updateButton.id = "updateButton";
  updateButton.innerText = "변경하기";
  updateButton.style.padding = "15px 30px";
  updateButton.style.marginRight = "17px";
  updateButton.style.fontSize = "1rem";
  updateButton.style.borderRadius = "8px";
  updateButton.style.border = "1px solid #ccc";
  updateButton.style.backgroundColor = "#50bcdf";
  updateButton.style.cursor = "pointer";
  buttonContainer.appendChild(updateButton);

  modal.appendChild(buttonContainer);

  backButton.addEventListener("click", () => {
    showInitialModal(scene);
  });

  updateButton.addEventListener("click", (event) => {
    event.preventDefault();
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      const type = input.dataset.type;
      const index = parseInt(input.dataset.index, 10);
      if (type === "inner" && gameOptions.slices[index]) {
        gameOptions.slices[index].text = input.value;
      }
      if (type === "outer" && secondWheelOptions.slices[index]) {
        secondWheelOptions.slices[index].text = input.value;
      }
    });

    scene.updateWheelOptions();

    modal.style.display = "none";
    scene.scene.resume();
    resetButton.style.color = "#fff";
  });
}
