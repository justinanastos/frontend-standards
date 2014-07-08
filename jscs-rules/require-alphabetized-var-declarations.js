var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(requireAlphabetizedVarDeclarations) {
        assert(
            typeof requireAlphabetizedVarDeclarations === 'boolean',
            'requireAlphabetizedVarDeclarations option requires boolean'
        );
        assert(
            requireAlphabetizedVarDeclarations === true,
            'requireAlphabetizedVarDeclarations option requires true value or should be removed'
        );

        this._requireAlphabetizedVarDeclarations = requireAlphabetizedVarDeclarations;
    },

    getOptionName: function() {
        return 'requireAlphabetizedVarDeclarations';
    },

    check: function(file, errors) {
        var nodesToScan = [];

        // Iterate through each function declaration inside the file. Add each
        // node to the list of nodes that will be scanned.
        file.iterateNodesByType(['FunctionDeclaration', 'FunctionExpression'], function(functionNode) {
            nodesToScan.push(functionNode.body.body);
        });

        // Return the string with the first letter as it was and the rest of the
        // letters in lowecase.
        function toLowerCaseAfterFirstLetter(string) {
            return string.substr(0, 1) + string.substr(1).toLowerCase();
        }

        // Check variables are in alphabetical order. This will ignore case after
        // the first letter by use of `toLowerCaseAfterFirstLetter`.
        function checkVariables(variableName, previousVariableName) {
            if (variableName.substr(0, 1) === '$' && previousVariableName === previousVariableName.toUpperCase()) {
                // If this variable starts with a $ and the previous is all
                // caps, then the previous is a constant and this should return
                // `true`.
                return true;
            }

            // Ignore case after the first letter of both variables.
            variableName = toLowerCaseAfterFirstLetter(variableName);
            previousVariableName = toLowerCaseAfterFirstLetter(previousVariableName);

            return variableName > previousVariableName;
        }

        // Create custom iterator to prevent needing lodash or underscore.
        function each(obj, iterator, context) {
            var key;

            if (obj === null || typeof obj === 'undefined') {
                return obj;
            }

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key, obj);
                }
            }

            return obj;
        }

        // Define function to scan a node. If child blocks are found, they will
        // be added to the nodesToScan stack.
        function checkNode(node) {
            // Define the previous variable name.
            var previousVariableName;

            // Loop through each childNode inside this node.
            each(node, function(childNode) {
                var childNodeType = childNode.type;
                var childNodeDeclarations;

                if (childNodeType === 'VariableDeclaration') {
                    // This is a variable declaration. Each declaration can
                    // declare multiple variables (var a, b;), so loop through
                    // all of them.

                    if (childNode.declarations) {
                        childNodeDeclarations = childNode.declarations;
                    } else if (childNode.body) {
                        childNodeDeclarations = childNode.body;
                    } else {
                        throw new Error('no children');
                    }

                    each(childNode.declarations, function(declaration) {
                        // Save the variable name.
                        var variableName = declaration.id.name;

                        if (typeof previousVariableName !== 'undefined') {
                            // This is at least the second variable in the block.
                            if (!checkVariables(variableName, previousVariableName)) {
                                errors.add(
                                    'Var declarations should be in alphabetical order (\'' + previousVariableName + '\' found before \'' + variableName + '\')',
                                    declaration.parentNode.loc.start
                                );
                            }
                        }

                        previousVariableName = declaration.id.name;
                    });
                }
            });
        }

        while (nodesToScan.length > 0) {
            checkNode(nodesToScan.pop());
        }
    }
};
