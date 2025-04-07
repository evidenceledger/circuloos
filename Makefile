.PHONY: rundocker buiddocker

builddocker:
	docker build -t circuloos .

rundev:
	docker run -v ${PWD}:/app --env CIRC_CONFIG_FILE=config/dev_config.yaml -p 4444:4444 -t --name circuloos -d circuloos

