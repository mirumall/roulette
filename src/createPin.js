import Phaser from 'phaser';
import { gameOptions, secondWheelOptions } from "./gameOptions.js"; // 필요한 옵션 가져오기

export function createPin() {
  this.pin = this.add
    .sprite(this.scale.width / 2, this.scale.height / 2 + 100, "pin")
    .setInteractive();

  this.updatePinState(true);

  this.pin.on("pointerdown", () => {
    // 클릭 효과 (크기 줄이기)
    this.tweens.add({
      targets: this.pin,
      scale: 0.9, // 크기를 90%로 줄임
      duration: 100, // 100ms 동안
      yoyo: true, // 다시 원래 크기로 복귀
      ease: "Power1", // 부드러운 애니메이션
    });

    [this.wheel1, this.wheel2].forEach((wheel) => {
      if (wheel.rotationTween) {
        const currentAngle = wheel.wheelContainer.angle % 360; // 현재 각도
        const direction = wheel.direction || 1; // 회전 방향
        wheel.rotationTween.stop();
        wheel.rotationTween = null; // 무한 회전 트윈 제거

        if (wheel === this.wheel2) {
          console.log(`Current angle for Outer Wheel: ${currentAngle}`);
        } else {
          console.log(`Current angle for Inner Wheel: ${currentAngle}`);
        }

        if (this.pinClickCount > 28) {
          if (wheel === this.wheel2) {
            // 바깥 룰렛에서 WINNER 슬라이스 찾기
            const targetSlice = secondWheelOptions.slices.find((slice) => slice.text === "WINNER");
            const targetStartAngle = secondWheelOptions.slices.reduce((acc, slice) => {
              if (slice === targetSlice) return acc;
              return acc + slice.degrees;
            }, 0);

            // 목표 슬라이스가 12시 방향에 오도록 추가 각도 계산
            const sliceCenterAngle = targetStartAngle + targetSlice.degrees / 2;
            const additionalAngle = (360 + currentAngle - sliceCenterAngle) % 360;

            // 목표 각도로 애니메이션
            const finalAngle = currentAngle + direction * (720 + additionalAngle); // 720도는 최소 2회전 추가

            this.tweens.add({
              targets: wheel.wheelContainer,
              angle: finalAngle,
              duration: 4000,
              ease: "Cubic.easeOut",
              onComplete: () => {
                this.handleStop(wheel); // 결과 처리
                if (wheel === this.wheel2) {
                  this.canSpin = true; // 다시 회전 가능 상태로 설정
                  this.updateButtonState(true); // 버튼 활성화
                }
              },
            });
          } else {
            // 안쪽 룰렛에서 GAME OVER 슬라이스 찾기
            const targetSlice = gameOptions.slices.find((slice) => slice.text === "GAME OVER");
            const targetStartAngle = gameOptions.slices.reduce((acc, slice) => {
              if (slice === targetSlice) return acc;
              return acc + slice.degrees;
            }, 0);

            // 목표 슬라이스가 12시 방향에 오도록 추가 각도 계산
            const sliceCenterAngle = targetStartAngle + targetSlice.degrees / 2;
            const additionalAngle = (360 - currentAngle + sliceCenterAngle) % 360;

            // 목표 각도로 애니메이션
            const finalAngle = currentAngle + direction * (720 + additionalAngle); // 720도는 최소 2회전 추가

            this.tweens.add({
              targets: wheel.wheelContainer,
              angle: finalAngle,
              duration: 4000,
              ease: "Cubic.easeOut",
              onComplete: () => {
                this.handleStop(wheel); // 결과 처리
                if (wheel === this.wheel2) {
                  this.canSpin = true; // 다시 회전 가능 상태로 설정
                  this.updateButtonState(true); // 버튼 활성화
                }
              },
            });
          }
        } else {
          // 랜덤 동작
          const randomFinalAngle = Phaser.Math.Between(720, 1080); // 충분히 큰 각도
          const targetAngle = currentAngle + direction * randomFinalAngle;

          this.tweens.add({
            targets: wheel.wheelContainer,
            angle: targetAngle,
            duration: 4000,
            ease: "Cubic.easeOut",
            onComplete: () => {
              this.handleStop(wheel); // 결과 처리
              if (wheel === this.wheel2) {
                this.canSpin = true; // 다시 회전 가능 상태로 설정
                this.updateButtonState(true); // 버튼 활성화
              }
            },
          });
        }
      }
    });
  });
}