app.adapters.employee = (function () {

        
    var deferred = $.Deferred();
    var db = window.openDatabase("Database", "1.0", "Cellar DB", 2000000);
    
    var siteurl = 'http://local.sommelierapp.com';

    db.transaction(
                function(tx) {
                    createTables(tx);
                    addData(tx);
                },
                function(error) {
                    //console.log('Transaction error: ' + error);
                    deferred.reject('Transaction error: ' + error);
                },
                function() {
                    //console.log('Transaction success');
                    deferred.resolve();
                }
    );
    
    
    findByName = function(searchKey) {
        var deferred = $.Deferred();

        db.transaction(
            function(tx) {

                var sql = "SELECT c.nid, c.title, c.amount, c.image_uri, c.price, c.year, c.type_tid, p.title as ptitle " +
                    "FROM cellar c LEFT JOIN producers p ON c.producer_nid = p.nid " +
                    "WHERE c.title || ' ' || p.title LIKE ? " +
                    "ORDER BY c.region_weight, c.producer_nid, c.title";
                    
                
                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    
                    
                    var len = results.rows.length,
                        cellar = [],
                        i = 0,
                        terms = JSON.parse(localStorage['terms']);

                    for (; i < len; i = i + 1) {
                    
                        cellar[i] = results.rows.item(i);
                        if('type_tid' in cellar[i]) {
                          cellar[i].type = terms[cellar[i].type_tid];
                        }
                    }
                    
                    deferred.resolve(cellar);
                });
            },
            function(error) {
                deferred.reject("Transaction Error: " + error.message);
            }
        );
        return deferred.promise();
    },
    

    findById = function(id) {
        var deferred = $.Deferred();
        db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.firstName, e.lastName, e.title, e.reports, e.city, e.officePhone, e.cellPhone, e.email, e.managerId, e.managerName, m.firstName managerFirstName, m.lastName managerLastName, count(r.id) reportCount " +
                    "FROM employee e " +
                    "LEFT JOIN employee r ON r.managerId = e.id " +
                    "LEFT JOIN employee m ON e.managerId = m.id " +
                    "WHERE e.id=:id";

                tx.executeSql(sql, [id], function(tx, results) {
                    deferred.resolve(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                deferred.reject("Transaction Error: " + error.message);
            }
        );
        return deferred.promise();
    };
    

    var createTables = function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS employee');
        var sql = "CREATE TABLE IF NOT EXISTS employee ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "firstName VARCHAR(50), " +
            "lastName VARCHAR(50), " +
            "title VARCHAR(50), " +
            "managerId INTEGER, " +
            "managerName VARCHAR(50), " +
            "reports INTEGER, " +
            "department VARCHAR(50), " +
            "city VARCHAR(50), " +
            "pic VARCHAR(50), " +
            "officePhone VARCHAR(50), " +
            "cellPhone VARCHAR(50), " +
            "twitterId VARCHAR(50), " +
            "blog VARCHAR(50), " +
            "email VARCHAR(50))";
        tx.executeSql(sql, null,
            function() {
                //console.log('Create table success');
            },
            function(tx, error) {
                alert('Create table error: ' + error.message);
          });
          
        tx.executeSql('DROP TABLE IF EXISTS cellar');
        var sql = "CREATE TABLE IF NOT EXISTS cellar ( " +
            "nid INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "title VARCHAR(100), " +
            "body VARCHAR(1024), " +
            "producer_nid INTEGER, " +
            "amount INTEGER, " +
            "appelation VARCHAR(50), " +
            "appelation_info VARCHAR(50), " +
            "cepages_tid INTEGER, " +
            "cepages_info VARCHAR(50), " +
            "image_uri VARCHAR(100), " +
            "cellartracker_link VARCHAR(100), " +
            "year VARCHAR(4), " +
            "type_tid INTEGER, " +
            "price VARCHAR(50), " +
            "price_tid INTEGER, " +
            "region_tids VARCHAR(50), " +
            "region_weight INTEGER, " +
            "alcohol VARCHAR(50), " +
            "drink_tid INTEGER)";
        tx.executeSql(sql, null,
            function() {
                //console.log('Create table success');
            },
            function(tx, error) {
                alert('Create table error: ' + error.message);
          });
          
        tx.executeSql('DROP TABLE IF EXISTS producers');
        var sql = "CREATE TABLE IF NOT EXISTS producers ( " +
            "nid INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "title VARCHAR(100), " +
            "body VARCHAR(1024), " +
            "image_uri VARCHAR(100), " +
            "type_domain VARCHAR(100), " +
            "address VARCHAR(200), " +
            "province_name VARCHAR(100), " +
            "country_name VARCHAR(100), " +
            "country VARCHAR(10), " +
            "latitude VARCHAR(20), " +
            "longitude VARCHAR(20), " +
            "region_tids VARCHAR(50), " +
            "hectares VARCHAR(50), " +
            "cepages_tid INTEGER, " +
            "cepages_extra_tid INTEGER, " +
            "site_link VARCHAR(100), " +
            "facebook_link VARCHAR(100), " +
            "mail VARCHAR(100), " +
            "phone VARCHAR(100))";
        tx.executeSql(sql, null,
            function() {
                //console.log('Create table success');
            },
            function(tx, error) {
                alert('Create table error: ' + error.message);
          });
          
          
    }

    var addData = function(tx) {

        url = siteurl + "/sa/cellar/json/all";
        mail = "sven.houtmeyers@telenet.be";

        $.getJSON(url + "?mail=" + mail + "&callback=?", function(data) {insertData(data);});
        
        function insertData(data) {
        
            db.transaction(
                function(tx) {
    
                    // Cellar > websql
                    var l = data.cellar.results.length;
                    var sql = 'INSERT  OR REPLACE INTO CELLAR (nid, title, body, producer_nid, amount, appelation, appelation_info, cepages_tid, cepages_info, image_uri, cellartracker_link, year, type_tid, price, price_tid, region_tids, region_weight, alcohol, drink_tid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                    
                    var c;
                    for (var i = 0; i < l; i++) {
                        c = data.cellar.results[i];
                        
                        tx.executeSql(sql, [c.nid, c.title, c.body, c.producer_nid, c.amount, c.appelation, c.appelation_info, c.cepages_tid, c.cepages_info, c.image_uri, c.cellartracker_link, c.year, c.type_tid, c.price, c.price_tid, c.region_tids, c.region_weight, c.alcohol, c.drink_tid],
                                function() {
                                    console.log('INSERT cellar item success');
                                },
                                function(tx, error) {
                                    alert('INSERT error: ' + error.message);
                                });
                    }
                    
                    
                    // Producers > websql
                    var l = data.producers.results.length;
                    var sql = 'INSERT INTO PRODUCERS (nid, title, body, image_uri, type_domain, address, province_name, country_name, country, latitude, longitude, region_tids, hectares, cepages_tid, cepages_extra_tid, site_link, facebook_link, mail, phone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                    
                    var c;
                    for (var i = 0; i < l; i++) {
                        p = data.producers.results[i];
                        
                        tx.executeSql(sql, [p.nid, p.title, p.body, p.image_uri, p.type_domain, p.address, p.province_name, p.country_name, p.country, p.latitude, p.longitude, p.region_tids, p.hectares, p.cepages_tid, p.cepages_extra_tid, p.site_link, p.facebook_link, p.mail, p.phone],
                                function() {
                                    console.log('INSERT producers item success');
                                },
                                function(tx, error) {
                                    alert('INSERT error: ' + error.message);
                                });
                    }
                    
                    // Terms > localStorage
                    $.ajax({
                         url : siteurl + "/sa/terms/json" + "?callback=?",
                         dataType : "jsonp",
                         success: function(data){
                            localStorage['terms'] = JSON.stringify(data);
                         }
                    });


                }
            );

        }

        
    
    }

    
    
    // The public API
    return {
        findById: findById,
        findByName: findByName
        //findByManager: findByManager
    };

}());    