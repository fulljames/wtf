/*
    {
        'label': "",
        'src': "",
        'description': ""
    },
*/

var data = {
    'items': [{
        'label': "ASP.net MVC",
        'src': "http://www.asp.net/mvc",
        'description': "ASP.NET MVC gives you a powerful, patterns-based way to build dynamic websites that enables a clean separation of concerns and that gives you full control over markup for enjoyable, agile development. ASP.NET MVC includes many features that enable fast, TDD-friendly development for creating sophisticated applications that use the latest web standards."
    },{
        'label': "Backbone",
        'src': "http://documentcloud.github.com/backbone/",
        'description': "Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface."
    },{
        'label': "Cake",
        'src': "http://cakephp.org/",
        'description': "CakePHP enables PHP users at all levels to rapidly develop robust web applications."
    },{
        'label': "Celery",
        'src': "http://celeryproject.org/",
        'description': "Celery is an asynchronous task queue/job queue based on distributed message passing. It is focused on real-time operation, but supports scheduling as well."
    },{
        'label': "CodeIgniter",
        'src': "http://codeigniter.com/",
        'description': "CodeIgniter is a powerful PHP framework with a very small footprint, built for PHP coders who need a simple and elegant toolkit to create full-featured web applications. "
    },{
        'label': "Django",
        'src': "https://www.djangoproject.com/",
        'description': "Django is a high-level Python Web framework that encourages rapid development and clean, pragmatic design."
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
        'label': "Express",
        'src': "http://expressjs.com",
        'description': "High performance, high class web development for Node.js"
    },{
        'label': "Grails",
        'src': "http://grails.org/",
        'description': "Grails is a high-productivity web framework based on the Groovy language that embraces the coding by convention paradigm, but is designed specifically for the Java platform."
    },{
        'label': "Knockout",
        'src': "http://knockoutjs.com/",
        'description': "Simplify dynamic JavaScript UIs by applying the Model-View-View Model (MVVM) pattern"
    },{
        'label': "Node",
        'src': "http://nodejs.org",
        'description': "Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices."
    },{
        'label': "OpenRasta",
        'src': "http://openrasta.org/",
        'description': "Is OpenRasta an MVC framework? Strictly and semantically speaking, no. However, in reality developing with OpenRasta strongly resembles MVC development."
    },{
        'label': "Padrino",
        'src': "http://www.padrinorb.com",
        'description': "Padrino is a ruby framework built upon the Sinatra web library."
    },{
        'label': "Ruby on Rails",
        'src': "http://rubyonrails.org/",
        'description': "Ruby on Rails is an open-source web framework that's optimized for programmer happiness and sustainable productivity. It lets you write beautiful code by favoring convention over configuration."
    },{
        'label': "Sinatra",
        'src': "http://www.sinatrarb.com/",
        'description': "Sinatra is a DSL for quickly creating web applications in Ruby with minimal effort."
    },{
        'label': "Spring",
        'src': "http://www.springsource.org/",
        'description': "Spring is the most popular application development framework for enterprise Java™. Millions of developers use Spring to create high performing, easily testable, reusable code without any lock-in."
    },{
        'label': "SproutCore",
        'src': "http://sproutcore.com/",
        'description': "SproutCore is an open-source framework for building blazingly fast, innovative user experiences on the web."
    },{
        'label': "Underscore",
        'src': "http://documentcloud.github.com/underscore/",
        'description': "Underscore is a utility-belt library for JavaScript that provides a lot of the functional programming support that you would expect in Prototype.js (or Ruby), but without extending any of the built-in JavaScript objects."
    },{
        'label': "Varnish",
        'src': "https://www.varnish-cache.org/",
        'description': "Varnish is a web application accelerator. You install it in front of your web application and it will speed it up significantly."
    },{
        'label': "Zend",
        'src': "http://framework.zend.com/",
        'description': "Extending the art & spirit of PHP, Zend Framework is based on simplicity, object-oriented best practices, corporate friendly licensing, and a rigorously tested agile codebase."
    }]
};

exports.index = function (req, res) {
    res.render("home", { title: 'What the Framework?', data: data });
};