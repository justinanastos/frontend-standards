/*global module */
var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(disallowVarHoisting) {
        assert(
            typeof disallowVarHoisting === 'boolean',
            'disallowVarHoisting option requires boolean or string'
        );
        assert(
            disallowVarHoisting === true,
            'disallowVarHoisting option requires true value or should be removed'
        );

        this._disallowVarHoisting = disallowVarHoisting;
    },

    getOptionName: function() {
        return 'disallowVarHoisting';
    },

    check: function(file, errors) {
        file.iterateNodesByType('VariableDeclaration', function(node) {
            var variable = node.declarations[0];
            var pos = node.parentCollection.indexOf(node);

            if (pos > 0) {
                var sibling = node.parentCollection[pos - 1];
                if (sibling.type !== 'VariableDeclaration') {
                    errors.add(
                        'Var declarations should be at top of functional scope',
                        variable.parentNode.loc.start
                    );
                }
            }
        });
    }
};
