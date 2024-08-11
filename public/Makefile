BUILD_DIR  = $(HOME)/source/9ziggy9.web/public/dist
LIB_DIR    = $(HOME)/source/9ziggy9.web/public/lib
CSS_DIR    = $(HOME)/source/9ziggy9.web/public/css
CSS_SRC    = $(HOME)/source/9ziggy9.web/public/scss

SASSC      = npx sass

.PHONY: all clean sass $(CSS)

all: clean sass
	npx webpack --config webpack.config.js

sass: $(CSS_SRC)/unit.scss
	mkdir -p $(CSS_DIR)
	$(SASSC) $(CSS_SRC)/unit.scss:$(CSS_DIR)/style.css

clean:
	rm -rf $(BUILD_DIR) $(LIB_DIR) $(CSS_DIR)
