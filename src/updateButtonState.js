export function updateButtonState(isActive) {
  if (isActive) {
    // 룰렛이 멈췄을 때 셋 모두 활성화
    this.abutton.setInteractive().setTexture("activeButtonA");
    this.bbutton.setInteractive().setTexture("activeButtonB");
    this.abbutton.setInteractive().setTexture("activeButtonAB");
  }

  // pin 상태 업데이트
  this.updatePinState(isActive);
}
