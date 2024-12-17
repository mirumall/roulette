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
