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

      this.updateButtonState(false);
      this.spinInfinite(this.wheel1, 1, 450);
    }
  });

  this.bbutton.on("pointerdown", () => {
    if (this.canSpin) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

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
