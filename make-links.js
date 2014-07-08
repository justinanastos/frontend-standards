/*jshint node: true */

var fs = require('fs');
var destinationPath;
var sourceFileList;
var sourceFile;
var destinationFile;
var cwd = process.cwd();
var index;
var filename;

function findNodeModulesPath() {
    var dirnamePieces;
    var nodeModulesPath;
    var projectPathDepth;

    dirnamePieces = __dirname.split(/[\\\/]/);
    projectPathDepth = dirnamePieces.indexOf('frontend-standards');
    nodeModulesPath = dirnamePieces.slice(0, projectPathDepth).join('/');

    return nodeModulesPath;
}

function findProjectRootPath() {
    var nodeModulesPath = findNodeModulesPath();
    var nodeModulesPathPieces;

    nodeModulesPathPieces = nodeModulesPath.split(/[\\\/]/);
    nodeModulesPathPieces.pop();

    return nodeModulesPathPieces.join('/');
}

function isFileSymbolicLink(filename) {
    var stats;
    var isSymbolicLink;

    stats = fs.lstatSync(filename);
    isSymbolicLink = stats.isSymbolicLink();

    return isSymbolicLink;
}

function createLink(sourceFile, destinationFile, filenameWithoutPath) {
    // Create symlink.
    fs.symlink(sourceFile, destinationFile, 'file', function(error) {
        if (error) {
            // There was an error.

            if (error.code === 'EEXIST') {
                // File exists error.

                if (!isFileSymbolicLink(destinationFile)) {
                    // File is not a symbolic link. Do nothing.

                    console.log('WARNING:', filenameWithoutPath, 'already exists and will not be overwritten.');
                } else {
                    // File is a symbolic link. Erase and overwrite.
                    fs.unlink(destinationFile, function(error) {
                        if (!error) {
                            // No error on unlink. Try to create the link again.
                            createLink(sourceFile, destinationFile);
                        } else {
                            // Unexpected error.
                            throw new Error(error);
                        }
                    });
                }
            } else {
                // Unexpected error.
                throw new Error(error);
            }
        }
    });
}

destinationPath = findProjectRootPath();
sourceFileList = fs.readdirSync(cwd + '/linter-configurations');

for (index in sourceFileList) {
    if (sourceFileList.hasOwnProperty(index)) {
        filename = sourceFileList[index];

        sourceFile = cwd + '/linter-configurations/' + filename;
        destinationFile = destinationPath + '/' + filename;

        createLink(sourceFile, destinationFile, filename);
    }
}

