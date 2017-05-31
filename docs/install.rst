Install and Run
===============

You can install the system from source or using Docker.

Docker Version
--------------

You must have docker installed (`Docker Installation <https://docs.docker.com/engine/installation/>`_)

To run using the docker version download the script `run_docker_ddt <https://github.com/ViDA-NYU/domain_discovery_tool_react/blob/master/bin/run_docker_ddt.zip>`_ and run it:

>>> ./run_docker_ddt

This will start elasticsearch and the domain discovery tool.

`Use Domain Discovery Tool <http://domain-discovery-tool.readthedocs.io/en/latest/use.html>`_

Local development
-----------------

Building and deploying the Domain Discovery Tool can be done using its Makefile to create a local development environment.  The conda build environment is currently only supported on 64-bit OS X and Linux.

Install Conda
~~~~~~~~~~~~~~

First install `conda <https://conda.io/docs/install/quick.html>`_.

Install Elasticsearch
~~~~~~~~~~~~~~~~~~~~~

Download Elasticsearch 1.6.2 `here <https://www.elastic.co/downloads/past-releases/elasticsearch-1-6-2>`_, extract the file and run Elasticsearch: 

>>> cd {path-to-installed-Elasticsearch}
>>> ./bin/elasticsearch

Install Domain Discovery API
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

>>> git clone https://github.com/ViDA-NYU/domain_discovery_API
>>> cd domain_discovery_API

The `make` command builds dd_api and downloads/installs its dependencies.

>>> make


Add domain_discovery_API to the environment:

>>> export DD_API_HOME="{path-to-cloned-domain_discovery_API-repository}"

Clone the DDT repository and enter it:

>>> https://github.com/ViDA-NYU/domain_discovery_tool_react
>>> cd domain_discovery_tool_react

Use the `make` command to build ddt and download/install its dependencies.

>>> make

After a successful installation, you can activate the DDT development environment:

>>> source activate ddt

(from the top-level `domain_discovery_tool_react` directory) execute:

>>> ./bin/ddt-dev

`Use Domain Discovery Tool <http://domain-discovery-tool.readthedocs.io/en/latest/use.html>`_
