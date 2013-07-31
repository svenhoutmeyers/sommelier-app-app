app.views.MapView = Backbone.View.extend({

    render: function () {
        
        var producer = this.model.attributes;
        console.log(producer.latitude);
        
        this.$el.html(this.template());

        setTimeout(function() {
            // create a map in the "map" div, set the view to a given place and zoom
            var map = L.map('map', {zoomControl:false}).setView([producer.latitude, producer.longitude], 14);
            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // add a marker in the given location, attach some popup content to it and open the popup
            L.marker([producer.latitude, producer.longitude]).addTo(map);
        });

        return this;
    },

    events: {
        "click .back-button": "back"
    },

    back: function() {
        window.history.back();
        return false;
    }

});
