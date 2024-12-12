export function handleStop(wheel) {
  let finalAngle = wheel.wheelContainer.angle % 360;
  if (finalAngle < 0) finalAngle += 360;

  let prizeIndex = this.getPrizeIndex(finalAngle, wheel.options.slices);
  let prizeText = wheel.options.slices[prizeIndex].text;

  // A 룰렛 결과 업데이트
  if (wheel === this.wheel1) {
    this.prizeTextA.setText(prizeText); // A 룰렛의 텍스트 업데이트
    this.innerResult = prizeText;
    this.readResult(prizeText); // 결과 읽기
  }
  // B 룰렛 결과 업데이트
  else if (wheel === this.wheel2) {
    this.prizeTextB.setText(prizeText); // B 룰렛의 텍스트 업데이트
    this.outerResult = prizeText;
    this.readResult(prizeText); // 결과 읽기
  }
  if (this.innerResult && this.outerResult) {
    console.log(`안쪽 결과: ${this.innerResult}, 바깥쪽 결과: ${this.outerResult}`);
    // 조건: 안쪽 룰렛이 "GAME OVER"이고 바깥 룰렛이 "WINNER"
    if (this.innerResult === "GAME OVER" && this.outerResult === "WINNER") {
      this.showGameOver();
    } else {
      this.canSpin = true; // 다시 스핀 가능하도록 설정
    }
  }
}