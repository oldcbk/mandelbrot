let numberOfWorkers = 8;
let workers = new Array(8);
let rowData;

onload = init;

onresize = function () {
    resizeToWindow();
}

function resizeToWindow() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let w = (i_max - i_min) * canvas.width / canvas.height;
    let r_mid = (r_max + r_min) / 2;
    r_min = r_mid - w / 2;
    r_max = r_mid + w / 2;
    rowData = ctx.createImageData(canvas.width, 1);
    startWorkers();
}

function init() {
    setupGraphics();
    canvas.onclick = function (ev) {
        handleClick(ev.clientX, ev.clientY);
    };

    for (let i = 0; i < numberOfWorkers; i++) {
        let worker = new Worker("worker.js");
        worker.onmessage = function (ev) {
            processWork(ev.data, ev.target);
        }
        worker.idle = true;
        workers[i] = worker;
    }
    startWorkers();
}

function handleClick(x, y) {
    let w = r_max - r_min;
    let h = i_min - i_max;
    let click_r = r_min + w * x / canvas.width;
    let click_i = i_max + h * y / canvas.height;
    let zoom = 8;
    r_min = click_r - w / zoom;
    r_max = click_r + w / zoom;
    i_max = click_i - h / zoom;
    i_min = click_i + h / zoom;
    startWorkers();
}

let nextRow = 0;
let generation = 0;

function startWorkers() {
    ++generation;
    nextRow = 0;

    for (let i = 0; i < workers.length; ++i) {
        let worker = workers[i];
        if (worker.idle) {
            let task = createTask(nextRow);
            // myLog("startWorkers createTask: 应无 values", task)
            worker.idle = false;
            worker.postMessage(task);
            ++nextRow;
        }
    }
}

function processWork(workerResult, worker) {
    drawRow(workerResult);
    reassignWorker(worker);
}

function reassignWorker(worker) {
    let row = nextRow++;
    if (row >= canvas.height) {
        worker.idle = true;
    } else {
        let task = createTask(row);
        worker.idle = false;
        worker.postMessage(task);
    }
}
