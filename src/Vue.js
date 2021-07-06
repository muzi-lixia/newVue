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
                set(newVlaue) {
                    self._data[key] = newVlaue;
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