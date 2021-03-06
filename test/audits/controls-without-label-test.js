module('ControlsWithoutLabel');

test('Button with type="submit" or type="reset" has label', function(assert) {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var submitInput = document.createElement('input');
    submitInput.type = 'submit';
    fixture.appendChild(submitInput);
    var resetInput = document.createElement('input');
    resetInput.type = 'reset';
    fixture.appendChild(resetInput);

    var config = {
        ruleName: 'controlsWithoutLabel',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Button element with inner text needs no label', function(assert) {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var button = document.createElement('button');
    button.textContent = 'Click me!';
    fixture.appendChild(button);

    var config = {
        ruleName: 'controlsWithoutLabel',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Button element with empty inner text does need a label', function(assert) {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var button = document.createElement('button');
    button.innerHTML = '<span></span>';
    fixture.appendChild(button);

    var config = {
        ruleName: 'controlsWithoutLabel',
        expected: axs.constants.AuditResult.FAIL
    };
    assert.runRule(config);
});

test('Input type button with value needs no label', function(assert) {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var input = document.createElement('input');
    input.type = 'button';
    input.value = 'Click me!';
    fixture.appendChild(input);

    var config = {
        ruleName: 'controlsWithoutLabel',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Input with role="presentation" needs no label', function(assert) {
    var fixture = document.getElementById('qunit-fixture');

    var input = document.createElement('input');
    var select = document.createElement('select');
    var textarea = document.createElement('textarea');
    var button = document.createElement('button');
    var video = document.createElement('video');

    var controls = [input, select, textarea, button, video];

    controls.forEach(function(control) {
      control.setAttribute("role", "presentation");
      fixture.appendChild(control);
    });

    var config = {
        ruleName: 'controlsWithoutLabel',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

test('Button element with image with alt needs no label', function(assert) {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var button = document.createElement('button');
    var img = button.appendChild(document.createElement('img'));
    img.setAttribute("alt", "Save");
    fixture.appendChild(button);

    var config = {
        ruleName: 'controlsWithoutLabel',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Button element with image with empty alt needs a label', function(assert) {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var button = document.createElement('button');
    var img = button.appendChild(document.createElement('img'));
    img.setAttribute("alt", "");
    fixture.appendChild(button);

    var config = {
        ruleName: 'controlsWithoutLabel',
        expected: axs.constants.AuditResult.FAIL,
        elements: [button]
    };
    assert.runRule(config);
});

test('Button element with image with no alt needs a label', function(assert) {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var button = document.createElement('button');
    button.appendChild(document.createElement('img'));
    fixture.appendChild(button);

    var config = {
        ruleName: 'controlsWithoutLabel',
        expected: axs.constants.AuditResult.FAIL,
        elements: [button]
    };
    assert.runRule(config);
});

(function() {
    var needLabel = ['checkbox', 'email', 'file', 'number', 'password', 'radio', 'range', 'tel', 'text', 'time', 'url'];

    test('Input types which need a label - missing label', function(assert) {
        needLabel.forEach(function (type) {
            var input = document.createElement('input');
            input.setAttribute("type", type);
            var fixture = document.getElementById('qunit-fixture');
            fixture.appendChild(input);
            try {
                var config = {
                    ruleName: 'controlsWithoutLabel',
                    expected: axs.constants.AuditResult.FAIL,
                    elements: [input]
                };
                assert.runRule(config);
            } finally {
                fixture.removeChild(input);
            }
        });
    });

    test('Input types which need a label - ARIA label', function(assert) {
        needLabel.forEach(function(type) {
            var input = document.createElement('input');
            input.setAttribute("type", type);
            input.setAttribute("aria-label", "What is the answer?");
            var fixture = document.getElementById('qunit-fixture');
            fixture.appendChild(input);
            try {
                var config = {
                    ruleName: 'controlsWithoutLabel',
                    expected: axs.constants.AuditResult.PASS,
                    elements: []
                };
                assert.runRule(config);
            } finally {
                fixture.removeChild(input);
            }
        });
    });

    test('Input types which need a label - ARIA labelledby', function(assert) {
        needLabel.forEach(function(type) {
            var input = document.createElement('input');
            input.setAttribute("type", type);
            var id = goog.getUid(input);
            input.setAttribute("aria-labelledby", id);
            var label = document.createElement('span');
            label.textContent = "What is the answer?";
            label.setAttribute("id", id);
            ok(document.getElementById(id) == null, "test is not reliable, id conflict");
            var fixture = document.getElementById('qunit-fixture');
            fixture.appendChild(label);
            fixture.appendChild(input);
            try {
                var config = {
                    ruleName: 'controlsWithoutLabel',
                    expected: axs.constants.AuditResult.PASS,
                    elements: []
                };
                assert.runRule(config);
            } finally {
                fixture.removeChild(input);
                fixture.removeChild(label);
            }
        });
    });

    test('Input types which need a label - HTML label', function(assert) {
        needLabel.forEach(function(type) {
            var input = document.createElement('input');
            input.setAttribute("type", type);
            var id = goog.getUid(input);
            input.setAttribute("id", id);
            var label = document.createElement('label');
            label.textContent = "What is the answer?";
            label.setAttribute("for", id);
            ok(document.getElementById(id) == null, "test is not reliable, id conflict");
            var fixture = document.getElementById('qunit-fixture');
            fixture.appendChild(label);
            fixture.appendChild(input);
            try {
                var config = {
                    ruleName: 'controlsWithoutLabel',
                    expected: axs.constants.AuditResult.PASS,
                    elements: []
                };
                assert.runRule(config);
            } finally {
                fixture.removeChild(input);
                fixture.removeChild(label);
            }
        });
    });
})();
