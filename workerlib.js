function computeRow(task) {
    // myLog("computeRow task param: 应无 values", task);
    let iter = 0;
    const c_i = task.i;
    let c_r;
    const max_iter = task.max_iter;
    const escape = task.escape * task.escape;
    task.values = [];
    for (let i = 0; i < task.width; i++) {
        c_r = task.r_min + (task.r_max - task.r_min) * i / task.width;
        let z_r = 0, z_i = 0;
        // 逃逸测试
        for (iter = 0; z_r * z_r + z_i * z_i < escape && iter < max_iter; iter++) {
            // z <- z^2 + c
            let z_rtmp = z_r * z_r - z_i * z_i + c_r;
            z_i = 2 * z_r * z_i + c_i;
            z_r = z_rtmp;
        }
        if (iter === max_iter) {
            iter = -1; // 属于集合(未逃逸)
        }
        task.values.push(iter); // 根据"逃逸时间"绘制
    }
    // myLog("computeRow task return: 应有 values", task);
    return task;
}