import Phaser from "phaser";
import { gameOptions, secondWheelOptions } from "./gameOptions.js";

export function createButtons() {
  let buttonSpacing = 80;
  let buttonY = 40;

  let abuttonWidth = this.textures.get("abutton").getSourceImage().width;
  let bbuttonWidth = this.textures.get("bbutton").getSourceImage().width;
  let abbuttonWidth = this.textures.get("abbutton").getSourceImage().width;

  let totalButtonWidth =
    abuttonWidth + bbuttonWidth + abbuttonWidth + buttonSpacing * 2;

  let startX = (this.scale.width - totalButtonWidth) / 2;

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

  this.abutton.on("pointerdown", () => {
    if (this.canSpin) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      this.prizeTextA.setText("");
      this.prizeTextB.setText("");

      this.updateButtonState(false);
      this.spinInfinite(this.wheel1, 1, 450);
    }
  });

  this.bbutton.on("pointerdown", () => {
    if (this.canSpin) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      this.prizeTextA.setText("");
      this.prizeTextB.setText("");

      this.updateButtonState(false);
      this.spinInfinite(this.wheel2, -1, 200);
    }
  });

  this.abbutton.on("pointerdown", () => {
    if (this.canSpin) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      this.prizeTextA.setText("");
      this.prizeTextB.setText("");

      this.updateButtonState(false);
      this.spinInfinite(this.wheel1, 1, 450);
      this.spinInfinite(this.wheel2, -1, 200);
    }
  });
}

export function createPin() {
  this.pin = this.add
    .sprite(this.scale.width / 2, this.scale.height / 2 + 50, "pin")
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

    if (this.wheel1.rotationTween) {
      const currentAngle1 = this.wheel1.wheelContainer.angle % 360;
      const direction1 = this.wheel1.direction || 1;
      this.wheel1.rotationTween.stop();
      this.wheel1.rotationTween = null;

      const randomFinalAngle1 = Phaser.Math.Between(1080, 1440);
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
