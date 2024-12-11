import { gameOptions, secondWheelOptions } from "./gameOptions.js";

export function createPrizeText() {
  // 박스 스타일 정의
  const boxWidth = 400;
  const boxHeight = 60;
  const boxBackgroundColor = 0xffffff; // 흰색
  const boxBorderColor = 0xc0c0c0; // 연한 회색
  const boxBorderWidth = 0;
  const boxCornerRadius = 10;
  const lineColor = 0x808080; // 선의 색상 (회색)
  const lineWidth = 0.5;

  // A 룰렛 결과 박스
  this.prizeBoxA = this.add.graphics();
  this.prizeBoxA
    .fillStyle(boxBackgroundColor, 1)
    .fillRoundedRect(
      this.scale.width / 2 - boxWidth / 2,
      this.scale.height / 2 -
        secondWheelOptions.wheelRadius -
        90 -
        boxHeight / 2,
      boxWidth,
      boxHeight,
      boxCornerRadius
    )
    .lineStyle(boxBorderWidth, boxBorderColor)
    .strokeRoundedRect(
      this.scale.width / 2 - boxWidth / 2,
      this.scale.height / 2 -
        secondWheelOptions.wheelRadius -
        90 -
        boxHeight / 2,
      boxWidth,
      boxHeight,
      boxCornerRadius
    );

  // A 룰렛 결과 텍스트
  this.prizeTextA = this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - secondWheelOptions.wheelRadius - 90, // A 룰렛 텍스트 위치
      "A룰렛 결과",
      { font: "20px Arial", color: "#000" } // 텍스트 스타일
    )
    .setOrigin(0.5);

  // B 룰렛 결과 박스
  this.prizeBoxB = this.add.graphics();
  this.prizeBoxB
    .fillStyle(boxBackgroundColor, 1)
    .fillRoundedRect(
      this.scale.width / 2 - boxWidth / 2,
      this.scale.height / 2 - gameOptions.wheelRadius - 90 - boxHeight / 2,
      boxWidth,
      boxHeight,
      boxCornerRadius
    )
    .lineStyle(boxBorderWidth, boxBorderColor)
    .strokeRoundedRect(
      this.scale.width / 2 - boxWidth / 2,
      this.scale.height / 2 - gameOptions.wheelRadius - 90 - boxHeight / 2,
      boxWidth,
      boxHeight,
      boxCornerRadius
    );

  // B 룰렛 결과 텍스트
  this.prizeTextB = this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - gameOptions.wheelRadius - 90, // B 룰렛 텍스트 위치
      "B룰렛 결과",
      { font: "20px Arial", color: "#000" } // 텍스트 스타일
    )
    .setOrigin(0.5);



  // A와 B 박스 사이에 선 추가
  const lineStartX = this.scale.width / 2 - boxWidth / 2 + 10; // 선 시작 X
  const lineEndX = this.scale.width / 2 + boxWidth / 2 - 10; // 선 끝 X
  const lineY =
    (this.scale.height / 2 -
      secondWheelOptions.wheelRadius -
      90 +
      boxHeight / 2 + // A 박스의 아래쪽
      this.scale.height / 2 -
      gameOptions.wheelRadius -
      90 -
      boxHeight / 2) / // B 박스의 위쪽
    2; // 중간 지점

  const connectingLine = this.add.graphics();
  connectingLine.lineStyle(lineWidth, lineColor);
  connectingLine.beginPath();
  connectingLine.moveTo(lineStartX, lineY);
  connectingLine.lineTo(lineEndX, lineY);
  connectingLine.strokePath();
}
