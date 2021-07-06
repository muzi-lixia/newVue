// 数组可以监听访问到，但是并不能监听改变
// vue底层 改写数组的7种方法 [push, pop, shift, unshift, splice, sort, reverse]

// 1. 得到数组原型
import {def} from "./utils";

const arrayPrototype = Array.prototype;

//2. 以Array.prototype为原型创建arrayMethods对象
export const arrayMethods = Object.create(arrayPrototype);

const methodsNeedChange = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

methodsNeedChange.forEach(methodName => {
    //1. 备份原来的方法, 即保存push、pop等7种方法的功能
    const origin = arrayPrototype[methodName];

    //2. 定义新的方法
    def(arrayMethods, methodName, function () {
        //3. 恢复原来的功能， this的执行上下文为数组，因为是数组在打点调用
        const result = origin.apply(this, arguments);
        /*
        * （开始）此处操作是因为push、unshift、splice三种方法比较特殊，
        *  它可以往数组中插入新的项，要让这些新插入的项也是可监听的，即可被observe
        * */
        //1. 把数组上的__ob__属性取出来， 为什么数组被添加了__ob__属性？
        // 因为数组肯定不是最高层，比如obj.g属性是数组,obj肯定不是数组，第一次遍历obj对象第一层的时候，
        // 就已经给对象中的每一项添加了__ob__属性，也就是给g属性添加了__ob__属性
        const ob = this.__ob__;
        let inserted = [];
        //因为 arguments是类数组对象，原型没有slice方法，所以需要将类数组对象变为数组
        let args = [...arguments];
        switch (methodName) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                //splice的格式是 splice(下标，数量，插入的新项)
                inserted = args.slice(2);
                break;
        }
        //判断有没有插入的新项，如果有，也让它变为可observe（响应的）的
        if (inserted) {
            ob.observeArray(inserted)
        }
        ob.dep.notify();
        /*（结束）*/
        // console.log('啦啦啦啦');
        return result;
    }, false);
});