import Phaser from "phaser";
import { gameOptions, secondWheelOptions } from "./gameOptions.js";
import { Wheel } from "./Wheel.js";
import { createPin } from "./createPin.js";
import { createPrizeText } from "./createPrizeText.js";
import { createButtons } from "./createButtons.js";
import { handleStop } from "./handleStop.js";
import { readResult } from "./readResult.js";
import { updatePinState } from "./updatePinState.js";
import { updateButtonState } from "./updateButtonState.js";
import { spinInfinite } from "./spinInfinite.js";
import { getPrizeIndex } from "./getPrizeIndex.js";
import { createModal } from "./resetModal.js";
import { showInitialModal } from "./showModal.js";

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.currentTweens = [];
    this.canSpin = true;
    this.pinClickCount = 0;
    this.innerResult = null;
    this.outerResult = null;
    this.activeButton = null;
    this.buttonInterval = null;
    this.stopWheelTimer = null;
  }

  preload() {
    this.load.image("pin", "./assets/button.png");
    this.load.image("unpin", "./assets/unButton.png");
    this.load.image("bam", "./assets/bam.png");
    this.load.image("abutton", "./assets/button_a.png");
    this.load.image("bbutton", "./assets/button_b.png");
    this.load.image("abbutton", "./assets/button_ab.png");
    this.load.image("activeButtonA", "./assets/active_button_a.png");
    this.load.image("activeButtonB", "./assets/active_button_b.png");
    this.load.image("activeButtonAB", "./assets/active_button_ab.png");
    this.load.spritesheet("sparkAnimation", "./assets/spark.png", {
      frameWidth: 256,
      frameHeight: 143,
    });
    this.load.audio("spinSound", "./assets/backgroundMusic.mp3");
    this.load.audio("clickSound", "./assets/click.mp3");
  }

  create() {
    this.wheel1 = new Wheel(this, gameOptions, 0);
    this.wheel2 = new Wheel(this, secondWheelOptions, 1);
    createPin.call(this);
    createPrizeText.call(this);
    createButtons.call(this);

    this.spinSound = this.sound.add("spinSound", {
      loop: true,
    });
    this.clickSound = this.sound.add("clickSound");

    createModal(this);

    const brandText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 150,
        "생활 속 감성 브랜드 미루",
        {
          fontSize: "30px",
          fontFamily: "jalnan2",
          color: "#000000",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.input.on("gameobjectdown", this.onPinClick, this);

    this.abutton.on("pointerdown", () => {
      this.clickSound.play();
      this.toggleButtonState(this.abutton, "activeButtonA", "abutton");
      this.startStopTimer(); // 10초 뒤 룰렛 멈춤 타이머 시작
    });

    // B 버튼 동작
    this.bbutton.on("pointerdown", () => {
      this.clickSound.play();
      this.toggleButtonState(this.bbutton, "activeButtonB", "bbutton");
      this.startStopTimer(); // 10초 뒤 룰렛 멈춤 타이머 시작
    });

    // AB 버튼 동작
    this.abbutton.on("pointerdown", () => {
      this.clickSound.play();
      this.toggleButtonState(this.abbutton, "activeButtonAB", "abbutton");
      this.startStopTimer(); // 10초 뒤 룰렛 멈춤 타이머 시작
    });
  }

  startStopTimer() {
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout); // 기존 타이머 초기화
    }

    // 10초 뒤 createPin 내부 로직 실행
    this.stopTimeout = setTimeout(() => {
      if (this.wheel1.rotationTween) {
        const currentAngle1 = this.wheel1.wheelContainer.angle % 360;
        const direction1 = this.wheel1.direction || 1;
        this.wheel1.rotationTween.stop();
        this.wheel1.rotationTween = null;

        const randomFinalAngle1 = Phaser.Math.Between(360, 720);
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
    }, 10000); // 10초 뒤 실행
  }

  toggleButtonState(button, activeTexture, inactiveTexture) {
    // 모든 버튼 비활성화
    this.abutton.disableInteractive();
    this.bbutton.disableInteractive();
    this.abbutton.disableInteractive();

    if (this.activeButton && this.activeButton !== button) {
      clearInterval(this.buttonInterval);
      this.activeButton.setTexture(this.activeButton.activeTexture);
    }

    this.activeButton = button;
    this.activeButton.activeTexture = activeTexture;
    this.activeButton.inactiveTexture = inactiveTexture;

    this.buttonInterval = setInterval(() => {
      if (button.texture.key === activeTexture) {
        button.setTexture(inactiveTexture);
      } else {
        button.setTexture(activeTexture);
      }
    }, 500);
  }

  onPinClick(pointer, gameObject) {
    if (gameObject.texture.key === "pin" && this.canSpin) {
      this.pinClickCount++;
      this.canSpin = false;

      // 10초 타이머가 설정되어 있으면 취소
      if (this.stopWheelTimer) {
        this.stopWheelTimer.remove(false);
        this.stopWheelTimer = null;
      }

      this.time.delayedCall(4000, () => {
        this.canSpin = true;
      });
    }
  }

  stopWheel(wheel) {
    if (wheel.rotationTween) {
      const currentAngle = wheel.wheelContainer.angle % 360;
      const direction = wheel.direction || 1;
      wheel.rotationTween.stop();
      wheel.rotationTween = null;

      const randomFinalAngle = Phaser.Math.Between(360, 720);
      const targetAngle = currentAngle + direction * randomFinalAngle;

      this.tweens.add({
        targets: wheel.wheelContainer,
        angle: targetAngle,
        duration: 3000,
        ease: "Cubic.easeOut",
        onComplete: () => {
          this.handleStop(wheel);
          this.canSpin = true;
          this.updateButtonState(true);
        },
      });
    }
  }

  handleStop(wheel) {
    handleStop.call(this, wheel);

    if (this.spinSound.isPlaying) {
      this.spinSound.stop();
    }

    this.updateButtonState(true);

    if (this.buttonInterval) {
      clearInterval(this.buttonInterval);
      if (this.activeButton) {
        this.activeButton.setTexture(this.activeButton.activeTexture);
      }
    }
  }

  showGameOver() {
    this.canSpin = false;

    const spark = this.add.sprite(
      this.scale.width / 2,
      this.scale.height / 2,
      "sparkAnimation"
    );

    spark.displayWidth = this.scale.width / 1.2;
    spark.displayHeight = this.scale.height / 1.2;

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("sparkAnimation", {
        start: 0,
        end: 84,
      }),
      frameRate: 30,
      repeat: 0,
    });

    spark.play("explode");

    this.time.delayedCall(4000, () => {
      spark.destroy();
      this.pinClickCount = 0;
      this.canSpin = true;

      this.wheel1 = new Wheel(this, gameOptions, 0);
      this.wheel2 = new Wheel(this, secondWheelOptions, 1);
      createPin.call(this);

      this.scene.resume();
    });
  }

  showModal() {
    showInitialModal(this);
  }

  updateWheelOptions() {
    gameOptions.slices.forEach((slice, index) => {
      const input = document.getElementById(`innerWheelText${index}`);
      if (input) {
        slice.text = input.value;
      }
    });

    secondWheelOptions.slices.forEach((slice, index) => {
      const input = document.getElementById(`outerWheelText${index}`);
      if (input) {
        slice.text = input.value;
      }
    });

    this.wheel1 = new Wheel(this, gameOptions, 0);
    this.wheel2 = new Wheel(this, secondWheelOptions, 1);
    createPin.call(this);

    document.getElementById("modal").style.display = "none";
  }

  readResult(text) {
    readResult.call(this, text);
  }

  updatePinState(isActive) {
    updatePinState.call(this, isActive);
  }

  updateButtonState(isActive) {
    updateButtonState.call(this, isActive);
  }

  spinInfinite(wheel, direction, speed) {
    spinInfinite.call(this, wheel, direction, speed);
    if (!this.spinSound.isPlaying) {
      this.time.delayedCall(300, () => {
        this.spinSound.play();
      });
    }
  }

  getPrizeIndex(degrees, slices) {
    return getPrizeIndex.call(this, degrees, slices);
  }
}

window.onload = function () {
  const gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 1400,
      min: {
        width: 340,
        height: 640,
      },
      max: {
        width: 1200,
        height: 2800,
      },
      parent: "thegame",
    },
    backgroundColor: "#d7d7d7",
    scene: [playGame],
  };

  new Phaser.Game(gameConfig);
};
