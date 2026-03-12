#!/bin/sh
# Maven Wrapper script
MAVEN_PROJECTBASEDIR="${MAVEN_BASEDIR:-$(cd "$(dirname "$0")" && pwd)}"
export MAVEN_PROJECTBASEDIR
JAVA_HOME="${JAVA_HOME:-/c/Program Files/Microsoft/jdk-21.0.8.9-hotspot}"
export JAVA_HOME
exec "$JAVA_HOME/bin/java" \
  -classpath "$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar" \
  org.apache.maven.wrapper.MavenWrapperMain "$@"
