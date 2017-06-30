[![Documentation Status](https://readthedocs.org/projects/domain-discovery-tool/badge/?version=latest)](http://domain-discovery-tool.readthedocs.io/en/latest/?badge=latest)

# Domain Discovery Tool (DDT)

This repository contains the Domain Discovery Tool (DDT) project. DDT is an interactive system that helps users explore and better understand a domain (or topic) as it is represented on the Web. It achieves this by integrating human insights with machine computation (data mining and machine learning) through visualization. DDT allows a domain expert to visualize and analyze pages returned by a search engine or a crawler, and easily provide feedback about relevance. DDT addresses important challenges:

* It assist users in the process of domain understanding and discovery, guiding them to construct effective queries to be issued to a search engine to find additional relevant information; 
* It provides an easy-to-use interface whereby users can quickly provide feedback regarding the relevance of pages which can then be used to create learning classifiers for the domains of interest; and
* It supports the configuration and deployment of focused crawlers that automatically and efficiently search the Web for additional pages on the topic. DDT allows users to quickly select crawling seeds as well as positive and negatives required to create the page classifier required for the focus topic.

## Installing DDT on your machine

You can install the system from source or using Docker.

## Docker Version

You must have docker installed ((`Docker Installation for Mac <https://docs.docker.com/docker-for-mac/install/>`_ , `Docker Installation for Ubuntu <https://docs.docker.com/engine/installation/linux/ubuntu/>`_)

To run using the docker version download the script <a href="https://github.com/ViDA-NYU/domain_discovery_tool_react/blob/master/bin/run_docker_ddt.zip" download>run_docker_ddt</a> and run it:

```
./run_docker_ddt
```
The above script will prompt to enter a directory where you would like to persist all the web pages for the domains you create. You can enter the path to a directory on the host you are running DDT or just press **Enter** to use the default directory which is $HOME/dd_data. The data is stored in the <a href="https://www.elastic.co/products/elasticsearch">elasticsearch</a> data format (You can later use this directory as the data directory to any elasticsearch).The script will start elasticsearch with the data directory provided.

The script will then start DDT. You will see a message **"ENGINE Bus STARTED"** when DDT is running successfully. You can now use DDT.

### Local development

Building and deploying the Domain Discovery Tool can be done using its Makefile to create a local development environment.  The conda build environment is currently only supported on 64-bit OS X and Linux.

First install conda (ADD link to conda install), either through the Anaconda or miniconda installers provided by Continuum.  You will also need Git (ADD link) and a Java Development Kit (>=1.8) (ADD link) which are not provided by conda.

Download Elastic Search 1.6.2 from <a href="https://www.elastic.co/downloads/past-releases/elasticsearch-1-6-2">here</a>, extract the file and run Elastic Search: 

```
./bin/elasticsearch
```

Set up Domain Discovery API 

```
git clone https://github.com/ViDA-NYU/domain_discovery_API
cd domain_discovery_API
```
The `make` command builds MDPROJ,  downloads and installs its dependencies.

```
make
```

Then, add domain_discovery_API to the environment:

```
export DD_API_HOME="{path-to-cloned-domain_discovery_API-repository}"
```

Clone the DDT repository and enter it:

```
https://github.com/ViDA-NYU/domain_discovery_tool_react
cd domain_discovery_tool_react
```

Use the `make` command to build DDT and download/install its dependencies.

```
make
```

After a successful installation, you can activate the DDT development environment:

```
source activate ddt
```

And (from the top-level `domain_discovery_tool` directory),  start
supervisord to run the web application and its associated services:

```
supervisord
```
or (from the top-level `domain_discovery_tool_react` directory) execute:

```
./bin/ddt-dev
```

## Use Domain Discovery Tool

Now you should be able to head to http://localhost:8084/ to interact with the tool.

## Documentation

More documentation is available [HERE!](http://domain-discovery-tool.readthedocs.io/en/latest/)

## Publication

Yamuna Krishnamurthy, Kien Pham, Aecio Santos, and Juliana Friere. 2016. [Interactive Web Content Exploration for Domain Discovery](http://poloclub.gatech.edu/idea2016/papers/p64-krishnamurthy.pdf) (Interactive Data Exploration and Analytics ([IDEA](http://poloclub.gatech.edu/idea2016/)) Workshop at Knowledge Discovery and Data Mining ([KDD](http://www.kdd.org/kdd2016/)), San Francisco, CA).

## Contact

DDT Development Team [ddt-dev@vgc.poly.edu]
