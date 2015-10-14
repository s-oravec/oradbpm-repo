# oradbpm-repo

Oracle DB Package Manager - Repository

# Idea

I need something like npmjs.org + npm for modules written in Oracle PL/SQL and I've been unable to find any opensource solution, so here's my try.
Features are greatly inspired by npmjs.org and npm.

# Features

* Open sourced REST API server
	* based on MEAN.js - MongoDB may be changed for something else in the future
	* lousy security - session cookie - sorry for that \_(ツ)_/¯ - any contributions regarding this are welcomed
* Open sourced npm-style [client CLI](https://github.com/s-oravec/oradbpm-cli) written in node  
* Doesn't store tarballs in repo, only stores links to github.com/your-local-repo

# Warning!!!

* very unstable right now, pretty all changes are breaking - do not use for production, yet
