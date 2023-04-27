// RVA: 0x9A821C Offset: 0x9A821C VA: 0x9A821C
// public void UpdateUserDiamond(int changeCount, bool isImmediatelyUpdateUI) { }
// void __fastcall UserDataMgr__UpdateUserDiamond(
//     UserDataMgr_o *this,
//     int32_t changeCount,
//     bool isImmediatelyUpdateUI,
// const MethodInfo *method)

Java.perform(function () {
  // 模块名称
  const moduleName = "libil2cpp.so";
  // 函数偏移地址
  const functionOffset = "0x9A821C";
  // 获取模块
  const module = Process.getModuleByName(moduleName)
  // 模块信息
  console.log("name: ", module.name);
  console.log("base: ", module.base);
  console.log("size: ", ptr(module.size));
  // 转为函数地址
  const addr = module.base.add(functionOffset);
  // 获取函数入口
  const func = new NativePointer(addr.toString());
  console.log('[+] hook ' + func.toString())

  // 函数 Hook
  Interceptor.attach(func, {
    onEnter: function (args) {
      console.log('method onEnter')
      console.log("参数1 int32_t changeCount : ", args[1])
      console.log("参数2 bool isImmediatelyUpdateUI : ", args[2])
      args[1] = ptr(99999) // 0x1869f
      args[2] = ptr(1) // 0x1
      console.log("参数1 修改后 int32_t changeCount : ", args[1])
      console.log("参数2 修改后 bool isImmediatelyUpdateUI : ", args[2])
    }
  });
});
