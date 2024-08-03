.PHONY: all build-react build-spring docker-login

VERSION=`date +%y.%-m.%-d`
BASE_IMAGE_NAME=registry-gitlab.aarcc530.com/tournament-site/tournament-site

all: build-react build-spring

build-react: docker-login
	cd react-server; \
	docker build . -t ${BASE_IMAGE_NAME}/react-server:${VERSION}; \
	docker push ${BASE_IMAGE_NAME}/react-server:${VERSION}

build-spring: docker-login
	cd spring-server; \
	docker build . -t ${BASE_IMAGE_NAME}/spring-server:${VERSION}; \
	docker push ${BASE_IMAGE_NAME}/spring-server:${VERSION}

docker-login:
	docker login registry-gitlab.aarcc530.com