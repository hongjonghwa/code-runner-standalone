FROM docker.io/library/ubuntu:22.04 
LABEL author="jonghwa.hong@gmail.com"

ENV TERM=xterm-color

# RUN apt update && apt -y upgrade
RUN apt-get update && \
    apt-get -y install time && \
    useradd -m user -u 9999 && \
    echo "\nexport PS1='$ '" >> ~user/.bashrc && \
    mkdir /CODE && \
    chown user /CODE && \
    chgrp user /CODE

RUN apt-get update &&  apt-get -y upgrade && \
    apt-get -y install g++ && \
    apt-get -y install openjdk-18-jdk-headless && \
    apt-get -y install python3 python-is-python3 python3-pip && \
    pip install pandas numpy

VOLUME /CODE

CMD ["/bin/bash"]
