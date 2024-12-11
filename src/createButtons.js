export function createButtons() {
  let buttonSpacing = 80;
  let buttonY = 40; // 버튼의 Y 위치 조정

  let abuttonWidth = this.textures.get("abutton").getSourceImage().width;
  let bbuttonWidth = this.textures.get("bbutton").getSourceImage().width;
  let abbuttonWidth = this.textures.get("abbutton").getSourceImage().width;

  let totalButtonWidth =
    abuttonWidth + bbuttonWidth + abbuttonWidth + buttonSpacing * 2;

  let startX = (this.scale.width - totalButtonWidth) / 2;

  // 버튼 생성
  this.abutton = this.add
    .image(startX + abuttonWidth / 2, buttonY, "activeButtonA")
    .setOrigin(0.5, 0)
    .setInteractive();

  this.bbutton = this.add
    .image(
      this.abutton.x + abuttonWidth / 2 + bbuttonWidth / 2 + buttonSpacing,
      buttonY,
      "activeButtonB"
    )
    .setOrigin(0.5, 0)
    .setInteractive();

  this.abbutton = this.add
    .image(
      this.bbutton.x + bbuttonWidth / 2 + abbuttonWidth / 2 + buttonSpacing,
      buttonY,
      "activeButtonAB"
    )
    .setOrigin(0.5, 0)
    .setInteractive();

  // 버튼 클릭 이벤트
  this.abutton.on("pointerdown", () => {
    if (this.canSpin) {
      // 현재 진행 중인 음성 합성 취소
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      // 결과 텍스트 초기화
      this.prizeTextA.setText("");


      this.updateButtonState(false); // 모든 버튼 비활성화
      this.spinInfinite(this.wheel1, 1); // 첫 번째 룰렛 무한 회전
    }
  });

  this.bbutton.on("pointerdown", () => {
    if (this.canSpin) {
      // 현재 진행 중인 음성 합성 취소
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      // 결과 텍스트 초기화

      this.prizeTextB.setText("");

      this.updateButtonState(false); // 모든 버튼 비활성화
      this.spinInfinite(this.wheel2, -1); // 두 번째 룰렛 무한 회전
    }
  });

  this.abbutton.on("pointerdown", () => {
    if (this.canSpin) {
      // 현재 진행 중인 음성 합성 취소
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      // 결과 텍스트 초기화
      this.prizeTextA.setText("");
      this.prizeTextB.setText("");

      this.updateButtonState(false); // 모든 버튼 비활성화
      this.spinInfinite(this.wheel1, 1); // 첫 번째 룰렛 무한 회전
      this.spinInfinite(this.wheel2, -1); // 두 번째 룰렛 무한 회전
    }
  });
}
