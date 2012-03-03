var fs = require('fs'),
    less = require('less'),
    step = require('step');

var filename = 'style';

step(
    function read() {
        fs.readFile(__dirname + '/../public/styles/'+filename+'.less', this);
    },
    function compile(err, data) {
        if (err) {
            console.log(err);
        } else {
            less.render(data.toString(), this);
        }
    },
    function write(err, css) {
        if (err) {
            console.log(err);
        } else {
            fs.writeFile(__dirname + '/../public/styles/'+filename+'.css', css, this);
        }
    },
    function done(err) {
        if (err) {
            console.log(err);
        }
    }
);