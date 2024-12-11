import Phaser from 'phaser';
export function createPin() {
  this.pin = this.add
    .sprite(this.scale.width / 2, this.scale.height / 2 + 100, "pin")
    .setInteractive();

  this.updatePinState(true);

  this.pin.on("pointerdown", () => {
    // 클릭 효과 (크기 줄이기)
    this.tweens.add({
      targets: this.pin,
      scale: 0.90, // 크기를 90%로 줄임
      duration: 100, // 100ms 동안
      yoyo: true, // 다시 원래 크기로 복귀
      ease: "Power1", // 부드러운 애니메이션
    });

    [this.wheel1, this.wheel2].forEach((wheel) => {
      if (wheel.rotationTween) {
        const currentAngle = wheel.wheelContainer.angle; // 현재 각도
        const direction = wheel.direction || 1; // 회전 방향
        wheel.rotationTween.stop();
        wheel.rotationTween = null; // 무한 회전 트윈 제거

        const randomFinalAngle = Phaser.Math.Between(720, 1080); // 충분히 큰 각도
        const targetAngle = currentAngle + direction * randomFinalAngle; // 목표 각도

        this.tweens.add({
          targets: wheel.wheelContainer,
          angle: targetAngle, // 목표 각도로 감속
          duration: 4000, // 감속 지속 시간
          ease: "Cubic.easeOut", // 부드러운 감속
          onComplete: () => {
            this.handleStop(wheel); // 결과 처리
            if (wheel === this.wheel2) {
              this.canSpin = true; // 다시 회전 가능 상태로 설정
              this.updateButtonState(true); // 버튼 활성화
            }
          },
        });
      }
    });
  });
}
