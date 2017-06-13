Install and Run
===============

You can install the system from source or using Docker.

Docker Version
--------------

You must have docker installed (`Docker Installation for Mac <https://docs.docker.com/docker-for-mac/install/>`_ , `Docker Installation for Ubuntu <https://docs.docker.com/engine/installation/linux/ubuntu/>`_)

To run using the docker version download the script `run_docker_ddt <https://github.com/ViDA-NYU/domain_discovery_tool_react/raw/master/bin/run_docker_ddt.zip>`_ and run it:

>>> ./run_docker_ddt

The above script will prompt to enter a directory where you would like to persist all the web pages for the domains you create. You can enter the path to a directory on the host you are running DDT or just press **Enter** to use the default directory which is $HOME/dd_data. The data is stored in the `elasticsearch <https://www.elastic.co/products/elasticsearch>`_ data format (You can later use this directory as the data directory to any elasticsearch).The script will start elasticsearch with the data directory provided.

The script will then start DDT. You will see a message **"ENGINE Bus STARTED"** when DDT is running successfully. You can now use DDT.

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

