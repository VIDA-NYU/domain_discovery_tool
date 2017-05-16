# Domain Discovery Tool

This repository contains the Domain Discovery Tool (DDT) project. DDT is an interactive system that helps users explore and better understand a domain (or topic) as it is represented on the Web. It achieves this by integrating human insights with machine computation (data mining and machine learning) through visualization. DDT allows a domain expert to visualize and analyze pages returned by a search engine or a crawler, and easily provide feedback about relevance. This feedback, in turn, can be used to address two challenges:

* Guide users in the process of domain understanding and help them construct effective queries to be issued to a search engine; and
* Configure focused crawlers that efficiently search the Web for additional pages on the topic. DDT allows users to quickly select crawling seeds as well as positive and negatives required to create a page classifier for the focus topic.

## Installing on your machine

Building and deploying the Domain Discovery Tool React can be done using its Makefile to create a local development environment.  The conda build environment is currently only supported on 64-bit OS X and Linux.

### Local development

First install conda, either through the Anaconda or miniconda installers provided by Continuum.  You will also need Git and a Java Development Kit (>=1.8). These are system tools that are generally not provided by conda.

Set up Domain Discovery API 

```
https://github.com/ViDA-NYU/domain_discovery_API.git
cd domain_discovery_API
```
Use the `make` command to build MDPROJ and download/install its dependencies.

```
make
```

Make domain_discovery_API available by adding it to the environment:

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

## Docker Version

To run using the docker version download the scrip [run_docker_ddt](https://github.com/ViDA-NYU/domain_discovery_tool_react/blob/master/bin/run_docker_ddt) and run it:

```
./run_docker_ddt
```

This will start elasticsearch and the domain discovery tool.

## Use Domain Discovery Tool

Now you should be able to head to http://localhost:8084/ to interact with the tool.

## Publication

Yamuna Krishnamurthy, Kien Pham, Aecio Santos, and Juliana Friere. 2016. [Interactive Web Content Exploration for Domain Discovery](http://poloclub.gatech.edu/idea2016/papers/p64-krishnamurthy.pdf) (Interactive Data Exploration and Analytics ([IDEA](http://poloclub.gatech.edu/idea2016/)) Workshop at Knowledge Discovery and Data Mining ([KDD](http://www.kdd.org/kdd2016/)), San Francisco, CA).

## Contact

DDT Development Team [ddt-dev@vgc.poly.edu]