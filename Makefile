# Makefile for Domain Discovery Tool development
# Type "make" or "make all" to build the complete development environment
# Type "make help" for a list of commands

# Variables for the Makefile
.PHONY = conda_environment cherrypy_config  word2vec_data clean
SHELL := /bin/bash
CONDA_ROOT := $(shell conda info --root)
CONDA_ENV := $(CONDA_ROOT)/envs/ddt

CONDA_ENV_TARGET := $(CONDA_ENV)/conda-meta/history
DOWNLOADER_APP_TARGET := server/seeds_generator/target/seeds_generator-1.0-SNAPSHOT-jar-with-dependencies.jar
CHERRY_PY_CONFIG_TARGET := server/config.conf
LINK_WORD2VEC_DATA_TARGET := server/ranking/D_cbow_pdw_8B.pkl
GET_REACT_DATA_TARGET := client/build/index.html

# Makefile commands, see below for actual builds

## all              : set up DDT development environment
all: conda_env downloader_app cherrypy_config link_word2vec_data get_react_data

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

## link_word2vec_data : Hardlink the word2vec data from the conda environment
link_word2vec_data: $(LINK_WORD2VEC_DATA_TARGET)


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

$(LINK_WORD2VEC_DATA_TARGET): $(CONDA_ENV)/data/D_cbow_pdw_8B.pkl
	ln $(CONDA_ENV)/data/D_cbow_pdw_8B.pkl ${PWD}/server/ranking

$(GET_REACT_DATA_TARGET):
	source activate ddt; \
	pushd client; \
	npm install; \
	npm run build; \
	cp build/index.html build/domain_discovery_tool.html; \
	popd
