export class Template {
  container: {
    image: string
    network?: string
    cpus?: string | number
    memory?: string
    user?: string
    workdir?: string
    volumes?: {
      hostSrc: string
      containerDest: string
      options?: string
    }[]
  }
  files: string[]
  actions: { name: string; script: string }[]
}

/*

{
  "container": {
    "image": "localhost/runner:dev",
    "network": "none",
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
  },

  "files": ["/CODE/main.py", "/CODE/main.cpp", "/CODE/Main.java"],

  "actions": [
    { "name": "bash", "script": "/bin/bash" },
    { "name": "run py", "script": "python main.py" },
    { "name": "run c++", "script": "g++ main.cpp ; ./a.out" },
    { "name": "run java", "script": "javac Main.java ; java Main" }
  ]
}

*/
