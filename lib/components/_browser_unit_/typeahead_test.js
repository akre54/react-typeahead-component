'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    TestUtils = require('react-addons-test-utils'),
    Typeahead = require('../typeahead');

describe('Typeahead', function () {
    // This is only required for tests which use `setSelectionRange`.
    // We have to render into the body because `setSelectionRange`
    // doesn't work if the element isn't actually on the page.
    // With React >= 0.14 rendering into document.body outputs a warning,
    // use a div inside an iframe instead. (http://yahooeng.tumblr.com/post/102274727496/to-testutil-or-not-to-testutil)

    var setupIframe = function () {
        this.iframe = document.createElement('iframe');
        document.body.appendChild(this.iframe);

        this.iframeDiv = document.createElement('div');
        this.iframe.contentDocument.body.appendChild(this.iframeDiv);
    };

    afterEach(function () {
        if (this.iframeDiv) {
            ReactDOM.unmountComponentAtNode(this.iframeDiv);
            delete this.iframeDiv;
        }

        if (this.iframe) {
            ReactDOM.unmountComponentAtNode(this.iframe.contentDocument.body);
            document.body.removeChild(this.iframe);
            delete this.iframe;
        }
    });

    describe('#componentWillReceiveProps', function () {
        it('should set `isHintVisible` to false if there isn\'t something completeable', function (done) {
            var div = document.createElement('div');
            var typeaheadInstance = ReactDOM.render(React.createElement(Typeahead, {
                inputValue: 'e',
                handleHint: function () {
                    return 'ezequiel';
                }
            }), div);

            // Put Typeahead in a state where the hint is visible.
            typeaheadInstance.handleChange({ target: { value: '' } });

            // The hint should be visible at this point.
            expect(typeaheadInstance.state.isHintVisible).to.be.true;

            ReactDOM.render(React.createElement(Typeahead, {
                inputValue: 'm',
                handleHint: function () {
                    return '';
                }
            }), div, function () {
                expect(typeaheadInstance.state.isHintVisible).to.be.false;
                done();
            });
        });

        it('should set `isHintVisible` to true if there is something completeable', function (done) {
            var div = document.createElement('div');
            var typeaheadInstance = ReactDOM.render(React.createElement(Typeahead, {
                inputValue: 'm',
                handleHint: function () {
                    return '';
                }
            }), div);

            // The hint should not be visible at this point.
            expect(typeaheadInstance.state.isHintVisible).to.be.false;

            ReactDOM.render(React.createElement(Typeahead, {
                inputValue: 'e',
                handleHint: function () {
                    return 'ezequiel';
                }
            }), div, function () {
                expect(typeaheadInstance.state.isHintVisible).to.be.true;
                done();
            });
        });
    });

    describe('#showDropdown', function () {
        it('should show the dropdown', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.showDropdown();

            expect(typeaheadInstance.state.isDropdownVisible).to.be.true;
        });
    });

    describe('#hideDropdown', function () {
        it('should hide the dropdown', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.hideDropdown();

            expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
        });
    });

    describe('#showHint', function () {
        it('should not show the hint if there is no `inputValue`', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.showHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });

        it('should not show the hint if there is no hint available', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze'
            }));

            typeaheadInstance.showHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });

        it('should not show the hint if there is no hint available to complete', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze',
                handleHint: function () {
                    return 'eze';
                }
            }));

            typeaheadInstance.showHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });

        it('should show the hint if there is a hint available to complete', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze',
                handleHint: function () {
                    return 'ezequiel';
                }
            }));

            typeaheadInstance.showHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.true;
        });
    });

    describe('#hideHint', function () {
        it('should hide the hint', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.hideHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });
    });

    describe('#setSelectedIndex', function () {
        it('should set the selected index', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.setSelectedIndex(1337);

            expect(typeaheadInstance.state.selectedIndex).to.be.equal(1337);
        });
    });

    describe('#handleChange', function () {
        it('should show the hint on change', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze',
                handleHint: function () {
                    return 'ezequiel';
                }
            }));

            typeaheadInstance.handleChange({ target: { value: '' } });
            expect(typeaheadInstance.state.isHintVisible).to.be.equal(true);
        });

        it('should show the dropdown on change', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.handleChange({ target: { value: '' } });
            expect(typeaheadInstance.state.isDropdownVisible).to.be.equal(true);
        });

        it('should reset the selected index on change', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.handleChange({ target: { value: '' } });
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });

        it('should call `onChange` if passed in', function () {
            var handleChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                onChange: handleChange
            }));

            typeaheadInstance.handleChange({ target: { value: '' } });
            expect(handleChange).to.have.been.called.once;
        });

        it('should pass the event object to `onChange` if passed in', function () {
            var handleChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                onChange: handleChange
            })),
                eventData = {
                timestamp: Date.now(),
                target: {
                    value: ''
                }
            };

            typeaheadInstance.handleChange(eventData);
            expect(handleChange).to.have.been.calledWith(eventData);
        });
    });

    describe('#handleFocus', function () {
        it('should show the dropdown on focus', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.handleFocus();
            expect(typeaheadInstance.state.isDropdownVisible).to.be.equal(true);
        });

        it('should call `onFocus` if passed in', function () {
            var handleFocus = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                onFocus: handleFocus
            }));

            typeaheadInstance.handleFocus();
            expect(handleFocus).to.have.been.called.once;
        });

        it('should pass the event object to `onFocus` if passed in', function () {
            var handleFocus = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                onFocus: handleFocus
            })),
                eventData = {
                timestamp: Date.now()
            };

            typeaheadInstance.handleFocus(eventData);
            expect(handleFocus).to.have.been.calledWith(eventData);
        });
    });

    describe('#handleClick', function () {
        it('should show the hint on click', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze',
                handleHint: function () {
                    return 'ezequiel';
                }
            }));

            typeaheadInstance.handleClick();
            expect(typeaheadInstance.state.isHintVisible).to.be.equal(true);
        });
    });

    describe('#navigate', function () {

        it('should not change the selected index if there is no `options`', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.navigate(-1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);

            typeaheadInstance.navigate(1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });

        it('should not change the selected index if `options` is empty', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                options: []
            }));

            typeaheadInstance.navigate(-1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);

            typeaheadInstance.navigate(1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });

        it('should increment and decrement the selected index if we navigate down and up respectively', function () {
            var OptionTemplate = React.createClass({
                displayName: 'OptionTemplate',

                render: function () {
                    return React.createElement(
                        'p',
                        null,
                        this.props.data
                    );
                }
            }),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                options: ['a', 'b', 'c'],
                optionTemplate: OptionTemplate
            }));

            typeaheadInstance.navigate(1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(0);

            typeaheadInstance.navigate(-1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });

        it('should wrap the selected index if we navigate up before the input and down past the last item respectively', function () {
            var OptionTemplate = React.createClass({
                displayName: 'OptionTemplate',

                render: function () {
                    return React.createElement(
                        'p',
                        null,
                        this.props.data
                    );
                }
            }),
                options = ['a', 'b', 'c'],
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                options: options,
                optionTemplate: OptionTemplate
            }));

            typeaheadInstance.navigate(-1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(options.length - 1);

            typeaheadInstance.navigate(1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });
    });

    describe('#handleKeyDown', function () {
        describe('Tab/End', function () {
            it('should complete the hint if it is visible', function () {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                    inputValue: 'eze',
                    handleHint: function () {
                        return 'ezequiel';
                    },
                    onComplete: handleComplete
                }));

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange({ target: { value: '' } });

                ['Tab', 'End'].forEach(function (key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                        key: key,
                        timestamp: Date.now(),
                        preventDefault: preventDefault
                    };

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(preventDefault).to.have.been.called.once;
                    expect(handleComplete).to.have.been.calledWith(eventData, 'ezequiel');
                });
            });

            it('should not complete the hint if the hint is not visible', function () {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                    inputValue: 'eze',
                    handleHint: function () {
                        return 'ezequiel';
                    },
                    onComplete: handleComplete
                }));

                ['Tab', 'End'].forEach(function (key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                        key: key,
                        timestamp: Date.now(),
                        preventDefault: preventDefault,
                        target: {
                            value: ''
                        }
                    };

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(preventDefault).to.have.not.been.called;
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });
            });

            it('should not complete the hint if shift is pressed', function () {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                    inputValue: 'eze',
                    handleHint: function () {
                        return 'ezequiel';
                    },
                    onComplete: handleComplete
                }));

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange({
                    target: {
                        value: ''
                    }
                });

                ['Tab', 'End'].forEach(function (key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                        key: key,
                        shiftKey: true,
                        timestamp: Date.now(),
                        preventDefault: preventDefault
                    };

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(preventDefault).to.have.not.been.called;
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });
            });

            it('should complete the hint if the the hint is visible and the input value is rtl', function () {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                    inputValue: '\u0634\u0632\u0630',
                    handleHint: function () {
                        return 'شزذيثبل';
                    },
                    onComplete: handleComplete
                }));

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange({ target: { value: '' } });

                ['Tab', 'End'].forEach(function (key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                        key: key,
                        preventDefault: preventDefault
                    };

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(preventDefault).to.have.been.called;
                    expect(handleComplete).to.have.been.calledWith(eventData, 'شزذيثبل');
                });
            });
        });

        describe('ArrowLeft', function () {
            beforeEach(function () {
                setupIframe.call(this);
            });

            describe('in rtl languages', function () {
                it('should complete the hint if it is visible', function () {
                    var inputValue = 'شزذ',
                        handleComplete = sinon.spy(),
                        typeaheadInstance = ReactDOM.render(React.createElement(Typeahead, {
                        inputValue: inputValue,
                        handleHint: function () {
                            return 'شزذيثب';
                        },
                        onComplete: handleComplete
                    }), this.iframeDiv),
                        eventData = {
                        key: 'ArrowLeft'
                    },
                        inputDOMNode = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-usertext')),
                        startRange = inputValue.length,
                        endRange = inputValue.length;

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange({ target: { value: '' } });

                    // The cursor must be at the end to be completeable.
                    inputDOMNode.setSelectionRange(startRange, endRange);

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.been.calledWith(eventData, 'شزذيثب');
                });

                it('should not complete the hint if the cursor is not at the end', function () {
                    var handleComplete = sinon.spy(),
                        inputValue = 'شزذ',
                        typeaheadInstance = ReactDOM.render(React.createElement(Typeahead, {
                        inputValue: inputValue,
                        handleHint: function () {
                            return 'ezequiel';
                        },
                        onComplete: handleComplete
                    }), this.iframeDiv),
                        eventData = {
                        key: 'ArrowLeft'
                    },
                        inputDOMNode = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-usertext')),
                        startRange = Math.floor(inputValue.length / 2),
                        endRange = Math.floor(inputValue.length / 2);

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange({ target: { value: '' } });

                    inputDOMNode.setSelectionRange(startRange, endRange);

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });

                it('should not complete the hint if the hint is not visible', function () {
                    var handleComplete = sinon.spy(),
                        typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                        inputValue: '\u0634\u0632\u0630',
                        handleHint: function () {
                            return 'شزذيثب';
                        },
                        onComplete: handleComplete
                    })),
                        eventData = {
                        key: 'ArrowLeft'
                    };

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'شزذيثب');
                });

                it('should not complete the hint if shift is pressed', function () {
                    var handleComplete = sinon.spy(),
                        typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                        inputValue: '\u0634\u0632\u0630',
                        handleHint: function () {
                            return 'شزذيثب';
                        },
                        onComplete: handleComplete
                    })),
                        eventData = {
                        key: 'ArrowLeft',
                        shiftKey: true
                    };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange({ target: { value: '' } });

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'شزذيثب');
                });
            });

            it('should not complete the hint if the inputValue is ltr', function () {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                    inputValue: 'eze',
                    handleHint: function () {
                        return 'ezequiel';
                    },
                    onComplete: handleComplete
                })),
                    eventData = {
                    key: 'ArrowLeft'
                };

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange({ target: { value: '' } });

                typeaheadInstance.handleKeyDown(eventData);
                expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
            });
        });

        describe('ArrowRight', function () {
            beforeEach(function () {
                setupIframe.call(this);
            });

            describe('in ltr languages', function () {
                it('should complete the hint if it is visible', function () {
                    var inputValue = 'eze',
                        handleComplete = sinon.spy(),
                        typeaheadInstance = ReactDOM.render(React.createElement(Typeahead, {
                        inputValue: inputValue,
                        handleHint: function () {
                            return 'ezequiel';
                        },
                        onComplete: handleComplete
                    }), this.iframeDiv),
                        eventData = {
                        key: 'ArrowRight'
                    },
                        inputDOMNode = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-usertext')),
                        startRange = inputValue.length,
                        endRange = inputValue.length;

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange({ target: { value: '' } });

                    // The cursor must be at the end to be completeable.
                    inputDOMNode.setSelectionRange(startRange, endRange);

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.been.calledWith(eventData, 'ezequiel');
                });

                it('should not complete the hint if the cursor is not at the end', function () {
                    var handleComplete = sinon.spy(),
                        inputValue = 'eze',
                        typeaheadInstance = ReactDOM.render(React.createElement(Typeahead, {
                        inputValue: inputValue,
                        handleHint: function () {
                            return 'ezequiel';
                        },
                        onComplete: handleComplete
                    }), this.iframeDiv),
                        eventData = {
                        key: 'ArrowRight',
                        target: {
                            value: 'ezequiel'
                        }
                    },
                        inputDOMNode = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-usertext')),
                        startRange = Math.floor(inputValue.length / 2),
                        endRange = Math.floor(inputValue.length / 2);

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange({ target: { value: '' } });

                    inputDOMNode.setSelectionRange(startRange, endRange);

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });

                it('should not complete the hint if the hint is not visible', function () {
                    var handleComplete = sinon.spy(),
                        typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                        inputValue: 'eze',
                        handleHint: function () {
                            return 'ezequiel';
                        },
                        onComplete: handleComplete
                    })),
                        eventData = {
                        key: 'ArrowRight'
                    };

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.not.been.calledWith(eventData);
                });

                it('should not complete the hint if shift is pressed', function () {
                    var handleComplete = sinon.spy(),
                        typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                        inputValue: 'eze',
                        handleHint: function () {
                            return 'ezequiel';
                        },
                        onComplete: handleComplete
                    })),
                        eventData = {
                        key: 'ArrowRight',
                        shiftKey: true
                    };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange({ target: { value: '' } });

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });
            });

            it('should not complete the hint if the inputValue is rtl', function () {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                    inputValue: '\u0634\u0632\u0630',
                    handleHint: function () {
                        return 'شزذيثب';
                    },
                    onComplete: handleComplete
                })),
                    eventData = {
                    key: 'ArrowRight'
                };

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange({ target: { value: '' } });

                typeaheadInstance.handleKeyDown(eventData);
                expect(handleComplete).to.have.not.been.calledWith(eventData, 'شزذيثب');
            });
        });

        describe('Enter/Escape', function () {
            it('should hide the hint', function () {
                var handleChange = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                    inputValue: 'eze',
                    handleHint: function () {
                        return 'ezequiel';
                    },
                    onChange: handleChange
                }));

                ['Enter', 'Escape'].forEach(function (key) {
                    var eventData = {
                        key: key
                    };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange({ target: { value: '' } });

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(typeaheadInstance.state.isHintVisible).to.be.false;
                });
            });

            it('should hide the dropdown', function () {
                var handleChange = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                    inputValue: 'eze',
                    handleHint: function () {
                        return 'ezequiel';
                    },
                    onChange: handleChange
                }));

                ['Enter', 'Escape'].forEach(function (key) {
                    var eventData = {
                        key: key
                    };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange({ target: { value: '' } });

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
                });
            });
        });

        describe('ArrowDown/ArrowUp', function () {
            it('should show the dropdown if there is `options`', function () {
                var handleChange = sinon.spy(),
                    OptionTemplate = React.createClass({
                    displayName: 'OptionTemplate',

                    render: function () {
                        return React.createElement(
                            'p',
                            null,
                            this.props.data
                        );
                    }
                }),
                    typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                    inputValue: 'eze',
                    handleHint: function () {
                        return 'ezequiel';
                    },
                    onChange: handleChange,
                    options: ['a', 'b', 'c'],
                    optionTemplate: OptionTemplate
                }));

                ['ArrowUp', 'ArrowDown'].forEach(function (key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                        key: key,
                        preventDefault: preventDefault
                    };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange({ target: { value: '' } });

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(typeaheadInstance.state.isDropdownVisible).to.be.true;
                    expect(preventDefault).to.have.been.called.once;
                });
            });
        });

        it('should not show the dropdown if there is no `options`', function () {
            var handleChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze',
                handleHint: function () {
                    return 'ezequiel';
                },
                onChange: handleChange
            }));

            ['ArrowUp', 'ArrowDown'].forEach(function (key) {
                var preventDefault = sinon.spy(),
                    eventData = {
                    key: key,
                    preventDefault: preventDefault
                };

                typeaheadInstance.handleKeyDown(eventData);

                expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
                expect(preventDefault).to.have.not.been.called.once;
            });
        });

        it('should not call `onOptionChange` if there is no `options`', function () {
            var handleOptionChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                onOptionChange: handleOptionChange
            }));

            ['ArrowUp', 'ArrowDown'].forEach(function (key) {
                var preventDefault = sinon.spy(),
                    eventData = {
                    key: key,
                    preventDefault: preventDefault
                };

                typeaheadInstance.handleKeyDown(eventData);

                expect(handleOptionChange).to.have.not.been.called;
                expect(preventDefault).to.have.not.been.called;
            });
        });

        it('should not call `onOptionChange` if there is no `options`', function () {
            var handleOptionChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                options: [],
                onOptionChange: handleOptionChange
            }));

            ['ArrowUp', 'ArrowDown'].forEach(function (key) {
                var preventDefault = sinon.spy(),
                    eventData = {
                    key: key,
                    preventDefault: preventDefault
                };

                typeaheadInstance.handleKeyDown(eventData);

                expect(handleOptionChange).to.have.not.been.called;
                expect(preventDefault).to.have.not.been.called;
            });
        });

        it('should call `onOptionChange` with the correct values if we arrow down and up respectively', function () {
            var handleOptionChange = sinon.spy(),
                OptionTemplate = React.createClass({
                displayName: 'OptionTemplate',

                render: function () {
                    return React.createElement(
                        'p',
                        null,
                        this.props.data
                    );
                }
            }),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze',
                options: ['a', 'b', 'c'],
                optionTemplate: OptionTemplate,
                onOptionChange: handleOptionChange
            })),
                expected = ['a', 'eze'];

            typeaheadInstance.showDropdown();

            ['ArrowDown', 'ArrowUp'].forEach(function (key, index) {
                var preventDefault = sinon.spy(),
                    eventData = {
                    key: key,
                    preventDefault: preventDefault
                };

                typeaheadInstance.handleKeyDown(eventData);

                expect(handleOptionChange).to.have.been.calledWith(eventData, expected[index]);
                expect(preventDefault).to.have.been.called;
            });
        });

        it('should wrap and call `onOptionChange` if we arrow up before the input and down past the last item respectively', function () {
            var handleOptionChange = sinon.spy(),
                OptionTemplate = React.createClass({
                displayName: 'OptionTemplate',

                render: function () {
                    return React.createElement(
                        'p',
                        null,
                        this.props.data
                    );
                }
            }),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'ezeq',
                options: ['a', 'b', 'c'],
                optionTemplate: OptionTemplate,
                onOptionChange: handleOptionChange
            })),
                expected = ['c', 'ezeq'];

            typeaheadInstance.showDropdown();

            ['ArrowUp', 'ArrowDown'].forEach(function (key, index) {
                var preventDefault = sinon.spy(),
                    eventData = {
                    key: key,
                    preventDefault: preventDefault
                };

                typeaheadInstance.handleKeyDown(eventData);

                expect(handleOptionChange).to.have.been.calledWith(eventData, expected[index]);
                expect(preventDefault).to.have.been.called;
            });
        });
    });

    describe('#handleOptionClick', function () {
        it('should call `focus`', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'una',
                handleHint: function () {
                    return 'unabashedly';
                }
            }));
            var focus = sinon.spy(typeaheadInstance, 'focus');

            // Put Typeahead in a state where it can be closed.
            typeaheadInstance.handleClick();

            typeaheadInstance.handleOptionClick();

            expect(focus).to.have.been.called.once;
        });

        it('should hide the hint', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze',
                handleHint: function () {
                    return 'ezequiel';
                }
            }));

            // Put  Typeahead in a state where the hint is visible.
            typeaheadInstance.handleClick();

            typeaheadInstance.handleOptionClick();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });

        it('should hide the dropdown', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze',
                handleHint: function () {
                    return 'ezequiel';
                }
            }));

            // Put  Typeahead in a state where the hint is visible.
            typeaheadInstance.handleClick();

            typeaheadInstance.handleOptionClick();

            expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
        });

        it('should set the selected index to the index of the item that was clicked', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, null));

            typeaheadInstance.handleOptionClick(1337);

            expect(typeaheadInstance.state.selectedIndex).to.be.equal(1337);
        });

        it('should call `onOptionClick` if passed in', function () {
            var handleOptionClick = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                onOptionClick: handleOptionClick
            }));

            typeaheadInstance.handleOptionClick();

            expect(handleOptionClick).to.be.have.been.called.once;
        });

        it('should pass the event object to `onOptionClick` if passed in', function () {
            var handleOptionClick = sinon.spy(),
                OptionTemplate = React.createClass({
                displayName: 'OptionTemplate',

                render: function () {
                    return React.createElement(
                        'p',
                        null,
                        this.props.data
                    );
                }
            }),
                options = ['a', 'b', 'c'],
                typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                options: options,
                optionTemplate: OptionTemplate,
                onOptionClick: handleOptionClick
            })),
                eventData = {
                timestamp: Date.now()
            },
                index = 1;

            typeaheadInstance.handleOptionClick(index, eventData);

            expect(handleOptionClick).to.be.have.been.calledWith(eventData, options[index], index);
        });
    });

    describe('#handleWindowClose', function () {
        it('should hide the hint and dropdown if `event.target` is outside of typeahead', function () {
            var typeaheadInstance = TestUtils.renderIntoDocument(React.createElement(Typeahead, {
                inputValue: 'eze',
                handleHint: function () {
                    return 'ezequiel';
                }
            }));

            // Put Typeahead in a state where the hint and dropdown is visible.
            typeaheadInstance.handleChange({ target: { value: '' } });

            typeaheadInstance.handleWindowClose({
                // Pretend this object is a DOM node we know nothing about.
                target: document.createElement('div')
            });

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
            expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
        });

        // it('should not hide the hint nor dropdown if `event.target` is inside of typeahead', function() {
        //     var typeaheadInstance = TestUtils.renderIntoDocument(
        //             <Typeahead
        //                 inputValue='eze'
        //                 handleHint={function() {
        //                     return 'ezequiel';
        //                 }}
        //             />
        //         );
        //
        //     // Put Typeahead in a state where the hint and dropdown is visible.
        //     typeaheadInstance.handleChange({ target: { value: '' } });
        //
        //     typeaheadInstance.handleWindowClose({
        //         target: ReactDOM.findDOMNode(
        //             TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-options')
        //         )
        //     });
        //
        //     expect(typeaheadInstance.state.isHintVisible).to.be.true;
        //     expect(typeaheadInstance.state.isDropdownVisible).to.be.true;
        // });
    });
});