/*!
 * form.js 0.0.1
 * http://github.com/Elao/form.js
 * Copyright 2014 Elao and other contributors; Licensed MIT
 */

(function($) {
    /**
 * Data Set
 */
    function DataSet(elements) {
        this.type = $.isArray(elements) ? "array" : "object";
        this.elements = this.type == "array" ? [] : {};
        this.emitter = $(document.createElement("div"));
        this.onElementChange = this.onElementChange.bind(this);
        this.index(elements);
    }
    /**
 * Index elements
 *
 * @param {Array|Object} elements
 */
    DataSet.prototype.index = function(elements) {
        if (this.type == "array") {
            var length = element.length;
            for (var i = 0; i < length; i++) {
                this.addElement(element[i], i);
            }
        } else {
            for (var name in elements) {
                this.addElement(element[element], name);
            }
        }
    };
    /**
 * Add an element to the set
 *
 * @param {Element} element
 * @param {String|Number} index
 */
    DataSet.prototype.addElement = function(element, index) {
        if (typeof this.elements[index] == "undefined") {
            this.elements[index] = $(element);
            this.elements[index].on("change", this.onElementChange);
        }
    };
    /**
 * On element change
 *
 * @param {Event} e
 */
    DataSet.prototype.onElementChange = function(e) {
        this.parseData();
        this.emitter.trigger("change");
    };
    /**
 * Get filters
 *
 * @return {Array}
 */
    DataSet.prototype.parseData = function() {
        var data = this.type == "array" ? [] : {}, value;
        if (this.type == "array") {
            var length = this.elements.length;
            for (var i = 0; i < length; i++) {
                value = smartParse(this.elements[i].val());
                if (value !== null && value !== "") {
                    data[i] = value;
                }
            }
        } else {
            for (var name in this.elements) {
                value = smartParse(this.elements[name].val());
                if (value !== null && value !== "") {
                    data[name] = value;
                }
            }
        }
        this.data = data;
    };
    /**
 * Attach event
 *
 * @param {String} event
 * @param {Function} callback
 */
    DataSet.prototype.on = function(event, callback) {
        this.emitter.on(event, callback);
    };
    /**
 * Detach event
 *
 * @param {String} event
 * @param {Function} callback
 */
    DataSet.prototype.off = function(event, callback) {
        this.emitter.off(event, callback);
    };
    /**
 * Smart parse from jQuery
 *
 * @param {mixed} data
 *
 * @return {mixed}
 */
    function smartParse(data) {
        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
        if (typeof data === "string") {
            try {
                data = data === "true" ? true : data === "false" ? false : data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
            } catch (e) {}
        }
        return data;
    }
    /**
 * Collection
 *
 * @param {Element} element
 * @param {Object} options
 */
    function Collection(element, options) {
        this.element = $(element);
        this.replaceKey = new RegExp(this.element.data("collection"), "g");
        this.currentKey = this.count();
        this.allowAdd = false;
        this.allowDelete = false;
        this.min = false;
        this.max = false;
        this.limitMin = false;
        this.limitMax = false;
        this.htmlPrototype = null;
        this.addButton = null;
        this.items = null;
        this.parseItems();
        this.parseAdd();
        this.parseDelete();
        this.parseMin();
        this.parseMax();
        this.element.removeAttr("data-collection");
    }
    /**
 * Update limit
 */
    Collection.prototype.updateLimit = function() {
        if (this.min) {
            this.limitMin = this.count() <= this.min;
            for (var i = this.items.length - 1; i >= 0; i--) {
                this.items[i].toggleDelete(!this.limitMin);
            }
        }
        if (this.max) {
            this.limitMax = this.count() >= this.max;
            this.addButton.toggle(!this.limitMax);
        }
    };
    /**
 * Get length of the collection
 *
 * @return {Number}
 */
    Collection.prototype.count = function() {
        return this.element.children().length;
    };
    /**
 * Add a new item
 */
    Collection.prototype.add = function() {
        if (this.allowAdd && !this.limitMax) {
            var item = this.getPrototype();
            this.items.push(item);
            this.element.append(item.element);
            this.currentKey++;
            this.element.trigger("collection:added", [ item ]);
        }
    };
    /**
 * Delete an existing item
 *
 * @param {CollectionItem} item
 */
    Collection.prototype.remove = function(item) {
        var index = this.items.indexOf(item);
        if (this.allowDelete && !this.limitMin && index >= 0) {
            this.items = this.items.slice(0, index).concat(this.items.slice(index + 1));
            item.element.remove();
            this.element.trigger("collection:deleted", [ item ]);
        }
    };
    /**
 * Get a new item from the HTML prototype
 *
 * @return {Element}
 */
    Collection.prototype.getPrototype = function() {
        return new CollectionItem(this, $(this.htmlPrototype.replace(this.replaceKey, this.currentKey)));
    };
    /**
 * Parse add button
 */
    Collection.prototype.parseAdd = function() {
        var addButtonId = this.element.data("add");
        this.htmlPrototype = this.element.data("prototype");
        this.element.removeAttr("data-prototype");
        if (addButtonId) {
            this.allowAdd = true;
            this.addButton = $("#" + addButtonId);
            this.addButton.on("click", this.add.bind(this));
            this.element.removeAttr("data-add");
        }
    };
    /**
 * Parse add button
 */
    Collection.prototype.parseDelete = function() {
        if (this.element.data("delete")) {
            this.allowDelete = true;
            this.element.removeAttr("data-delete");
        }
    };
    /**
 * Parse Mininum
 */
    Collection.prototype.parseMin = function() {
        var min = this.element.data("collection-min");
        if (min) {
            this.min = min;
            this.element.on("collection:deleted", this.updateLimit.bind(this));
            this.element.removeAttr("data-collection-min");
            this.updateLimit();
        }
    };
    /**
 * Parse Maximum
 */
    Collection.prototype.parseMax = function() {
        var max = this.element.data("collection-max");
        if (max) {
            this.max = max;
            this.element.on("collection:added", this.updateLimit.bind(this));
            this.element.removeAttr("data-collection-max");
            this.updateLimit();
        }
    };
    /**
 * Parse Items
 *
 * @return {Array}
 */
    Collection.prototype.parseItems = function() {
        if (!this.items) {
            this.items = [];
            var items = this.element.children(), length = items.length;
            for (var i = 0; i < length; i++) {
                this.items.push(new CollectionItem(this, items[i]));
            }
        }
    };
    /**
 * Collection Item
 *
 * @param {Collection} collection
 * @param {Element} element
 */
    function CollectionItem(collection, element) {
        this.collection = collection;
        this.element = element;
        var deleteButton = $('[data-delete="' + this.element[0].id + '"]', element);
        if (this.collection.allowDelete && deleteButton) {
            this.deleteButton = deleteButton;
            this.deleteButton.on("click", this.remove.bind(this));
        }
    }
    /**
 * Remove item from collection
 */
    CollectionItem.prototype.remove = function() {
        this.collection.remove(this);
    };
    /**
 * Toggle delete
 */
    CollectionItem.prototype.toggleDelete = function(toggle) {
        if (this.deleteButton) {
            this.deleteButton.toggle(toggle);
        }
    };
    /**
 * Choice
 *
 * @param {Element} element
 */
    function Choice(element, options) {
        this.element = $(element);
        this.expanded = this.element.prop("tagName").toLowerCase() != "select";
        this.multiple = (this.expanded ? $('input[type="checkbox"]', this.element).length : this.element.prop("multiple")) ? true : false;
        this.choices = [];
        this.value = null;
        var children = this.element.children(), length = children.length;
        for (var i = 0; i < length; i++) {
            var option = new Option(children[i], this, typeof options.data != "undefined" ? options.data : null);
            if (option.value !== "" && option.value !== null) {
                this.choices.push(option);
            }
        }
        this.element.on("change", this.updateValue.bind(this));
        this.updateValue();
    }
    Choice.prototype.matchers = {};
    /**
 * Update value
 */
    Choice.prototype.updateValue = function() {
        var value = this.getValueFromSelection();
        if (this.value != value) {
            this.value = value;
        }
    };
    /**
 * Alias for jQuery compatibility
 *
 * @return {mixed}
 */
    Choice.prototype.val = function() {
        return this.value;
    };
    /**
 * Get value from selection
 *
 * @return {String}
 */
    Choice.prototype.getValueFromSelection = function() {
        if (this.expanded) {
            var selection = this.getSelection();
            if (this.multiple) {
                var length = selection.length, values = [];
                for (var i = 0; i < length; i++) {
                    values.push(selection[i].value);
                }
                return values;
            }
            return selection.value;
        }
        var value = this.element.val();
        if (this.multiple) {
            return value ? $.map(value, function(item) {
                return smartParse(item);
            }) : [];
        }
        return smartParse(value);
    };
    /**
 * Get selection
 *
 * @return {Option|Array}
 */
    Choice.prototype.getSelection = function() {
        var length = this.choices.length, selection = [], option;
        for (var i = 0; i < length; i++) {
            option = this.choices[i];
            if (option.isSelected()) {
                if (this.multiple) {
                    selection.push(option);
                } else {
                    return option;
                }
            }
        }
        return selection;
    };
    /**
 * Update the choice from filters
 */
    Choice.prototype.filter = function(filter, matcher) {
        var length = this.choices.length;
        matcher = this.parseMatcher(matcher);
        for (var i = 0; i < length; i++) {
            this.choices[i].filter(filter, matcher);
        }
    };
    /**
 * Test if the value of the given options exists in the filter
 *
 * @param {Option} option
 * @param {Array} filter
 *
 * @return {Boolean}
 */
    Choice.prototype.matchers.valueOptionMatcher = function(filter, option) {
        return $.isArray(filter) ? filter.indexOf(option.value) >= 0 : filter === option.value;
    };
    /**
 * Choose a matcher according to the given options
 *
 * @param {mixed} matcher
 *
 * @return {Function}
 */
    Choice.prototype.parseMatcher = function(matcher) {
        var type = typeof matcher;
        if (type == "function") {
            return matcher;
        }
        if (type == "string" && typeof this.matchers[matcher] != "undefined") {
            return this.matchers[matcher];
        }
        return this.matchers.valueOptionMatcher;
    };
    /**
 * Option
 *
 * @param {Element} element
 * @param {Choice} parent
 * @param {Function} data
 */
    function Option(element, parent, data) {
        this.element = $(element);
        this.parent = parent;
        this.valueElement = this.parent.expanded ? this.element.find('input[type="' + (this.parent.multiple ? "checkbox" : "radio") + '"]:first') : this.element;
        this.value = smartParse(this.valueElement.val());
        this.data = typeof data == "function" ? data.call(this) : this.element.data();
    }
    /**
 * Filter the option
 *
 * @param {Array} filter
 */
    Option.prototype.filter = function(filter, matcher) {
        this.detach();
        if (this.match(filter, matcher)) {
            this.attach();
        } else {
            this.handleSelection();
        }
    };
    /**
 * Handle current selection
 */
    Option.prototype.handleSelection = function() {
        if (this.isSelected()) {
            this.valueElement.prop(this.getSelectionProperty(), false);
            this.triggerChange();
        }
    };
    /**
 * Is the option selected
 *
 * @return {Boolean}
 */
    Option.prototype.isSelected = function() {
        return this.valueElement.is(":" + this.getSelectionProperty());
    };
    /**
 * Get selection property
 *
 * @return {String}
 */
    Option.prototype.getSelectionProperty = function() {
        return this.parent.expanded ? "checked" : "selected";
    };
    /**
 * Trigger change
 */
    Option.prototype.triggerChange = function() {
        (this.parent.expanded ? this.valueElement : this.parent.element).trigger("change");
    };
    /**
 * Filter
 *
 * @param {Array} filter
 *
 * @return {Boolean}
 */
    Option.prototype.match = function(filter, matcher) {
        return matcher(filter, this);
    };
    /**
 * Attach to the DOM
 */
    Option.prototype.attach = function() {
        if (!this.element.parent().length) {
            this.parent.element.append(this.element);
        }
    };
    /**
 * Attach to the DOM
 */
    Option.prototype.detach = function() {
        if (this.element.parent().length) {
            this.element.remove();
        }
    };
    $.fn.collection = function(options) {
        return this.each(function() {
            $(this).data("collection", new Collection(this, typeof options == "object" ? options : {}));
        });
    };
    $.fn.choice = function(options) {
        return this.each(function() {
            $(this).data("choice", new Choice(this, typeof options == "object" ? options : {}));
        });
    };
})(jQuery);