@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.8.9-hotspot
set MAVEN_PROJECTBASEDIR=%~dp0
"%JAVA_HOME%\bin\java" -classpath "%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
