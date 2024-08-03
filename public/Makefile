BUILD_DIR  = $(HOME)/source/9ziggy9.web/public/dist
LIB_DIR    = $(HOME)/source/9ziggy9.web/public/lib

.PHONY: all clean

all: clean
	npx webpack --config webpack.config.js

clean:
	rm -rf $(BUILD_DIR) $(LIB_DIR)
