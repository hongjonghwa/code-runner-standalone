import { exec } from 'child_process'
import { IPty } from 'node-pty'
import { Socket as WSocket } from 'socket.io'
const pty = require('node-pty') // Global States.
// const terminals = {}
// const unsentOutput = {}
// const temporaryDisposable = {}

// ! TODO : interactive shell 이 아니면, 출력을 마치고 websocket 을 종료해야 한다.

// const runCommand = `
// podman run -ti --rm \
//  --name runner -h coderun \
//  --network none \
//  --cpus 0.125 \
//  -m 125m \
//  -u root \
//  -w /CODE \
//  -v /home/user/dev/standalone/CODE:/CODE \
//  runner:dev
// `
// const runCommandArray = runCommand
//   .split(' ')
//   .map((i) => i.trim())
//   .filter((i) => !!i)

const containerPtySocket = (ws: WSocket, executeArgs: string[]) => {
  let login = false

  // ws.once('disconnection', (reason) => {
  //   console.log(`[ptySocket] DISCONNECTING: ${reason}`)
  //   login = false
  // })
  const killContainer = () => {
    const containerName = executeArgs[executeArgs.findIndex((i) => i === '--name') + 1]
    {
      exec(`podman kill ${containerName}`, (error, stdout, stderr) => {
        if (error) {
          // 컨테이너 없음(이미 종료)
          console.log(`[killContainer] error: ${error.message}`)
          return
        }
        if (stderr) {
          console.log(`[killContainer] stderr: ${stderr}`)
          return
        }
        // 강제 종료
        console.log(`[killContainer] stdout: ${stdout}`)
      })
    }
  }

  const joint = () => {
    const env = Object.assign({}, process.env)
    env['COLORTERM'] = 'truecolor'
    // env['PS1'] = 'w e[0;31m$e[m '
    // env['TERM'] = 'xterm-color'
    // const env = {
    //   COLORTERM: 'truecolor',
    // }

    console.log('podman ' + executeArgs.join(' '))
    const ptyProcess: IPty = pty.spawn(
      // 'podman',
      // ['run', '-t', '-i', '--rm', '--name', 'ubuntu', 'docker.io/library/ubuntu:22.04'],
      'podman',
      executeArgs,
      {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        // cwd: process.env.PWD,
        // cwd: '/home/user/dev/standalone/CODE',
        env: env,
        encoding: null, // or 'utf8'
      },
    )
    console.log('[containerPtySocket] procees spawned : ' + ptyProcess.pid)

    ws.once('disconnect', (reason) => {
      // socket close..
      console.log(`1[containerPtySocket] disconnect: ${reason}`, ptyProcess.pid)
      killContainer()
      ptyProcess.kill()

      //ptyProcess.kill('SIGKILL') // bash -c 'bash' 형식일 때 process 가 종료되지 않는다.
    })
    ws.on('error', (errMsg) => {
      console.log(`[containerPtySocket] ws error: ${errMsg}`, ptyProcess.pid)
      // conn.end()
      ws.disconnect(true)
      killContainer()
      ptyProcess.kill()
    })

    // ws.on('control', (controlData) => {
    //   console.log(`[ptySocket] control: ${controlData}`)
    // })

    ws.on('resize', (data) => {
      ptyProcess.resize(data.cols, data.rows)
      // term.setWindow(data.rows, data.cols)
      // console.log(`[containerPtySocket] resize`, data)
    })
    ws.on('data', (data) => {
      ptyProcess.write(data)
    })

    ptyProcess.onData((data: any) => {
      // console.log('pty ondata', data.toString('utf-8'))
      ws.emit('data', data.toString('utf-8'))
    })

    ptyProcess.onExit(({ exitCode, signal }) => {
      // node-pty 프로세스 종료
      // console.log(`[ptySocket] pty exit: ${exitCode} ${signal}`)
      ws.disconnect(true)
    })

    /*
    this.terminals[term.pid] = term
    this.unsentOutput[term.pid] = ''
    this.temporaryDisposable[term.pid] = term.onData((data) => {
      socket.emit('data', data.toString())
      console.log('onData', data.toString())
      this.unsentOutput[term.pid] += data
    })
    */
  }
  joint()
}

export default containerPtySocket
