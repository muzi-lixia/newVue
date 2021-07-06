
import { def } from "./utils";
import defineReactive from "./defineReactive";
import { arrayMethods } from './array'
import observe from "./observe";
import Dep from './Dep'
export default class Observer {
    constructor(value) {
        //每一个Observer实例身上，都有一个dep实例
        this.dep = new Dep();
        //给实例（this, 这里的this不是类本身，而是实例）添加了__ob__属性，值是这次new的实例
        def(value, '__ob__', this, false);
        //Observer的目的是将一个正常的object转换为每个层级的属性都是响应式（可被侦测）的object
        //检查当前是数组还是Object
        if (Array.isArray(value)) {
            //如果是数组，则强行将数组原型指向arrayMethods
            Object.setPrototypeOf(value, arrayMethods);
            //让这个数组变得observe
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }
    //遍历object的每一个属性，通过Object.defineProperty添加为响应式
    walk(value){
        for (let key in value) {
            defineReactive(value, key);
        }
    }
    //数组的特殊遍历
    observeArray(arr) {
        for (let i = 0, l = arr.length; i < l; i ++ ){
            observe(arr[i]);
        }
    }
}