app.models.Producer = Backbone.Model.extend({

    sync: function(method, model, options) {
        if (method === "read") {
            app.adapters.wine.findProducerById(parseInt(this.id)).done(function (data) {
                options.success(data);
            });
        }
    }

});