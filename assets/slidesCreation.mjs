import { formingPyramidRefs } from "./effect.mjs";

const scale = 3;
const dot = 0.5;
const CONST_DIMENS = 150;

function createCanvasElement(width, height, createCanvas) {
  let canvasNew;
  if (typeof window === "undefined") {
    canvasNew = createCanvas(width, height);
  } else {
    canvasNew = document.createElement("canvas");
    canvasNew.setAttribute("width", width);
    canvasNew.setAttribute("height", height);
  }
  return { canvas: canvasNew, width, height };
}

function canvasClearBackground(ctx, canvas, width, height) {
  // console.log(canvas, width, height)
  ctx.beginPath();
  ctx.fillStyle = "#fff"; // `rgba(255, 255, 255, 255)`
  ctx.fillRect(0, 0, width, height /* canvas.width, canvas.height */);
  ctx.stroke();
  return ctx;
}

function drawOnePointCanvas(ctx, data, transp) {
  ctx.beginPath();
  if (data.val < 200) ctx.strokeStyle = `rgba(0, 0, 200, ${transp})`;
  if (data.val > 100) ctx.strokeStyle = "rgba(200, 0, 0, 0)"; // ${/*transp*/})`
  const x = data.x * scale + 10;
  const y = data.y * scale + 10;
  ctx.moveTo(x + 1 * dot * scale, y);
  ctx.arc(x, y, 1 * dot * scale, 0, Math.PI * 2, true);
  ctx.stroke();
}

function drawCanvasLoop(data, createCanvas) {
  const feDataImgs = [];
  const { canvas, width, height } = createCanvasElement(
    CONST_DIMENS * scale + 20,
    CONST_DIMENS * scale + 20,
    createCanvas
  );

  if (canvas.getContext) {
    let ctx = canvas.getContext("2d");
    let step = data.length - 1;
    ctx = canvasClearBackground(ctx, canvas, width, height);

    while (step > 3) {
      ctx = canvasClearBackground(ctx, canvas, width, height);
      for (let i = step - 3; i <= step; i++) {
        try {
          data[i].forEach((point) => {
            drawOnePointCanvas(ctx, point, 0.4);
          });
        } catch {}
      }
      step--;
      if (data[step].length > 10) {
        const dataCanv = canvas.toDataURL("image/jpeg", 1.0);
        feDataImgs.push({ data: dataCanv, name: step, ctx: canvas });
      }
    }
  }
  return feDataImgs;
}

async function canvasToPyramidArr(imDat /* , createCanvas*/, callback) {
  const some = document.getElementById("process-info");
  const createCanvas = createCanvasElement;
  const pointsArr = [];
  let ii;
  let jj;
  for (let i = 0; i < imDat.data.length; i += 4) {
    ii = (i / 4) % CONST_DIMENS;
    jj = Math.trunc(i / 4 / CONST_DIMENS);
    pointsArr.push({
      x: ii,
      y: jj,
      val: imDat.data[i],
      sta: "f",
    });
  }
  // console.log("formingPyramidRefs");
  //callback("formingPyramidRefs"); //.apply();
  // document.getElementById("process-info").innerText = "info6y56yc56hc6";
  const pyramidRefsData = await formingPyramidRefs(pointsArr);
  // console.log("drawCanvasLoop");
  // callback("drawCanvasLoop");
  const drawCanvasLoopRes = drawCanvasLoop(pyramidRefsData, createCanvas);
  // console.log("done", callback);
  // callback("done");
  return drawCanvasLoopRes;
}

function resizeCanvasImage(img, width, height, createCanvas) {
  const canvasNew = createCanvasElement(
    CONST_DIMENS,
    CONST_DIMENS,
    createCanvas
  ).canvas;
  const ctxNew = canvasNew.getContext("2d");
  ctxNew.drawImage(img, 0, 0, width, height, 0, 0, CONST_DIMENS, CONST_DIMENS);
  return ctxNew.getImageData(0, 0, CONST_DIMENS, CONST_DIMENS);
}

export { canvasToPyramidArr, createCanvasElement, resizeCanvasImage };
