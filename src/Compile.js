import Watcher from "./Watcher";

export default class Compile {
    constructor(el, vue) {
        //vue实例
        this.$vue = vue;
        //挂载点
        this.$el = document.querySelector(el)
        //如果用户传入了挂载点
        if (this.$el) {
            //调用函数，让节点变为fragment，类似于mustache中的tokens，实际上用的是AST，这里是轻量级的fragment
            let $fragment = this.node2Fragment(this.$el);
            //编译
            this.compile($fragment);
            //替换好的内容上树
            this.$el.appendChild($fragment);
        }
    }
    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        let child;
        //让所有节点都进入fragment
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }
    compile(el) {
        //得到子元素
        let childNodes = el.childNodes;
        let self = this;
        let reg = /\{\{(.*)\}\}/;
        //遍历节点
        childNodes.forEach(node => {
            let text = node.textContent;
            if (node.nodeType === 1) {
                self.compileElement(node);
            } else if (node.nodeType === 3 && reg.test(text)) {
                //文本节点
                let word = text.match(reg)[1];
                self.compileText(node, word);
            }
        });
    }
    compileElement(node) {
        //这里不是将HTML结构看作字符串，而是真正的属性列表
        let nodeAttributes = node.attributes;
        let self = this;
        //将类数组对象转为数组
        [].slice.call(nodeAttributes).forEach(attr => {
            //这里就解析指令
            let attrName = attr.name;
            let value = attr.value;
            //指令都是以v-开头
            let dir = attrName.substring(2);
            //看看是不是指令
            if (attrName.indexOf('v-') === 0) {
                if (dir === 'model') {
                    new Watcher(self.$vue, value, value => {
                        node.value = value;
                    });
                    node.value = self.getVueValue(self.$vue, value);
                    node.addEventListener('input', e => {
                        let newValue = e.target.value;
                        self.setVueValue(self.$vue, value, newValue);
                        node.value = newValue;
                    })
                }else if (dir === 'for') {

                } else if (dir === 'if') {

                }
            }
        })
    }
    compileText(node, name) {
        //拿到数据
        node.textContent = this.getVueValue(this.$vue, name);
        new Watcher(this.$vue, name, value => {
            node.textContent = value;
        });
    }
    getVueValue(vue, exp) {
        //拿值
        //拆分表达式，’obj.a.b
        let val = vue;
        exp = exp.split('.');
        exp.forEach(key => {
            val = val[key];
        });
        return val;
    }
    setVueValue(vue, exp, value) {
        //设置值
        let val = vue;
        exp = exp.split('.');
        exp.forEach((key, index) => {
            if (index < exp.length - 1) {
                val = val[key];
            }else {
                val[key] = value;
            }
        });
    }
}