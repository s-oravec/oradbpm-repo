FROM node:0.10
MAINTAINER Štefan Oravec, stefan.oravec@me.com

# Install gem sass for  grunt-contrib-sass
RUN apt-get update -qq && apt-get install -y build-essential apt-utils
RUN apt-get install -y ruby
RUN gem install sass

WORKDIR /home/mean

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower

# Install Mean.JS packages
ADD package.json /home/mean/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/mean/.bowerrc
ADD bower.json /home/mean/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /home/mean

# Set development environment as default
ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
CMD ["grunt"]

#/usr/bin/ld: cannot find -lkrb5
#/usr/bin/ld: cannot find -lgssapi_krb5

#npm WARN peerDependencies The peer dependency kerberos@~0.0 included from mongodb-core will no
#npm WARN peerDependencies longer be automatically installed to fulfill the peerDependency
#npm WARN peerDependencies in npm 3+. Your application will need to depend on it explicitly.

#npm WARN peerDependencies The peer dependency istanbul@0.x.x included from grunt-mocha-istanbul will no
#npm WARN peerDependencies longer be automatically installed to fulfill the peerDependency
#npm WARN peerDependencies in npm 3+. Your application will need to depend on it explicitly.
