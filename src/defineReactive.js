import observe from "./observe";
import Dep from "./Dep";

export default function defineReactive(data, key, value) {
    const dep = new Dep();
    // console.log(data, key, arguments);
    if (arguments.length === 2) {
        value = data[key];
    }

    //子元素要进行observe，至此形成了递归，这个函数递归不是自己调用自己，而是多个函数、类循环调用
    let childOb = observe(value);

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get() {
            // console.log('访问属性 '+ key);
            //如果处于依赖收集阶段
            if (Dep.target) {
                dep.append();
                //检查子元素
                if (childOb) {
                    childOb.dep.append();
                }
            }
            return value;
        },
        set(newValue) {
            if (value === newValue) return;
            value = newValue;
            //当设置了新值，这个值也要被observe，
            // console.log('改变属性 ' + key);
            childOb = observe(newValue);
            //发布订阅模式，通知dep
            dep.notify();
        }
    })
}