export function spinInfinite(wheel, direction) {
  this.time.delayedCall(300, () => {
    wheel.direction = direction;
    wheel.rotationTween = this.tweens.add({
      targets: wheel.wheelContainer,
      angle: "+=" + direction * 360,
      duration: 300,
      ease: "Linear",
      repeat: -1,
    });
  });
}
export function readResult(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "ko-KR";
    utterance.pitch = 1.3;
    utterance.rate = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("이 브라우저는 SpeechSynthesis를 지원하지 않습니다.");
  }
}

export function updatePinState(isActive) {
  if (isActive) {
    this.pin.setTexture("unpin");
  } else {
    this.pin.setTexture("pin");
  }
}

export function handleStop(wheel) {
  let finalAngle = wheel.wheelContainer.angle % 360;
  if (finalAngle < 0) finalAngle += 360;

  let prizeIndex = this.getPrizeIndex(finalAngle, wheel.options.slices);
  let prizeText = wheel.options.slices[prizeIndex].text;

  if (wheel === this.wheel1) {
    this.prizeTextA.setText(prizeText);
    this.innerResult = prizeText;
    this.readResult(prizeText);
  } else if (wheel === this.wheel2) {
    this.prizeTextB.setText(prizeText);
    this.outerResult = prizeText;
    this.readResult(prizeText);
  }
}
