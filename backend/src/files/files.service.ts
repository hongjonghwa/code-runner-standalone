import { Injectable } from '@nestjs/common'

import { readFileSync, readdir, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'
const promisify = require('util').promisify
const readdirPromise = promisify(readdir)

const WORK_DIR = '/home/user/dev/gits/standalone/CODE'

@Injectable()
export class FilesService {
  readFile(path: string) {
    return readFileSync(join(WORK_DIR, path)).toString('utf-8')
  }

  writeFile(path: string, contents: string) {
    writeFileSync(join(WORK_DIR, path), contents)
    return true
  }

  size(path: string) {
    return statSync(WORK_DIR + path).size
  }

  contents(path: string) {
    return readFileSync(join(WORK_DIR, path)).toString('utf-8')
  }

  read(fileName: string) {
    return readFileSync(join(WORK_DIR, fileName)).toString('utf-8')
  }

  async list(): Promise<string[]> {
    let names: string[]
    try {
      names = await readdirPromise(WORK_DIR)
    } catch (err) {
      console.log(err)
    }
    if (names === undefined) {
      // console.log('undefined')
    } else {
      // console.log('First Name', names[0])
    }
    console.log('return', names)
    return names
  }

  async files(dir: string): Promise<object[]> {
    let names: string[]
    try {
      names = await readdirPromise(WORK_DIR + dir)
    } catch (err) {
      console.log(err)
    }
    if (names === undefined) {
      return []
      // console.log('undefined')
    }

    return names.map((i) => ({ name: i, path: `${dir}${i}` }))
  }
}
