ko.bindingHandlers.isEditable = {
	init: function (element, valueAccessor) {
		var isEditable = ko.unwrap(valueAccessor());
		if (isEditable) {
			$(element).attr("contenteditable", "true");
		} else {
			$(element).attr("contenteditable", "false");
		}
	},
	update: function (element, valueAccessor) {
		var isEditable = ko.unwrap(valueAccessor());
		if (isEditable) {
			$(element).attr("contenteditable", "true");
		} else {
			$(element).attr("contenteditable", "false");
		}
	}
}
ko.bindingHandlers.inlineEdit = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        $(element).text(ko.unwrap(value));
        
		$(element).on("focus click", function (e) {
			var sel, range;
			if (window.getSelection && document.createRange) {
				range = document.createRange();
				range.selectNodeContents(element);
				sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(element);
				range.select();
			}
		});
    },
	update: function (element, valueAccessor) {
		if ($(element).text() !== ko.unwrap(valueAccessor())) {
			$(element).text(ko.unwrap(valueAccessor()));
            console.log("The text is: " + $(element).text());
            console.log("The value accessor is: " + ko.unwrap(valueAccessor()));
		}
        $(element).on("input", function (e) {
            valueAccessor($(this).text());
            
        });
        //$(element).text(ko.unwrap(valueAccessor()));
	}
};

function toJSON(rootObject, replacer, spacer) {
    var cache = [];
    var plainJavaScriptObject = ko.toJS(rootObject);
    var replacerFunction = replacer || cycleReplacer;
    var output = ko.utils.stringifyJson(plainJavaScriptObject, replacerFunction, spacer || 2);
    cache = null; 
    return output;

    function cycleReplacer(key, value) {
        if (['entityAspect', 'entityType', '_$typeName'].indexOf(key) !== -1) {
            return;
        }
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return; 
            }
            cache.push(value);
        }
        return value;
    }
}

ko.bindingHandlers.dump = {
    init: function (element, valueAccessor, allBindingsAccessor, viewmodel, bindingContext) {
        var context = valueAccessor();
        var allBindings = allBindingsAccessor();
        var pre = document.createElement('pre');

        element.appendChild(pre);

        var dumpJSON = ko.computed({
            read: function () {
                var en = allBindings.enable === undefined || allBindings.enable;
                return en ? toJSON(context, null, 2) : '';
            },
            disposeWhenNodeIsRemoved: element
        });

        ko.applyBindingsToNode(pre, {
            text: dumpJSON,
            visible: dumpJSON
        });

        return { controlsDescendentBindings: true };
    }
};