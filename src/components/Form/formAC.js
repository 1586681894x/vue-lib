export function ColumnOptions(sc){// column select-options-init
    let column = sc.column;
    let n = column.name, v = column.value, options = column.options;
    let { getTxt,setValue } = sc;
    let setFirstValue = (list = [])=>{
        if(_.isNil(v)){// 默认值
            v = list[0]?.dictValue
            if(column.props?.multiple){
                v = [v];
            }
        }
        //
        sc.opt.options = list;
        setValue(v);
    }
    //
    _.extend(sc.opt,column,{options:[]});
    if(typeof options === 'string'){// 自加载
        getTxt(options,(data)=>{
            setFirstValue(data);
        })
    }else if(typeof options === 'function'){
        options((data)=>{
            setFirstValue(data);
        })
    }else{
        setFirstValue(options);
    }
}

