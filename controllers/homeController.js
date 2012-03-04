var data = {
    'items': [{
        'label': "Node",
        'src': "http://nodejs.org",
        'description': "Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices."
    },{
        'label': "Ender",
        'src': "http://ender.no.de",
        'description': "Ender is a full featured package manager for your browser. It allows you to search, install, manage, and compile front-end javascript packages and their dependencies for the web. We like to think of it as NPM's little sister."
    },
    {
        'label': "Express",
        'src': "http://expressjs.com",
        'description': "High performance, high class web development for Node.js"
    },{
        'label': "Padrino",
        'src': "http://www.padrinorb.com",
        'description': "Padrino is a ruby framework built upon the Sinatra web library."
    },{
        'label': "Celery",
        'src': "http://celeryproject.org/",
        'description': "Celery is an asynchronous task queue/job queue based on distributed message passing. It is focused on real-time operation, but supports scheduling as well."
    },{
        'label': "Varnish",
        'src': "https://www.varnish-cache.org/",
        'description': "Varnish is a web application accelerator. You install it in front of your web application and it will speed it up significantly."
    },{
        'label': "Cake",
        'src': "http://cakephp.org/",
        'description': "CakePHP enables PHP users at all levels to rapidly develop robust web applications."
    },{
        'label': "CodeIgniter",
        'src': "http://codeigniter.com/",
        'description': "CodeIgniter is a powerful PHP framework with a very small footprint, built for PHP coders who need a simple and elegant toolkit to create full-featured web applications. "
    },{
        'label': "Knockout",
        'src': "http://knockoutjs.com/",
        'description': "Simplify dynamic JavaScript UIs by applying the Model-View-View Model (MVVM) pattern"
    },{
        'label': "Underscore",
        'src': "http://documentcloud.github.com/underscore/",
        'description': "Underscore is a utility-belt library for JavaScript that provides a lot of the functional programming support that you would expect in Prototype.js (or Ruby), but without extending any of the built-in JavaScript objects."
    }]
};

exports.index = function (req, res) {
    res.render("home", { title: 'What the Framework?', data: data });
};