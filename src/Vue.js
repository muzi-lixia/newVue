/*
* vue响应式原理四个步骤：
*   1、实现一个监听器Observe，对数据对象进行遍历，包括子属性对象的属性，
*     利用Object.defineProperty()对对象都加上getter和setter，如此，给对象赋值，就能触发getter，监听到数据的变化
*   2、实现一个解析器Compile，解析vue模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，
*     并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据变动，收到通知，通知更新函数进行数据更新
*   3、实现一个订阅者Watcher，Watcher是Observe和Compile之间的通信桥梁，主要的任务是订阅Observe中属性变化的消息
*     当收到属性值变化的消息，触发解析器Compile中对应的更新函数
*   4、实现一个订阅器Dep，订阅器采用发布-订阅模式，用来收集Watcher，对监听器Observe和解析器Compile实现统一管理
* */

import Compile from "./Compile";
import observe from "./observe";
import Watcher from "./Watcher";

export default class Vue {
    constructor(options) {
        // console.log(options);
        //把参数存为$options
        this.$options = options || {};
        //数据
        this._data = options.data || undefined;
        //监听数据
        observe(this._data);
        //默认数据要变为响应式的
        this.initData();
        // this.initComputed();
        //调用默认的Watcher
        this.initWatch();
        //模板编译
        new Compile(options.el, this);
    }
    initData() {
        let self = this;
        Object.keys(this._data).forEach(key => {
            Object.defineProperty(self, key, {
                get() {
                    return self._data[key];
                },
                set(newValue) {
                    self._data[key] = newValue;
                }
            })
        })
    }
    initWatch() {
        let self = this;
        let watch = this.$options.watch;
        Object.keys(watch).forEach(key => {
            new Watcher(self, key, watch[key]);
        })
    }
}