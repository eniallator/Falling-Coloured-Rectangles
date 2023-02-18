ctx.fillStyle = "black";
ctx.strokeStyle = "white";

let gradient, center;
const goldenRatio = (1 + Math.sqrt(5)) / 2;

function draw() {
  ctx.fillStyle = gradient ?? "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const numLines = paramConfig.getVal("num-lines");
  const lineRotSpeed = paramConfig.getVal("line-rotation-speed");
  const time = Date.now();

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = "10px";
  for (let i = 0; i < numLines; i++) {
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    const bias = ((i + 1) * goldenRatio) % 2;
    const sign = 2 * (i % 2) - 1;
    const angle = (i / numLines) * 2 * Math.PI;
    const point = center
      .copy()
      .add(center.copy().setAngle(sign * bias * lineRotSpeed * time + angle));

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  const maxMagnitude = center.getMagnitude();
  const numRects = paramConfig.getVal("num-rects");
  const rectSize = paramConfig.getVal("rect-size");
  const rectRotSpeed = paramConfig.getVal("rect-rotation-speed");
  const rectFallSpeed = paramConfig.getVal("rect-fall-speed");

  for (let i = 0; i < numRects; i++) {
    const bias = 0.5 + (((i + 1) * goldenRatio) % 1);
    const sign = 2 * (i % 2) - 1;
    const angle = (i / numRects) * 2 * Math.PI;
    const fallPercent = 1 - ((sign * bias * rectFallSpeed * time) % 1);
    const rectPos = center.copy().add(
      center
        .copy()
        .setAngle(sign * bias * rectRotSpeed * time + angle)
        .setMagnitude(fallPercent * maxMagnitude)
    );
    const rectColour = ((((i / numRects) * time) / 80) * goldenRatio) % 360;
    const sizeMultiplier =
      ((i / numRects) * Math.min(canvas.height, canvas.width)) / 1000;
    const timeMultiplier = Math.abs(
      bias * (((time / 10000) * goldenRatio) % 2) - 1
    );
    const width =
      rectSize / 2 + rectSize * fallPercent * timeMultiplier * sizeMultiplier;
    const height =
      rectSize / 2 +
      rectSize * fallPercent * (1 - timeMultiplier) * sizeMultiplier;
    ctx.fillStyle = `hsl(${rectColour}, 100%, 60%)`;
    ctx.fillRect(rectPos.x - width / 2, rectPos.y - height / 2, width, height);
  }

  requestAnimationFrame(draw);
}

window.resizeCallback = () => {
  center = new Vector(canvas.width / 2, canvas.height / 2);
  gradient = ctx.createRadialGradient(
    center.x,
    center.y,
    0,
    center.x,
    center.y,
    center.getMagnitude()
  );
  paramConfig
    .getVal("gradient-colours")
    .forEach((colour, i, colours) =>
      gradient.addColorStop(i / (colours.length - 1), `#${colour}`)
    );
  draw();
};

paramConfig.onLoad(window.resizeCallback);
