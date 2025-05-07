// canvas and context
let canvas;
let ctx;

// 曼德博集: z[n+1] = z[n]^2 + c, 从z_0=0开始迭代, 不发散的c属于此集合

// c的虚部取值范围
let i_max = 1.5;
let i_min = -1.5;
// c的实部取值范围 初始值不太重要,后面会改(中心点没变)
let r_min = -2.5;
let r_max = 1.5;

let max_iter = 1024; // 最大迭代次数
let escape = 1025; // 逃逸值 与上面的值无关
let palette = new Array(max_iter + 1); // 调色盘

/** 一次处理高为 canvas中的1px 的一行
 * @param {number} row
 */
function createTask(row) {
    return {
        row: row,
        width: rowData.width,
        generation: generation,
        r_min: r_min,
        r_max: r_max,
        i: i_max + (i_min - i_max) * row / canvas.height, // c的虚部(图像y轴向上,但从上往下绘制)
        max_iter: max_iter,
        escape: escape
    };
}

function makePalette() {
    /**
     * @param {number} x
     * @returns {number}
     */
    function wrap(x) {
        x = ((x + 256) & 0x1ff) - 256;
        if (x < 0) x = -x;
        return x;
    }

    for (let i = 0; i <= max_iter; i++) {
        palette[i] = [wrap(7 * i), wrap(5 * i), wrap(11 * i)];
    }
}

function drawRow(workerResults) {
    let values = workerResults.values;
    let pixelData = rowData.data;
    for (let i = 0; i < rowData.width; i++) {
        let r = i * 4;
        let g = i * 4 + 1;
        let b = i * 4 + 2;
        let a = i * 4 + 3;
        pixelData[a] = 255;
        if (values[i] < 0) {
            pixelData[r] = pixelData[g] = pixelData[b] = 0;
        } else {
            let color = palette[values[i]];
            pixelData[r] = color[0];
            pixelData[g] = color[1];
            pixelData[b] = color[2];
        }
    }
    ctx.putImageData(rowData, 0, workerResults.row);
}

function setupGraphics() {
    canvas = document.getElementById("fractal");
    ctx = canvas.getContext("2d");
    // canvas大小 = 窗口大小
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    // 取值范围 实/虚 = 宽/高
    let r_width = (i_max - i_min) * canvas.width / canvas.height; // w(计算)/h(固定) = w/h (canvas的)
    let r_mid = (r_min + r_max) / 2;
    r_min = r_mid - r_width / 2;
    r_max = r_mid + r_width / 2;
    rowData = ctx.createImageData(canvas.width, 1);
    makePalette();
}
