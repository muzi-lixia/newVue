
// delete方法

export default function _delete(target, key) {
    // 判断是否为数组
    if (Array.isArray(target)) {
        target.splice(key, 1);
        return 
    }

    const ob = target.__ob__;

    // 对象本身没有这个属性就直接返回
    if (!(key in target)) return;

    // 否则，删除这个属性
    delete target[key]

    // 判断是否是响应式对象, 不是则直接返回
    if (!ob) return;

    // 是响应式，则通知视图更新
    ob.dep.notify();
}