
// nextTick
// 回调函数
let callbacks = []
let pending = false

function flushCallbacks() {
    // 把标志位还原为false
    pending = false;
    // 依次执行回调
    for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](i);
    }
}

/* 
* 采用 微任务 并按照 优先级 优雅降级 的方式实现异步刷新
*/
let timerFunc;
if (typeof Promise !== 'undefined') {
    // 支持Promise
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
    }
} else if (typeof MutationObserver !== 'undefined') {
    // MutationObserver 主要是监听dom变化 也是一个异步方法
    let counter = 1;
    const observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
        characterData: true
    });
    timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    }
} else if (typeof setImmediate !== 'undefined') {
    // 如果前边都不支持，判断setImmediate是否支持
    timerFunc = () => {
        setImmediate(flushCallbacks);
    }
} else {
    // 最后降级采用setTimeout
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    }
}

export default function _nextTick(cb) {
    callbacks.push(cb);
    if (!pending) {
        pending = true;
        timerFunc();
    }
}
