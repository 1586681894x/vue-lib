
// TODO 省事
class Rules {

  constructor(){
    this.map = {
      // ============= self ====================
      // 姓名
      name:(opt)=>{
        return { pattern: /^[\u4E00-\u9FA5]{2,4}$/, message: opt.msg || "请输入正确的中文姓名", trigger: 'change' }
      },
      // code
      code:(opt)=>{
        return { pattern: /^[A-Za-z\d][A-Za-z\d\_]*$/, message: opt.msg || "请输入字母、数字、下划线, 首字符必须为字母或数字", trigger: 'change' }
      },
      // code
      nickname:(opt)=>{
        return { pattern: /^[A-Za-z\d|\u4E00-\u9FA5][A-Za-z\d\_|\u4E00-\u9FA5]*$/, message: opt.msg || "请输入汉字、字母、数字、下划线, 且不能以下划线开头", trigger: 'change' }
      },
      // 企业名称: 中文+字母
      enterpriseName:(opt)=>{
        return { pattern: /^[\u4e00-\u9fa5\(\)（）\da-zA-Z&]{2,50}$/gi, message: opt.msg || "请输入正确的企业名称", trigger: 'change' }
      },
      // ============= common ==================
      // 账户名
      username:(opt)=>{ return { validator:Username(opt), trigger: 'change' } },
      // 邮箱
      email:(opt)=>{
        return { pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, message: opt.msg || "请输入正确的邮箱", trigger: 'change' }
      },
      // 银行卡号
      accountBankNum:(opt)=>{ return { validator:Bank(opt), trigger: 'change' } },
      // 统一社会信用码
      creditNum:(opt)=>{
        return { pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{15})$/, message: opt.msg || "请输入正确的统一社会信用码", trigger: 'change' }
      },
      // 身份证号
      idcardNum:(opt)=>{
        return { pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: opt.msg || "请输入正确的身份证号码", trigger: 'change' }
      },
      // 手机号
      mobile:(opt)=>{
        return { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: opt.msg || "请输入正确的手机号码", trigger: 'change' }
      },
      // 车牌验证
      vehicleNum:(opt)=>{
        return { pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1,2}$/, message: opt.msg || '请输入正确的车牌号', trigger: 'change' }
      },
      // 验证码
      isValidCode:(opt)=>{
        return { pattern: /^\d{6}$/, message: opt.msg || "验证码格式错误", trigger: 'change' }
      },
      // 数字校验 {max,min,maxIn,minIn,fixed,msg}
      isNum:(opt)=>{ return { validator:IsNum(opt), trigger: 'change' } },
      // 字符校验 {max,min,msg}
      isStr:(opt)=>{ return { validator:IsStr(opt), trigger: 'change' } },
      //
      required:(opt)=>{
        return { required: true, message: opt.msg || '必填项', trigger: "change" }
      },
    }
  }

  // get(['xxx','xxx'],[])
  get = (arr,extend)=>{
    let res = [] , map = this.map;
    arr.forEach((v)=>{
      let rule = typeof v === 'string' ? {name:v} : v;
      res.push(map[rule.name](rule))
    })
    Array.prototype.push.apply(res,extend)
    //
    return res;
  }
}

export default new Rules();


// 字符校验 {max,min,msg}
function IsStr(opt){
  return (rule,val,callback)=>{
    if(_.isEmpty(val)){
      callback();
      return;
    }
    if(!_.isNil(opt.max) && val.length>opt.max-0){
      callback(new Error(opt.msg || `字符长度不大于${opt.max}.`))
      return;
    }
    if(!_.isNil(opt.min) && val.length<opt.min-0){
      callback(new Error(opt.msg || `字符长度不小于${opt.min}.`))
      return;
    }
    callback();
  }
}
// 数字校验 {max,min,maxIn,minIn,fixed,msg}
function IsNum(opt){
  return (rule,val,callback)=>{
    if(_.isEmpty(val)){
      callback();
      return;
    }
    if(!_.isNil(opt.max) && val>opt.max-0){
      callback(new Error(opt.msg || `数字不大于${opt.max}.`))
      return;
    }
    if(!_.isNil(opt.min) && val<opt.min-0){
      callback(new Error(opt.msg || `数字不小于${opt.min}.`))
      return;
    }
    if(!_.isNil(opt.maxIn) && val>=opt.maxIn-0){
      callback(new Error(opt.msg || `数字不大于等于${opt.maxIn}.`))
      return;
    }
    if(!_.isNil(opt.minIn) && val<=opt.minIn-0){
      callback(new Error(opt.msg || `数字不小于等于${opt.minIn}.`))
      return;
    }
    //
    if(opt.fixed){
      if(RegExp(`\\.\\d{${opt.fixed+1},}`).test(val)){
        callback(new Error(opt.msg || `数字后保留${opt.fixed}位.`))
        return;
      }
      if(!/^\d+(\.\d+)?$/.test(val)){
        callback(new Error(opt.msg || `请输入数字`));
        return;
      }
    }else{
      if(!/^\d+$/.test(val)){
        callback(new Error(opt.msg || `请输入数字`));
        return;
      }
    }
    callback();
  }
}
// 账户名校验 {max,min,first}
function Username(opt){
  return (rule,val,callback)=>{
    if(_.isEmpty(val)){
      callback();
      return;
    }
    if(!_.isNil(opt.max) && val.length>opt.max){
      callback(new Error(`字符长度小于${opt.max}位.`))
      return;
    }
    if(!_.isNil(opt.min) && val.length<opt.min){
      callback(new Error(`字符长度小于${opt.min}位.`))
      return;
    }
    if(!/^[a-zA-Z0-9]/.test(val)){
      callback(new Error(`首字符必须为字母或数字.`))
      return;
    }
      if(!/^\w+$/.test(val) || /^\d+$/.test(val)){
      callback(new Error(`请输入字母、数字、下划线, 不可全为数字.`));
      return;
    }
    callback();
  }
}
// 银行卡校验 {onSuccess}
// { pattern: /^([1-9]{1})(\d{14,15}|\d{17,18})$/, message: opt.msg || "请输入正确的银行卡号", trigger: 'change' }
function Bank(opt){
  let firstArr = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99';
  return (rule,val,callback)=>{
    if(_.isEmpty(val)){
      callback();
      return;
    }
    if(!/^([1-9]{1})(\d{14,15}|\d{17,18})$/.test(val)){
      callback(new Error(`银行卡号格式不对.`));
      return;
    }
    if(firstArr.indexOf(val.substring(0,2))==-1){
      callback(new Error(`银行卡号开头6位不符合规范.`));
      return;
    }
    // if(!luhmCheck(val)){ // ：中国银行借记卡不符合Luhn校验
    //   callback(new Error(`银行卡号有误，不符合Luhn校验.`));
    //   return;
    // }
    opt.onSuccess && opt.onSuccess(bankCardAttribution(val));
    callback();
  }
}



