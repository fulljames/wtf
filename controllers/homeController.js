var _ = require('underscore');

/*
    {
        'label': "",
        'src': "",
        'description': ""
    },
*/

var data = {
    'items': [{
        'label': "Anchor",
        'src': "http://anchorcms.com/",
        'description': "Anchor is a content management system, written in PHP5, built for art-directed posts."
    },{
        'label': "Angular.js",
        'src': "http://angularjs.org/",
        'description': "What HTML would have been had it been designed for web apps"
    },{
        'label': "ASP.net MVC",
        'src': "http://www.asp.net/mvc",
        'description': "ASP.NET MVC gives you a powerful, patterns-based way to build dynamic websites that enables a clean separation of concerns and that gives you full control over markup for enjoyable, agile development. ASP.NET MVC includes many features that enable fast, TDD-friendly development for creating sophisticated applications that use the latest web standards."
    },{
        'label': "Backbone",
        'src': "http://documentcloud.github.com/backbone/",
        'description': "Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface."
    },{
        'label': "Batman.js",
        'src': "http://batmanjs.org/",
        'description': "Batman.js is a framework for building rich web applications with CoffeeScript or JavaScript. App code is concise and declarative, thanks to a powerful system of view bindings and observable properties. The API is designed with developer and designer happiness as its first priority."
    },{
        'label': "Behat",
        'src': "http://behat.org/",
        'description': "Behat was inspired by Ruby's Cucumber project and especially its syntax part (Gherkin). It tries to be like Cucumber with input (Feature files) and output (console formatters), but in core, it has been built from the ground on pure php with Symfony2 components."
    },{
        'label': "Bootstrap",
        'src': "http://twitter.github.com/bootstrap/",
        'description': "Simple and flexible HTML, CSS, and Javascript for popular user interface components and interactions."
    },{
        'label': "Buster.js",
        'src': "http://busterjs.org/",
        'description': "Buster.JS is a new JavaScript testing framework. It does browser testing by automating test runs in actual browsers (think JsTestDriver), as well as Node.js testing. "
    },{
        'label': "Cake",
        'src': "http://cakephp.org/",
        'description': "CakePHP enables PHP users at all levels to rapidly develop robust web applications."
    },{
        'label': "Cappuccino",
        'src': "http://cappuccino.org/",
        'description': "Cappuccino is an open source framework that makes it easy to build desktop-caliber applications that run in a web browser."
    },{
        'label': "Celery",
        'src': "http://celeryproject.org/",
        'description': "Celery is an asynchronous task queue/job queue based on distributed message passing. It is focused on real-time operation, but supports scheduling as well."
    },{
        'label': "Clojure",
        'src': "http://clojure.org/",
        'description': "Clojure is a dynamic programming language that targets the Java Virtual Machine (and the CLR, and JavaScript). It is designed to be a general-purpose language, combining the approachability and interactive development of a scripting language with an efficient and robust infrastructure for multithreaded programming."
    },{
        'label': "Closure Library",
        'src': "https://developers.google.com/closure/library/",
        'description': "The Closure Library is a broad, well-tested, modular, and cross-browser JavaScript library. You can pull just what you need from a large set of reusable UI widgets and controls, and from lower-level utilities for DOM manipulation, server communication, animation, data structures, unit testing, rich-text editing, and more."
    },{
        'label': "CodeIgniter",
        'src': "http://codeigniter.com/",
        'description': "CodeIgniter is a powerful PHP framework with a very small footprint, built for PHP coders who need a simple and elegant toolkit to create full-featured web applications. "
    },{
        'label': "Coffeescript",
        'src': "http://coffeescript.org/",
        'description': "CoffeeScript is a little language that compiles into JavaScript. Underneath all those awkward braces and semicolons, JavaScript has always had a gorgeous object model at its heart. CoffeeScript is an attempt to expose the good parts of JavaScript in a simple way."
    },{
        'label': "Compass",
        'src': "http://compass-style.org/",
        'description': "Compass is an open-source CSS authoring framework which uses the Sass stylesheet language to make writing stylesheets powerful and easy."
    },{
        'label': "CouchDB",
        'src': "http://couchdb.apache.org/",
        'description': "Apache CouchDB is a document-oriented database that can be queried and indexed using JavaScript in a MapReduce fashion. CouchDB also offers incremental replication with bi-directional conflict detection and resolution."
    },{
        'label': "Cucumber",
        'src': "http://cukes.info/",
        'description': "Cucumber lets software development teams describe how software should behave in plain text. The text is written in a business-readable domain-specific language and serves as documentation, automated tests and development-aid - all rolled into one format."
    },{
        'label': "Cujo",
        'src': "https://github.com/unscriptable/cujo/wiki/Intro",
        'description': "At its core, cujo.js is an MVC framework that runs in the browser. An MVC framework embraces the concepts of data models, views, and controllers. Data models are abstractions of structured data. Views display and collect information to/from users. Controllers orchestrate and execute the behaviors of an application."
    },{
        'label': "Dart",
        'src': "http://www.dartlang.org/",
        'description': "Dart is a new class-based programming language for creating structured web applications. Developed with the goals of simplicity, efficiency, and scalability, the Dart language combines powerful new language features with familiar language constructs into a clear, readable syntax."
    },{
        'label': "Django",
        'src': "https://www.djangoproject.com/",
        'description': "Django is a high-level Python Web framework that encourages rapid development and clean, pragmatic design."
    },{
        'label': "Doctrine",
        'src': "http://www.doctrine-project.org/",
        'description': "The Doctrine Project is the home of a selected set of PHP libraries primarily focused on providing persistence services and related functionality. Its prize projects are a Object Relational Mapper and the Database Abstraction Layer it is built on top of."
    },{
        'label': "Dojo Toolkit",
        'src': "http://dojotoolkit.org/",
        'description': "Dojo saves you time and scales with your development process, using web standards as its platform. It’s the toolkit experienced developers turn to for building high quality desktop and mobile web applications."
    },{
        'label': "Drupal",
        'src': "http://drupal.org/",
        'description': "Drupal is an open source content management platform powering millions of websites and applications. It’s built, used, and supported by an active and diverse community of people around the world."
    },{
        'label': "Ember",
        'src': "http://emberjs.com/",
        'description': "Ember is a JavaScript framework for creating ambitious web applications that eliminates boilerplate and provides a standard application architecture."
    },{
        'label': "Ender",
        'src': "http://ender.no.de",
        'description': "Ender is a full featured package manager for your browser. It allows you to search, install, manage, and compile front-end javascript packages and their dependencies for the web."
    },{
        'label': "Enyo",
        'src': "http://enyojs.com/",
        'description': "Enyo is an open source object-oriented JavaScript framework emphasizing encapsulation and modularity. Enyo contains everything you need to create a fast, scalable mobile or web application."
    },{
        'label': "Erlang",
        'src': "http://www.erlang.org/",
        'description': "Erlang is a programming language used to build massively scalable soft real-time systems with requirements on high availability. Some of its uses are in telecoms, banking, e-commerce, computer telephony and instant messaging. Erlang's runtime system has built-in support for concurrency, distribution and fault tolerance."
    },{
        'label': "Express",
        'src': "http://expressjs.com",
        'description': "Sinatra inspired web development framework for node.js -- insanely fast, flexible, and simple "
    },{
        'label': "Ext JS",
        'src': "http://www.sencha.com/products/extjs",
        'description': "Ext JS 4 is the next major advancement in our JavaScript framework. Featuring expanded functionality, plugin-free charting, and a new MVC architecture it's the best Ext JS yet. "
    },{
        'label': "Flask",
        'src': "http://flask.pocoo.org/",
        'description': "Flask is a microframework for Python based on Werkzeug, Jinja 2 and good intentions. And before you ask: It's BSD licensed!"
    },{
        'label': "Foundation",
        'src': "http://foundation.zurb.com/",
        'description': "An easy to use, powerful, and flexible framework for building prototypes and production code on any kind of device. Start here, build everywhere."
    },{
        'label': "Go",
        'src': "http://golang.org/",
        'description': "The Go programming language is an open source project to make programmers more productive. Go is expressive, concise, clean, and efficient. Its concurrency mechanisms make it easy to write programs that get the most out of multicore and networked machines, while its novel type system enables flexible and modular program construction."
    },{
        'label': "Google Web Toolkit",
        'src': "http://code.google.com/webtoolkit/",
        'description': "Google Web Toolkit (GWT) is a development toolkit for building and optimizing complex browser-based applications. GWT is used by many products at Google, including Google AdWords and Orkut. It's open source, completely free, and used by thousands of developers around the world."
    },{
        'label': "Grails",
        'src': "http://grails.org/",
        'description': "Grails is a high-productivity web framework based on the Groovy language that embraces the coding by convention paradigm, but is designed specifically for the Java platform."
    },{
        'label': "Hadoop",
        'src': "http://hadoop.apache.org/",
        'description': "The Apache Hadoop software library is a framework that allows for the distributed processing of large data sets across clusters of computers using a simple programming model. It is designed to scale up from single servers to thousands of machines, each offering local computation and storage."
    },{
        'label': "HAML",
        'src': "http://haml-lang.com/",
        'description': "Haml takes your gross, ugly templates and replaces them with veritable Haiku. Haml is the next step in generating views in your Rails application. Haml is a refreshing take that is meant to free us from the shitty templating languages we have gotten used to. Haml is based on one primary principle. Markup should be beautiful."
    },{
        'label': "Handlebars",
        'src': "http://handlebarsjs.com/",
        'description': "Handlebars provides the power necessary to let you build semantic templates effectively with no frustration. Mustache templates are compatible with Handlebars, so you can take a Mustache template, import it into Handlebars, and start taking advantage of the extra Handlebars features."
    },{
        'label': "Hogan.js",
        'src': "http://twitter.github.com/hogan.js/",
        'description': "Hogan.js is a 2.5k JS templating engine developed at Twitter. Use it as a part of your asset packager to compile templates ahead of time or include it in your browser to handle dynamic templates."
    },{
        'label': "HTML5 Boilerplate",
        'src': "http://html5boilerplate.com/",
        'description': "HTML5 Boilerplate is the professional badass's base HTML/CSS/JS template for a fast, robust and future-safe site."
    },{
        'label': "Jade",
        'src': "https://github.com/visionmedia/jade",
        'description': "Jade is a high performance template engine heavily influenced by Haml and implemented with JavaScript for node."
    },{
        'label': "Jasmine",
        'src': "http://pivotal.github.com/jasmine/",
        'description': "Jasmine is a behavior-driven development framework for testing your JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM. And it has a clean, obvious syntax so that you can easily write tests."
    },{
        'label': "Javascript MVC",
        'src': "http://javascriptmvc.com/",
        'description': "JavaScriptMVC is an open-source framework containing the best ideas in jQuery development. It guides you to successfully completed projects by promoting best practices, maintainability, and convention over configuration."
    },{
        'label': "Jekyll",
        'src': "http://jekyllrb.com/",
        'description': "Jekyll is a simple, blog aware, static site generator. It takes a template directory (representing the raw form of a website), runs it through Textile or Markdown and Liquid converters, and spits out a complete, static website suitable for serving with Apache or your favorite web server."
    },{
        'label': "Joomla",
        'src': "http://www.joomla.org/",
        'description': "Joomla is one of the world’ s most popular open source CMS (content management system). With millions of websites running on Joomla, the software is used by individuals, small & medium-sized businesses, and large organizations worldwide to easily create & build a variety of websites & web-enabled applications."
    },{
        'label': "jQ Touch",
        'src': "http://www.jqtouch.com/",
        'description': "A Zepto/jQuery plugin for mobile web development on the iPhone, Android, iPod Touch, and other forward-thinking devices."
    },{
        'label': "jQuery",
        'src': "http://jquery.com/",
        'description': "jQuery is a fast and concise JavaScript Library that simplifies HTML document traversing, event handling, animating, and Ajax interactions for rapid web development. jQuery is designed to change the way that you write JavaScript."
    },{
        'label': "jQuery Mobile",
        'src': "http://jquerymobile.com/",
        'description': "A unified, HTML5-based user interface system for all popular mobile device platforms, built on the rock-solid jQuery and jQuery UI foundation. Its lightweight code is built with progressive enhancement, and has a flexible, easily themeable design."
    },{
        'label': "jQuery UI",
        'src': "http://jqueryui.com/",
        'description': "jQuery UI provides abstractions for low-level interaction and animation, advanced effects and high-level, themeable widgets, built on top of the jQuery JavaScript Library, that you can use to build highly interactive web applications."
    },{
        'label': "Kirby",
        'src': "http://getkirby.com/",
        'description': "Kirby is a file-based cms. Easy to setup, easy to use, flexible as hell."
    },{
        'label': "Kohana",
        'src': "http://kohanaframework.org/",
        'description': "An elegant HMVC PHP5 framework that provides a rich set of components for building web applications."
    },{
        'label': "Knockout",
        'src': "http://knockoutjs.com/",
        'description': "Simplify dynamic JavaScript UIs by applying the Model-View-View Model (MVVM) pattern"
    },{
        'label': "LESS",
        'src': "http://lesscss.org/",
        'description': "LESS extends CSS with dynamic behavior such as variables, mixins, operations and functions. LESS runs on both the client-side (IE 6+, Webkit, Firefox) and server-side, with Node.js and Rhino."
    },{
        'label': "Lua",
        'src': "http://www.lua.org/",
        'description': "Lua is a powerful, fast, lightweight, embeddable scripting language. Lua combines simple procedural syntax with powerful data description constructs based on associative arrays and extensible semantics."
    },{
        'label': "Memcached",
        'src': "http://memcached.org/",
        'description': "Free & open source, high-performance, distributed memory object caching system, generic in nature, but intended for use in speeding up dynamic web applications by alleviating database load."
    },{
       'label': "MochiKit",
       'src': "http://mochi.github.com/mochikit/",
       'description': "MochiKit is a highly documented and well tested, suite of JavaScript libraries that will help you get shit done, fast. We took all the good ideas we could find from our Python, Objective-C, etc. experience and adapted it to the crazy world of JavaScript."
    },{
        'label': "Moment.js",
        'src': "http://momentjs.com/",
        'description': "A lightweight javascript date library for parsing, manipulating, and formatting dates."
    },{
        'label': "MongoDB",
        'src': "http://www.mongodb.org/",
        'description': "MongoDB (from 'humongous') is a scalable, high-performance, open source NoSQL database. "
    },{
        'label': "MooTools",
        'src': "http://mootools.net/",
        'description': "MooTools is a compact, modular, Object-Oriented JavaScript framework designed for the intermediate to advanced JavaScript developer. It allows you to write powerful, flexible, and cross-browser code with its elegant, well documented, and coherent API."
    },{
        'label': "Mustache",
        'src': "http://mustache.github.com/",
        'description': "Logic-less templates. Available in Ruby, JavaScript, Python, Erlang, PHP, Perl, Objective-C, Java, .NET, Android, C++, Go, Lua, ooc, ActionScript, ColdFusion, Scala, Clojure, Fantom, CoffeeScript, D, and for node.js."
    },{
        'label': "Nesta",
        'src': "http://nestacms.com/",
        'description': "A Ruby CMS for developers and designers. With simple code that's easy to follow, Nesta is easily extended using the Sinatra web framework."
    },{
        'label': "Node",
        'src': "http://nodejs.org",
        'description': "Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices."
    },{
        'label': "NowJS",
        'src': "http://nowjs.com/",
        'description': "NowJS creates a magic namespace 'now', accessible by server and client. Functions and variables added to now are automatically synced, in real-time. Call client functions from the server and server functions from client"
    },{
        'label': "Objective-C",
        'src': "https://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/ObjectiveC/Introduction/introObjectiveC.html",
        'description': "The Objective-C language is a simple computer language designed to enable sophisticated object-oriented programming. Objective-C is defined as a small but powerful set of extensions to the standard ANSI C language."
    },{
        'label': "OpenRasta",
        'src': "http://openrasta.org/",
        'description': "Is OpenRasta an MVC framework? Strictly and semantically speaking, no. However, in reality developing with OpenRasta strongly resembles MVC development."
    },{
        'label': "Padrino",
        'src': "http://www.padrinorb.com",
        'description': "Padrino is a ruby framework built upon the Sinatra web library."
    },{
        'label': "Paper.js",
        'src': "http://paperjs.org",
        'description': "Paper.js is an open source vector graphics scripting framework that runs on top of the HTML5 Canvas. It offers a clean Scene Graph / Document Object Model and a lot of powerful functionality to create and work with vector graphics and bezier curves, all neatly wrapped up in a well designed, consistent and clean programming interface."
    },{
        'label': "Phalcon",
        'src': "http://phalconphp.com/",
        'description': "PhalconPHP is a web framework delivered as a C extension providing high performance and lower resource consumption."
    },{
        'label': "PhoneGap",
        'src': "http://phonegap.com/",
        'description': "PhoneGap is an HTML5 app platform that allows you to author native applications with web technologies and get access to APIs and app stores. PhoneGap leverages web technologies developers already know best... HTML and JavaScript."
    },{
        'label': "Play",
        'src': "http://www.playframework.org/",
        'description': "The Play framework makes it easier to build Web applications with Java and Scala. Finally a Java Web framework made by Web developers. Discover a clean alternative to bloated enterprise Java stacks. Play focuses on developer productivity and targets RESTful architectures."
    },{
        'label': "Processing.js",
        'src': "http://processingjs.org/",
        'description': "Processing.js is the sister project of the popular Processing visual programming language, designed for the web. Processing.js makes your data visualizations, digital art, interactive animations, educational graphs, video games, etc. work using web standards and without any plug-ins."
    },{
        'label': "Prototype",
        'src': "http://www.prototypejs.org/",
        'description': "Prototype is a JavaScript framework that aims to ease development of dynamic web applications. It offers a familiar class-style OO framework, extensive Ajax support, higher-order programming constructs, and easy DOM manipulation."
    },{
        'label': "Pylons",
        'src': "http://www.pylonsproject.org/",
        'description': "Pylons 1.0 is a lightweight web framework emphasizing flexibility and rapid development. Pylons combines the very best ideas from the worlds of Ruby, Python and Perl, providing a structured but extremely flexible Python web framework."
    },{
        'label': "Python",
        'src': "http://python.org/",
        'description': "Python is a programming language that lets you work more quickly and integrate your systems more effectively. You can learn to use Python and see almost immediate gains in productivity and lower maintenance costs."
    },{
        'label': "QUnit",
        'src': "https://github.com/jquery/qunit",
        'description': "QUnit is a powerful, easy-to-use, JavaScript test suite. It's used by the jQuery project to test its code and plugins but is capable of testing any generic JavaScript code (and even capable of testing JavaScript code on the server-side)."
    },{
        'label': "Qwery",
        'src': "https://github.com/ded/qwery",
        'description': "Qwery is a small blazing fast query selector engine allowing you to select elements with CSS1|2|3 queries"
    },{
        'label': "Raphaël",
        'src': "http://raphaeljs.com/",
        'description': "Raphaël is a small JavaScript library that should simplify your work with vector graphics on the web. Raphaël ['ræfeɪəl] uses the SVG W3C Recommendation and VML as a base for creating graphics."
    },{
        'label': "Redis",
        'src': "http://redis.io/",
        'description': "Redis is an open source, advanced key-value store. It is often referred to as a data structure server since keys can contain strings, hashes, lists, sets and sorted sets."
    },{
        'label': "Rhino",
        'src': "http://www.mozilla.org/rhino/",
        'description': "Rhino is an open-source implementation of JavaScript written entirely in Java. It is typically embedded into Java applications to provide scripting to end users."
    },{
        'label': "Ruby",
        'src': "http://www.ruby-lang.org/en/",
        'description': "A dynamic, open source programming language with a focus on simplicity and productivity. It has an elegant syntax that is natural to read and easy to write."
    },{
        'label': "Ruby on Rails",
        'src': "http://rubyonrails.org/",
        'description': "Ruby on Rails is an open-source web framework that's optimized for programmer happiness and sustainable productivity. It lets you write beautiful code by favoring convention over configuration."
    },{
        'label': "Sammy.js",
        'src': "http://sammyjs.org/",
        'description': "Sammy.js is a tiny JavaScript framework developed to ease the pain and provide a basic structure for developing JavaScript applications."
    },{
        'label': "SASS",
        'src': "http://sass-lang.com/",
        'description': "Sass makes CSS fun again. Sass is an extension of CSS3, adding nested rules, variables, mixins, selector inheritance, and more. It’s translated to well-formatted, standard CSS using the command line tool or a web-framework plugin."
    },{
        'label': "Scala",
        'src': "http://www.scala-lang.org/",
        'description': "Scala is a general purpose programming language designed to express common programming patterns in a concise, elegant, and type-safe way. It smoothly integrates features of object-oriented and functional languages, enabling Java and other programmers to be more productive."
    },{
        'label': "Scriptaculous",
        'src': "http://script.aculo.us/",
        'description': "script.aculo.us provides you with easy-to-use, cross-browser user interface JavaScript libraries to make your web sites and web applications fly."
    },{
        'label': "Sencha Touch",
        'src': "http://www.sencha.com/products/touch",
        'description': "Build HTML5 mobile apps for iPhone, Android, and BlackBerry. With over 50 built-in components, state management, and a built-in MVC system, Sencha Touch 2 provides everything you need to create immersive mobile apps."
    },{
        'label': "Sinatra",
        'src': "http://www.sinatrarb.com/",
        'description': "Sinatra is a DSL for quickly creating web applications in Ruby with minimal effort."
    },{
        'label': "Spine.js",
        'src': "http://spinejs.com/",
        'description': "Spine is a lightweight framework for building JavaScript web applications. Spine gives you an MVC structure and then gets out of your way, allowing you to concentrate on the fun stuff, building awesome web applications."
    },{
        'label': "Spring",
        'src': "http://www.springsource.org/",
        'description': "Spring is the most popular application development framework for enterprise Java™. Millions of developers use Spring to create high performing, easily testable, reusable code without any lock-in."
    },{
        'label': "SproutCore",
        'src': "http://sproutcore.com/",
        'description': "SproutCore is an open-source framework for building blazingly fast, innovative user experiences on the web."
    },{
        'label': "Struts",
        'src': "http://struts.apache.org/",
        'description': "The Apache Struts web framework is a free open-source solution for creating Java web applications."
    },{
        'label': "Symfony",
        'src': "http://symfony.com/",
        'description': "Symfony is a PHP framework for web projects. Speed up the creation and maintenance of your PHP web applications. Replace the repetitive coding tasks by power, control and pleasure."
    },{
        'label': "Tapestry",
        'src': "http://tapestry.apache.org/",
        'description': "Component oriented framework for creating dynamic, robust, highly scalable web applications in Java."
    },{
        'label': "Turbo Gears",
        'src': "http://turbogears.org/",
        'description': "TurboGears 2 is a reinvention of the TurboGears project to take advantage of new components, and to provide a fully customizable WSGI (Web Server Gateway Interface) stack. From the beginning TurboGears was designed to be a Full Stack framework built from best-of-breed components. "
    },{
        'label': "Underscore",
        'src': "http://documentcloud.github.com/underscore/",
        'description': "Underscore is a utility-belt library for JavaScript that provides a lot of the functional programming support that you would expect in Prototype.js (or Ruby), but without extending any of the built-in JavaScript objects."
    },{
        'label': "Varnish",
        'src': "https://www.varnish-cache.org/",
        'description': "Varnish is a web application accelerator. You install it in front of your web application and it will speed it up significantly."
    },{
        'label': "Wicket",
        'src': "http://wicket.apache.org/",
        'description': "With proper mark-up/logic separation, a POJO data model, and a refreshing lack of XML, Apache Wicket makes developing web-apps simple and enjoyable again. Swap the boilerplate, complex debugging and brittle code for powerful, reusable components written with plain Java and HTML."
    },{
        'label': "Wink Toolkit",
        'src': "http://www.winktoolkit.org/",
        'description': "Wink Toolkit is a lightweight JavaScript toolkit which will help you build great mobile web apps. It is designed and developed to meet the specific constraints of the mobile environment."
    },{
        'label': "Wordpress",
        'src': "http://wordpress.org/",
        'description': "WordPress is web software you can use to create a beautiful website or blog. We like to say that WordPress is both free and priceless at the same time."
    },{
        'label': "Yii",
        'src': "http://www.yiiframework.com/",
        'description': "Yii is a high-performance PHP framework best for developing Web 2.0 applications. Yii comes with rich features: MVC, DAO/ActiveRecord, I18N/L10N, caching, authentication and role-based access control, scaffolding, testing, etc. It can reduce your development time significantly."
    },{
        'label': "YUI Library",
        'src': "http://developer.yahoo.com/yui/",
        'description': "YUI is a free, open source JavaScript and CSS framework for building richly interactive web applications. YUI is provided under a BSD license and is available on GitHub for forking and contribution."
    },{
        'label': "Zend",
        'src': "http://framework.zend.com/",
        'description': "Extending the art & spirit of PHP, Zend Framework is based on simplicity, object-oriented best practices, corporate friendly licensing, and a rigorously tested agile codebase."
    },{
        'label': "Zepto",
        'src': "http://zeptojs.com/",
        'description': "Zepto.js is a minimalist JavaScript framework for modern web browsers*, with a jQuery-compatible syntax. The goal: a 5-10k library that handles most basic drudge work with a nice API so you can concentrate on getting stuff done."
    }]
};

exports.index = function (req, res) {
    data.term = null;
    var term = null;
    var title = 'What the Framework?';

    var tk = null;

    if (req.headers.host.indexOf('localhost') == -1) {
        if (req.headers.host.indexOf('whattheframework') != -1) {
            tk = 'sfv6rev';
        } else {
            tk = 'nou4wqq';
        }
    }

    var next = function() {
        if (term) {
            if (term.toLowerCase() == 'anything' || term.toLowerCase() == '*') {
                data.term = term;
                title += ' - *';
            } else {
                var match = (_.find(data.items,function(item) {
                    return item.label.toLowerCase() == term.toLowerCase();
                }));

                if (match) {
                    data.term = term;
                    title += ' - ' +match.label;
                }
            }
        }
        res.render("home", { title: title, data: data, tk: tk });
    }

    if (req.method == 'POST') {
        req.on('data', function(chunk) {
            var pair = chunk.toString().split('=');

            if (pair[0] == 'term') {
                term = pair[1];
            }
        });

        req.on('end', next);
    } else {
        term = req.route.params.term;
        next();
    }
};