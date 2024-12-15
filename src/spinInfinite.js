export function spinInfinite(wheel, direction, speed) {
  this.time.delayedCall(300, () => {
    wheel.direction = direction;
    wheel.rotationTween = this.tweens.add({
      targets: wheel.wheelContainer,
      angle: "+=" + direction * 360,
      duration: speed,
      ease: "Linear",
      repeat: -1,
    });
  });
}
