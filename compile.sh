#!/bin/sh

# compresses the application
java -classpath "js.jar;compiler.jar" org.mozilla.javascript.tools.shell.Main r.js -o app.build.js && \
	cp script/libs/jade.js compressed/script/libs/jade.js
