var wtf = wtf || { models: {}, funcs: {} };

wtf.settings = {
    'minFontSize' : Number.NEGATIVE_INFINITY,
    'maxFontSize' : Number.POSITIVE_INFINITY
}

// modified from FitText.js 1.0
// Copyright 2011, Dave Rupert http://daverupert.com
wtf.funcs.resizer = function(w) {
    return Math.max(Math.min(w / 10, parseFloat(wtf.settings.maxFontSize)), parseFloat(wtf.settings.minFontSize))
}

wtf.models.Page = function(data) {
    var self = this;
    this.input = ko.observable();
    this.matches = ko.observableArray();

    this.h1w = ko.observable($('h1')[0].clientWidth);
    this.headerSizePx = ko.computed(function() {
        return wtf.funcs.resizer(self.h1w()) + 'px';
    });

    this.input.subscribe(function(value) {

        self.matches([]);

        if (!value || value.length < 2) {
            return;
        }

        if (value.toLowerCase() == 'anything') {
            self.matches(data.items);
            return;
        }

        var result = $.filter(data.items,function(item) {
            return item.label.toLowerCase().indexOf(value.toLowerCase()) != -1;
        })

        self.matches(result);
    });

    this.set = function(d,e) {
        var parts = e.target.href.split('/');
        var result = parts[parts.length-1];

        self.input(result);
    }

    if (data.term) {
        this.input(data.term);
    }

}

$(document).ready(function () {

    var viewmodel = new wtf.models.Page(data);
    ko.applyBindings(viewmodel);

    $(window).resize(function(e) {
        viewmodel.h1w($('h1')[0].clientWidth);
    });
});