import {Buffer} from 'node:buffer';
import {decrypt} from './decrypt.mjs'

const inputPass = ''
const password = Buffer.from(inputPass, 'hex')

await decrypt(password, './MSG0.db', './MSG0.decrypt.db')
