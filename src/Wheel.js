import Phaser from "phaser";
import { gameOptions } from "./gameOptions.js";

export class Wheel {
  constructor(scene, options, index) {
    this.scene = scene;
    this.options = options;
    this.index = index;
    this.createWheel();
  }

  createWheel() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const wheelRadius = this.options.wheelRadius;
    const yOffset = 100;

    this.wheelContainer = this.scene.add.container(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 + yOffset
    );

    let startDegrees = -90;
    this.options.slices.forEach((slice) => {
      this.drawSlice(graphics, slice, startDegrees, wheelRadius);
      startDegrees += slice.degrees;
    });

    graphics.generateTexture(
      `wheel${this.index}`,
      (wheelRadius + gameOptions.strokeWidth) * 2,
      (wheelRadius + gameOptions.strokeWidth) * 2
    );

    const wheel = this.scene.add.sprite(0, 0, `wheel${this.index}`);
    this.wheelContainer.add(wheel);

    if (this.index === 0) {
      this.addSliceTexts(startDegrees, wheelRadius);
    } else {
      this.addSecondWheelTexts(startDegrees, wheelRadius);
      this.wheelContainer.setDepth(-1);
    }
  }

  drawSlice(graphics, slice, startDegrees, wheelRadius) {
    const color = Phaser.Display.Color.ValueToColor(slice.color);
    graphics.fillStyle(color.color, 1);
    graphics.slice(
      wheelRadius + gameOptions.strokeWidth,
      wheelRadius + gameOptions.strokeWidth,
      wheelRadius,
      Phaser.Math.DegToRad(startDegrees),
      Phaser.Math.DegToRad(startDegrees + slice.degrees),
      false
    );
    graphics.fillPath();
  }

  addSliceTexts(startDegrees, wheelRadius) {
    startDegrees = -90;
    const totalSlices = this.options.slices.length;
    this.options.slices.forEach((slice) => {
      if (!slice.text) return;

      const textX =
        (wheelRadius - 140) *
        Math.cos(Phaser.Math.DegToRad(startDegrees + slice.degrees / 2));
      const textY =
        (wheelRadius - 140) *
        Math.sin(Phaser.Math.DegToRad(startDegrees + slice.degrees / 2));

      let fontSize = "18px";
      if (slice.text.length >= 15) {
        fontSize = "14px";
      }

      const text = this.scene.add.text(textX, textY, slice.text, {
        fontSize: fontSize,
        fontFamily: "jalnan2",
        color: "#000000",
        fontWeight: "bold",
      });

      text.setOrigin(0.6);
      text.setAngle(startDegrees + slice.degrees / 2 + 180);
      this.wheelContainer.add(text);

      startDegrees += slice.degrees;
    });
  }

  addSecondWheelTexts(startDegrees, wheelRadius) {
    const textRadius = wheelRadius - 22;

    this.options.slices.forEach((slice) => {
      if (!slice.text) return;

      const arcAngle = slice.degrees;
      const textAngle = startDegrees + arcAngle / 2;
      const color = slice.textColor || "#000000";

      const font = this.getFont(slice);

      this.drawPhaserCurvedText(
        slice.text,
        textRadius,
        textAngle,
        arcAngle,
        font,
        color
      );

      startDegrees += arcAngle;
    });
  }

  getFont(slice) {
    if (slice.degrees < 40 && slice.text.length >= 10) {
      return "12px jalnan2";
    } else if (slice.degrees == 40 && slice.text.length >= 13) {
      return "14px jalnan2";
    } else if (slice.degrees > 40 && slice.text.length >= 14) {
      return "14px jalnan2";
    } else {
      return "20px jalnan2";
    }
  }

  drawPhaserCurvedText(text, radius, startAngle, arcAngle, font, color) {
    const charArray = text.split("");
    const totalArc = Phaser.Math.DegToRad(arcAngle);

    const baseSpacingFactor = 1;
    const dynamicSpacingFactor =
      arcAngle > 60
        ? Math.max(0.4, baseSpacingFactor - ((arcAngle - 60) / 90) * 4)
        : baseSpacingFactor;
    const spacingFactor =
      charArray.length < 10
        ? Math.min(dynamicSpacingFactor, 1)
        : dynamicSpacingFactor;

    const spaceFactor = 0.2;
    const minCharAngle = Phaser.Math.DegToRad(1);
    const maxCharAngle = Phaser.Math.DegToRad(4);

    const charAngle = Math.min(
      maxCharAngle,
      Math.max(minCharAngle, (totalArc / charArray.length) * spacingFactor)
    );
    const totalTextArc = charAngle * charArray.length;

    let currentAngle =
      Phaser.Math.DegToRad(startAngle) - totalTextArc / 2.2 + charAngle / 2;

    charArray.forEach((char) => {
      if (char === " ") {
        currentAngle += charAngle * spaceFactor;
        return;
      }

      const x = radius * Math.cos(currentAngle);
      const y = radius * Math.sin(currentAngle);

      const charText = this.scene.add.text(x, y, char, {
        font: font,
        color: color,
      });

      charText.setOrigin(0.5);
      charText.setAngle(Phaser.Math.RadToDeg(currentAngle) + 90);

      this.wheelContainer.add(charText);

      currentAngle += charAngle;
    });
  }

  positionSliceAt12(slice) {
    const sliceIndex = this.options.slices.findIndex(
      (s) =>
        s.degrees === slice.degrees &&
        s.color === slice.color &&
        s.text === slice.text
    );
    if (sliceIndex !== -1) {
      const angleOffset = 360 - sliceIndex * slice.degrees;
      this.setRotation(angleOffset);
    }
  }

  setRotation(angle) {
    this.scene.tweens.add({
      targets: this.wheelContainer,
      angle: angle,
      duration: 1000,
      ease: "Cubic.easeOut",
    });
  }
}
