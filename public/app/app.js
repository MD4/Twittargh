(function () {
    "use strict";

    var DEFAULT_ROUTE = 'one';

    var template = document.querySelector('#t');
    var navTabs = document.querySelector('#t /deep/ #paper-tabs');

    template.pages = [
        {name: 'Wall', hash: 'wall'},
        {name: 'User', hash: 'profile'},
        {name: 'Tag', hash: 'tag'}
    ];




    template.addEventListener('template-bound', function (e) {
        var keys = document.querySelector('#keys');

        // Allow selecting pages by num keypad. Dynamically add
        // [1, template.pages.length] to key mappings.
        var keysToAdd = Array.apply(null, template.pages).map(function (x, i) {
            return i + 1;
        }).reduce(function (x, y) {
            return x + ' ' + y;
        });
        keys.keys += ' ' + keysToAdd;

        this.route = this.route || DEFAULT_ROUTE; // Select initial route.
    });


    // Patches

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        };
    }

})();
