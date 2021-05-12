<template>
  <el-popover
          ref="$pop"
          placement="bottom-start"
          trigger="click"
          :title="title"
          :content="content" >
    <i class="el-icon-loading" v-if="!content" />
  </el-popover>
</template>

<script>
    let dom_ = require('element-ui/lib/utils/dom');

    export default  {
        name:  'CMPopover',
        data(){
            return {
                title:'',
                content:''
            }
        },
        created(){
            this.show = _.debounce(this.show,300)
            Object(dom_['on'])(document.body,'click',this.close)
        },
        destroyed(){
            Object(dom_['off'])(document.body,'click',this.close)
        },
        methods:{
            close(){
                this.$refs.$pop.doClose();
            },
            show(options){
                if(!options.$el){
                    return;
                }else{
                    options.$el.onclick = (e) => { e.stopPropagation() }
                    Object.assign(this,{
                        title:options.title,
                        content:''
                    })
                }
                //
                let $pop = this.$refs.$pop;
                if($pop.showPopper){
                    $pop.doClose();
                }else{
                    this.$refs.$pop.referenceElm = options.$el;
                    this.$refs.$pop.doShow();
                    // load
                    if(typeof options.content === 'function'){
                        options.content((data)=>{
                            this.content = data;
                        })
                    }else{
                        this.content = options.content;
                    }
                }
            }
        }
    }
</script>
