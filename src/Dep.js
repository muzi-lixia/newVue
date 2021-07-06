let uid = 0;
export default class Dep {
    constructor() {
        // console.log('我是Dep构造器');
        this.id = uid ++;
        //用数组存储自己的订阅者，就是存放的Watcher的实例
        this.subs = [];
    }
    //添加订阅
    addSub (sub) {
        this.subs.push(sub);
    }
    //添加依赖
    append(){
        //Dep.target就是自己指定的全局的一个位置，且是唯一的，没有歧义，使用Window.target也行
        if (Dep.target) {
            this.addSub(Dep.target);
        }
    }
    notify() {
        // console.log('notify被触发了');
        //浅克隆一份
        const subs = this.subs.slice();
        for (let i = 0, l = subs.length; i<l; i++){
            subs[i].update();
        }
    }
}