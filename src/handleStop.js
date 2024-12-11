export function handleStop(wheel) {
  let finalAngle = wheel.wheelContainer.angle % 360;
  if (finalAngle < 0) finalAngle += 360;

  let prizeIndex = this.getPrizeIndex(finalAngle, wheel.options.slices);
  let prizeText = wheel.options.slices[prizeIndex].text;

  // A 룰렛 결과 업데이트
  if (wheel === this.wheel1) {
    this.prizeTextA.setText(prizeText); // A 룰렛의 텍스트 업데이트
    this.readResult(prizeText); // 결과 읽기
  }
  // B 룰렛 결과 업데이트
  else if (wheel === this.wheel2) {
    this.prizeTextB.setText(prizeText); // B 룰렛의 텍스트 업데이트
    this.readResult(prizeText); // 결과 읽기
  }
}