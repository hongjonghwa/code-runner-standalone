import { Injectable } from '@nestjs/common'
import { CreateCodeDto } from './dto/create-code.dto'

import { readFileSync, readdir, readdirSync, statSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'fs'
import { join } from 'path'
import { Access } from './entities/access.entity'
import { Template } from './entities/template.entity'

const fsRoot = join(process.cwd(), '../var')
const accessDir = join(fsRoot, 'access')
const userDir = join(fsRoot, 'user')
const logDir = join(fsRoot, 'log')
const templateDir = join(process.cwd(), '../templates')

@Injectable()
export class CodesRepository {
  getTemplateDir(templateId: string) {
    return join(templateDir, templateId)
  }

  getUserCodeDir(accessId: string) {
    return join(userDir, accessId)
  }

  copyUserCodeDir(templateId: string, hostSrc: any, accessId: string) {
    const srcDir = join(this.getTemplateDir(templateId), hostSrc)
    //const destDir = join(userDir, accessId, hostSrc)
    const destDir = join(this.getUserCodeDir(accessId), hostSrc)

    const isExists = existsSync(destDir)
    if (!isExists) mkdirSync(destDir, { recursive: true })
    cpSync(srcDir, destDir, { recursive: true })
  }
  readUserCodeFile(accessId: string, filePath: string) {
    const path = join(this.getUserCodeDir(accessId), filePath)
    return readFileSync(path).toString('utf-8')
  }

  writeUserCodeFile(accessId: string, filePath: any, contents: string) {
    const path = join(this.getUserCodeDir(accessId), filePath)
    writeFileSync(path, contents)
    return true
  }

  findTemplate(id: string) {
    return JSON.parse(readFileSync(join(templateDir, id, 'index.json')).toString()) as Template
  }
  findAccess(id: string) {
    return JSON.parse(readFileSync(join(accessDir, `${id}.json`)).toString()) as Access
  }
  saveAccess(accessId: string, access: Access) {
    const isExists = existsSync(accessDir)
    if (!isExists) mkdirSync(accessDir, { recursive: true })
    writeFileSync(join(accessDir, `${accessId}.json`), JSON.stringify(access))
  }

  test() {
    return 'test'
  }
}
