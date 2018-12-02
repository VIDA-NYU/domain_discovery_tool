#
# Domain Discover Tool Dockerfile
#
#

# Pull base image.
FROM ubuntu:latest

# Install some dependencies
RUN apt-get update && apt-get -y install git build-essential wget

# Install miniconda
RUN echo 'export PATH=/opt/conda/bin:$PATH' > /etc/profile.d/conda.sh && \
    wget --quiet --no-check-certificate http://repo.continuum.io/miniconda/Miniconda2-latest-Linux-x86_64.sh && \
    /bin/bash /Miniconda2-latest-Linux-x86_64.sh -b -p /opt/conda && \
    rm Miniconda2-latest-Linux-x86_64.sh && \
    /opt/conda/bin/conda install --yes conda==3.14.1
ENV PATH /opt/conda/bin:$PATH

RUN conda install -c conda conda-env

RUN echo $PATH

# Expose Domain Discovery Tool port
EXPOSE 8084

# Expose ACHE port
EXPOSE 8080

# Expose ElasticSearch ports
EXPOSE 9200
EXPOSE 9300

# Expose Supervisord port
EXPOSE 9001

# Get domain_discovery_API repository
RUN git clone https://github.com/ViDA-NYU/domain_discovery_API.git /ddt/domain_discovery_API

WORKDIR /ddt/domain_discovery_API

# Add build file
RUN mv env_docker.yml environment.yml

RUN make conda_env &&\
    make downloader_app	&&\
    make link_word2vec_data &&\
    make tsp_solver &&\
    rm -rf /opt/conda/pkgs

WORKDIR /ddt/domain_discovery_tool

# Add build file
ADD ./Makefile /ddt/domain_discovery_tool/Makefile

# Install conda dependencies and download nltk data
ADD ./environment.yml /ddt/domain_discovery_tool/environment.yml
RUN make conda_env
RUN make get_nltk_data

# Add client source files
ADD ./client /ddt/domain_discovery_tool/client

RUN make get_react_install &&\
    make get_react_build &&\
    rm -rf /ddt/domain_discovery_tool/client/node_modules &&\
    rm -rf /ddt/domain_discovery_tool/client/public

# Add client source files
ADD ./server /ddt/domain_discovery_tool/server

# Setup remaining configs
RUN make cherrypy_config

ADD ./bin/run_ddt /ddt/run_ddt

CMD bash -c 'source activate ddt; /ddt/run_ddt'