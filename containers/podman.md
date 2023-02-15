# ubuntu
podman run -ti --rm --name ubuntu docker.io/library/ubuntu:22.04

# ?? ipv4 connection error

apt install wget -o Acquire::ForceIPv4=true
apt update -o Acquire::ForceIPv4=true

# method 1
sudo vim /etc/apt/apt.conf.d/99disable-ipv6
Insert Acquire::ForceIPv4 "true";

Save

apt-get update

#method 2
sudo apt-get -o Acquire::ForceIPv4=true update




# podman tutorial
- https://github.com/containers/podman/blob/main/docs/tutorials/podman_tutorial.md

podman run -dt -p 8080:8080/tcp -e HTTPD_VAR_RUN=/run/httpd -e HTTPD_MAIN_CONF_D_PATH=/etc/httpd/conf.d \
                  -e HTTPD_MAIN_CONF_PATH=/etc/httpd/conf \
                  -e HTTPD_CONTAINER_SCRIPTS_PATH=/usr/share/container-scripts/httpd/ \
                  registry.fedoraproject.org/f29/httpd /usr/bin/run-httpd


podman inspect -l | grep IPAddress\":
            "SecondaryIPAddresses": null,
            "IPAddress": "",


podman run -dt -p 8080:8080/tcp -e HTTPD_VAR_RUN=/run/httpd -e HTTPD_MAIN_CONF_D_PATH=/etc/httpd/conf.d \
                  -e HTTPD_MAIN_CONF_PATH=/etc/httpd/conf \
                  -e HTTPD_CONTAINER_SCRIPTS_PATH=/usr/share/container-scripts/httpd/ \
                  registry.fedoraproject.org/f29/httpd /usr/bin/run-httpd

