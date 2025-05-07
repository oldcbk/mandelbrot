/**
 * 我感觉console.log可能会延迟执行(相对于代码中写定的位置),导致引用的数据可能已经被修改了
 * @param desc - 直接log的内容
 * @param data - 要深拷贝的数据
 */
function myLog(desc, data) {
    const copy = structuredClone(data);
    console.log(desc, copy);
}