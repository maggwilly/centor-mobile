FROM openjdk:8-jdk-alpine

#ENVIRONNEMENT
ENV GLIB_PACKAGE_BASE_URL https://github.com/sgerrand/alpine-pkg-glibc/releases/download
ENV GLIB_VERSION 2.25-r0

# Install node
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 9.1.0
RUN apk update &&  apk add curl bash nodejs npm


ENV GRADLE_HOME /usr/local/gradle
ENV GRADLE_VERSION 4.10.3

ENV ANDROID_HOME /usr/local/android-sdk-linux
ENV ANDRDOID_TOOLS_VERSION r28.0.6
ENV ANDROID_API_LEVELS android-28
ENV ANDROID_BUILD_TOOLS_VERSION 28.0.2

ENV PATH ${GRADLE_HOME}/bin:${JAVA_HOME}/bin:${ANDROID_HOME}/tools:$ANDROID_HOME/platform-tools:$PATH

# INSTALL IONIC AND CORDOVA
RUN npm install -g cordova@9.0.0

#INSTALL Graddle
RUN mkdir -p ${GRADLE_HOME} && \
  curl -L https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip > /tmp/gradle.zip && \
  unzip /tmp/gradle.zip -d ${GRADLE_HOME} && \
  mv ${GRADLE_HOME}/gradle-${GRADLE_VERSION}/* ${GRADLE_HOME} && \
  rm -r ${GRADLE_HOME}/gradle-${GRADLE_VERSION}



# INSTALL ANDROID
RUN mkdir -p ${ANDROID_HOME} && \
   curl -L https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip > /tmp/tools.zip && \
  unzip /tmp/tools.zip -d ${ANDROID_HOME} && ls ${ANDROID_HOME}

# INSTALL GLIBC
RUN curl -L https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub > /etc/apk/keys/sgerrand.rsa.pub && \
  curl -L ${GLIB_PACKAGE_BASE_URL}/${GLIB_VERSION}/glibc-${GLIB_VERSION}.apk > /tmp/glibc.apk && \
  curl -L ${GLIB_PACKAGE_BASE_URL}/${GLIB_VERSION}/glibc-bin-${GLIB_VERSION}.apk > /tmp/glibc-bin.apk && \
  apk add /tmp/glibc-bin.apk /tmp/glibc.apk

# CONFIGURATION
RUN  echo -ne "y\ny" | android update sdk --all --no-ui -a --filter platform-tools,${ANDROID_API_LEVELS},build-tools-${ANDROID_BUILD_TOOLS_VERSION}

VOLUME ["/var/cordova/app"]
VOLUME ["/usr/local/android-sdk-linux"]
VOLUME ["/usr/local/gradle"]

WORKDIR /var/cordova/app/
#FILES DELETION
RUN rm -rf /tmp/* /var/cache/apk/*

CMD tail -f /dev/null

EXPOSE 8100

