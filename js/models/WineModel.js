app.models.Wine = Backbone.Model.extend({

    initialize:function () {

        /* niet meer nodig, was voor reports op te halen
        this.reports = new app.models.ReportsCollection();
        this.reports.parent = this;
        */
    },

    sync: function(method, model, options) {
        if (method === "read") {
            app.adapters.wine.findById(parseInt(this.id)).done(function (data) {
                options.success(data);
            });
        }
    }

});

app.models.WineCollection = Backbone.Collection.extend({

    model: app.models.Wine,

    sync: function(method, model, options) {
        if (method === "read") {
            app.adapters.wine.findByName(options.data.name).done(function (data) {
                options.success(data);
            });
        }
    }

});
