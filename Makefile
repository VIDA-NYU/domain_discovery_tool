# Makefile for Domain Discovery Tool development
# Type "make" or "make all" to build the complete development environment
# Type "make help" for a list of commands

# Variables for the Makefile
.PHONY = conda_environment cherrypy_config  word2vec_data clean nltk_data
SHELL := /bin/bash
CONDA_ROOT := $(shell conda info --root)
CONDA_ENV := $(CONDA_ROOT)/envs/ddt
HOSTNAME := $(shell hostname)

CONDA_ENV_TARGET := $(CONDA_ENV)/conda-meta/history
CHERRY_PY_CONFIG_TARGET := server/config.conf
GET_REACT_NPM_INSTALL := client/node_modules
GET_REACT_NPM_BUILD := client/build/index.html
GET_NLTK_DATA_TARGET := nltk_data

# Makefile commands, see below for actual builds

## all              : set up DDT development environment
all: conda_env downloader_app cherrypy_config get_react_install get_react_build get_nltk_data

## help             : show all commands.
# Note the double '##' in the line above: this is what's matched to produce
# the list of commands.
help                : Makefile
	@sed -n 's/^## //p' $<

clean:
	rm -rf client/build; \
	rm server/config.conf

## conda_env        : Install/update a conda environment with needed packages
conda_env: $(CONDA_ENV_TARGET)

## downloader_app   : Build the Java-based downloader application
downloader_app: $(DOWNLOADER_APP_TARGET)

## cherrypy_config  : Configure CherryPy (set absolute root environment)
cherrypy_config: $(CHERRY_PY_CONFIG_TARGET)

## get_nltk_data    : Download NLTK corpus and tokenizers 
get_nltk_data: $(GET_NLTK_DATA_TARGET)

## get_react_install : Download react packages
get_react_install: $(GET_REACT_NPM_INSTALL)

## get_react_build : Build react packages
get_react_build: $(GET_REACT_NPM_BUILD)


# Actual Target work here

$(CONDA_ENV_TARGET): environment.yml
	conda env update

$(CHERRY_PY_CONFIG_TARGET): server/config.conf-in
	sed "s#tools.staticdir.root = .#tools.staticdir.root = ${PWD}/client/build#g" server/config.conf-in > server/config.conf

$(GET_NLTK_DATA_TARGET): 
	source activate ddt; \
	python -m nltk.downloader -d ${PWD}/nltk_data stopwords brown punkt averaged_perceptron_tagger

$(GET_REACT_NPM_INSTALL):
	source activate ddt; \
	pushd client; \
	npm install; \
	python fix_for_npm_child_process_issue.py; \
	popd

$(GET_REACT_NPM_BUILD):
	source activate ddt; \
	pushd client; \
	npm run build; \
	cp build/index.html build/domain_discovery_tool.html; \
        cp -rf public/font-awesome-4.7.0 build/static; \
	popd

