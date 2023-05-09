const moduleName = 'WeChatWin.dll';
const module = Process.enumerateModules().find(module => module.name === moduleName)
console.log("模块地址：", module.base);
// 手机号特征码 31 是 手机号第一位 1
const pattern = '0F 00 00 00 31 ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? 00 00 00 00 00 0b 00 00 00 0f';

function readMemory(address, offset) {
  const tmpAddress = address.add(parseInt(offset, 16));
  return tmpAddress + '  ' + tmpAddress.readUtf8String()
}

function toHexString(byteArray) {
  return Array.from(new Uint8Array(byteArray)).map(byte => {
    return ('0' + byte.toString(16)).slice(-2)
  }).join('').toUpperCase()
}

Memory.scan(module.base, module.size, pattern, {
  onMatch: function (address, size) {
    address = address.add(parseInt('4', 16))
    console.log('Memory.scan() found match at', address);
    console.log("手机号：", readMemory(address, '0'))
    console.log("国家：", readMemory(address, '30'))
    console.log("省份：", readMemory(address, '48'))
    console.log("城市：", readMemory(address, '60'))
    console.log("昵称：", readMemory(address, '90'))
    console.log("账户名：", readMemory(address, '430'))
    const byteArray = address.add(parseInt('40C', 16)).readPointer().readByteArray(32);
    console.log("密钥：", toHexString(byteArray))
    // console.log(hexdump(address.readByteArray(9999), {length: 9999, ansi: true, header: false}))
    return 'stop';
  }
})
