import { Injectable } from '@nestjs/common'
import { join } from 'path'
import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { CodesRepository } from './codes.repository'
import { CreateCodeDto } from './dto/create-code.dto'
import { UpdateCodeDto } from './dto/update-code.dto'
import { Access } from './entities/access.entity'
import { Template } from './entities/template.entity'
import containerPtySocket from './sockets/containerPtySocket'

const randomString = (len: number = 16) => {
  let ret = ''
  const s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  while (len-- > 0) ret += s.charAt(Math.floor(Math.random() * s.length))
  return ret
}

@Injectable()
export class CodesService {
  constructor(private readonly codesRepository: CodesRepository) {}

  writeUserCodeFile(accessId: string, fileId: number, contents: string) {
    const template = this.findTemplate(this.findAccess(accessId).templateId)
    if (!Array.isArray(template?.files) || !template.files[fileId]) throw new Error('Invalid file id.')
    const filePath = template.files[fileId]
    return this.codesRepository.writeUserCodeFile(accessId, filePath, contents)
  }

  readUserCodeFile(accessId: string, fileId: number) {
    const template = this.findTemplate(this.findAccess(accessId).templateId)
    if (!Array.isArray(template?.files) || !template.files[fileId]) throw new Error('Invalid file id.')
    const filePath = template.files[fileId]
    return this.codesRepository.readUserCodeFile(accessId, filePath)
  }

  findTemplate(id: string) {
    const ret = this.codesRepository.findTemplate(id)
    return ret
  }
  findAccess(id: string) {
    const ret = this.codesRepository.findAccess(id)
    return ret
    // throw new Error('Method not implemented.')
  }

  createAccess(access: Access) {
    const accessId = randomString(16)
    this.codesRepository.saveAccess(accessId, access)
    this.createUserCodeFile(access.templateId, accessId)

    return accessId
  }
  createUserCodeFile(templateId: string, accessId: string) {
    const template = this.findTemplate(templateId)
    if (!template) throw new Error('Template not found.')
    const volumes = template?.container?.volumes
    if (Array.isArray(volumes)) {
      for (const { hostSrc } of volumes) {
        console.log('copy ', hostSrc)
        this.codesRepository.copyUserCodeDir(templateId, hostSrc, accessId)
      }
    }
  }

  bindTerminal(socket: Socket, accessId: string, actionId: number) {
    const access: Access = this.findAccess(accessId)
    const template: Template = this.findTemplate(access.templateId)
    const { container } = template
    const args = ['run', '-ti', '--rm', '--name', accessId, '-h', 'coderun']
    if (container.network) args.push('--network', container.network)
    if (container.cpus) args.push('--cpus', container.cpus.toString())
    if (container.memory) args.push('-m', container.memory)
    if (container.user) args.push('-u', container.user)
    if (container.workdir) args.push('-w', container.workdir)
    if (container.volumes) {
      const userDir = this.codesRepository.getUserCodeDir(accessId)
      for (const v of container.volumes) {
        let mountStr = `${join(userDir, v.hostSrc)}:${v.containerDest}`
        if (v.options) mountStr = `${mountStr}:${v.options}`
        args.push('-v', mountStr)
      }
    }

    args.push(container.image)
    const actionScript = template.actions[actionId].script

    if (actionScript) {
      // old
      // const tokenizes = actionScript
      //   .split(' ')
      //   .map((i) => i.trim())
      //   .filter((i) => !!i)
      // if (tokenizes.length > 0) args.push(...tokenizes)
      args.push('sh', '-c', actionScript)
    }

    containerPtySocket(socket, args)
  }
  /*
    "cpus": 0.125,
    "memory": "125m",
    "user": "root",
    "workdir": "/CODE",
    "volumes": [
      {
        "hostSrc": "/CODE",
        "containerDest": "/CODE",
        "options": "rw"
      }
    ]
*/
  runCommand = `
  podman run -ti --rm \
   --name runner -h coderun \
   --network none \
   --cpus 0.125 \
   -m 125m \
   -u root \
   -w /CODE \
   -v /home/user/dev/standalone/CODE:/CODE \
   runner:dev
  `

  findAll() {
    return `This action returns all codes`
  }

  findOne(id: number) {
    return `This action returns a #${id} code`
  }

  update(id: number, updateCodeDto: UpdateCodeDto) {
    return `This action updates a #${id} code`
  }

  remove(id: number) {
    return `This action removes a #${id} code`
  }
}
