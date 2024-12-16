import { gameOptions, secondWheelOptions } from "./gameOptions.js";

export function showInitialModal(scene) {
  const modal = document.getElementById("modal");
  modal.innerHTML = "";

  modal.style.width = "200px";
  modal.style.height = "25%"; // 높이를 30%로 늘림
  modal.style.fontSize = "1.5rem";
  modal.style.padding = "20px";
  modal.style.overflowY = "auto";
  modal.style.zIndex = "1000";

  const modalTitle = document.createElement("div");
  modalTitle.style.marginBottom = "20px";

  const titleLine1 = document.createElement("span");
  titleLine1.innerText = "미루 세계여행";
  titleLine1.style.display = "block";
  titleLine1.style.textAlign = "left";
  titleLine1.style.fontSize = "1.3rem";

  const titleLine2 = document.createElement("span");
  titleLine2.innerText = "주사위 룰렛 게임";
  titleLine2.style.display = "block";
  titleLine2.style.textAlign = "right";
  titleLine2.style.fontSize = "1.3rem";

  modalTitle.appendChild(titleLine1);
  modalTitle.appendChild(titleLine2);
  modal.appendChild(modalTitle);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-around";
  buttonContainer.style.marginTop = "20px";

  const innerButton = document.createElement("button");
  innerButton.id = "innerButton";
  innerButton.innerText = "A 재설정";
  innerButton.style.padding = "10Px 12px";
  innerButton.style.fontSize = "1rem";
  innerButton.style.borderRadius = "8px";
  innerButton.style.border = "1px solid #ccc";
  innerButton.style.backgroundColor = "#ffffff";
  innerButton.style.cursor = "pointer";
  buttonContainer.appendChild(innerButton);

  const outerButton = document.createElement("button");
  outerButton.id = "outerButton";
  outerButton.innerText = "B 재설정";
  outerButton.style.padding = "10px 12px";
  outerButton.style.fontSize = "1rem";
  outerButton.style.borderRadius = "8px";
  outerButton.style.border = "1px solid #ccc";
  outerButton.style.backgroundColor = "#ffffff";
  outerButton.style.cursor = "pointer";
  buttonContainer.appendChild(outerButton);

  modal.appendChild(buttonContainer);

  innerButton.addEventListener("click", () => {
    showEditModal(scene, "inner");
  });

  outerButton.addEventListener("click", () => {
    showEditModal(scene, "outer");
  });

  // 닫기 버튼 추가
  const closeButton = document.createElement("button");
  closeButton.id = "closeButton";
  closeButton.innerText = "닫기";
  closeButton.style.position = "absolute";
  closeButton.style.bottom = "10px";
  closeButton.style.left = "50%";
  closeButton.style.transform = "translateX(-50%)";
  closeButton.style.padding = "10px 20px";
  closeButton.style.fontSize = "1rem";
  closeButton.style.borderRadius = "8px";
  closeButton.style.border = "1px solid #ccc";
  closeButton.style.backgroundColor = "#ff0000";
  closeButton.style.color = "#ffffff";
  closeButton.style.cursor = "pointer";
  modal.appendChild(closeButton);

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.style.display = "block";
}

export function showEditModal(scene, type) {
  const modal = document.getElementById("modal");
  const resetButton = document.getElementById("resetButton");

  modal.innerHTML = "";

  modal.style.width = "70%";
  modal.style.height = "80%";
  modal.style.fontSize = "1.5rem";
  modal.style.padding = "20px";
  modal.style.marginBottom = "20px";
  modal.style.overflowY = "hidden"; // 전체 모달의 스크롤을 숨김
  modal.style.zIndex = "1000";

  const modalTitle = document.createElement("h2");
  modalTitle.innerText = type === "inner" ? "A 재설정" : "B 재설정";
  modalTitle.style.textAlign = "center";
  modalTitle.style.marginBottom = "20px";
  modal.appendChild(modalTitle);

  const formContainer = document.createElement("div");
  formContainer.style.flex = "1";
  formContainer.style.overflowY = "auto"; // 인풋 컨테이너의 스크롤을 활성화
  formContainer.style.maxHeight = "calc(100% - 150px)"; // 하단 버튼 영역을 제외한 높이 설정

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
    input.style.padding = "10px";

    input.style.fontSize = "1rem";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "8px";

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
    resetButton.style.backgroundColor = "#ff0000";
    resetButton.style.color = "#fff";
  });
}
