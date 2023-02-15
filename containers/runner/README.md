# one time run

cd dev/standalone/container/

podman run -ti --rm \
 --name runner -h coderun \
 --network none \
 --cpus 0.125 \
 -m 125m \
 -u user \
 -w /CODE \
 -v $(pwd)/../../CODE:/CODE \
 runner:dev

podman run -ti --rm --name runner -h coderun runner:dev

# PODMAN TROUBLE SHOOTING

https://github.com/containers/podman/blob/main/troubleshooting.md#26-running-containers-with-resource-limits-fails-with-a-permissions-error

1. $ cat "/sys/fs/cgroup/user.slice/user-$(id -u).slice/user@$(id -u).service/cgroup.controllers"
   Example output might be:

memory pids

In the above example, cpu and cpuset are not listed, which means the current user does not have permission to set CPU or CPUSET limits.

2.  If you want to enable CPU or CPUSET limit delegation for all users, you can create the file /etc/systemd/system/user@.service.d/delegate.conf with the contents:

[Service]
Delegate=memory pids cpu cpuset

3. rollback
   sudo rm -rf /etc/systemd/system/user@.service.d

---

# one time run

docker run -it --rm \
 --name code-runner -h code-runner \
 --network none \
 --cpus 0.125 \
 -m 125m \
 -u user \
 -w /CODE \
 -v $(pwd)/code:/CODE \
 -p 80:8080 \
 code-runner-python:3.10-pandas python main.py

# multiple run

docker run -t --rm -d \
 --name code-runner -h code-runner \
 --network none \
 --cpus 0.125 \
 -m 125m \
 -u user \
 -w /CODE \
 -v $(pwd)/code:/CODE \
 -p 80:8080 \
 code-runner-python:3.10-pandas

docker exec -it code-runner bash
docker exec code-runner python main.py
docker exec code-runner python -c "print('hello world')"
docker exec code-runner sh -c "python main.py; python main.py; python main.py"
docker exec code-runner bash -c "time -p python main.py; time -p python main.py; time -p python main.py"

# 수행시간, 타임

docker exec code-runner /user/bin/time -f %e,%M python main.py
