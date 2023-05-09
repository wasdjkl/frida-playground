// 参考自: https://mp.weixin.qq.com/s/4DbXOS5jDjJzM2PN0Mp2JA
import {Buffer} from 'node:buffer';
import {createDecipheriv, pbkdf2Sync, createHmac} from 'node:crypto';
import {open, readFile} from 'node:fs/promises';
import chalk from 'chalk'

const SQLITE_FILE_HEADER = Buffer.concat([Buffer.from("SQLite format 3"), Buffer.alloc(1)]);
const KEY_SIZE = 32
const DEFAULT_PAGESIZE = 4096
const DEFAULT_ITER = 64000
const algorithm = 'aes-256-cbc'

async function decipherPage(file, buffer, key) {
  const decipher = createDecipheriv(algorithm, key, buffer.slice(-48, -32));
  // https://github.com/nodejs/node/issues/2794#issuecomment-139436581
  decipher.setAutoPadding(false);
  const tt = decipher.update(buffer.slice(0, -48))
  decipher.final()
  await file.write(tt);
  await file.write(buffer.slice(-48))
}

async function decrypt(password, inputPath, outputPath) {
  const inputFile = await readFile(inputPath);
  const salt = inputFile.slice(0, 16);
  const key = pbkdf2Sync(password, salt, DEFAULT_ITER, KEY_SIZE, 'sha1');
  const first = inputFile.slice(16, DEFAULT_PAGESIZE);
  let mac_salt = new Uint8Array(salt.length);
  for (let i = 0; i < salt.length; i++) {
    mac_salt[i] = salt[i] ^ 58;
  }
  const mac_key = pbkdf2Sync(key, mac_salt, 2, KEY_SIZE, 'sha1');
  const hmac = createHmac('sha1', mac_key);
  hmac.update(first.slice(0, -32));
  let buffer = new ArrayBuffer(4);
  let view = new DataView(buffer);
  view.setInt32(0, 1, true);
  let byteArray = new Uint8Array(buffer);
  hmac.update(byteArray);
  if (Buffer.compare(hmac.digest(), first.slice(-32, -12)) === 0) {
    console.log(chalk.bgGreen('🎉 解密成功! '))
  } else {
    console.log(chalk.bgRed('🎉 解密失败! '))
    return false;
  }
  const pages = [];
  for (let i = DEFAULT_PAGESIZE; i < inputFile.length; i += DEFAULT_PAGESIZE) {
    pages.push(inputFile.slice(i, i + DEFAULT_PAGESIZE));
  }
  const file = await open(outputPath, 'w')
  file.write(SQLITE_FILE_HEADER)
  await decipherPage(file, first, key)
  for (const page of pages) {
    await decipherPage(file, page, key)
  }
  file.close()
  return true;
}

export {decrypt};
