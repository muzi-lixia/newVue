import defineReactive from "../defineReactive";

// set方法
export default function _set(target, key, value) {
    // 判断是否是数组
    if (Array.isArray(target)) {
        // 判断数组长度大小
        target.length = Math.max(target.length, key);
        // 执行splice方法
        target.splice(key, 1, value);
        return value
    }

    const ob = target.__ob__;
    
    // 如果此对象不是响应式对象，则直接返回
    if (key in target && !(key in target.prototype) || !ob) {
        target[key] = value;
        return value;
    }

    // 否则新增属性，并添加响应式
    defineReactive(target, key, value);
    return value;
}
