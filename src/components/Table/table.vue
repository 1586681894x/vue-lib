<template>
  <div class="table" v-loading="options.loading" >
    <el-table :data="options.data" height="100px" stripe v-bind="$attrs" v-on="$listeners">
      <template  v-for="(item,idx) in columns" >
        <!-- common -->
        <el-table-column v-if="showCol(item,'true')" :key="idx" show-overflow-tooltip v-bind="{...item}" ></el-table-column>
        <!-- component-global -->
        <component v-else-if="showCol(item,'cm')" :is="item.template" :column="item" />
        <!-- component-slot -->
        <slot v-else-if="showCol(item,'slot')" :name="item.template" :column="item" />
        <!-- operation -->
        <!--<el-table-column v-else-if="showCol(item,'_')" :key="idx"-->
           <!--class-name="small-padding fixed-width" fixed="right" show-overflow-tooltip v-bind="{...item}" >-->
          <!--<template slot-scope="scope">-->
            <!--<el-button v-show="false" />-->
            <!--<el-button size="mini" plain-->
                       <!--v-for="(button,buttonIdx) in item.options" :key="`${item.prop}_${buttonIdx}`"-->
                       <!--:type="button.type || 'primary'"-->
                       <!--:icon="button.icon"-->
                       <!--@click="button.onClick(scope.row)"-->
                       <!--v-hasPermi="button.hasPermi"-->
                       <!--v-show="!button.onShow || button.onShow(scope.row)"-->
            <!--&gt;-->
              <!--<svg-icon v-if="button.iconClass" class="button_icon" :icon-class="button.iconClass" />-->
              <!--{{button.text}}-->
            <!--</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column v-else-if="showCol(item,'_')" :key="idx"
                         class-name="small-padding fixed-width" show-overflow-tooltip v-bind="{...item}" >
          <template slot-scope="scope">
            <el-button size="mini" circle
                       v-for="(button,buttonIdx) in item.options" :key="`${item.prop}_${buttonIdx}`"
                       v-bind="button.props"
                       @click="button.onClick(scope.row)"
                       v-show="!button.onShow || button.onShow(scope.row)"
            >
              <i :class="`iconfont ${button.icon}`" />
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <Pagination
      v-if="options.total>0"
      :total="options.total"
      :page.sync="options.pageNum"
      :limit.sync="options.pageSize"
      @pagination="$listeners.getList"
    />
  </div>
</template>

<script>
  export default {
      name:'Table',
      props:{
          columns:{
            type:Array
          },
          options:{
            type:Object
          }
      },
      methods:{
          showCol(column,name){
            return this.getType(column) === name;
          },
          getType:(item)=>{
            let type = '';
            if(item.hidden){
                return type
            }
            //
            if(item.template?.indexOf('CM')==0){
                type = 'cm';
            }else if(item.template){
                type = 'slot';
            }else if(item.prop === '_'){
                type = '_';
            }else{
                type = 'true'
            }
            return type;
          }
      }
  }
</script>
