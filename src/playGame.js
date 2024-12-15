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
import { createResetButton, createModal, showModal } from "./resetModal.js";

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.currentTweens = [];
    this.canSpin = true;
    this.pinClickCount = 0; // 핀 클릭 카운트 변수
    this.innerResult = null; // A 룰렛 결과
    this.outerResult = null;
    this.activeButton = null; // 현재 활성화된 버튼
    this.buttonInterval = null; // 버튼 상태를 주기적으로 변경하는 타이머
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
    }); // 스프라이트 시트 로드
    this.load.audio("spinSound", "./assets/backgroundMusic.mp3");
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

    createResetButton(this);
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
      this.toggleButtonState(this.abutton, "activeButtonA", "abutton");
    });

    this.bbutton.on("pointerdown", () => {
      this.toggleButtonState(this.bbutton, "activeButtonB", "bbutton");
    });

    this.abbutton.on("pointerdown", () => {
      this.toggleButtonState(this.abbutton, "activeButtonAB", "abbutton");
    });
  }

  toggleButtonState(button, activeTexture, inactiveTexture) {
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
    }, 500); // 500ms 간격으로 텍스처 변경
  }

  onPinClick(pointer, gameObject) {
    if (gameObject.texture.key === "pin" && this.canSpin) {
      this.pinClickCount++;
      this.canSpin = false;

      this.time.delayedCall(4000, () => {
        this.canSpin = true;
      });
    }
  }

  stopWheels(callback) {
    this.time.delayedCall(4000, () => {
      this.handleStop(this.wheel1);
      this.handleStop(this.wheel2);

      this.time.delayedCall(100, callback);
    });
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
    this.canSpin = false; // 다시 스핀 가능하도록 설정
    // 폭죽 애니메이션 추가 (스프라이트 시트를 기반으로 변경)
    const spark = this.add.sprite(
      this.scale.width / 2,
      this.scale.height / 2,
      "sparkAnimation"
    );

    // 스프라이트의 크기를 화면 크기에 맞게 조정
    spark.displayWidth = this.scale.width / 1.2;
    spark.displayHeight = this.scale.height / 1.2;

    // 애니메이션 생성 및 재생
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("sparkAnimation", {
        start: 0,
        end: 84,
      }), // 5x17 = 85프레임
      frameRate: 30, // 초당 프레임
      repeat: 0, // 반복 없음
    });

    spark.play("explode"); // 애니메이션 실행

    // 2초 후 애니메이션 종료 및 초기화
    this.time.delayedCall(4000, () => {
      spark.destroy(); // 애니메이션 제거
      this.pinClickCount = 0; // 핀 클릭 카운트 초기화
      this.canSpin = true; // 다시 스핀 가능하도록 설정

      this.wheel1 = new Wheel(this, gameOptions, 0);
      this.wheel2 = new Wheel(this, secondWheelOptions, 1);
      createPin.call(this);

      // 게임 다시 시작
      this.scene.resume();
    });
  }

  showModal() {
    showModal(this);
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
      this.spinSound.play();
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
        height: 800,
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
  console.log(Phaser);
  new Phaser.Game(gameConfig);
};
