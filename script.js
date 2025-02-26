"use strict";

const container = document.querySelector("#container");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(1, -1);

const handle = document.querySelector("#handle");

let mainAngle = 1;
let mousedown = false;

function getSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1);
  return {
    biggest: Math.max(canvas.width, canvas.height),
    smallest: Math.min(canvas.width, canvas.height),
    widthExtent: canvas.width / 2,
    heightExtent: canvas.height / 2,
    radius: Math.min(canvas.width, canvas.height) / 4,
  };
}

function positionHandle(angle = mainAngle) {
  const { biggest, smallest, radius } = getSize();
  // const c = document.body.getBoundingClientRect();
  // const h = document.body.getBoundingClientRect();
  // const thisWidth = h.width / 2;
  // const thisHeight = h.height / 2;
  const handleRadius = handle.getBoundingClientRect().height / 2;

  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  const x = radius * Math.cos(angle);
  const y = -radius * Math.sin(angle);

  handle.style.left = x + cX - handleRadius + "px";
  handle.style.top = y + cY - handleRadius + "px";
}

function drawCircle() {
  const { biggest, smallest, widthExtent, heightExtent, radius } = getSize();
  const sin = Math.sin(mainAngle);
  const cos = Math.cos(mainAngle);

  // background
  ctx.fillStyle = "#E9E6E8";
  ctx.fillRect(-widthExtent, -heightExtent, canvas.width, canvas.height);

  // border
  ctx.strokeStyle = "#D3CED1";
  ctx.beginPath();
  ctx.moveTo(-widthExtent, -radius);
  ctx.lineTo(widthExtent, -radius);
  ctx.moveTo(-widthExtent, radius);
  ctx.lineTo(widthExtent, radius);
  ctx.moveTo(-radius, -heightExtent);
  ctx.lineTo(-radius, heightExtent);
  ctx.moveTo(radius, -heightExtent);
  ctx.lineTo(radius, heightExtent);
  ctx.closePath();
  ctx.stroke();

  // circle
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.stroke();

  // axes
  ctx.beginPath();
  ctx.moveTo(-widthExtent, 0);
  ctx.lineTo(widthExtent, 0);
  ctx.moveTo(0, -heightExtent);
  ctx.lineTo(0, heightExtent);
  ctx.closePath();
  ctx.stroke();

  // angle
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(radius * cos, radius * sin);
  ctx.closePath();
  ctx.stroke();

  // sec and csc

  const cosAbs = cos / Math.abs(cos);
  const sinAbs = sin / Math.abs(sin);
  const csc = 1 / cos;
  const cscY = Math.sqrt((radius * csc) ** 2 - radius ** 2) * sinAbs;
  const sec = 1 / sin;
  const secX = Math.sqrt((radius * sec) ** 2 - radius ** 2) * cosAbs;

  ctx.strokeStyle = "#EEA243";
  ctx.beginPath();
  ctx.moveTo(radius * cos, radius * sin + 1);
  ctx.lineTo(radius * cosAbs, cscY + 1);
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = "#5E239D";
  ctx.beginPath();
  ctx.moveTo(radius * cos, radius * sin - 1);
  ctx.lineTo(secX, sinAbs * radius - 1);
  ctx.closePath();
  ctx.stroke();

  // sin and cos
  ctx.strokeStyle = "#FF4870";
  ctx.beginPath();
  ctx.moveTo(0, radius * sin);
  ctx.lineTo(radius * cos, radius * sin);
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = "#02A9EA";
  ctx.beginPath();
  ctx.moveTo(radius * cos, 0);
  ctx.lineTo(radius * cos, radius * sin);
  ctx.closePath();
  ctx.stroke();

  // tangent
  ctx.strokeStyle = "#FF66B3";
  const tan = sin / cos;
  const absTanX = Math.abs(cos) + Math.sqrt(tan ** 2 - sin ** 2);
  const tanX = cos >= 0 ? absTanX : -absTanX;
  ctx.beginPath();
  ctx.moveTo(radius * cos, radius * sin);
  ctx.lineTo(radius * tanX, 0);
  ctx.closePath();
  ctx.stroke();
}

function getAngleFromMouse(e) {
  if (!mousedown) return;
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  const x = mouseX - cX;
  const y = mouseY - cY;

  const boundedAngle = -Math.atan(y / x);
  const angle = x >= 0 ? boundedAngle : boundedAngle + Math.PI;

  positionHandle(angle);
  updateDetails(angle);
}

function updateDetails(angle) {
  mainAngle = angle < 0 ? angle + Math.PI * 2 : angle;
  const sin = Math.sin(mainAngle);
  const cos = Math.cos(mainAngle);
  const tan = Math.sin(mainAngle);
  const { radius } = getSize();
  drawCircle();

  // console.log(`sin: ${Math.sin(mainAngle)}\ncos: ${Math.cos(mainAngle)}\ntan: ${Math.tan(mainAngle)}`);
}

function updateCircle() {
  setTimeout(() => drawCircle(), 1);
  positionHandle(mainAngle);
}

window.addEventListener("mousemove", getAngleFromMouse);
window.addEventListener("mouseup", putMouseUp);
handle.addEventListener("mousedown", putMouseDown);
window.addEventListener("resize", updateCircle);

function putMouseUp() {
  mousedown = false;
}

function putMouseDown() {
  mousedown = true;
}

positionHandle();
drawCircle();
