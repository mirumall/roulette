import Phaser from "phaser";
import { gameOptions, secondWheelOptions } from "./gameOptions.js";
import { Wheel } from "./Wheel.js";
import { createPrizeText, getPrizeIndex } from "./createPrizeText.js";
import { createButtons, createPin } from "./createButtons.js";
import {
  spinInfinite,
  updatePinState,
  readResult,
  handleStop,
} from "./rouletteHandle.js";
import { createModal } from "./resetModal.js";
import { showInitialModal } from "./showModal.js";

class PlayGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.initState();
    this.isSpinning = false;
  }

  initState() {
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
    this.loadAssets();
    this.load.image("titleImage", "./assets/gameText.png");
  }

  loadAssets() {
    const assets = [
      { key: "pin", path: "./assets/button.png" },
      { key: "unpin", path: "./assets/unButton.png" },
      { key: "bam", path: "./assets/bam.png" },
      { key: "abutton", path: "./assets/button_a.png" },
      { key: "bbutton", path: "./assets/button_b.png" },
      { key: "abbutton", path: "./assets/button_ab.png" },
      { key: "activeButtonA", path: "./assets/active_button_a.png" },
      { key: "activeButtonB", path: "./assets/active_button_b.png" },
      { key: "activeButtonAB", path: "./assets/active_button_ab.png" },
      { key: "shadow", path: "./assets/shadow.png" },
      { key: "titleImage", path: "./assets/gameText.png" },
    ];

    assets.forEach((asset) => this.load.image(asset.key, asset.path));

    this.load.audio("spinSound", "./assets/backgroundMusic.mp3");
  }

  create() {
    this.createWheels();
    this.createUI();
    this.createEvents();
  }

  createWheels() {
    this.wheel1 = new Wheel(this, gameOptions, 0);
    this.wheel2 = new Wheel(this, secondWheelOptions, 1);
  }

  createUI() {
    createPin.call(this);
    createPrizeText.call(this);
    createButtons.call(this);
    createModal(this);

    this.spinSound = this.sound.add("spinSound", { loop: true });

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 200,
        "생활 속 감성 브랜드 미루",
        {
          fontSize: "30px",
          fontFamily: "jalnan2",
          color: "#000000",
          align: "center",
        }
      )
      .setOrigin(0.5);
  }

  createEvents() {
    this.input.on("gameobjectdown", this.onPinClick, this);

    this.abutton.on("pointerdown", () =>
      this.handleButtonClick(this.abutton, "activeButtonA", "abutton")
    );
    this.bbutton.on("pointerdown", () =>
      this.handleButtonClick(this.bbutton, "activeButtonB", "bbutton")
    );
    this.abbutton.on("pointerdown", () =>
      this.handleButtonClick(this.abbutton, "activeButtonAB", "abbutton")
    );
  }

  handleButtonClick(button, activeTexture, inactiveTexture) {
    if (this.canSpin) {
      if (navigator.vibrate) {
        navigator.vibrate(500);
      } else {
        console.warn("Vibration API가 지원되지 않는 브라우저입니다.");
      }
      this.toggleButtonState(button, activeTexture, inactiveTexture);
      this.startStopTimer();
    }
  }

  startStopTimer() {
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
    }

    this.isSpinning = true;
    window.dispatchEvent(new Event("disable-click"));

    this.stopTimeout = setTimeout(() => {
      this.stopWheel(this.wheel1, 360, 720);
      this.stopWheel(this.wheel2, 1440, 1800);
    }, 10000);
  }

  stopWheel(wheel, minAngle, maxAngle) {
    if (wheel.rotationTween) {
      const currentAngle = wheel.wheelContainer.angle % 360;
      const direction = wheel.direction || 1;
      wheel.rotationTween.stop();
      wheel.rotationTween = null;

      const randomFinalAngle = Phaser.Math.Between(minAngle, maxAngle);
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

  toggleButtonState(button, activeTexture, inactiveTexture) {
    this.updateButtonState(false);

    if (this.activeButton && this.activeButton !== button) {
      clearInterval(this.buttonInterval);
      this.activeButton.setTexture(this.activeButton.activeTexture);
    }

    this.activeButton = button;
    this.activeButton.activeTexture = activeTexture;
    this.activeButton.inactiveTexture = inactiveTexture;

    this.buttonInterval = setInterval(() => {
      button.setTexture(
        button.texture.key === activeTexture ? inactiveTexture : activeTexture
      );
    }, 500);

    this.canSpin = true;
  }

  onPinClick(pointer, gameObject) {
    if (gameObject.texture.key === "pin" && this.canSpin) {
      this.pinClickCount++;
      this.canSpin = false;
      this.updatePinState("unpin");

      if (navigator.vibrate) {
        navigator.vibrate(500);
      }

      if (this.buttonInterval) {
        clearInterval(this.buttonInterval);
        if (this.activeButton) {
          this.activeButton.setTexture(this.activeButton.activeTexture);
        }
      }

      if (this.stopWheelTimer) {
        this.stopWheelTimer.remove(false);
        this.stopWheelTimer = null;
      }

      this.time.delayedCall(4000, () => {
        this.canSpin = true;
      });
    }
  }

  handleStop(wheel) {
    handleStop.call(this, wheel);

    if (this.spinSound.isPlaying) {
      this.spinSound.stop();
    }

    this.isSpinning = false;
    this.canSpin = true;

    this.updateButtonState(true);
    window.dispatchEvent(new Event("enable-click"));
  }

  showModal() {
    showInitialModal(this);
  }

  updateWheelOptions() {
    this.updateOptions(gameOptions, "innerWheelText");
    this.updateOptions(secondWheelOptions, "outerWheelText");

    this.createWheels();
    createPin.call(this);

    document.getElementById("modal").style.display = "none";
    this.updateButtonState(true);
  }

  updateOptions(options, prefix) {
    options.slices.forEach((slice, index) => {
      const input = document.getElementById(`${prefix}${index}`);
      if (input) {
        slice.text = input.value;
      }
    });
  }

  readResult(text) {
    readResult.call(this, text);
  }

  updatePinState(isActive) {
    updatePinState.call(this, isActive);
  }

  updateButtonState(isActive) {
    if (isActive) {
      this.abutton.setInteractive().setTexture("activeButtonA");
      this.bbutton.setInteractive().setTexture("activeButtonB");
      this.abbutton.setInteractive().setTexture("activeButtonAB");
    } else {
      this.abutton.disableInteractive();
      this.bbutton.disableInteractive();
      this.abbutton.disableInteractive();
    }

    if (this.buttonInterval) {
      clearInterval(this.buttonInterval);
      if (this.activeButton) {
        this.activeButton.setTexture(this.activeButton.activeTexture);
      }
    }
    this.updatePinState(isActive);
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
    scene: [PlayGame],
  };

  new Phaser.Game(gameConfig);
};
