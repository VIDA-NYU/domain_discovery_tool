# domain_discovery_tool_react

## Installing on your machine

Building and deploying the Domain Discovery Tool React can be done using its Makefile to create a local development environment.  The conda build environment is currently only supported on 64-bit OS X and Linux.

### Local development

First install conda, either through the Anaconda or miniconda installers provided by Continuum.  You will also need Git and a Java Development Kit.  These are system tools that are generally not provided by conda.

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
or (from the top-level `domain_discovery_tool` directory too) begins in development environment:

```
./bin/ddt-dev
```

Now you should be able to head to http://localhost:8084/ to interact
with the tool.
