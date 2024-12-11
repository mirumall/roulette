import Phaser from 'phaser';
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
import { spinWheel } from "./spinWheel.js";
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
  }

  preload() {
    this.load.image("pin", "./assets/button.png");
    this.load.image("unpin", "./assets/unButton.png");
    this.load.image("abutton", "./assets/button_a.png");
    this.load.image("bbutton", "./assets/button_b.png");
    this.load.image("abbutton", "./assets/button_ab.png");
    this.load.image("activeButtonA", "./assets/active_button_a.png");
    this.load.image("activeButtonB", "./assets/active_button_b.png");
    this.load.image("activeButtonAB", "./assets/active_button_ab.png");
    this.load.audio("spinSound", "./assets/spinSound.mp3");
    this.load.audio("backgroundMusic", "./assets/backgroundMusic.mp3");
  }

  create() {
    this.wheel1 = new Wheel(this, gameOptions, 0); 
    this.wheel2 = new Wheel(this, secondWheelOptions, 1);
    createPin.call(this);
    createPrizeText.call(this);
    createButtons.call(this);

    this.backgroundMusic = this.sound.add("backgroundMusic", {
      loop: true,
      volume: 0.5
    });
    this.backgroundMusic.play();


    this.spinSound = this.sound.add("spinSound", {
      loop: true,
    });

    createResetButton(this);
    createModal(this);

    const brandText = this.add.text(this.scale.width / 2, this.scale.height - 150, '생활 속 감성 브랜드 미루', {
      fontSize: '30px',
      color: '#000000',
      align: 'center'
    }).setOrigin(0.5);

    this.input.on('gameobjectdown', this.onPinClick, this);
  }

  onPinClick(pointer, gameObject) {
    if (gameObject.texture.key === 'pin' && this.canSpin) {
      this.pinClickCount++;
      this.canSpin = false; 
      console.log(`핀 클릭 횟수: ${this.pinClickCount}`);
  
     
      if (this.pinClickCount >= 30) {
        this.stopWheels(() => {
          this.showGameOver(); 
        });
      }else {
        // 룰렛을 돌리고 나서 다시 canSpin을 true로 설정
        this.time.delayedCall(4000, () => {
          this.canSpin = true;
        });
      }
    }
  }
  
  
  

  stopWheels(callback) {
    this.time.delayedCall(4000, () => {
      this.handleStop(this.wheel1);
      this.handleStop(this.wheel2); 
  
      this.time.delayedCall(100, callback);
    });
  }
  

  showGameOver() {

    this.add.text(this.scale.width / 2, this.scale.height / 2, 'Game Over', {
      fontSize: '64px',
      color: '#ff0000',
      align: 'center'
    }).setOrigin(0.5);

    this.scene.pause(); 
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

  handleStop(wheel) {
    handleStop.call(this, wheel);


    if (this.spinSound.isPlaying) {
      this.spinSound.stop();
    }

    this.updateButtonState(true); 
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

  spinInfinite(wheel, direction) {
    spinInfinite.call(this, wheel, direction);
    if (!this.spinSound.isPlaying) {
      this.spinSound.play();
    }
  }

  spinWheel(directions, ...wheels) {
    spinWheel.call(this, directions, ...wheels);
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
      parent: 'thegame',
    },
    backgroundColor: '#d7d7d7',
    scene: [playGame], 
  };
  console.log(Phaser);
  new Phaser.Game(gameConfig);
};

