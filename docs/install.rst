Install and Run
===============

You can install the system from source or using Docker.

Docker Version
--------------

You must have docker installed (`Docker Installation for Mac <https://docs.docker.com/docker-for-mac/install/>`_ , `Docker Installation for Ubuntu <https://docs.docker.com/engine/installation/linux/ubuntu/>`_)

Background Mode
~~~~~~~~~~~~~~~

You must have docker compose installed to run the background version. For Mac docker-compose is included in the docker installation. For Ubuntu follow instructions under Linux tab in `docker compose install for linux <https://docs.docker.com/compose/install/>`_

In order to run the docker version in background download:

**To run only DDT (no crawlers):** Download :download:`docker-compose.yml <../docker-compose.yml>`.

**To run DDT, deep crawler and focused crawler:** Download the following files in the same directory

:download:`docker-compose.yml.ache <../docker-compose.yml.ache>`. Rename the downloaded **docker-compose.yml.ache** to **docker-compose.yml**.

:download:`ache.yml <../ache.yml>`	  

Now use the following commands to run DDT (and crawlers if applicable):

>>> cd {path-to-downloaded-docker-compose.yml}
>>> docker-compose up -d

The above commands will start elasticsearch and DDT processes (and crawlers if applicable). The elasticsearch and DDT (and crawler if applicable) data are stored in the directory {path-to-downloaded-docker-compose.yml}/data

You can check the output of the DDT tool using:

>>> docker logs dd_tool

You will see a message **"ENGINE Bus STARTED"** when DDT is running successfully. You can now use DDT.

`Use Domain Discovery Tool <http://domain-discovery-tool.readthedocs.io/en/latest/tutorials.html>`_

To shutdown the processes run:

>>> cd {path-to-downloaded-docker-compose.yml}
>>> docker-compose stop

Interactive Mode
~~~~~~~~~~~~~~~~

To run using the interactive docker version download the script :download:`run_docker_ddt <../bin/run_docker_ddt>` and run it:

>>> cd {path-to-downloaded-run_docker_ddt}
>>> chmod a+x run_docker_ddt
>>> ./run_docker_ddt

The above script will prompt to enter a directory where you would like to persist all the web pages for the domains you create. You can enter the path to a directory on the host you are running DDT or just press **Enter** to use the default directory which is {path-to-downloaded-run_docker_ddt}/data. The data is stored in the `elasticsearch <https://www.elastic.co/products/elasticsearch>`_ data format (You can later use this directory as the data directory to any elasticsearch).The script will start elasticsearch with the data directory provided.

The script will then start DDT. You will see a message **"ENGINE Bus STARTED"** when DDT is running successfully. You can now use DDT.

`Use Domain Discovery Tool <http://domain-discovery-tool.readthedocs.io/en/latest/tutorials.html>`_

Trouble Shooting
~~~~~~~~~~~~~~~~

In case you see the following error:

>>> ERROR: for elasticsearch  Cannot create container for service elasticsearch: Conflict. The container name "/elastic" is already in use by container b714e105ccbf3a6d5a718c76c2ce1e5a51ea6f10a5f4997a6e5b12b9c7faf50e. You have to remove (or rename) that container to be able to reuse that name.

run the following command:

>>> docker rm elastic

In case you see the following error:

>>> ERROR: for ddt  Cannot create container for service ddt: Conflict. The container name "/dd_tool" is already in use by container 326881fda035692aa0a5c03ec808294aaad2f9fd816baa13270d2fe50e7e1e77. You have to remove (or rename) that container to be able to reuse that name.

>>> docker rm dd_tool

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

>>> https://github.com/ViDA-NYU/domain_discovery_tool
>>> cd domain_discovery_tool

Use the `make` command to build ddt and download/install its dependencies.

>>> make

After a successful installation, you can activate the DDT development environment:

>>> source activate ddt

(from the top-level `domain_discovery_tool` directory) execute:

>>> ./bin/ddt-dev

`Use Domain Discovery Tool <http://domain-discovery-tool.readthedocs.io/en/latest/tutorials.html>`_

