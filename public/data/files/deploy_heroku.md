# Deploying a Sinatra App with Heroku from a Clean Cloud9 IDE Workspace
I use <a href="https://c9.io/">Cloud9</a>, a cloud-based development IDE accessed through a web-browser that provides the user with a Docker Ubuntu Container. Although both are Unix-based and operate using the same command line interface, Ubuntu (particularly when hosted on Cloud9) varies enough from Mac OS (the default environment in our lessons) that implementing course materials and projects from an Ubuntu virtual machine hosted with Cloud9 often requires a different approach.

The section of Launch School’s curriculum that I am currently moving through requires us to create a simple, mobile-friendly book viewing application per the course’s specifications, and then make this application publicly accessible on a long-term basis by deploying it with Heroku. For simplicity’s sake, and since I believe this is how future applications will be packaged and deployed, I decided to copy the application files from my master Launch-School Cloud 9 workspace to a new workspace explicitly devoted to the application, and deploy from there.

The files can be transferred either through a simple download from the original workspace and upload to the new workspace using Cloud9’s interface, or by pulling the file from a remote git repo. In either case, after getting the files into the new workspace, configuring the app for deployment with Puma as web server (rather than WEBrick) and logging into Heroku in the CLI, there are roughly eight steps to deploying the app:

(1) Use RVM to install whatever version of Ruby is specified in the application’s Gemfile:

```
$ rvm install ruby-2.2.4
```

(2) Install Bundler and use it to install all of the gems specified in the Gemfile:

```
$ # in the app's root directory
$ gem install bundler
$ bundle install
```

(3) Test the app locally to make sure everything’s in order:

```
$ heroku local
```

(4) Initialize a local git repository in the app’s root directory in the clean Cloud9 workspace:

```
$ # in the app's root directory
$ git init
$ git add '.'
$ git commit -m 'Initial commit.'
```

(5) Create a Heroku remote repository:

```
$ heroku create
```

(6) Create a Heroku application (name assigned by Heroku unless specified by user):

```
$ heroku apps:create myappname
```
 
(7) Push the project to the new Heroku remote repository for the application:

```
$ git push heroku master
```

(8) Check that the application is running at the URL ending with ‘.com’ specified towards the end of the console output.

(9) All done!