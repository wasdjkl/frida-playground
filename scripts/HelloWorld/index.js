const frida = require('frida')
const target = "./project/cmake-build-debug/HelloWorld.exe";
const scriptFile = "./hook/MessageBox.js";
const fs = require('fs')

function onProcessCrashed() {
  console.log("进程崩溃")
}

function onSessionDetached() {
  console.log("会话结束")
  process.exit()
}

function onMessage(message) {
  console.log("脚本消息:", message)
}

async function sleep(delay){
  await new Promise(resolve => setTimeout(resolve, delay))
}

async function init() {
  // 获取 本机 设备
  const device = await frida.getLocalDevice()
  // 创建进程
  const pid = await device.spawn(target)
  // 附加进程
  const session = await device.attach(pid)
  // 脱离进程事件
  session.detached.connect(onSessionDetached)
  // 进程崩溃事件
  device.processCrashed.connect(onProcessCrashed)
  // 脚本内容
  const fridaAgent = fs.readFileSync(scriptFile).toString()
  // 创建脚本实例
  const script = await session.createScript(fridaAgent)
  // 脚本消息事件
  script.message.connect(onMessage)
  // 加载脚本
  await script.load()
  // 恢复进程继续运行
  await device.resume(pid)
}

init().then()
