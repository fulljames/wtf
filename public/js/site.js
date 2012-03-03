var wtf = wtf || { models: {}, funcs: {} };

wtf.models.Page = function(data) {
    var self = this;

    this.input = ko.observable();
    this.matches = ko.observableArray();

    this.input.subscribe(function(value) {

        self.matches([]);

        if (!value || value.length < 2) {
            return;
        }

        var result = _.filter(data.items,function(item) {
            return item.label.toLowerCase().indexOf(value.toLowerCase()) != -1;
        })

        self.matches(result);
    });

    this.set = function(d,e) {
        var parts = e.target.href.split('/');
        var result = parts[parts.length-1];

        self.input(result);
    }

}

$(function() {

    var viewmodel = new wtf.models.Page(data);
    ko.applyBindings(viewmodel);

})