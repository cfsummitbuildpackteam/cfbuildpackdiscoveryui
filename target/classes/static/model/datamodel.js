var neo4j = require('neo4j');
var errors = require('./errors');

var db = new neo4j.GraphDatabase({
    url: 'http://neo4j:test1234@localhost:7474',
	auth: null
});

// Private constructor:

var User = module.exports = function User(_node) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// Public constants:

User.VALIDATION_INFO = {
    'username': {
        required: true,
        minLength: 2,
        maxLength: 16,
        pattern: /^[A-Za-z0-9_]+$/,
        message: '2-16 characters; letters, numbers, and underscores only.'
    },
};

// Public instance properties:

// The user's username, e.g. 'aseemk'.
Object.defineProperty(User.prototype, 'username', {
    get: function () { return this._node.properties['username']; }
});

// Private helpers:

// Takes the given caller-provided properties, selects only known ones,
// validates them, and returns the known subset.
// By default, only validates properties that are present.
// (This allows `User.prototype.patch` to not require any.)
// You can pass `true` for `required` to validate that all required properties
// are present too. (Useful for `User.create`.)
function validate(props, required) {
    var safeProps = {};

    for (var prop in User.VALIDATION_INFO) {
        var val = props[prop];
        validateProp(prop, val, required);
        safeProps[prop] = val;
    }

    return safeProps;
}

// Validates the given property based on the validation info above.
// By default, ignores null/undefined/empty values, but you can pass `true` for
// the `required` param to enforce that any required properties are present.
function validateProp(prop, val, required) {
    var info = User.VALIDATION_INFO[prop];
    var message = info.message;

    if (!val) {
        if (info.required && required) {
            throw new errors.ValidationError(
                'Missing ' + prop + ' (required).');
        } else {
            return;
        }
    }

    if (info.minLength && val.length < info.minLength) {
        throw new errors.ValidationError(
            'Invalid ' + prop + ' (too short). Requirements: ' + message);
    }

    if (info.maxLength && val.length > info.maxLength) {
        throw new errors.ValidationError(
            'Invalid ' + prop + ' (too long). Requirements: ' + message);
    }

    if (info.pattern && !info.pattern.test(val)) {
        throw new errors.ValidationError(
            'Invalid ' + prop + ' (format). Requirements: ' + message);
    }
}

function isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation';
}
