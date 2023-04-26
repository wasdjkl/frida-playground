Java.perform(function () {
  // 模块名称
  const moduleName = "libil2cpp.so";
  // 函数偏移地址
  // RVA: 0x9A7504 Offset: 0x9A7504 VA: 0x9A7504
  // public int GetUserDiamond() { }
  const functionOffset = "0x9A7504";
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
      // console.log("method args:", args)
    },
    onLeave: function (retval) {
      console.log('method onLeave')
      console.log("method retval:", retval)
      retval.replace(new NativePointer(99999));
    }
  });
});
