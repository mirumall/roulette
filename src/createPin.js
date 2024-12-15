import Phaser from "phaser";
import { gameOptions, secondWheelOptions } from "./gameOptions.js";

export function createPin() {
  this.pin = this.add
    .sprite(this.scale.width / 2, this.scale.height / 2 + 100, "pin")
    .setInteractive();

  this.updatePinState(true);

  this.pin.on("pointerdown", () => {
    this.tweens.add({
      targets: this.pin,
      scale: 0.9,
      duration: 100,
      yoyo: true,
      ease: "Power1",
    });

    // wheel1 처리
    if (this.wheel1.rotationTween) {
      const currentAngle1 = this.wheel1.wheelContainer.angle % 360;
      const direction1 = this.wheel1.direction || 1;
      this.wheel1.rotationTween.stop();
      this.wheel1.rotationTween = null;

      const randomFinalAngle1 = Phaser.Math.Between(720, 1080);
      const targetAngle1 = currentAngle1 + direction1 * randomFinalAngle1;

      this.tweens.add({
        targets: this.wheel1.wheelContainer,
        angle: targetAngle1,
        duration: 3000,
        ease: "Cubic.easeOut",
        onComplete: () => {
          this.handleStop(this.wheel1);
        },
      });
    }

    // wheel2 처리
    if (this.wheel2.rotationTween) {
      const currentAngle2 = this.wheel2.wheelContainer.angle % 360;
      const direction2 = this.wheel2.direction || 1;
      this.wheel2.rotationTween.stop();
      this.wheel2.rotationTween = null;

      const randomFinalAngle2 = Phaser.Math.Between(1440, 1800);
      const targetAngle2 = currentAngle2 + direction2 * randomFinalAngle2;

      this.tweens.add({
        targets: this.wheel2.wheelContainer,
        angle: targetAngle2,
        duration: 3000,
        ease: "Cubic.easeOut",
        onComplete: () => {
          this.handleStop(this.wheel2);
          this.canSpin = true;
          this.updateButtonState(true);
        },
      });
    }
  });
}
