export function updateButtonState(isActive) {
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

  this.time.delayedCall(300, () => {
    this.updatePinState(isActive);
  });
}
