import "frida-il2cpp-bridge";

Il2Cpp.perform(() => {
  console.log("Unity version:", Il2Cpp.unityVersion);

  // 全局跟踪
  Il2Cpp.trace()
    .assemblies(Il2Cpp.domain.assembly("Assembly-CSharp"))
    .filterClasses((classes) => {
      if (classes.namespace.startsWith("Live2D")) return false;
      if (classes.namespace.startsWith("I2.Loc")) return false;
      if (classes.namespace.startsWith("TKFrame")) return false;
      if (classes.namespace.startsWith("TKAction")) return false;
      if (classes.fullName === "Italic") return false;
      if (classes.namespace.startsWith("NTween")) return false;
      console.log("fullName", classes.fullName, "namespace", classes.namespace);
      return true;
    })
    .and()
    .attach();

  // 用户数据管理类
  const UserDataMgr = Il2Cpp.domain
    .assembly("Assembly-CSharp")
    .image.class("UserDataMgr");

  // 金币
  UserDataMgr.method("UpdateUserCoin").implementation = function (
    changeCount,
    isImmediatelyUpdateUI,
  ) {
    changeCount = ptr(99999);
    this.method("UpdateUserCoin").invoke(changeCount, isImmediatelyUpdateUI);
  };
  // 钻石
  UserDataMgr.method("UpdateUserDiamond").implementation = function (
    changeCount,
    isImmediatelyUpdateUI,
  ) {
    changeCount = 999;
    this.method("UpdateUserDiamond").invoke(changeCount, isImmediatelyUpdateUI);
  };

  // 店铺解锁
  UserDataMgr.method("GetStoreUnlocked").implementation = (gameType) => {
    console.log("获取店铺解锁状态", gameType);
    return true;
  };

  // 关卡状态枚举
  const MultipleChoice = Il2Cpp.domain
    .assembly("Assembly-CSharp")
    .image.class("LevelState");
  const Star3 = MultipleChoice.field<Il2Cpp.ValueType>("Star3").value;
  console.log(Star3);

  // 关卡解锁
  UserDataMgr.method("GetLevelState").implementation = function (x) {
    if (this.toString().startsWith("UserDataMgr")) {
      const ret = this.method("GetLevelState").invoke(101);
      //  // 对原始返回值进行打印,ok是模块中封装的打印函数，也可以直接使用consloe.log
      //  console.log(ret.toString(),"ret:" + ret, typeof ret, Object.keys(ret), ret.handle, ret.type, Object.keys(ret.type), ret.type.handle);
      if (ret.toString() !== "Star3") {
        return Star3;
      }
      return ret;
    }
  };

  // // .filterMethods(method => method.isStatic && method.returnType.equals(UserDataMgr.type) && !method.isExternal)

  // const SecurityStreams = Il2Cpp.domain.assembly("UnityEngine").image.class("Debug");

  // Il2Cpp.trace(true).classes(SecurityStreams).and().attach();

  // const PlayerPrefs = Il2Cpp.domain.assembly("Assembly-CSharp").image.class("UnityEngine.PlayerPrefs");
  // Il2Cpp.trace().classes(PlayerPrefs)
  // .filterMethods(method => method.isStatic && method.returnType.equals(UserDataMgr.type) && !method.isExternal)
  // .and().attach();
  // const UserDefaults = Il2Cpp.domain.assembly("Assembly-CSharp").image.class("UserDefaults");
  // const AdMgr = Il2Cpp.domain.assembly("Assembly-CSharp").image.class("AdMgr");
  // const CustomerMgr = Il2Cpp.domain.assembly("Assembly-CSharp").image.class("CustomerMgr");
  // const HttpMgr = Il2Cpp.domain.assembly("Assembly-CSharp").image.class("HttpMgr");
  //
  //
  // // Il2Cpp.trace(true).classes(UserDefaults)
  // // .filterMethods(method => method.isStatic && method.returnType.equals(UserDataMgr.type) && !method.isExternal)
  // // .and().attach();
  //
  // Il2Cpp.trace().classes(UserDataMgr)
  //     // .filterMethods(method => method.isStatic && method.returnType.equals(UserDataMgr.type) && !method.isExternal)
  //     .and().attach();
  // Il2Cpp.trace(true).classes(AdMgr)
  //     .filterMethods(method => method.isStatic && method.returnType.equals(AdMgr.type) && !method.isExternal)
  //     .and().attach();
  // Il2Cpp.trace(true).classes(CustomerMgr)
  //     // .filterMethods(method => method.isStatic && method.returnType.equals(CustomerMgr.type) && !method.isExternal)
  //     .and().attach();
  // Il2Cpp.trace(true).classes(HttpMgr)
  //     .filterMethods(method => method.isStatic && method.returnType.equals(HttpMgr.type) && !method.isExternal)
  //     .and().attach();
  //
  // Il2Cpp.trace(true).classes(UserDataMgr).filterMethods(
  //     method => method.name == "CheckUserDiamondIsEnough"
  //     // || method.name == "GetLevelState"
  // ).and().attach();

  // Il2Cpp.trace(true).classes(UserDataMgr).filterMethods(method => {
  //     console.log("method: " + method.name );
  //     return method.name != "RestoreClientByServerData"
  // }).and().attach();
  // :UpdateUserEnergy

  // UserDataMgr.method("GetGuideIdIsDone").implementation = function () {
  //     // 利用invoke回调原函数，获取原始返回值
  //     // const ret = this.method("CheckIsForbidin").invoke();
  //     // 对原始返回值进行打印,ok是模块中封装的打印函数，也可以直接使用consloe.log
  //     // console.log("params:" + x);
  //     // console.log("ret:" + ret);
  //     // 修改返回值
  //     const ret = this.method("GetLevelState").invoke(1142);
  //     console.log("ret111:" + ret,Object.keys(ret),ret.type);
  //     return true;
  // }

  // UserDataMgr.method("GetLevelState").implementation = function (gameType) {
  //     console.log("获取关卡解锁状态", gameType)
  //     return 1;
  // }

  //
  // UserDefaults.method("GetInt").implementation = function (key, defaultValue) {
  //     switch (key.toString()) {
  //         // 免费大转盘剩余次数
  //         case "\"Da_Zhuan_Pan_Free_Count\"":
  //             return 0;
  //         //
  //         // case "\"User_Coin_Count\"":
  //         //     return 999999;
  //         // case "\"User_Diamond_Count\"":
  //         //     return 999999;
  //         default:
  //             // 解锁所有关卡 (WIP)
  //             if (key.toString().startsWith("\"Level_State")) {
  //                 return 0;
  //             }
  //             if(key.toString().startsWith("\"Achievement_")){
  //                 return 2;
  //             }
  //
  //             if(key.toString().startsWith("\"Upgrade_Item_")){
  //                 return 2;
  //             }
  //     }
  //     const ret = this.method("GetInt").invoke(key, defaultValue);
  //     if(key.toString().startsWith("\"Purchaser_Wait_Time\"")){
  //         return ret
  //     }
  //     console.log(key, ret, typeof ret)
  //     return ret;
  // }

  //
  // UserDataMgr.method("GetLevelState").implementation = function (levelIndex) {
  //     console.log(typeof levelIndex)
  //     levelIndex = 101
  //     // console.log("获取关卡状态", levelIndex)
  //     const ret = this.method("GetLevelState").invoke(levelIndex)
  //     // console.log("关卡",levelIndex,ret)
  //     return ret;
  // }

  // Il2Cpp.trace(true).classes(UserDataMgr).filterMethods(method => method.name == "GetUserCoin").and().attach();
  // dump.cs 中的函数原型 System.Boolean IsCarUnlocked(); // 0x0207595c
  // UserDataMgr.method("GetUserCoin").implementation = function () {
  //     // 利用invoke回调原函数，获取原始返回值
  //     this.method("UpdateUserCoin").invoke(9999999, true);
  //     // // 对原始返回值进行打印,ok是模块中封装的打印函数，也可以直接使用consloe.log
  //     // 修改返回值
  //     return 999;
  // }
  // 获取Assembly-CSharp.dll
  //     const Assembly = Il2Cpp.domain.assembly("Assembly-CSharp").image
  //     // 获取CarSelector类
  //     const CarSelector = Assembly.class("HttpMgr")
  // // console.log(CarSelector)
  //     // it traces method calls and returns
  //     Il2Cpp.trace()
  //         .classes(CarSelector)
  //         // .filterMethods(method => method.isStatic && method.returnType.equals(CarSelector.type) && !method.isExternal)
  //         .and()
  //         .attach();

  // 获取Assembly-CSharp.dll
  // 获取CarSelector类
  //     const DebugSelector = Assembly.class("UnityEngine")
  // // console.log(CarSelector)
  //     // it traces method calls and returns
  //     Il2Cpp.trace()
  //         .classes(DebugSelector)
  //         // .filterMethods(method => method.isStatic && method.returnType.equals(CarSelector.type) && !method.isExternal)
  //         .and()
  //         .attach();
  //     const UserDataMgr = Assembly.class("UserDataMgr")
  // console.log(CarSelector)
  // it traces method calls and returns
  // Il2Cpp.trace()
  //     .classes(UserDataMgr)
  //     // .filterMethods(method => method.isStatic && method.returnType.equals(CarSelector.type) && !method.isExternal)
  //     .and()
  //     .attach();

  // detailed trace, it traces method calls and returns and it reports every parameter
  // Il2Cpp.trace(true)
  //     .assemblies(Assembly.assembly)
  //     .filterClasses(klass => klass.namespace == "UserDataMgr")
  //     // .filterParameters(param => param.type.equals(CarSelector) && param.name == "msg")
  //     // .and()
  //     // .assemblies(Il2Cpp.corlib.assembly)
  //     // .filterMethods(method => method.name.toLowerCase().includes("begin"))
  //     .and()
  //     .attach();
});
