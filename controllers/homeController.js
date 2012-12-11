var _ = require('underscore');
var data = require('../data/items.js');

exports.index = function (req, res) {
    data.term = null;
    var term = null;
    var title = 'What the Framework?';

    var tk = '';

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