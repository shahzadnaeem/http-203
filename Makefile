
PROJECTDIR=./
DOMAIN=shaz-http-css.surge.sh

surge:
	surge --domain https://$(DOMAIN) $(PROJECTDIR) $(DOMAIN)
