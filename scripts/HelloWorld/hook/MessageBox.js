// ; Imports from USER32.dll
// ;
// ; int (__stdcall *MessageBoxA)(HWND hWnd, LPCSTR lpText, LPCSTR lpCaption, UINT uType)

const pMessageBoxA = Module.findExportByName("user32.dll", 'MessageBoxA')
const pText = Memory.allocAnsiString("该对话框已被劫持，同时接下来的按任意键暂停会变成运行计算器")
const pCaption = Memory.allocAnsiString("已劫持")
Interceptor.attach(pMessageBoxA, {
  onEnter: function (args) {
    console.log("[+] MessageBoxA");
    console.log("¦- hWnd: " + args[0]);
    console.log("¦- lpText: " + args[1].readAnsiString());
    console.log("¦- lpCaption: " + args[2].readAnsiString());
    console.log("¦- uType: " + args[3] + "\n");
    args[1] = pText
    args[2] = pCaption
  }, onLeave: function (retval) {
    console.log(retval);
  }
});

// ; int (__cdecl *system)(const char *Command)
const pSystem = Module.findExportByName("msvcrt.dll", 'system')
// 防止垃圾回收
const command = Memory.allocUtf8String("calc.exe");
Interceptor.attach(pSystem, {
  onEnter: function (args) {
    console.log("[+] system");
    console.log("¦- command: " + args[0].readAnsiString());
    args[0] = command;
    console.log("¦- new command: " + args[0].readAnsiString());
  }, onLeave: function (retval) {
    console.log(retval);
  }
});
