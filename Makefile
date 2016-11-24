# Makefile for Domain Discovery Tool development
# Type "make" or "make all" to build the complete development environment 
# Type "make help" for a list of commands

# Variables for the Makefile
.PHONY = conda_environment cherrypy_config nltk_data word2vec_data install_npm
SHELL := /bin/bash
CONDA_ROOT := $(shell conda info --root)
CONDA_ENV := $(CONDA_ROOT)/envs/ddt

CONDA_ENV_TARGET := $(CONDA_ENV)/conda-meta/history
DOWNLOADER_APP_TARGET := server/seeds_generator/target/seeds_generator-1.0-SNAPSHOT-jar-with-dependencies.jar
CHERRY_PY_CONFIG_TARGET := server/config.conf
GET_NLTK_DATA_TARGET := nltk_data/corpora nltk_data/tokenizers
LINK_WORD2VEC_DATA_TARGET := server/ranking/D_cbow_pdw_8B.pkl
INSTALL_NPM_TARGET := ${PWD}/node-v6.9.1-linux-x64/bin/npm
GET_REACT_DATA_TARGET := client/build/index.html

# Makefile commands, see below for actual builds

## all              : set up DDT development environment
all: conda_env downloader_app cherrypy_config get_nltk_data link_word2vec_data install_npm get_react_data

## help             : show all commands.
# Note the double '##' in the line above: this is what's matched to produce
# the list of commands.
help                : Makefile
	@sed -n 's/^## //p' $<

## conda_env        : Install/update a conda environment with needed packages
conda_env: $(CONDA_ENV_TARGET)

## downloader_app   : Build the Java-based downloader application
downloader_app: $(DOWNLOADER_APP_TARGET)

## cherrypy_config  : Configure CherryPy (set absolute root environment)
cherrypy_config: $(CHERRY_PY_CONFIG_TARGET)

## get_nltk_data    : Download NLTK corpus and tokenizers 
get_nltk_data: $(GET_NLTK_DATA_TARGET)

## link_word2vec_data : Hardlink the word2vec data from the conda environment
link_word2vec_data: $(LINK_WORD2VEC_DATA_TARGET)

## install_npm    : Download npm
install_npm: $(INSTALL_NPM_TARGET)

## get_react_data : Download react packages
get_react_data: $(GET_REACT_DATA_TARGET)

# Actual Target work here

$(CONDA_ENV_TARGET): environment.yml
	conda env update

$(DOWNLOADER_APP_TARGET): $(CONDA_ENV_TARGET) server/seeds_generator/pom.xml $(wildcard server/seeds_generator/src/main/java/page_downloader/*.java)
	source activate ddt; \
	pushd server/seeds_generator; \
	mvn compile assembly:single; \
	popd

$(CHERRY_PY_CONFIG_TARGET): server/config.conf-in
	sed "s#tools.staticdir.root = .#tools.staticdir.root = ${PWD}/client/build#g" server/config.conf-in > server/config.conf

$(GET_NLTK_DATA_TARGET): $(CONDA_ENV)
	source activate ddt; \
	python -m nltk.downloader -d ${PWD}/nltk_data stopwords brown punkt averaged_perceptron_tagger

$(LINK_WORD2VEC_DATA_TARGET): $(CONDA_ENV)/data/D_cbow_pdw_8B.pkl
	ln $(CONDA_ENV)/data/D_cbow_pdw_8B.pkl ${PWD}/server/ranking

$(INSTALL_NPM_TARGET) :
	tar -xvJf node-v6.9.1-linux-x64.tar.xz; \

$(GET_REACT_DATA_TARGET):
	export PATH=${PWD}/node-v6.9.1-linux-x64/bin:${PATH}; \
	pushd client; \
	npm install; \
	npm run build; \
	cp build/index.html build/domain_discovery_tool.html; \
	popd
