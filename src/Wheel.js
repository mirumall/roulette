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
    let graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    let wheelRadius = this.options.wheelRadius;
    let yOffset = 100; // Y 좌표 오프셋 추가

    this.wheelContainer = this.scene.add.container(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 + yOffset // Y 좌표에 오프셋 추가
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

    let wheel = this.scene.add.sprite(0, 0, `wheel${this.index}`);
    this.wheelContainer.add(wheel);

    if (this.index === 0) {
      this.addSliceTexts(startDegrees, wheelRadius);
    } else {
      this.addSecondWheelTexts(startDegrees, wheelRadius);
      this.wheelContainer.setDepth(-1);
    }
  }

  drawSlice(graphics, slice, startDegrees, wheelRadius) {
    let color = Phaser.Display.Color.ValueToColor(slice.color);
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
    this.options.slices.forEach((slice) => {
      if (!slice.text) return;

      let textX =
        (wheelRadius - 140) * // 텍스트를 더 안쪽으로 배치
        Math.cos(Phaser.Math.DegToRad(startDegrees + slice.degrees / 2));
      let textY =
        (wheelRadius - 140) * // 텍스트를 더 안쪽으로 배치
        Math.sin(Phaser.Math.DegToRad(startDegrees + slice.degrees / 2));

      if (slice.image) {
        let imageX =
          (wheelRadius - 70) * // 이미지를 더 바깥쪽으로 배치
          Math.cos(Phaser.Math.DegToRad(startDegrees + slice.degrees / 2.7));
        let imageY =
          (wheelRadius - 60) * // 이미지를 더 바깥쪽으로 배치
          Math.sin(Phaser.Math.DegToRad(startDegrees + slice.degrees / 2));

        let image = this.scene.add.image(imageX, imageY, slice.image);
        image.setScale(0.04); // 이미지 크기 조정
        image.setOrigin(0.7);
        image.setAngle(startDegrees + slice.degrees / 2 + 190);
        this.wheelContainer.add(image);
      }

      let text = this.scene.add.text(textX, textY, slice.text, {
        fontSize: "14px",
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
    let textRadius = wheelRadius - 22; // 텍스트가 위치할 반지름
    let font = "20px jalnan2"; // 텍스트의 폰트 스타일

    this.options.slices.forEach((slice) => {
      if (!slice.text) return;

      let arcAngle = slice.degrees; // 슬라이스 각도
      let textAngle = startDegrees + arcAngle / 2; // 슬라이스 중심 각도
      let color = slice.textColor || "#000000"; // 텍스트 색상

      // 텍스트를 곡선으로 그리기
      this.drawPhaserCurvedText(
        slice.text,
        textRadius,
        textAngle,
        arcAngle,
        font,
        color
      );

      startDegrees += arcAngle; // 다음 슬라이스의 시작 각도로 이동
    });
  }

  drawPhaserCurvedText(text, radius, startAngle, arcAngle, font, color) {
    const charArray = text.split(""); // 텍스트를 문자 배열로 분리
    const totalArc = Phaser.Math.DegToRad(arcAngle); // 슬라이스의 전체 호 길이(라디안)

    // 문자 간 간격을 동적으로 계산
    const baseSpacingFactor = 1; // 기본 간격
    const dynamicSpacingFactor =
      arcAngle > 60
        ? Math.max(0.4, baseSpacingFactor - ((arcAngle - 60) / 90) * 3) // 넓은 슬라이스의 간격 줄임
        : baseSpacingFactor;

    let spacingFactor =
      charArray.length < 7
        ? Math.min(dynamicSpacingFactor, 0.8) // 문자가 적을수록 간격 더 줄임
        : dynamicSpacingFactor;

    const spaceFactor = 0.35; // 공백 간격 비율 (문자 간격 대비)
    const minCharAngle = Phaser.Math.DegToRad(1.5); // 최소 문자 간 간격
    const maxCharAngle = Phaser.Math.DegToRad(10); // 최대 문자 간 간격

    // 문자 간 각도 계산
    const charAngle = Math.min(
      maxCharAngle,
      Math.max(minCharAngle, (totalArc / charArray.length) * spacingFactor)
    );

    // 전체 텍스트가 차지하는 각도 계산
    const totalTextArc = charAngle * charArray.length;

    // 텍스트 시작 각도를 슬라이스 중심에 맞게 보정
    let currentAngle =
      Phaser.Math.DegToRad(startAngle) - totalTextArc / 2.2 + charAngle / 2;

    charArray.forEach((char) => {
      // 공백 처리
      if (char === " ") {
        currentAngle += charAngle * spaceFactor; // 공백 간격만 차지하고 넘어감
        return;
      }

      const x = radius * Math.cos(currentAngle); // X 좌표 계산
      const y = radius * Math.sin(currentAngle); // Y 좌표 계산

      // Phaser 텍스트 객체로 추가
      let charText = this.scene.add.text(x, y, char, {
        font: font,
        color: color,
      });

      charText.setOrigin(0.5); // 중심 정렬
      charText.setAngle(Phaser.Math.RadToDeg(currentAngle) + 90); // 곡선 방향에 맞춰 회전

      this.wheelContainer.add(charText); // 텍스트를 컨테이너에 추가

      currentAngle += charAngle; // 다음 문자 위치로 이동
    });
  }

  // 특정 슬라이스를 12시 방향에 위치시키는 메서드
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
    // 룰렛의 회전 각도를 설정하는 로직 구현
    this.scene.tweens.add({
      targets: this.wheelContainer,
      angle: angle,
      duration: 1000,
      ease: "Cubic.easeOut",
    });
  }
}
