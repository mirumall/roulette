import { gameOptions, secondWheelOptions } from "./gameOptions.js";

export function createResetButton(scene) {
  const resetButton = document.createElement("button");
  resetButton.id = "resetButton";
  resetButton.innerText = "룰렛 재설정";
  resetButton.style.position = "absolute";
  resetButton.style.bottom = "10px";
  resetButton.style.left = "50%";
  resetButton.style.transform = "translateX(-50%)";
  resetButton.style.padding = "10px 15px";
  resetButton.style.fontSize = "18px"; 
  resetButton.style.backgroundColor = "#ffffff";
  resetButton.style.border = "none";
  resetButton.style.borderRadius = "10px";
  resetButton.style.cursor = "pointer";
  document.body.appendChild(resetButton);

  resetButton.addEventListener("click", () => {
    scene.showModal();
  });
}

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

  document.body.appendChild(modal);

  const updateButton = document.createElement("button");
  updateButton.id = "updateButton";
  updateButton.innerText = "변경하기";
  modal.appendChild(updateButton);

  updateButton.addEventListener("click", () => {
    scene.updateWheelOptions();
  });
}

export function showModal(scene) {
  const modal = document.getElementById("modal");
  const resetButton = document.getElementById("resetButton");


  modal.innerHTML = "";

  modal.style.width = "70%";
  modal.style.height = "80%";
  modal.style.fontSize = "1.5rem"; 
  modal.style.padding = "20px";
  modal.style.overflowY = "auto";


  const modalTitle = document.createElement("h2");
  modalTitle.innerText = "룰렛 값 변경";
  modalTitle.style.textAlign = "center";
  modalTitle.style.marginBottom = "20px";
  modalTitle.style.fontSize = "1.5rem";
  modal.appendChild(modalTitle);


  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.marginBottom = "20px";


  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const innerHeader = document.createElement("th");
  innerHeader.innerText = "안쪽 룰렛";
  innerHeader.style.border = "1px solid #ccc";
  innerHeader.style.padding = "15px";
  innerHeader.style.backgroundColor = "#f0f0f0";
  innerHeader.style.textAlign = "center";
  innerHeader.style.fontSize = "1rem"; 
  innerHeader.style.width = "50%";

  const outerHeader = document.createElement("th");
  outerHeader.innerText = "바깥쪽 룰렛";
  outerHeader.style.border = "1px solid #ccc";
  outerHeader.style.padding = "15px";
  outerHeader.style.backgroundColor = "#f0f0f0";
  outerHeader.style.textAlign = "center";
  outerHeader.style.fontSize = "1rem";
  outerHeader.style.width = "50%"; 

  headerRow.appendChild(innerHeader);
  headerRow.appendChild(outerHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);


  const tbody = document.createElement("tbody");

  const maxLength = Math.max(gameOptions.slices.length, secondWheelOptions.slices.length);

  for (let i = 0; i < maxLength; i++) {
    const row = document.createElement("tr");


    const innerCell = document.createElement("td");
    innerCell.style.border = "1px solid #ccc";
    innerCell.style.padding = "10px";
    innerCell.style.textAlign = "center";
    innerCell.style.backgroundColor = "#fff";
    innerCell.style.fontSize = "12px"; 
    innerCell.innerText = gameOptions.slices[i]?.text || ""; 
    innerCell.dataset.type = "inner";
    innerCell.dataset.index = i;
    if (["GAME OVER", "다음 기회에"].includes(innerCell.innerText)) {
      innerCell.contentEditable = false;
      innerCell.style.backgroundColor = "#f0f0f0"; 
    } else {
      innerCell.contentEditable = true;
    }
    row.appendChild(innerCell);


    const outerCell = document.createElement("td");
    outerCell.style.border = "1px solid #ccc";
    outerCell.style.padding = "10px";
    outerCell.style.textAlign = "center";
    outerCell.style.backgroundColor = "#fff";
    outerCell.style.fontSize = "12px"; 
    outerCell.innerText = secondWheelOptions.slices[i]?.text || ""; 
    outerCell.dataset.type = "outer";
    outerCell.dataset.index = i;
    if (["WINNER", "꽝"].includes(outerCell.innerText)) {
      outerCell.contentEditable = false;
      outerCell.style.backgroundColor = "#f0f0f0";
    } else {
      outerCell.contentEditable = true;
    }
    row.appendChild(outerCell);

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  modal.appendChild(table);


  const updateButton = document.createElement("button");
  updateButton.id = "updateButton";
  updateButton.innerText = "변경하기";
  updateButton.style.display = "block"; 
  updateButton.style.margin = "20px auto"; 
  updateButton.style.padding = "15px 30px";
  updateButton.style.fontSize = "1rem";
  updateButton.style.borderRadius = "8px";
  updateButton.style.border = "1px solid #ccc";
  updateButton.style.backgroundColor = "#ffffff";
  updateButton.style.cursor = "pointer";


  updateButton.addEventListener("click", () => {
    const cells = tbody.querySelectorAll("td");
    cells.forEach((cell) => {
      const type = cell.dataset.type;
      const index = parseInt(cell.dataset.index, 10);
      if (type === "inner" && gameOptions.slices[index]) {
        gameOptions.slices[index].text = cell.innerText;
      }
      if (type === "outer" && secondWheelOptions.slices[index]) {
        secondWheelOptions.slices[index].text = cell.innerText;
      }
    });

    scene.updateWheelOptions();

    modal.style.display = "none";
    resetButton.style.backgroundColor = "#ffffff"; 
    resetButton.style.color = "#000000"; 
  });

  modal.appendChild(updateButton);


  modal.style.display = "block";
  modal.style.display = "block";


  resetButton.style.backgroundColor = "#cccccc"; 
  resetButton.style.color = "#ffffff"; 
}