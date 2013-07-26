app.routers.AppRouter = Backbone.Router.extend({

    routes: {
        "":                     "home",
        "wines/:id":            "wineDetails",
        "producers/:id":        "producerDetails",
        "wines/:id/reports":    "reports",
        "wines/:id/map":        "map"
    },

    initialize: function () {
        app.slider = new PageSlider($('body'));

    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!app.homeView) {
            app.homeView = new app.views.HomeView();
            app.homeView.render();
        } else {
            console.log('reusing home view');
            app.homeView.delegateEvents(); // delegate events when the view is recycled
        }
        app.slider.slidePage(app.homeView.$el);
    },

    wineDetails: function (id) {
        var wine = new app.models.Wine({id: id});
        wine.fetch({
            success: function (data) {
                // Note that we could also 'recycle' the same instance of WineFullView
                // instead of creating new instances
                app.slider.slidePage(new app.views.WineView({model: data}).render().$el);
            }
        });
    },
    
    producerDetails: function (id) {
        var producer = new app.models.Producer({id: id});
        
        producer.fetch({
            success: function (data) {
                app.slider.slidePage(new app.views.ProducerView({model: data}).render().$el);
            }
        });
    },

    reports: function (id) {
        var wine = new app.models.Wine({id: id});
        wine.fetch({
            success: function (data) {
                // Note that we could also 'recycle' the same instance of WineFullView
                // instead of creating new instances
                app.slider.slidePage(new app.views.ReportsView({model: data}).render().$el);
            }
        });
    },

    map: function (id) {
        app.slider.slidePage(new app.views.MapView().render().$el);
    }

});