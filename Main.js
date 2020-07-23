(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}




// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$PubGrub$Cache$Cache = function (a) {
	return {$: 'Cache', a: a};
};
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $author$project$PubGrub$Version$toTuple = function (_v0) {
	var major = _v0.a.major;
	var minor = _v0.a.minor;
	var patch = _v0.a.patch;
	return _Utils_Tuple3(major, minor, patch);
};
var $author$project$PubGrub$Cache$addDependencies = F4(
	function (_package, version, deps, _v0) {
		var cache = _v0.a;
		return A2(
			$elm$core$Dict$member,
			_Utils_Tuple2(
				_package,
				$author$project$PubGrub$Version$toTuple(version)),
			cache.dependencies) ? $author$project$PubGrub$Cache$Cache(cache) : $author$project$PubGrub$Cache$Cache(
			_Utils_update(
				cache,
				{
					dependencies: A3(
						$elm$core$Dict$insert,
						_Utils_Tuple2(
							_package,
							$author$project$PubGrub$Version$toTuple(version)),
						deps,
						cache.dependencies)
				}));
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$PubGrub$Version$Version = function (a) {
	return {$: 'Version', a: a};
};
var $author$project$PubGrub$Version$new = function (_v0) {
	var major = _v0.major;
	var minor = _v0.minor;
	var patch = _v0.patch;
	return $author$project$PubGrub$Version$Version(
		{
			major: A2($elm$core$Basics$max, 0, major),
			minor: A2($elm$core$Basics$max, 0, minor),
			patch: A2($elm$core$Basics$max, 0, patch)
		});
};
var $author$project$PubGrub$Version$fromTuple = function (_v0) {
	var major = _v0.a;
	var minor = _v0.b;
	var patch = _v0.c;
	return $author$project$PubGrub$Version$new(
		{major: major, minor: minor, patch: patch});
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$ElmPackages$raw = '\n{\n  "0ui/elm-task-parallel": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "1602/elm-feather": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "2.3.2",\n    "2.3.3",\n    "2.3.4",\n    "2.3.5"\n  ],\n  "1602/json-schema": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1"\n  ],\n  "1602/json-value": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "1602/json-viewer": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "1hko/elm-truth-table": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "2426021684/elm-collage": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "2426021684/elm-text-width": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "2mol/elm-colormaps": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0"\n  ],\n  "7hoenix/elm-chess": [\n    "1.0.0"\n  ],\n  "AaronCZim/to-elm-format-string": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "AdrianRibao/elm-derberos-date": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.2.3"\n  ],\n  "Apanatshka/elm-list-ndet": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Apanatshka/elm-signal-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "3.2.1",\n    "3.3.0",\n    "3.3.1",\n    "3.3.2",\n    "3.4.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.1.0",\n    "5.1.1",\n    "5.2.0",\n    "5.2.1",\n    "5.3.0",\n    "5.4.0",\n    "5.4.1",\n    "5.5.0",\n    "5.6.0",\n    "5.7.0"\n  ],\n  "Arkham/elm-chords": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "Arkham/elm-rttl": [\n    "1.0.0"\n  ],\n  "AuricSystemsInternational/creditcard-validator": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Bastes/the-validator": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2"\n  ],\n  "Bernardoow/elm-alert-timer-message": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Bernardoow/elm-rating-component": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "Bogdanp/elm-ast": [\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "4.0.5",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "7.0.0",\n    "8.0.0",\n    "8.0.1",\n    "8.0.2",\n    "8.0.3",\n    "8.0.4",\n    "8.0.5",\n    "8.0.6",\n    "8.0.7",\n    "8.0.8",\n    "8.0.9",\n    "8.0.10",\n    "8.0.11",\n    "8.0.12"\n  ],\n  "Bogdanp/elm-combine": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1"\n  ],\n  "Bogdanp/elm-datepicker": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "Bogdanp/elm-generate": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0"\n  ],\n  "Bogdanp/elm-querystring": [\n    "1.0.0"\n  ],\n  "Bogdanp/elm-route": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "4.0.0"\n  ],\n  "Bogdanp/elm-time": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0",\n    "1.4.0"\n  ],\n  "Bractlet/elm-plot": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "BrianHicks/elm-avl-exploration": [\n    "1.0.0"\n  ],\n  "BrianHicks/elm-benchmark": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "BrianHicks/elm-css-reset": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "BrianHicks/elm-particle": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1"\n  ],\n  "BrianHicks/elm-string-graphemes": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "BrianHicks/elm-trend": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3"\n  ],\n  "BuraBure/elm-collision": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "CallumJHays/elm-kalman-filter": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "CallumJHays/elm-sliders": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "CallumJHays/elm-unwrap": [\n    "1.0.0"\n  ],\n  "Cendrb/elm-css": [\n    "1.0.0"\n  ],\n  "Chadtech/ct-colors": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "Chadtech/ctpaint-keys": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.0.3",\n    "6.0.4",\n    "6.0.5",\n    "6.0.6",\n    "6.0.7",\n    "6.0.8",\n    "6.0.9"\n  ],\n  "Chadtech/dependent-text": [\n    "1.0.0"\n  ],\n  "Chadtech/elm-bool-extra": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.4.0",\n    "2.4.1",\n    "2.4.2"\n  ],\n  "Chadtech/elm-css-grid": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "Chadtech/elm-imperative-porting": [\n    "1.0.0"\n  ],\n  "Chadtech/elm-loop": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "Chadtech/elm-money": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "Chadtech/elm-provider": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "Chadtech/elm-relational-database": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2"\n  ],\n  "Chadtech/elm-us-state-abbreviations": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "Chadtech/elm-vector": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "Chadtech/hfnss": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Chadtech/id": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0"\n  ],\n  "Chadtech/mail": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Chadtech/order": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "Chadtech/random-pcg-pipeline": [\n    "1.0.0"\n  ],\n  "Chadtech/random-pipeline": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "Chadtech/return": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "Chadtech/tuple-infix": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "Chadtech/unique-list": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "2.1.4"\n  ],\n  "ChristophP/elm-i18next": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2"\n  ],\n  "ChristophP/elm-mark": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "CipherDogs/elm-bitcoin": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "CoderDennis/elm-time-format": [\n    "1.0.0"\n  ],\n  "ConcatDK/elm-todoist": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "Confidenceman02/elm-animate-height": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "ContaSystemer/elm-menu": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "CurrySoftware/elm-datepicker": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "Dandandan/parser": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "5.0.3",\n    "5.0.4",\n    "5.1.0",\n    "6.0.0",\n    "6.0.1",\n    "6.1.0",\n    "6.2.0",\n    "6.2.1",\n    "6.2.2",\n    "6.2.3",\n    "6.2.4",\n    "6.2.5"\n  ],\n  "DavidTobin/elm-key": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "DrBearhands/elm-json-editor": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "EdutainmentLIVE/elm-bootstrap": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "EdutainmentLIVE/elm-dropdown": [\n    "1.0.0"\n  ],\n  "Elm-Canvas/raster-shapes": [\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "EngageSoftware/elm-dnn-http": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "EngageSoftware/elm-dnn-localization": [\n    "1.0.2"\n  ],\n  "EngageSoftware/elm-engage-common": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1"\n  ],\n  "EngageSoftware/elm-mustache": [\n    "1.0.0"\n  ],\n  "FMFI-UK-1-AIN-412/elm-formula": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "FabienHenon/elm-ckeditor5": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0"\n  ],\n  "FabienHenon/elm-infinite-list-view": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0"\n  ],\n  "FabienHenon/elm-infinite-scroll": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "2.3.2",\n    "2.4.0",\n    "2.4.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3"\n  ],\n  "FabienHenon/elm-iso8601-date-strings": [\n    "1.0.0"\n  ],\n  "FabienHenon/elm-pull-to-refresh": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.3.0",\n    "1.3.1"\n  ],\n  "FabienHenon/jsonapi": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0"\n  ],\n  "FabienHenon/remote-resource": [\n    "1.0.0"\n  ],\n  "FordLabs/elm-star-rating": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "FranklinChen/elm-tau": [\n    "1.0.0"\n  ],\n  "Fresheyeball/deburr": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Fresheyeball/elm-animate-css": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Fresheyeball/elm-font-awesome": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "Fresheyeball/elm-function-extra": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "Fresheyeball/elm-guards": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Fresheyeball/elm-nearly-eq": [\n    "1.0.0",\n    "1.1.0",\n    "1.0.1"\n  ],\n  "Fresheyeball/elm-number-expanded": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "Fresheyeball/elm-restrict-number": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0"\n  ],\n  "Fresheyeball/elm-return": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.0.3",\n    "7.0.0",\n    "7.1.0"\n  ],\n  "Fresheyeball/elm-sprite": [\n    "1.0.0"\n  ],\n  "Fresheyeball/elm-tuple-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0"\n  ],\n  "Fresheyeball/elm-yala": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "Fresheyeball/perspective": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "Fresheyeball/sprite": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Garados007/elm-svg-parser": [\n    "1.0.0"\n  ],\n  "Gizra/elm-all-set": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Gizra/elm-attribute-builder": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Gizra/elm-compat-017": [\n    "1.0.0"\n  ],\n  "Gizra/elm-compat-018": [\n    "1.0.0"\n  ],\n  "Gizra/elm-compat-019": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "Gizra/elm-debouncer": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "Gizra/elm-dictlist": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2"\n  ],\n  "Gizra/elm-editable-webdata": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "Gizra/elm-essentials": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0"\n  ],\n  "Gizra/elm-fetch": [\n    "1.0.0"\n  ],\n  "Gizra/elm-keyboard-event": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Gizra/elm-restful": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "Gizra/elm-storage-key": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "GlobalWebIndex/class-namespaces": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0"\n  ],\n  "GlobalWebIndex/cmd-extra": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0",\n    "1.3.0"\n  ],\n  "GlobalWebIndex/elm-plural-rules": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0"\n  ],\n  "GlobalWebIndex/quantify": [\n    "1.0.0"\n  ],\n  "GlobalWebIndex/segment-elm": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "Guid75/ziplist": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "HAN-ASD-DT/priority-queue": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "HAN-ASD-DT/rsa": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0"\n  ],\n  "Herteby/enum": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Herteby/simplex-noise": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2"\n  ],\n  "Herteby/url-builder-plus": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "Holmusk/elmoji": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "Holmusk/swagger-decoder": [\n    "1.0.0"\n  ],\n  "HolyMeekrob/elm-font-awesome-5": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0"\n  ],\n  "InsideSalesOfficial/isdc-elm-ui": [\n    "1.0.0"\n  ],\n  "IzumiSy/elm-consistent-hashing": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "IzumiSy/elm-multi-waitable": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "Janiczek/architecture-test": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "Janiczek/browser-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "Janiczek/cmd-extra": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "Janiczek/color-hcl": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "Janiczek/distinct-colors": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "Janiczek/elm-architecture-test": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8",\n    "1.0.9",\n    "1.0.10"\n  ],\n  "Janiczek/elm-bidict": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "Janiczek/elm-encoding": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Janiczek/elm-graph": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "Janiczek/elm-runescape": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Janiczek/package-info": [\n    "1.0.0"\n  ],\n  "Janiczek/transform": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "JasonMFry/elm-bootstrap": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "JeremyBellows/elm-bootstrapify": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0",\n    "7.1.0",\n    "8.0.0",\n    "8.0.1",\n    "8.0.2",\n    "9.0.0",\n    "9.0.1"\n  ],\n  "JoelQ/elm-dollar": [\n    "1.0.0"\n  ],\n  "JoelQ/elm-toggleable": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "JoeyEremondi/array-multidim": [\n    "1.0.0"\n  ],\n  "JoeyEremondi/elm-typenats": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "JoeyEremondi/safelist": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "JoeyEremondi/typenats": [\n    "1.0.0"\n  ],\n  "JohnBugner/elm-bag": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "JohnBugner/elm-loop": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0"\n  ],\n  "JohnBugner/elm-matrix": [\n    "1.0.0"\n  ],\n  "JonRowe/elm-jwt": [\n    "1.0.0"\n  ],\n  "JordyMoos/elm-clockpicker": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "JordyMoos/elm-pageloader": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "JordyMoos/elm-quiz": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "JoshuaHall/elm-fraction": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0"\n  ],\n  "JulianKniephoff/elm-time-extra": [\n    "1.0.0"\n  ],\n  "JustinLove/elm-twitch-api": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.2.0",\n    "4.3.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.1.0"\n  ],\n  "JustusAdam/elm-path": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.2.3",\n    "1.2.4",\n    "1.3.0"\n  ],\n  "K-Adam/elm-dom": [\n    "1.0.0"\n  ],\n  "Kinto/elm-kinto": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.1.0",\n    "7.0.0",\n    "8.0.0"\n  ],\n  "Kraxorax/elm-matrix-a": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "KtorZ/elm-notification": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "Kurren123/k-dropdown-container": [\n    "1.0.0"\n  ],\n  "Kwarrtz/render": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "Leonti/elm-material-datepicker": [\n    "1.0.0"\n  ],\n  "Leonti/elm-time-picker": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "LesleyLai/elm-grid": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Libbum/elm-partition": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0"\n  ],\n  "Libbum/elm-redblacktrees": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4"\n  ],\n  "Logiraptor/elm-bench": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "M1chaelTran/elm-graphql": [\n    "1.0.0"\n  ],\n  "MacCASOutreach/graphicsvg": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "6.0.1",\n    "6.1.0",\n    "7.0.0",\n    "7.0.1",\n    "7.1.0"\n  ],\n  "MadonnaMat/elm-select-two": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1"\n  ],\n  "MartinKavik/elm-combinatorics": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "MartinSStewart/elm-audio": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3"\n  ],\n  "MartinSStewart/elm-bayer-matrix": [\n    "1.0.0"\n  ],\n  "MartinSStewart/elm-box-packing": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "MartinSStewart/elm-codec-bytes": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "MartinSStewart/elm-nonempty-string": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "MartinSStewart/send-grid": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0"\n  ],\n  "MattCheely/tryframe-coordinator": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "MatthewJohnHeath/elm-fingertree": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "MaybeJustJames/yaml": [\n    "1.0.0"\n  ],\n  "MazeChaZer/elm-ckeditor": [\n    "1.0.0"\n  ],\n  "MichaelCombs28/elm-base85": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "MichaelCombs28/elm-css-bulma": [\n    "1.0.0"\n  ],\n  "MichaelCombs28/elm-dom": [\n    "1.0.0"\n  ],\n  "MichaelCombs28/elm-mdl": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "MichaelCombs28/elm-parts": [\n    "1.0.0"\n  ],\n  "MichaelCombs28/unit-list": [\n    "1.0.0"\n  ],\n  "Microsoft/elm-json-tree-view": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "MikaelMayer/parser": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "Morgan-Stanley/morphir-elm": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "Natim/elm-workalendar": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Nexosis/nexosisclient-elm": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "4.1.1"\n  ],\n  "NoRedInk/datetimepicker": [\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "3.0.1",\n    "2.0.4",\n    "3.0.2"\n  ],\n  "NoRedInk/datetimepicker-legacy": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "NoRedInk/elm-api-components": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "NoRedInk/elm-check": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "NoRedInk/elm-compare": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "NoRedInk/elm-debug-controls-without-datepicker": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "NoRedInk/elm-decode-pipeline": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "NoRedInk/elm-doodad": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.4.0",\n    "2.4.1",\n    "2.5.0",\n    "2.5.1",\n    "2.6.0",\n    "2.7.0",\n    "2.7.1",\n    "2.8.0",\n    "2.8.1",\n    "2.9.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "5.0.0",\n    "5.0.1"\n  ],\n  "NoRedInk/elm-feature-interest": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "NoRedInk/elm-formatted-text": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "2.3.2",\n    "2.3.3",\n    "2.3.4"\n  ],\n  "NoRedInk/elm-formatted-text-19": [\n    "1.0.0"\n  ],\n  "NoRedInk/elm-formatted-text-test-helpers": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "NoRedInk/elm-json-decode-pipeline": [\n    "1.0.0"\n  ],\n  "NoRedInk/elm-lazy-list": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "NoRedInk/elm-phoenix": [\n    "1.0.0"\n  ],\n  "NoRedInk/elm-plot-19": [\n    "1.0.0"\n  ],\n  "NoRedInk/elm-plot-rouge": [\n    "1.0.0"\n  ],\n  "NoRedInk/elm-rails": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "4.0.5",\n    "4.0.6",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "6.1.0",\n    "6.2.0",\n    "7.0.0",\n    "8.0.0",\n    "9.0.0"\n  ],\n  "NoRedInk/elm-random-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "NoRedInk/elm-random-general": [\n    "1.0.0"\n  ],\n  "NoRedInk/elm-random-pcg-extended": [\n    "1.0.0"\n  ],\n  "NoRedInk/elm-rfc5988-parser": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "NoRedInk/elm-rollbar": [\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "NoRedInk/elm-saved": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "NoRedInk/elm-shrink": [\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "NoRedInk/elm-simple-fuzzy": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "NoRedInk/elm-sortable-table": [\n    "1.0.0"\n  ],\n  "NoRedInk/elm-string-conversions": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "NoRedInk/elm-string-extra": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1"\n  ],\n  "NoRedInk/elm-sweet-poll": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0"\n  ],\n  "NoRedInk/elm-task-extra": [\n    "1.0.1",\n    "2.0.0"\n  ],\n  "NoRedInk/elm-uuid": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "NoRedInk/elm-view-utils": [\n    "1.1.0",\n    "1.1.1",\n    "1.0.0"\n  ],\n  "NoRedInk/http-upgrade-shim": [\n    "1.0.0"\n  ],\n  "NoRedInk/json-elm-schema": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0"\n  ],\n  "NoRedInk/list-selection": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1"\n  ],\n  "NoRedInk/noredink-ui": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "3.2.1",\n    "3.3.0",\n    "3.4.0",\n    "3.5.0",\n    "3.5.1",\n    "3.6.0",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0",\n    "4.3.0",\n    "4.4.0",\n    "4.5.0",\n    "4.6.0",\n    "4.7.0",\n    "4.8.0",\n    "4.9.0",\n    "4.9.1",\n    "4.10.0",\n    "4.11.0",\n    "4.11.1",\n    "4.12.0",\n    "4.13.0",\n    "4.14.0",\n    "4.15.0",\n    "5.0.0",\n    "5.1.0",\n    "5.2.0",\n    "5.3.0",\n    "5.4.0",\n    "5.5.0",\n    "5.5.1",\n    "5.5.2",\n    "5.5.3",\n    "5.6.0",\n    "5.7.0",\n    "5.8.0",\n    "5.8.1",\n    "5.8.2",\n    "5.9.0",\n    "5.9.1",\n    "5.10.0",\n    "5.11.0",\n    "6.0.0",\n    "6.1.0",\n    "6.1.1",\n    "6.1.2",\n    "6.1.3",\n    "6.1.4",\n    "6.1.5",\n    "6.1.6",\n    "6.2.0",\n    "6.3.0",\n    "6.4.0",\n    "6.5.0",\n    "6.6.0",\n    "6.6.1",\n    "6.6.2",\n    "6.6.3",\n    "6.7.0",\n    "6.8.0",\n    "6.8.1",\n    "6.9.0",\n    "6.10.0",\n    "6.11.0",\n    "6.11.1",\n    "6.12.0",\n    "6.13.0",\n    "6.13.1",\n    "6.14.0",\n    "6.15.0",\n    "6.16.0",\n    "6.17.0",\n    "6.18.0",\n    "6.19.0",\n    "6.19.1",\n    "6.20.0",\n    "6.20.1",\n    "6.21.0",\n    "6.22.0",\n    "6.23.0",\n    "6.23.1",\n    "6.23.2",\n    "6.24.0",\n    "6.24.1",\n    "6.25.0",\n    "6.26.0",\n    "6.26.1",\n    "6.27.0",\n    "6.28.0",\n    "6.29.0",\n    "6.29.1",\n    "6.30.0",\n    "6.31.0",\n    "7.0.0",\n    "7.1.0",\n    "7.1.1",\n    "7.1.2",\n    "7.1.3",\n    "7.1.4",\n    "7.2.0",\n    "7.2.1",\n    "7.3.0",\n    "7.4.0",\n    "7.4.1",\n    "7.5.0",\n    "7.6.0",\n    "7.7.0",\n    "7.8.0",\n    "7.9.0",\n    "7.10.0",\n    "7.11.0",\n    "7.12.0",\n    "7.12.1",\n    "7.13.0",\n    "7.14.0",\n    "7.14.1",\n    "7.14.2",\n    "7.15.0",\n    "7.16.0",\n    "7.17.0",\n    "7.17.1",\n    "7.18.0",\n    "7.18.1",\n    "7.19.0",\n    "7.20.0",\n    "7.21.0",\n    "7.22.0",\n    "7.23.0",\n    "7.24.0",\n    "7.25.0",\n    "7.25.1",\n    "7.26.0",\n    "7.26.1",\n    "8.0.0",\n    "8.1.0",\n    "8.2.0",\n    "8.3.0",\n    "8.3.1",\n    "9.0.0",\n    "9.1.0",\n    "9.2.0",\n    "9.3.0",\n    "9.4.0",\n    "9.5.0",\n    "9.5.1",\n    "9.0.1",\n    "9.6.0",\n    "9.5.2",\n    "9.0.2",\n    "9.7.0",\n    "9.8.0",\n    "9.8.1",\n    "9.9.0",\n    "10.0.0",\n    "10.1.0",\n    "10.2.0",\n    "10.3.0",\n    "10.4.0"\n  ],\n  "NoRedInk/nri-elm-css": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.4.1",\n    "1.5.0",\n    "1.5.1",\n    "1.6.0",\n    "1.6.1",\n    "1.7.0",\n    "1.7.1",\n    "1.8.0",\n    "1.9.0",\n    "1.9.1",\n    "1.10.0",\n    "1.11.0",\n    "1.12.0",\n    "1.12.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "5.0.1"\n  ],\n  "NoRedInk/rocket-update": [\n    "1.0.0"\n  ],\n  "NoRedInk/start-app": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "NoRedInk/style-elements": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "NoRedInk/view-extra": [\n    "2.0.0"\n  ],\n  "OldhamMade/elm-charts": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "Orange-OpenSource/elm-advanced-grid": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Orasund/elm-action": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2"\n  ],\n  "Orasund/elm-cellautomata": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "Orasund/elm-game-essentials": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "Orasund/elm-jsonstore": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "Orasund/elm-pair": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1"\n  ],\n  "Orasund/elm-ui-framework": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0",\n    "1.6.1"\n  ],\n  "Orasund/elm-ui-widgets": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4"\n  ],\n  "Orasund/pixelengine": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "2.2.3",\n    "2.2.4",\n    "2.2.5",\n    "2.2.6",\n    "2.2.7",\n    "2.2.8",\n    "2.2.9",\n    "2.2.10",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.1.0",\n    "4.2.0",\n    "4.3.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "5.0.3",\n    "6.0.0",\n    "6.1.0",\n    "6.2.0"\n  ],\n  "PaackEng/elm-alert-beta": [\n    "1.0.0"\n  ],\n  "PaackEng/elm-google-maps": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "PaackEng/elm-svg-string": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "PaackEng/elm-ui-dialog": [\n    "1.0.0"\n  ],\n  "PaackEng/elm-ui-dropdown": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "PaackEng/paack-ui": [\n    "1.0.0"\n  ],\n  "PanagiotisGeorgiadis/elm-datepicker": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "2.2.1"\n  ],\n  "PanagiotisGeorgiadis/elm-datetime": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0"\n  ],\n  "Pilatch/elm-simple-port-program": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Punie/elm-id": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "Punie/elm-matrix": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "Punie/elm-parser-extras": [\n    "1.0.0"\n  ],\n  "Punie/elm-reader": [\n    "1.0.0"\n  ],\n  "QiTASC/hatchinq": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.2.0",\n    "4.2.1",\n    "4.3.0",\n    "4.4.0",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0",\n    "8.0.0",\n    "8.1.0",\n    "9.0.0",\n    "9.1.0",\n    "9.2.0",\n    "9.3.0",\n    "10.0.0",\n    "10.0.1",\n    "10.1.0",\n    "11.0.0",\n    "11.0.1",\n    "11.0.2",\n    "11.1.0",\n    "11.2.0",\n    "12.0.0",\n    "13.0.0",\n    "14.0.0",\n    "14.1.0",\n    "14.2.0",\n    "15.0.0",\n    "15.0.1",\n    "16.0.0",\n    "17.0.0",\n    "17.0.1",\n    "17.0.2",\n    "18.0.0",\n    "18.0.1",\n    "19.0.0",\n    "19.0.1",\n    "20.0.0",\n    "21.0.0",\n    "21.0.1",\n    "22.0.0",\n    "22.0.1",\n    "23.0.0",\n    "24.0.0",\n    "25.0.0",\n    "25.0.1",\n    "25.1.0",\n    "25.2.0",\n    "25.2.1",\n    "26.0.0",\n    "27.0.0"\n  ],\n  "RGBboy/websocket-server": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "RalfNorthman/elm-zoom-plot": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "RobbieMcKinstry/stripe": [\n    "1.0.0"\n  ],\n  "RomanErnst/erl": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "RoyalIcing/datadown-elm": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "RoyalIcing/inflexio": [\n    "1.0.0"\n  ],\n  "RoyalIcing/lofi-elm": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "RoyalIcing/lofi-schema-elm": [\n    "1.0.0"\n  ],\n  "SHyx0rmZ/selectable-list": [\n    "1.0.0"\n  ],\n  "STTR13/ziplist": [\n    "1.0.0"\n  ],\n  "SamirTalwar/arborist": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "Saulzar/elm-keyboard-keys": [\n    "1.0.0"\n  ],\n  "Saulzar/key-constants": [\n    "1.0.0"\n  ],\n  "SelectricSimian/elm-constructive": [\n    "1.0.0"\n  ],\n  "Shearerbeard/stripe": [\n    "1.0.1",\n    "2.0.0"\n  ],\n  "SidneyNemzer/elm-remote-data": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "SimplyNaOH/elm-searchable-menu": [\n    "1.0.0"\n  ],\n  "SiriusStarr/elm-password-strength": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "SiriusStarr/elm-spaced-repetition": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "SiriusStarr/elm-splat": [\n    "1.0.0"\n  ],\n  "Skinney/collections-ng": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "Skinney/elm-array-exploration": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5"\n  ],\n  "Skinney/elm-deque": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "Skinney/elm-dict-exploration": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "Skinney/elm-phone-numbers": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5",\n    "2.0.6",\n    "2.0.7",\n    "2.0.8",\n    "2.0.9",\n    "2.0.10",\n    "2.0.11",\n    "2.0.12",\n    "2.0.13",\n    "2.0.14",\n    "2.0.15",\n    "2.0.16",\n    "2.0.17",\n    "2.0.18",\n    "2.0.19",\n    "2.0.20",\n    "2.0.21",\n    "2.0.22",\n    "2.0.23",\n    "2.0.24",\n    "2.0.25",\n    "2.0.26",\n    "2.0.27",\n    "2.0.28"\n  ],\n  "Skinney/elm-warrior": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "4.0.5"\n  ],\n  "Skinney/fnv": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "Skinney/keyboard-events": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "Skinney/murmur3": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5",\n    "2.0.6",\n    "2.0.7",\n    "2.0.8"\n  ],\n  "Spaxe/elm-lsystem": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "Spaxe/svg-pathd": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "StoatPower/elm-wkt": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "SwiftsNamesake/euclidean-space": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "SwiftsNamesake/please-focus": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "SwiftsNamesake/proper-keyboard": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0"\n  ],\n  "SylvanSign/elm-pointer-events": [\n    "1.0.2"\n  ],\n  "TSFoster/elm-bytes-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0"\n  ],\n  "TSFoster/elm-compare": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "TSFoster/elm-envfile": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "TSFoster/elm-heap": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2"\n  ],\n  "TSFoster/elm-md5": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "TSFoster/elm-sha1": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "TSFoster/elm-tuple-extra": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "TSFoster/elm-uuid": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "TheDahv/doctari": [\n    "1.0.0"\n  ],\n  "TheSeamau5/elm-check": [\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0"\n  ],\n  "TheSeamau5/elm-html-decoder": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "TheSeamau5/elm-lazy-list": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "TheSeamau5/elm-material-icons": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "TheSeamau5/elm-quadtree": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "TheSeamau5/elm-random-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "TheSeamau5/elm-router": [\n    "1.0.0"\n  ],\n  "TheSeamau5/elm-shrink": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "TheSeamau5/elm-spring": [\n    "1.0.0"\n  ],\n  "TheSeamau5/elm-task-extra": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "TheSeamau5/elm-undo-redo": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "TheSeamau5/flex-html": [\n    "2.0.0",\n    "2.0.1"\n  ],\n  "TheSeamau5/selection-list": [\n    "1.0.0"\n  ],\n  "TheSeamau5/typographic-scale": [\n    "1.0.0"\n  ],\n  "ThinkAlexandria/css-in-elm": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "ThinkAlexandria/elm-drag-locations": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "ThinkAlexandria/elm-html-in-elm": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ThinkAlexandria/elm-pretty-print-json": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ThinkAlexandria/elm-primer-tooltips": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "ThinkAlexandria/keyboard-extra": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ThinkAlexandria/window-manager": [\n    "1.0.0"\n  ],\n  "ThomasWeiser/elmfire": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7"\n  ],\n  "ThomasWeiser/elmfire-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "TimothyDespair/elm-maybe-applicator": [\n    "1.0.0"\n  ],\n  "VerbalExpressions/elm-verbal-expressions": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "2.0.0"\n  ],\n  "Voronchuk/hexagons": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.1.0"\n  ],\n  "Warry/elmi-decoder": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "WhileTruu/elm-blurhash": [\n    "1.0.0"\n  ],\n  "WhileTruu/elm-smooth-scroll": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "YuyaAizawa/list-wrapper": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "YuyaAizawa/peg": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.2.0"\n  ],\n  "Zaptic/elm-glob": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Zinggi/elm-2d-game": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0"\n  ],\n  "Zinggi/elm-game-resources": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "Zinggi/elm-glsl-generator": [\n    "1.0.0"\n  ],\n  "Zinggi/elm-hash-icon": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "Zinggi/elm-obj-loader": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "Zinggi/elm-random-general": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "Zinggi/elm-random-pcg-extended": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "Zinggi/elm-uuid": [\n    "1.0.0"\n  ],\n  "Zinggi/elm-webgl-math": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6"\n  ],\n  "aardito2/realm": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6"\n  ],\n  "abadi199/dateparser": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "abadi199/datetimepicker": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1"\n  ],\n  "abadi199/datetimepicker-css": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "abadi199/elm-creditcard": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0",\n    "6.1.0",\n    "7.0.0",\n    "7.0.1",\n    "8.0.0",\n    "9.0.0",\n    "9.0.1",\n    "10.0.0",\n    "10.0.1"\n  ],\n  "abadi199/elm-input-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "4.1.1",\n    "4.2.0",\n    "4.2.1",\n    "4.2.2",\n    "4.3.0",\n    "5.0.0",\n    "5.1.0",\n    "5.2.0",\n    "5.2.1",\n    "5.2.2",\n    "5.2.3",\n    "5.2.4"\n  ],\n  "abadi199/intl-phone-input": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "abinayasudhir/elm-select": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0"\n  ],\n  "abinayasudhir/elm-treeview": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "abinayasudhir/html-parser": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "abinayasudhir/outmessage": [\n    "1.0.0"\n  ],\n  "abradley2/elm-calendar": [\n    "1.0.0"\n  ],\n  "abradley2/elm-datepicker": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0"\n  ],\n  "abradley2/elm-form-controls": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2"\n  ],\n  "abradley2/form-controls": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "abradley2/form-elements": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2"\n  ],\n  "abradley2/form-fields": [\n    "1.0.0"\n  ],\n  "abrykajlo/elm-scroll": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "achutkiran/elm-material-color": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "achutkiran/material-components-elm": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0",\n    "1.2.1"\n  ],\n  "adauguet/elm-spanned-string": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "adeschamps/mdl-context": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "adius/vectual": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "afidegnum/elm-bulmanizer": [\n    "1.0.0"\n  ],\n  "afidegnum/elm-tailwind": [\n    "1.0.0"\n  ],\n  "aforemny/material-components-web-elm": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "4.0.0"\n  ],\n  "agrafix/elm-bootforms": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.0.1",\n    "7.0.0",\n    "8.0.0",\n    "9.0.0",\n    "10.0.0"\n  ],\n  "agustinrhcp/elm-datepicker": [\n    "1.0.0"\n  ],\n  "agustinrhcp/elm-mask": [\n    "1.0.0"\n  ],\n  "ahstro/elm-bulma-classes": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "ahstro/elm-konami-code": [\n    "1.0.0"\n  ],\n  "ahstro/elm-luhn": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ahstro/elm-ssn-validation": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "akavel/elm-expo": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "akbiggs/elm-effects": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0"\n  ],\n  "akbiggs/elm-game-update": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "akheron/elm-easter": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "akoppela/elm-autocomplete": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "akoppela/elm-logo": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "alech/elm-calendarweeks": [\n    "1.0.0"\n  ],\n  "alepop/elm-google-url-shortener": [\n    "1.0.0"\n  ],\n  "alex-tan/elm-dialog": [\n    "1.0.0"\n  ],\n  "alex-tan/elm-tree-diagram": [\n    "1.0.0"\n  ],\n  "alex-tan/loadable": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2"\n  ],\n  "alex-tan/postgrest-client": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "alex-tan/postgrest-queries": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "7.0.3",\n    "7.1.0",\n    "7.2.0"\n  ],\n  "alex-tan/task-extra": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "alexanderkiel/elm-mdc-alpha": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0"\n  ],\n  "alexanderkiel/list-selection": [\n    "1.0.0"\n  ],\n  "alexandrepiveteau/elm-algebraic-graph": [\n    "1.0.0"\n  ],\n  "alexandrepiveteau/elm-ordt": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2"\n  ],\n  "alexkorban/uicards": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "alinz/elm-vector2d": [\n    "1.0.0"\n  ],\n  "allenap/elm-json-decode-broken": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "allo-media/canopy": [\n    "1.0.0"\n  ],\n  "allo-media/elm-daterange-picker": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2"\n  ],\n  "allo-media/elm-es-simple-query-string": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "allo-media/fable": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "allo-media/koivu": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1"\n  ],\n  "alltonp/elm-driveby": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "alpacaaa/elm-date-distance": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0"\n  ],\n  "altjsus/elm-airtable": [\n    "1.0.0"\n  ],\n  "altjsus/elmtable": [\n    "1.0.0"\n  ],\n  "aluuu/elm-check-io": [\n    "1.0.0"\n  ],\n  "alvivi/elm-css-aria": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0"\n  ],\n  "alvivi/elm-keyword-list": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "alvivi/elm-nested-list": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "alvivi/elm-widgets": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.2.1",\n    "3.3.0",\n    "3.4.0",\n    "3.4.1"\n  ],\n  "amaksimov/elm-maybe-pipeline": [\n    "1.0.0"\n  ],\n  "amaksimov/elm-multikey-handling": [\n    "1.0.0"\n  ],\n  "amazzeo/elm-math-strings": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ambuc/juggling-graph": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "amilner42/keyboard-extra": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0"\n  ],\n  "amitu/elm-formatting": [\n    "1.0.0"\n  ],\n  "anatol-1988/measurement": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "andre-dietrich/elm-mapbox": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "andre-dietrich/elm-random-pcg-regex": [\n    "1.0.1",\n    "1.0.0"\n  ],\n  "andre-dietrich/elm-random-regex": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8",\n    "1.0.9"\n  ],\n  "andre-dietrich/elm-svgbob": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0"\n  ],\n  "andre-dietrich/parser-combinators": [\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "4.0.0"\n  ],\n  "andrewMacmurray/elm-delay": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0"\n  ],\n  "andrewjackman/toasty-bootstrap": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "andys8/elm-geohash": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "anhmiuhv/pannablevideo": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "annaghi/dnd-list": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1"\n  ],\n  "antivanov/eunit": [\n    "1.0.0"\n  ],\n  "aphorisme/elm-oprocesso": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "apuchenkin/elm-multiway-tree-extra": [\n    "1.0.0"\n  ],\n  "apuchenkin/elm-nested-router": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "5.0.0"\n  ],\n  "aramiscd/elm-basscss": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "aristidesstaffieri/elm-poisson": [\n    "1.0.0"\n  ],\n  "arnau/elm-feather": [\n    "1.0.0"\n  ],\n  "arnau/elm-objecthash": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1"\n  ],\n  "arowM/elm-chat-scenario": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "arowM/elm-check-button": [\n    "1.0.0"\n  ],\n  "arowM/elm-classname": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "arowM/elm-css-modules-helper": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "arowM/elm-data-url": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0"\n  ],\n  "arowM/elm-default": [\n    "1.0.0"\n  ],\n  "arowM/elm-embedded-gist": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "arowM/elm-evil-sendmsg": [\n    "1.0.0"\n  ],\n  "arowM/elm-form-decoder": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0"\n  ],\n  "arowM/elm-form-validator": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2"\n  ],\n  "arowM/elm-html-extra-internal": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "arowM/elm-html-internal": [\n    "1.0.0"\n  ],\n  "arowM/elm-html-with-context": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "arowM/elm-istring": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "arowM/elm-mixin": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0"\n  ],\n  "arowM/elm-monoid": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "arowM/elm-neat-layout": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "arowM/elm-parser-test": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0"\n  ],\n  "arowM/elm-raw-html": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "arowM/elm-reference": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7"\n  ],\n  "arowM/elm-show": [\n    "1.0.0"\n  ],\n  "arowM/elm-time-machine": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "arowM/html": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "arowM/html-extra": [\n    "1.0.0"\n  ],\n  "arsduo/elm-dom-drag-drop": [\n    "1.0.0"\n  ],\n  "arsduo/elm-ui-drag-drop": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "arturopala/elm-monocle": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0",\n    "1.3.1",\n    "1.3.2",\n    "1.4.0",\n    "1.5.0",\n    "1.5.1",\n    "1.6.0",\n    "1.7.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0"\n  ],\n  "ashelab/elm-cqrs": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "astynax/tea-combine": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "athanclark/elm-debouncer": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "athanclark/elm-discrete-transition": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "athanclark/elm-duration": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "4.0.1",\n    "5.0.1"\n  ],\n  "athanclark/elm-every": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0",\n    "7.0.1"\n  ],\n  "athanclark/elm-param-parsing-2": [\n    "1.0.0"\n  ],\n  "athanclark/elm-threading": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "austinshenk/elm-w3": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "avh4/burndown-charts": [\n    "1.0.0"\n  ],\n  "avh4/elm-beautiful-example": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "avh4/elm-color": [\n    "1.0.0"\n  ],\n  "avh4/elm-debug-controls": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1"\n  ],\n  "avh4/elm-desktop-app": [\n    "1.0.0"\n  ],\n  "avh4/elm-diff": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7"\n  ],\n  "avh4/elm-dropbox": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "avh4/elm-favicon": [\n    "1.0.0"\n  ],\n  "avh4/elm-fifo": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "avh4/elm-github-v3": [\n    "1.0.0"\n  ],\n  "avh4/elm-meshes": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "avh4/elm-program-test": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "2.3.2",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.3.0"\n  ],\n  "avh4/elm-spec": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "avh4/elm-table": [\n    "1.0.0"\n  ],\n  "avh4/elm-testable": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "avh4/elm-transducers": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "avh4/elm-typed-styles": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "avh4-experimental/elm-debug-controls-without-datepicker": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "avh4-experimental/elm-layout": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "avh4-experimental/elm-transducers": [\n    "1.0.0"\n  ],\n  "azer/elm-ui-styles": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "5.0.0"\n  ],\n  "b0oh/elm-do": [\n    "1.0.0"\n  ],\n  "b52/elm-semantic-ui": [\n    "1.1.0"\n  ],\n  "bChiquet/elm-accessors": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "bChiquet/line-charts": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "babsballetschool/image-directory": [\n    "1.0.0"\n  ],\n  "bakkemo/elm-collision": [\n    "1.0.0",\n    "2.0.1",\n    "2.0.0",\n    "2.0.2"\n  ],\n  "bardt/elm-rosetree": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "bartavelle/json-helpers": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "base-dev/elm-graphql-module": [\n    "1.0.0"\n  ],\n  "basti1302/elm-human-readable-filesize": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0"\n  ],\n  "basti1302/elm-non-empty-array": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.4.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "bburdette/cellme": [\n    "1.0.0"\n  ],\n  "bburdette/pdf-element": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "bburdette/schelme": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "bburdette/stl": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "bburdette/toop": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "bburdette/typed-collections": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "bburdette/websocket": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "bcardiff/elm-debounce": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3"\n  ],\n  "bcardiff/elm-infscroll": [\n    "1.0.0"\n  ],\n  "bemyak/elm-slider": [\n    "1.0.0"\n  ],\n  "benansell/elm-geometric-transformation": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "benansell/lobo-elm-test-extra": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "bendyworks/elm-action-cable": [\n    "1.0.0"\n  ],\n  "benthepoet/elm-purecss": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "bernerbrau/elm-css-widgets": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "besuikerd/elm-dictset": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "bgrosse-midokura/composable-form": [\n    "1.0.0"\n  ],\n  "bigardone/elm-css-placeholders": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "bigbinary/elm-form-field": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "bigbinary/elm-reader": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "billperegoy/elm-form-validations": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "billperegoy/elm-sifter": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "billstclair/elm-bitwise-infix": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "billstclair/elm-chat": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "billstclair/elm-crypto-aes": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8",\n    "1.0.9",\n    "1.0.10"\n  ],\n  "billstclair/elm-crypto-string": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "billstclair/elm-custom-element": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.3.0",\n    "1.4.0"\n  ],\n  "billstclair/elm-dev-random": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.1.5",\n    "1.1.6",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.1.0"\n  ],\n  "billstclair/elm-dialog": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "billstclair/elm-digital-ocean": [\n    "1.0.0"\n  ],\n  "billstclair/elm-dynamodb": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "billstclair/elm-geolocation": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "billstclair/elm-html-template": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1"\n  ],\n  "billstclair/elm-id-search": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "billstclair/elm-localstorage": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.0.3",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0"\n  ],\n  "billstclair/elm-mastodon": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.0.3",\n    "7.0.0",\n    "8.0.0",\n    "9.0.0",\n    "9.0.1",\n    "9.0.2"\n  ],\n  "billstclair/elm-mastodon-websocket": [\n    "1.0.0"\n  ],\n  "billstclair/elm-oauth-middleware": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "billstclair/elm-popup-picker": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "billstclair/elm-port-funnel": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.2.0"\n  ],\n  "billstclair/elm-recovered": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "billstclair/elm-recovered-utf8": [\n    "1.0.0"\n  ],\n  "billstclair/elm-s3": [\n    "1.0.0"\n  ],\n  "billstclair/elm-sha256": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8",\n    "1.0.9"\n  ],\n  "billstclair/elm-simple-xml-to-json": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "billstclair/elm-sortable-table": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.2.0"\n  ],\n  "billstclair/elm-svg-button": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "billstclair/elm-system-notification": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "billstclair/elm-versioned-json": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "billstclair/elm-websocket-client": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.1.0"\n  ],\n  "billstclair/elm-websocket-framework": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "5.1.0",\n    "6.0.0",\n    "7.0.0",\n    "8.0.0",\n    "8.1.0",\n    "8.2.0",\n    "9.0.0",\n    "10.0.0",\n    "11.0.0",\n    "11.0.1",\n    "11.0.2",\n    "12.0.0",\n    "13.0.0",\n    "13.0.1",\n    "13.0.2"\n  ],\n  "billstclair/elm-websocket-framework-server": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "6.1.0",\n    "6.1.1",\n    "6.1.2",\n    "7.0.0",\n    "8.0.0",\n    "8.0.1",\n    "8.0.2",\n    "8.0.3",\n    "9.0.0",\n    "9.1.0",\n    "10.0.0",\n    "10.0.1",\n    "11.0.0",\n    "12.0.0",\n    "13.0.0",\n    "14.0.0",\n    "14.0.1",\n    "14.1.0",\n    "14.1.1",\n    "14.1.2",\n    "14.1.3"\n  ],\n  "billstclair/elm-xml-eeue56": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "billstclair/elm-xml-extra": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "bitrage-io/elm-ratequeue": [\n    "1.0.0"\n  ],\n  "bkuhlmann/form-validator": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1"\n  ],\n  "blacksheepmails/elm-set": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "blissfully/elm-chartjs-webcomponent": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "bloom/aviators": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.1.0"\n  ],\n  "bloom/elm-return": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "bloom/remotedata": [\n    "1.0.1"\n  ],\n  "blue-dinosaur/lambda": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "bluedogtraining/bdt-elm": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.2.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.1.0",\n    "6.2.0",\n    "7.0.0",\n    "7.1.0",\n    "8.0.0",\n    "8.1.0",\n    "8.1.1",\n    "8.2.0",\n    "8.3.0",\n    "9.0.0",\n    "9.0.1",\n    "10.0.0",\n    "11.0.0",\n    "12.0.0",\n    "12.0.1",\n    "13.0.0",\n    "13.1.0",\n    "13.1.1",\n    "13.1.2",\n    "14.0.0",\n    "15.0.0",\n    "15.1.0",\n    "15.1.1",\n    "15.1.2",\n    "15.1.3",\n    "16.0.0",\n    "16.1.0",\n    "17.0.0",\n    "17.1.0",\n    "18.0.0",\n    "18.1.0",\n    "18.1.1",\n    "19.0.0",\n    "19.0.1",\n    "20.0.0",\n    "21.0.0",\n    "21.0.1",\n    "21.0.2",\n    "21.1.0",\n    "22.0.0",\n    "22.0.1",\n    "22.1.0",\n    "23.0.0",\n    "24.0.0",\n    "25.0.0",\n    "25.1.0",\n    "26.0.0",\n    "26.0.1",\n    "26.1.0",\n    "26.1.1",\n    "26.1.2",\n    "26.1.3",\n    "26.1.4",\n    "26.1.5",\n    "26.1.6",\n    "27.0.0",\n    "27.0.1",\n    "27.0.2",\n    "27.0.3",\n    "27.0.4",\n    "27.0.5",\n    "27.0.6",\n    "27.0.7",\n    "27.0.8",\n    "27.0.9",\n    "27.0.10",\n    "27.0.11",\n    "27.0.12",\n    "27.0.13"\n  ],\n  "boianr/multilingual": [\n    "1.0.0"\n  ],\n  "bowbahdoe/elm-history": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "bowbahdoe/lime-reset": [\n    "1.0.0"\n  ],\n  "brainrape/elm-ast": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "brainrape/elm-bidict": [\n    "1.0.0"\n  ],\n  "brainrape/flex-html": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "brandly/elm-dot-lang": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4"\n  ],\n  "brasilikum/is-password-known": [\n    "1.0.0"\n  ],\n  "brenden/elm-tree-diagram": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "brian-watkins/elm-procedure": [\n    "1.0.0"\n  ],\n  "brian-watkins/elm-spec": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "brianvanburken/elm-list-date": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "brightdb/sequence": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "bruz/elm-simple-form-infix": [\n    "1.0.1",\n    "1.0.0"\n  ],\n  "bundsol/boxed": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "burabure/elm-collision": [\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "burnable-tech/elm-ethereum": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "bzimmermandev/autogrid": [\n    "1.0.0"\n  ],\n  "cacay/elm-void": [\n    "1.0.0"\n  ],\n  "cakenggt/elm-net": [\n    "1.0.0"\n  ],\n  "calions-app/app-object": [\n    "1.0.0"\n  ],\n  "calions-app/env": [\n    "1.0.0"\n  ],\n  "calions-app/jsonapi-http": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0"\n  ],\n  "calions-app/jsonapi-http-retry": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "calions-app/remote-resource": [\n    "1.0.0"\n  ],\n  "calions-app/test-attribute": [\n    "1.0.0"\n  ],\n  "camjc/elm-chart": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "camjc/elm-quiz": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "canadaduane/elm-hccb": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "capitalist/elm-octicons": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.3.0"\n  ],\n  "cappyzawa/elm-ui-colors": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "cappyzawa/elm-ui-onedark": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "careport/elm-avl": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "carlsson87/mod10": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "carlsson87/mod11": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "carmonw/elm-number-to-words": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "carpe/elm-data": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "4.0.5"\n  ],\n  "carwow/elm-core": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "4.0.5",\n    "4.0.6",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2",\n    "4.1.3",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0",\n    "6.0.1",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "7.0.3",\n    "7.0.4",\n    "7.0.5",\n    "7.0.6",\n    "8.0.0",\n    "9.0.0"\n  ],\n  "carwow/elm-slider": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0",\n    "6.0.1",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "8.0.0",\n    "9.0.0",\n    "10.0.0",\n    "11.0.0",\n    "11.1.0",\n    "11.1.1",\n    "11.1.2",\n    "11.1.3",\n    "11.1.4",\n    "11.1.5",\n    "11.1.6"\n  ],\n  "carwow/elm-slider-old": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "carwow/elm-theme": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.1.0",\n    "4.1.1",\n    "4.2.0",\n    "4.3.0",\n    "4.3.1",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "7.0.0",\n    "8.0.0",\n    "9.0.0",\n    "10.0.0",\n    "11.0.0",\n    "11.0.1",\n    "11.1.0",\n    "11.2.0"\n  ],\n  "ccapndave/elm-eexl": [\n    "1.0.0"\n  ],\n  "ccapndave/elm-effects-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "ccapndave/elm-flat-map": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0"\n  ],\n  "ccapndave/elm-list-map": [\n    "1.0.0"\n  ],\n  "ccapndave/elm-reflect": [\n    "1.0.0"\n  ],\n  "ccapndave/elm-statecharts": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "ccapndave/elm-translator": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0"\n  ],\n  "ccapndave/elm-typed-tree": [\n    "1.0.0"\n  ],\n  "ccapndave/elm-update-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "ccapndave/focus": [\n    "2.1.0",\n    "3.0.0"\n  ],\n  "ceddlyburge/elm-bootstrap-starter-master-view": [\n    "1.0.0"\n  ],\n  "ceddlyburge/elm-collections": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "cedric-h/elm-google-sign-in": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "cedricss/elm-css-systems": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.1.0"\n  ],\n  "cedricss/elm-form-machine": [\n    "1.0.0"\n  ],\n  "cedricss/elm-progress-ring": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "chain-partners/elm-bignum": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "chazsconi/elm-phoenix-ports": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "chemirea/bulma-classes": [\n    "1.0.0"\n  ],\n  "chendrix/elm-matrix": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "3.1.3"\n  ],\n  "chendrix/elm-numpad": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "chicode/lisa": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "5.1.1",\n    "5.1.2",\n    "5.1.3",\n    "5.1.4",\n    "5.1.5"\n  ],\n  "choonkeat/elm-retry": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "chrilves/elm-io": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0"\n  ],\n  "chrisalmeida/graphqelm": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "chrisbuttery/elm-greeting": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "chrisbuttery/elm-parting": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "chrisbuttery/elm-scroll-progress": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "chrisbuttery/is-online": [\n    "1.0.1",\n    "1.0.2"\n  ],\n  "chrisbuttery/reading-time": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "circuithub/elm-array-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "circuithub/elm-array-focus": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "circuithub/elm-bootstrap-html": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.0.3",\n    "6.1.0",\n    "6.2.0",\n    "6.3.0",\n    "6.3.1",\n    "6.3.2",\n    "6.3.3",\n    "6.3.4",\n    "7.0.0"\n  ],\n  "circuithub/elm-dropdown": [\n    "1.0.0"\n  ],\n  "circuithub/elm-filepickerio-api-types": [\n    "1.0.0"\n  ],\n  "circuithub/elm-function-extra": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.1.5",\n    "1.1.6",\n    "1.1.7",\n    "1.1.8",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2"\n  ],\n  "circuithub/elm-graphics-shorthand": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "circuithub/elm-html-extra": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.4.0",\n    "1.5.0",\n    "1.5.1",\n    "1.5.2"\n  ],\n  "circuithub/elm-html-shorthand": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0",\n    "7.0.0",\n    "8.0.0",\n    "9.0.0",\n    "9.0.1",\n    "9.0.2",\n    "9.0.3",\n    "9.0.4",\n    "10.0.0",\n    "11.0.0"\n  ],\n  "circuithub/elm-json-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "2.2.1"\n  ],\n  "circuithub/elm-list-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "2.4.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "3.3.0",\n    "3.4.0",\n    "3.5.0",\n    "3.6.0",\n    "3.7.0",\n    "3.7.1",\n    "3.8.0",\n    "3.9.0",\n    "3.10.0"\n  ],\n  "circuithub/elm-list-signal": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "circuithub/elm-list-split": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "circuithub/elm-maybe-extra": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.5.1",\n    "1.6.0"\n  ],\n  "circuithub/elm-number-format": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "circuithub/elm-result-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.4.0"\n  ],\n  "circuithub/elm-string-split": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "cjduncana/three-words": [\n    "1.0.0"\n  ],\n  "cjmeeks/elm-calendar": [\n    "1.0.0"\n  ],\n  "ckoster22/elm-genetic": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "clojj/elm-css-grid": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "cmditch/elm-bigint": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "cmditch/elm-ethereum": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0"\n  ],\n  "cmditch/mel-bew3": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0",\n    "7.0.0",\n    "7.0.1",\n    "8.0.0",\n    "9.0.0",\n    "10.0.0",\n    "11.0.0",\n    "12.0.0",\n    "13.0.0",\n    "13.0.1"\n  ],\n  "cobalamin/elm-json-extra": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "cobalamin/history-tree": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "cobalamin/safe-int": [\n    "1.0.0"\n  ],\n  "coinop-logan/elm-format-number": [\n    "1.0.0"\n  ],\n  "coinop-logan/phace": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "commonmind/elm-csexpr": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "commonmind/elm-csv-encode": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "comsysto/harvest-api": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "coreytrampe/elm-vendor": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "correl/elm-paginated": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0"\n  ],\n  "cotterjd/elm-mdl": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "crazymykl/ex-em-elm": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0"\n  ],\n  "csicar/elm-mathui": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "cuducos/elm-format-number": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "5.0.3",\n    "5.0.4",\n    "5.0.5",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.1.0",\n    "6.2.0",\n    "7.0.0",\n    "8.0.0",\n    "8.1.0",\n    "8.1.1",\n    "8.1.2"\n  ],\n  "cultureamp/babel-elm-assets-plugin": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "cultureamp/elm-css-modules-loader": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5",\n    "2.0.6",\n    "2.0.7",\n    "2.0.8",\n    "2.0.9",\n    "2.0.10"\n  ],\n  "cutsea110/elm-temperature": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dailydrip/elm-emoji": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dalen/elm-charts": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "damienklinnert/elm-hue": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1"\n  ],\n  "damienklinnert/elm-spinner": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "damukles/elm-dialog": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "danabrams/elm-media": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.4",\n    "2.0.5",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "3.0.5"\n  ],\n  "danabrams/elm-media-source": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "danfishgold/base64-bytes": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "danhandrea/elm-date-format": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "danhandrea/elm-foo": [\n    "1.0.0"\n  ],\n  "danhandrea/elm-router": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "danielnarey/elm-color-math": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "danielnarey/elm-css-basics": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0"\n  ],\n  "danielnarey/elm-css-math": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "danielnarey/elm-font-import": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "danielnarey/elm-form-capture": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "danielnarey/elm-input-validation": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "danielnarey/elm-modular-ui": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0"\n  ],\n  "danielnarey/elm-semantic-dom": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "danielnarey/elm-semantic-effects": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "danielnarey/elm-stylesheet": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.1.0",\n    "7.0.0",\n    "7.1.0",\n    "7.1.1"\n  ],\n  "danielnarey/elm-toolkit": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.2.1",\n    "3.3.0",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0",\n    "4.3.0",\n    "4.4.0",\n    "4.5.0",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "6.1.0",\n    "6.1.1",\n    "6.2.0"\n  ],\n  "danmarcab/elm-retroactive": [\n    "1.0.0"\n  ],\n  "danmarcab/material-icons": [\n    "1.0.0"\n  ],\n  "danyx23/elm-dropzone": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "danyx23/elm-mimetype": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "danyx23/elm-uuid": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2"\n  ],\n  "dasch/crockford": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "dasch/elm-basics-extra": [\n    "1.0.0"\n  ],\n  "dasch/levenshtein": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dasch/parser": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "data-viz-lab/elm-chart-builder": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "davcamer/elm-protobuf": [\n    "1.0.0"\n  ],\n  "davidpelaez/elm-scenic": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dawehner/elm-colorbrewer": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1"\n  ],\n  "deadfoxygrandpa/elm-architecture": [\n    "1.0.0"\n  ],\n  "deadfoxygrandpa/elm-test": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1"\n  ],\n  "debois/elm-dom": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.2.3",\n    "1.3.0"\n  ],\n  "debois/elm-mdl": [\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.0.3",\n    "6.0.4",\n    "6.1.0",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0",\n    "7.3.0",\n    "7.4.0",\n    "7.5.0",\n    "7.6.0",\n    "8.0.0",\n    "8.0.1",\n    "8.1.0"\n  ],\n  "debois/elm-parts": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0"\n  ],\n  "declension/elm-obj-loader": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "derekdreery/elm-die-faces": [\n    "1.0.0"\n  ],\n  "derrickreimer/elm-keys": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "dhruvin2910/elm-css": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "dillonkearns/elm-cli-options-parser": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "dillonkearns/elm-graphql": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.5.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0",\n    "4.2.1",\n    "4.3.0",\n    "4.3.1",\n    "4.4.0",\n    "4.5.0",\n    "5.0.0"\n  ],\n  "dillonkearns/elm-markdown": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2"\n  ],\n  "dillonkearns/elm-oembed": [\n    "1.0.0"\n  ],\n  "dillonkearns/elm-pages": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0"\n  ],\n  "dillonkearns/elm-rss": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dillonkearns/elm-sitemap": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dillonkearns/graphqelm": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.1.0",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0",\n    "8.0.0",\n    "8.0.1",\n    "9.0.0",\n    "9.1.0",\n    "10.0.0",\n    "10.1.0",\n    "10.2.0",\n    "11.0.0",\n    "11.1.0",\n    "11.2.0"\n  ],\n  "dillonkearns/graphqelm-demo": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "6.1.0",\n    "6.1.1"\n  ],\n  "dividat/elm-identicon": [\n    "1.0.0"\n  ],\n  "dividat/elm-semver": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "dmy/elm-imf-date-time": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dmy/elm-pratt-parser": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "doanythingfordethklok/snackbar": [\n    "1.0.0"\n  ],\n  "doodledood/elm-split-pane": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0"\n  ],\n  "dosarf/elm-activemq": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dosarf/elm-guarded-input": [\n    "1.0.0"\n  ],\n  "dosarf/elm-tree-view": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "dosarf/elm-yet-another-polling": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "drathier/elm-graph": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "drathier/elm-test-graph": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "drathier/elm-test-tables": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "driebit/elm-css-breakpoint": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "driebit/elm-ginger": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.3.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "driebit/elm-html-unsafe-headers": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "driebit/elm-max-size-dict": [\n    "1.0.0"\n  ],\n  "drojas/elm-http-parser": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "drojas/elm-task-middleware": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "dtraft/elm-classnames": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "dullbananas/elm-touch": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "duncanmalashock/json-rest-api": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "dustinfarris/elm-autocomplete": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dustinspecker/capitalize-word": [\n    "1.0.0"\n  ],\n  "dustinspecker/dict-key-values": [\n    "1.0.0"\n  ],\n  "dustinspecker/is-fibonacci-number": [\n    "1.0.0"\n  ],\n  "dustinspecker/last": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dustinspecker/list-join-conjunction": [\n    "1.0.0"\n  ],\n  "dustinspecker/us-states": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "dvberkel/microkanren": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "dwyl/elm-criteria": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1"\n  ],\n  "dwyl/elm-datepicker": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0"\n  ],\n  "dwyl/elm-input-tables": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "dzuk-mutant/internettime": [\n    "1.0.0"\n  ],\n  "eddylane/elm-flip-animation": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "edkv/elm-components": [\n    "1.0.0"\n  ],\n  "edkv/elm-generic-dict": [\n    "1.0.0"\n  ],\n  "edvail/elm-polymer": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.2.3",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "eelcoh/parser-indent": [\n    "1.0.0"\n  ],\n  "eeue56/elm-all-dict": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "eeue56/elm-alternative-json": [\n    "1.0.0"\n  ],\n  "eeue56/elm-debug-json-view": [\n    "1.0.0"\n  ],\n  "eeue56/elm-default-dict": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "eeue56/elm-flat-matrix": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.3.2",\n    "1.3.3",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0",\n    "1.6.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0"\n  ],\n  "eeue56/elm-html-in-elm": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "5.2.0"\n  ],\n  "eeue56/elm-html-query": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "eeue56/elm-html-test": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "5.0.1",\n    "5.1.0",\n    "5.1.1",\n    "5.1.2",\n    "5.1.3",\n    "5.2.0"\n  ],\n  "eeue56/elm-http-error-view": [\n    "1.0.0"\n  ],\n  "eeue56/elm-json-field-value": [\n    "1.0.0"\n  ],\n  "eeue56/elm-lazy": [\n    "1.0.0"\n  ],\n  "eeue56/elm-lazy-list": [\n    "1.0.0"\n  ],\n  "eeue56/elm-pretty-print-json": [\n    "1.0.0"\n  ],\n  "eeue56/elm-shrink": [\n    "1.0.0"\n  ],\n  "eeue56/elm-simple-data": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "eeue56/elm-stringify": [\n    "1.0.1",\n    "1.0.0",\n    "1.0.2"\n  ],\n  "eeue56/elm-xml": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "2.2.3"\n  ],\n  "egillet/elm-sortable-table": [\n    "2.0.0",\n    "2.0.1"\n  ],\n  "eike/json-decode-complete": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elb17/multiselect-menu": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "eliaslfox/orderedmap": [\n    "1.0.0"\n  ],\n  "eliaslfox/queue": [\n    "1.0.0"\n  ],\n  "elm/browser": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "elm/bytes": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8"\n  ],\n  "elm/core": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "elm/file": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "elm/html": [\n    "1.0.0"\n  ],\n  "elm/http": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "elm/json": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3"\n  ],\n  "elm/parser": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "elm/project-metadata-utils": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm/random": [\n    "1.0.0"\n  ],\n  "elm/regex": [\n    "1.0.0"\n  ],\n  "elm/svg": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm/time": [\n    "1.0.0"\n  ],\n  "elm/url": [\n    "1.0.0"\n  ],\n  "elm/virtual-dom": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "elm-athlete/athlete": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "2.3.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2"\n  ],\n  "elm-bodybuilder/elegant": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0",\n    "7.1.0",\n    "7.1.1",\n    "7.1.2"\n  ],\n  "elm-bodybuilder/elm-function": [\n    "1.0.0"\n  ],\n  "elm-bodybuilder/formbuilder": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0"\n  ],\n  "elm-bodybuilder/formbuilder-autocomplete": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "elm-bodybuilder/formbuilder-photo": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "elm-canvas/element-relative-mouse-events": [\n    "1.0.0"\n  ],\n  "elm-canvas/raster-shapes": [\n    "1.0.0"\n  ],\n  "elm-community/array-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0"\n  ],\n  "elm-community/basics-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.2.0",\n    "2.3.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.1.0"\n  ],\n  "elm-community/dict-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.3.2",\n    "1.4.0",\n    "1.5.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "2.4.0"\n  ],\n  "elm-community/easing-functions": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "elm-community/elm-check": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "elm-community/elm-datepicker": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.1.0",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0",\n    "7.2.1",\n    "7.2.2",\n    "7.2.3",\n    "7.2.4",\n    "7.2.5",\n    "7.2.6"\n  ],\n  "elm-community/elm-history": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0"\n  ],\n  "elm-community/elm-json-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "elm-community/elm-lazy-list": [\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.0.0"\n  ],\n  "elm-community/elm-linear-algebra": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "elm-community/elm-list-extra": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "elm-community/elm-material-icons": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "elm-community/elm-random-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "elm-community/elm-test": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.2.0"\n  ],\n  "elm-community/elm-time": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8",\n    "1.0.9",\n    "1.0.10",\n    "1.0.11",\n    "1.0.12",\n    "1.0.13",\n    "1.0.14",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4"\n  ],\n  "elm-community/elm-webgl": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4"\n  ],\n  "elm-community/graph": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0"\n  ],\n  "elm-community/html-extra": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "3.3.0",\n    "3.4.0"\n  ],\n  "elm-community/html-test-runner": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7"\n  ],\n  "elm-community/intdict": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "elm-community/json-extra": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.4.0",\n    "2.5.0",\n    "2.6.0",\n    "2.7.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0",\n    "4.3.0"\n  ],\n  "elm-community/lazy-list": [\n    "1.0.0"\n  ],\n  "elm-community/linear-algebra": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2"\n  ],\n  "elm-community/list-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.1.0",\n    "7.0.0",\n    "7.0.1",\n    "7.1.0",\n    "8.0.0",\n    "8.1.0",\n    "8.2.0",\n    "8.2.1",\n    "8.2.2",\n    "8.2.3",\n    "8.2.4"\n  ],\n  "elm-community/list-split": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "elm-community/material-icons": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "elm-community/maybe-extra": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "5.2.0"\n  ],\n  "elm-community/parser-combinators": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "elm-community/random-extra": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0"\n  ],\n  "elm-community/ratio": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "elm-community/result-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.3.0",\n    "2.4.0"\n  ],\n  "elm-community/shrink": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "elm-community/string-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.3.2",\n    "1.3.3",\n    "1.4.0",\n    "1.5.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "elm-community/svg-extra": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-community/typed-svg": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "5.1.0",\n    "5.2.0",\n    "6.0.0"\n  ],\n  "elm-community/undo-redo": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "elm-community/webgl": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5"\n  ],\n  "elm-explorations/benchmark": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-explorations/linear-algebra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "elm-explorations/markdown": [\n    "1.0.0"\n  ],\n  "elm-explorations/test": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2"\n  ],\n  "elm-explorations/webgl": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "elm-in-elm/compiler": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-lang/animation-frame": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-lang/core": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "4.0.5",\n    "5.0.0",\n    "5.1.0",\n    "5.1.1"\n  ],\n  "elm-lang/dom": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "elm-lang/geolocation": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "elm-lang/html": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "elm-lang/http": [\n    "1.0.0"\n  ],\n  "elm-lang/keyboard": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-lang/lazy": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "elm-lang/mouse": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-lang/navigation": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "elm-lang/page-visibility": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-lang/svg": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "elm-lang/trampoline": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-lang/virtual-dom": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4"\n  ],\n  "elm-lang/websocket": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "elm-lang/window": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-scotland/elm-tries": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-tools/documentation": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "elm-tools/parser": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "elm-tools/parser-primitives": [\n    "1.0.0"\n  ],\n  "elm-toulouse/cbor": [\n    "1.0.0"\n  ],\n  "elm-toulouse/float16": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "emilianobovetti/edit-distance": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "emilianobovetti/elm-yajson": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "emilyhorsman/elm-speechrecognition-interop": [\n    "1.0.0"\n  ],\n  "emptyflash/typed-svg": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "emtenet/elm-component-support": [\n    "1.0.0"\n  ],\n  "enetsee/elm-color-interpolate": [\n    "1.0.0"\n  ],\n  "enetsee/elm-facet-scenegraph": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0",\n    "7.0.0",\n    "8.0.0",\n    "9.0.0",\n    "10.0.0",\n    "11.0.0",\n    "12.0.0"\n  ],\n  "enetsee/elm-scale": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8"\n  ],\n  "enetsee/facet-plot-alpha": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "enetsee/facet-render-svg-alpha": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "enetsee/facet-scenegraph-alpha": [\n    "1.0.0"\n  ],\n  "enetsee/facet-theme-alpha": [\n    "1.0.0"\n  ],\n  "enetsee/rangeslider": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "enetsee/typed-format": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "engagesoftware/elm-dnn-localization": [\n    "1.0.0"\n  ],\n  "ensoft/entrance": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "ericgj/elm-accordion-menu": [\n    "1.0.0"\n  ],\n  "ericgj/elm-autoinput": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "ericgj/elm-csv-decode": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "ericgj/elm-quantiles": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "ericgj/elm-uri-template": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ericgj/elm-validation": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "eriktim/elm-protocol-buffers": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "erlandsona/assoc-set": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "erosson/number-suffix": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "ersocon/creditcard-validation": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "erwald/elm-edit-distance": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "esanmiguelc/elm-validate": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "eskimoblood/elm-color-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "3.2.1",\n    "3.2.2",\n    "3.2.3",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "5.0.0",\n    "5.1.0"\n  ],\n  "eskimoblood/elm-parametric-surface": [\n    "1.0.0"\n  ],\n  "eskimoblood/elm-simplex-noise": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.2.3"\n  ],\n  "eskimoblood/elm-wallpaper": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "2.1.4",\n    "2.1.5"\n  ],\n  "etaque/elm-dialog": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "etaque/elm-form": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "etaque/elm-hexagons": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "etaque/elm-response": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0"\n  ],\n  "etaque/elm-route-parser": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0"\n  ],\n  "etaque/elm-simple-form": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1"\n  ],\n  "etaque/elm-simple-form-infix": [\n    "1.0.0"\n  ],\n  "etaque/elm-transit": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "7.0.3",\n    "7.0.4",\n    "7.0.5"\n  ],\n  "etaque/elm-transit-router": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "etaque/elm-transit-style": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "evancz/automaton": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "evancz/elm-effects": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "evancz/elm-graphics": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "evancz/elm-html": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "5.0.0"\n  ],\n  "evancz/elm-http": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "evancz/elm-markdown": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.1.5",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "evancz/elm-playground": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "evancz/elm-sortable-table": [\n    "1.0.1"\n  ],\n  "evancz/elm-svg": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "evancz/focus": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "evancz/start-app": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "evancz/task-tutorial": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "evancz/url-parser": [\n    "2.0.0",\n    "2.0.1"\n  ],\n  "evancz/virtual-dom": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.2.3",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "exdis/elm-sample-package": [\n    "1.0.0"\n  ],\n  "f0i/iso8601": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "f0i/statistics": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "fabhof/elm-ui-datepicker": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "fabiommendes/elm-bricks": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "fabiommendes/elm-dynamic-forms": [\n    "1.0.0"\n  ],\n  "fabiommendes/elm-iter": [\n    "1.0.0"\n  ],\n  "fabiommendes/elm-sexpr": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "fapian/elm-html-aria": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.3.0",\n    "1.3.1",\n    "1.4.0"\n  ],\n  "fauu/elm-selectable-text": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "fbonetti/elm-geodesy": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "fbonetti/elm-phoenix-socket": [\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0"\n  ],\n  "fdbeirao/elm-sliding-list": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0"\n  ],\n  "feathericons/elm-feather": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0"\n  ],\n  "fedragon/elm-typed-dropdown": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "felipesere/elm-github-colors": [\n    "1.0.0"\n  ],\n  "fiatjaf/hashbow-elm": [\n    "1.0.0"\n  ],\n  "fifth-postulate/combinatorics": [\n    "1.0.0"\n  ],\n  "fifth-postulate/elm-csv-decode": [\n    "1.0.0"\n  ],\n  "fifth-postulate/priority-queue": [\n    "1.0.0"\n  ],\n  "flarebyte/bubblegum-entity": [\n    "1.0.0"\n  ],\n  "flarebyte/bubblegum-graph": [\n    "1.0.0"\n  ],\n  "flarebyte/bubblegum-ui-preview": [\n    "1.0.0"\n  ],\n  "flarebyte/bubblegum-ui-preview-tag": [\n    "1.0.0"\n  ],\n  "flarebyte/bubblegum-ui-tag": [\n    "1.0.0"\n  ],\n  "flarebyte/bubblegum-ui-textarea": [\n    "1.0.0"\n  ],\n  "flarebyte/ntriples-filter": [\n    "1.0.0"\n  ],\n  "flowlang-cc/elm-audio-graph": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "folkertdev/elm-bounding-box": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "folkertdev/elm-brotli": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "folkertdev/elm-cff": [\n    "1.0.0"\n  ],\n  "folkertdev/elm-deque": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "folkertdev/elm-flate": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4"\n  ],\n  "folkertdev/elm-hexbin": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "folkertdev/elm-int64": [\n    "1.0.0"\n  ],\n  "folkertdev/elm-iris": [\n    "1.0.0"\n  ],\n  "folkertdev/elm-kmeans": [\n    "1.0.0"\n  ],\n  "folkertdev/elm-paragraph": [\n    "1.0.0"\n  ],\n  "folkertdev/elm-sha2": [\n    "1.0.0"\n  ],\n  "folkertdev/elm-state": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "folkertdev/elm-tiny-inflate": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "folkertdev/elm-treemap": [\n    "1.0.0"\n  ],\n  "folkertdev/one-true-path-experiment": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "5.0.0"\n  ],\n  "folkertdev/outmessage": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "folkertdev/svg-path-dsl": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "folkertdev/svg-path-lowlevel": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "folq/review-rgb-ranges": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "francescortiz/elm-queue": [\n    "1.0.0"\n  ],\n  "frandibar/elm-bootstrap": [\n    "1.0.1",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "frandibar/elm-font-awesome-5": [\n    "1.0.0"\n  ],\n  "frawa/elm-contour": [\n    "1.0.0"\n  ],\n  "fredcy/elm-debouncer": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "fredcy/elm-defer-command": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "fredcy/elm-parseint": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0",\n    "1.3.0",\n    "2.0.0",\n    "1.3.1",\n    "2.0.1"\n  ],\n  "fredcy/elm-timer": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "fresheyeball/elm-check-runner": [\n    "1.0.0"\n  ],\n  "friedbrice/elm-teaching-tools": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "fustkilas/elm-airtable": [\n    "1.0.0"\n  ],\n  "gaborv/debouncer": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "gampleman/elm-examples-helper": [\n    "1.0.0"\n  ],\n  "gampleman/elm-mapbox": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "4.1.0"\n  ],\n  "gampleman/elm-visualization": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0",\n    "1.6.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "garetht/elm-dynamic-style": [\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0"\n  ],\n  "gdamjan/elm-identicon": [\n    "1.0.0"\n  ],\n  "gege251/elm-validator-pipeline": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "genthaler/elm-enum": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "geppettodivacin/elm-couchdb": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "getsurance/elm-street": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "getto-systems/elm-apply": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "getto-systems/elm-command": [\n    "1.0.0"\n  ],\n  "getto-systems/elm-field": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "getto-systems/elm-html-table": [\n    "1.0.0"\n  ],\n  "getto-systems/elm-http-header": [\n    "1.0.0"\n  ],\n  "getto-systems/elm-http-part": [\n    "1.0.0"\n  ],\n  "getto-systems/elm-json": [\n    "1.0.0"\n  ],\n  "getto-systems/elm-sort": [\n    "1.0.0"\n  ],\n  "getto-systems/elm-url": [\n    "1.0.0"\n  ],\n  "getto-systems/getto-elm-command": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "ggb/elm-bloom": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0"\n  ],\n  "ggb/elm-sentiment": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ggb/elm-trend": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "ggb/numeral-elm": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.2.3",\n    "1.3.0",\n    "1.4.0",\n    "1.4.1",\n    "1.4.2",\n    "1.4.3"\n  ],\n  "ggb/porterstemmer": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "ghivert/elm-cloudinary": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "ghivert/elm-colors": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "ghivert/elm-data-dumper": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "ghivert/elm-graphql": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.3.0",\n    "3.4.0",\n    "3.5.0",\n    "4.0.0",\n    "5.0.0"\n  ],\n  "ghivert/elm-mapbox": [\n    "1.0.0"\n  ],\n  "gicentre/elm-vega": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.3.0",\n    "2.3.1",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "4.2.0",\n    "4.3.0",\n    "4.3.1",\n    "5.0.0",\n    "5.1.0",\n    "5.2.0",\n    "5.3.0",\n    "5.4.0",\n    "5.5.0"\n  ],\n  "gicentre/elm-vegalite": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0",\n    "1.7.0",\n    "1.8.0",\n    "1.9.0",\n    "1.10.0",\n    "1.11.0",\n    "1.12.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0"\n  ],\n  "gicentre/tidy": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0"\n  ],\n  "gigobyte/iso8601-duration": [\n    "1.0.0"\n  ],\n  "gilbertkennen/bigint": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "gilesbowkett/html-escape-sequences": [\n    "1.0.0"\n  ],\n  "gingko/time-distance": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "2.2.1",\n    "2.3.0"\n  ],\n  "gipsy-king/radar-chart": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "glasserc/elm-debouncer": [\n    "1.0.0"\n  ],\n  "glasserc/elm-form-result": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "glasserc/elm-requested": [\n    "1.0.0"\n  ],\n  "gmauricio/elm-semantic-ui": [\n    "1.0.0"\n  ],\n  "goilluminate/elm-fancy-daterangepicker": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "5.1.1",\n    "5.1.2",\n    "5.1.3",\n    "6.0.0"\n  ],\n  "gribouille/elm-graphql": [\n    "1.0.0"\n  ],\n  "gribouille/elm-prelude": [\n    "1.0.0"\n  ],\n  "gribouille/elm-table": [\n    "1.0.0"\n  ],\n  "gribouille/elm-treeview": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "groteck/elm-iban": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "grotsev/elm-debouncer": [\n    "1.0.0"\n  ],\n  "grrinchas/elm-graphql-client": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "grrinchas/elm-natural": [\n    "1.0.0"\n  ],\n  "guid75/ziplist": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "h0lyalg0rithm/elm-select": [\n    "1.0.0"\n  ],\n  "hakonrossebo/elmdocs": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3"\n  ],\n  "halfzebra/elm-aframe": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0"\n  ],\n  "halfzebra/elm-sierpinski": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "hanshoglund/elm-interval": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "hardfire/elm-ad-bs": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "harmboschloo/elm-dict-intersect": [\n    "1.0.0"\n  ],\n  "harmboschloo/elm-ecs": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "harmboschloo/graphql-to-elm": [\n    "1.0.0"\n  ],\n  "harmboschloo/graphql-to-elm-package": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "harrysarson/elm-complex": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "harrysarson/elm-decode-elmi": [\n    "1.0.0"\n  ],\n  "harrysarson/elm-hacky-unique": [\n    "1.0.0"\n  ],\n  "hawx/elm-mixpanel": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "hecrj/composable-form": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "2.2.3",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "7.1.0",\n    "8.0.0",\n    "8.0.1"\n  ],\n  "hecrj/elm-slug": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "hecrj/html-parser": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "2.3.2",\n    "2.3.3",\n    "2.3.4"\n  ],\n  "hendore/elm-adorable-avatars": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "hendore/elm-port-message": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "hendore/elm-temperature": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "henne90gen/elm-pandas-visualization": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "hercules-ci/elm-dropdown": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "hercules-ci/elm-hercules-extras": [\n    "1.0.0"\n  ],\n  "hermanverschooten/ip": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "heyLu/elm-format-date": [\n    "1.0.0"\n  ],\n  "hickscorp/elm-bigint": [\n    "1.0.0",\n    "1.0.2"\n  ],\n  "hmsk/elm-css-modern-normalize": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "hoelzro/elm-drag": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "holmusk/timed-cache": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "hrldcpr/elm-cons": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0"\n  ],\n  "hugobessaa/elm-logoot": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.2.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "humio/elm-dashboard": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.0.1"\n  ],\n  "ianmackenzie/elm-1d-parameter": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ianmackenzie/elm-3d-camera": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.1.0"\n  ],\n  "ianmackenzie/elm-3d-scene": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ianmackenzie/elm-float-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "ianmackenzie/elm-geometry": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.3.0",\n    "3.4.0",\n    "3.5.0",\n    "3.6.0"\n  ],\n  "ianmackenzie/elm-geometry-linear-algebra-interop": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "ianmackenzie/elm-geometry-prerelease": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ianmackenzie/elm-geometry-svg": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "ianmackenzie/elm-geometry-test": [\n    "1.0.0"\n  ],\n  "ianmackenzie/elm-interval": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "ianmackenzie/elm-iso-10303": [\n    "1.0.0"\n  ],\n  "ianmackenzie/elm-step-file": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ianmackenzie/elm-triangular-mesh": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "ianmackenzie/elm-units": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.4.0",\n    "2.5.0",\n    "2.5.1",\n    "2.6.0"\n  ],\n  "ianmackenzie/elm-units-interval": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "ianp/elm-datepicker": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "icidasset/css-support": [\n    "1.0.0"\n  ],\n  "icidasset/elm-binary": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0"\n  ],\n  "icidasset/elm-material-icons": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0"\n  ],\n  "icidasset/elm-sha": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "identicalsnowflake/elm-dynamic-style": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "identicalsnowflake/elm-typed-styles": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "imbybio/cachedremotedata": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "imbybio/outmessage-nested": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "imeckler/either": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "imeckler/empty": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "imeckler/iterator": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0"\n  ],\n  "imeckler/piece": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "imeckler/queue": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3"\n  ],\n  "imeckler/ratio": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "imeckler/stage": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "2.0.0"\n  ],\n  "imjoehaines/afinn-165-elm": [\n    "1.0.0"\n  ],\n  "indicatrix/elm-chartjs-webcomponent": [\n    "1.0.0"\n  ],\n  "indicatrix/elm-input-extra": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ingara/elm-asoiaf-api": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "inkuzmin/elm-multiselect": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3"\n  ],\n  "innoave/bounded-number": [\n    "1.0.0"\n  ],\n  "insurello/elm-swedish-bank-account-number": [\n    "1.0.0"\n  ],\n  "insurello/elm-ui-explorer": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "iodevs/elm-history": [\n    "1.0.0"\n  ],\n  "iodevs/elm-validate": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3"\n  ],\n  "iosphere/elm-i18n": [\n    "1.0.0"\n  ],\n  "iosphere/elm-logger": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "iosphere/elm-network-graph": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "2.0.0"\n  ],\n  "iosphere/elm-toast": [\n    "1.0.0"\n  ],\n  "ir4y/elm-cursor": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "ir4y/elm-dnd": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "isaacseymour/deprecated-time": [\n    "1.0.0"\n  ],\n  "isberg/elm-ann": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.5.1",\n    "1.5.2",\n    "1.5.3",\n    "1.6.0",\n    "1.6.1",\n    "1.6.2"\n  ],\n  "itravel-de/elm-thumbor": [\n    "1.0.0"\n  ],\n  "ivadzy/bbase64": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "j-panasiuk/elm-ionicons": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "jabaraster/elm-views": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "jackfranklin/elm-console-log": [\n    "1.0.0"\n  ],\n  "jackfranklin/elm-parse-link-header": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "jackfranklin/elm-statey": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "jackhp95/elm-mapbox": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "jackhp95/palit": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "jackwillis/elm-dialog": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jahewson/elm-graphql-module": [\n    "1.0.0"\n  ],\n  "jamby1100/elm-blog-engine": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "2.0.0"\n  ],\n  "jamesgary/elm-config-ui": [\n    "1.0.0"\n  ],\n  "jamesmacaulay/elm-graphql": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.3.2",\n    "1.3.3",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0",\n    "1.6.1",\n    "1.7.0",\n    "1.8.0",\n    "2.0.0"\n  ],\n  "jamesmacaulay/elm-json-bidirectional": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "janjelinek/creditcard-validation": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jaredramirez/elm-field": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "jaredramirez/elm-parser": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "jaredramirez/elm-s3": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0"\n  ],\n  "jasonliang512/elm-heroicons": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "jasonmahr/html-escape-sequences": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "1.0.2",\n    "2.0.2",\n    "2.0.3",\n    "1.0.3",\n    "2.0.4",\n    "1.0.4",\n    "1.0.5",\n    "2.0.5"\n  ],\n  "jastice/boxes-and-bubbles": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "jastice/forkithardermakeitbetter": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "jastice/president": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "javcasas/elm-decimal": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "javcasas/elm-integer": [\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "jcollard/elm-playground": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "jcollard/key-constants": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jeffesp/elm-vega": [\n    "2.0.3"\n  ],\n  "jergason/elm-hash": [\n    "1.0.0"\n  ],\n  "jessitron/elm-http-with-headers": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "jessitron/elm-param-parsing": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "jfairbank/elm-stream": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "jfmengels/elm-lint": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2"\n  ],\n  "jfmengels/elm-lint-reporter": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jfmengels/elm-review": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0"\n  ],\n  "jfmengels/elm-review-reporter": [\n    "1.0.0"\n  ],\n  "jfmengels/lint-debug": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jfmengels/lint-unused": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jfmengels/review-common": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1"\n  ],\n  "jfmengels/review-debug": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "jfmengels/review-documentation": [\n    "1.0.0"\n  ],\n  "jfmengels/review-tea": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "jfmengels/review-unused": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3"\n  ],\n  "jgrenat/elm-html-test-runner": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "jgrenat/regression-testing": [\n    "1.0.0"\n  ],\n  "jigargosar/elm-material-color": [\n    "1.0.0"\n  ],\n  "jims/graphqelm": [\n    "1.0.0"\n  ],\n  "jims/html-parser": [\n    "1.0.0"\n  ],\n  "jinjor/elm-contextmenu": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "jinjor/elm-csv-decode": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jinjor/elm-debounce": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "3.0.0"\n  ],\n  "jinjor/elm-diff": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6"\n  ],\n  "jinjor/elm-html-parser": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.1.5"\n  ],\n  "jinjor/elm-inline-hover": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jinjor/elm-insertable-key": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jinjor/elm-map-debug": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "jinjor/elm-req": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "jinjor/elm-time-travel": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8",\n    "1.0.9",\n    "1.0.10",\n    "1.0.11",\n    "1.0.12",\n    "1.0.13",\n    "1.0.14",\n    "1.0.15",\n    "1.0.16",\n    "1.0.17",\n    "2.0.0"\n  ],\n  "jinjor/elm-transition": [\n    "1.0.0"\n  ],\n  "jinjor/elm-xml-parser": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "jirichmiel/minimax": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jjagielka/select-menu": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jjant/elm-comonad-zipper": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jjant/elm-dict": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "jjant/elm-printf": [\n    "1.0.0"\n  ],\n  "jluckyiv/elm-utc-date-strings": [\n    "1.0.0"\n  ],\n  "jmg-duarte/group-list": [\n    "1.0.0"\n  ],\n  "joakin/elm-canvas": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "3.0.5",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "4.2.0",\n    "4.2.1"\n  ],\n  "joakin/elm-grid": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "joefiorini/elm-time-machine": [\n    "1.0.0"\n  ],\n  "john-kelly/elm-interactive-graphics": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "john-kelly/elm-postgrest": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.1.0"\n  ],\n  "john-kelly/elm-rest": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "johnathanbostrom/elm-dice": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "johnathanbostrom/selectlist": [\n    "1.0.0"\n  ],\n  "johnathanbostrom/selectlist-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "johnpmayer/elm-linear-algebra": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "johnpmayer/elm-opaque": [\n    "1.0.0"\n  ],\n  "johnpmayer/elm-webgl": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "johnpmayer/state": [\n    "1.0.0"\n  ],\n  "johnpmayer/tagtree": [\n    "1.0.0"\n  ],\n  "jonathanfishbein1/complex-numbers": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.1.0",\n    "6.1.1",\n    "7.0.0",\n    "7.0.1"\n  ],\n  "jonathanfishbein1/elm-comment": [\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.1",\n    "4.0.0",\n    "1.0.0",\n    "3.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "5.0.3",\n    "5.0.4",\n    "5.0.5"\n  ],\n  "jonathanfishbein1/elm-equal": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jonathanfishbein1/elm-field": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0"\n  ],\n  "jonathanfishbein1/elm-monoid": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "jonathanfishbein1/elm-semigroup": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jonathanfishbein1/linear-algebra": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "7.0.0",\n    "7.1.0",\n    "8.0.0",\n    "9.0.0"\n  ],\n  "joneshf/elm-comonad": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.3.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "joneshf/elm-constraint": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "joneshf/elm-mom": [\n    "1.0.0"\n  ],\n  "joneshf/elm-proxy": [\n    "1.0.0"\n  ],\n  "joneshf/elm-tagged": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "joneshf/elm-tail-recursion": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "joneshf/elm-these": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0",\n    "1.2.1"\n  ],\n  "jonoabroad/commatosed": [\n    "1.0.0"\n  ],\n  "joonazan/elm-gol": [\n    "1.0.0"\n  ],\n  "joonazan/elm-type-inference": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "2.0.1",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "5.1.1",\n    "5.2.0"\n  ],\n  "jordymoos/pilf": [\n    "1.0.0"\n  ],\n  "jorgengranseth/elm-string-format": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "joshforisha/elm-entities": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "joshforisha/elm-html-entities": [\n    "1.0.0"\n  ],\n  "joshforisha/elm-inflect": [\n    "1.0.0"\n  ],\n  "jouderianjr/elm-dialog": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jouderianjr/elm-loaders": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jpagex/elm-geoip": [\n    "1.0.0"\n  ],\n  "jpagex/elm-loader": [\n    "1.0.0"\n  ],\n  "jpagex/elm-material-color": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jreut/elm-grid": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jsanchesleao/elm-assert": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jschomay/elm-bounded-number": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "jschomay/elm-narrative-engine": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0"\n  ],\n  "jschomay/elm-paginate": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1"\n  ],\n  "jschonenberg/elm-dropdown": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "json-tools/json-schema": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "json-tools/json-value": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jtanguy/moulin-rouge": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "jtojnar/elm-json-tape": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "juanedi/charty": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "justgage/tachyons-elm": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2",\n    "4.1.3"\n  ],\n  "justgook/alt-linear-algebra": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "justgook/elm-game-logic": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "justgook/elm-image": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "justgook/elm-image-encode": [\n    "1.0.0"\n  ],\n  "justgook/elm-tiled": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "justgook/elm-tiled-decode": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "1.1.1",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "justgook/elm-webdriver": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "justgook/webgl-playground": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2",\n    "4.1.3"\n  ],\n  "justgook/webgl-shape": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "justinmimbs/date": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "3.2.0",\n    "3.2.1"\n  ],\n  "justinmimbs/elm-arc-diagram": [\n    "1.0.0"\n  ],\n  "justinmimbs/elm-date-extra": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0"\n  ],\n  "justinmimbs/elm-date-selector": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "justinmimbs/time-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "justinmimbs/timezone-data": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "2.1.4",\n    "3.0.0"\n  ],\n  "justinmimbs/tzif": [\n    "1.0.0"\n  ],\n  "jvdvleuten/url-parser-combinator": [\n    "1.0.0"\n  ],\n  "jvoigtlaender/elm-drag": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "jvoigtlaender/elm-gauss": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jvoigtlaender/elm-memo": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5"\n  ],\n  "jvoigtlaender/elm-warshall": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jweir/charter": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2"\n  ],\n  "jweir/elm-iso8601": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0",\n    "6.0.1",\n    "7.0.0"\n  ],\n  "jweir/sparkline": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "jwheeler-cp/elm-form": [\n    "1.0.0"\n  ],\n  "jwmerrill/elm-animation-frame": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "jwoudenberg/elm-test-experimental": [\n    "1.0.0"\n  ],\n  "jwoudenberg/html-typed": [\n    "1.0.0"\n  ],\n  "jxxcarlson/convolvemachine": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "jxxcarlson/elm-cell-grid": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0",\n    "8.0.0",\n    "8.0.1"\n  ],\n  "jxxcarlson/elm-editor": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "3.1.3"\n  ],\n  "jxxcarlson/elm-graph": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "jxxcarlson/elm-markdown": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8",\n    "1.0.9",\n    "1.0.10",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "2.2.3",\n    "2.2.4",\n    "2.3.0",\n    "2.4.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "4.1.0",\n    "5.0.0",\n    "5.1.0",\n    "5.1.1",\n    "6.0.0",\n    "6.0.1",\n    "7.0.0",\n    "8.0.0",\n    "9.0.0",\n    "9.1.0",\n    "9.2.0",\n    "9.2.1",\n    "9.2.2",\n    "9.2.3",\n    "9.2.4",\n    "9.2.5",\n    "9.2.6",\n    "9.2.7",\n    "9.2.8",\n    "9.2.9",\n    "9.2.10",\n    "9.2.11",\n    "9.2.12",\n    "9.2.13",\n    "9.2.14",\n    "9.2.15",\n    "9.2.16"\n  ],\n  "jxxcarlson/elm-pseudorandom": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "jxxcarlson/elm-stat": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3"\n  ],\n  "jxxcarlson/elm-tar": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "3.0.5",\n    "3.0.6",\n    "3.0.7",\n    "3.0.8",\n    "3.0.9",\n    "3.0.10",\n    "3.0.11",\n    "3.0.12",\n    "4.0.0"\n  ],\n  "jxxcarlson/elm-text-editor": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "7.0.3",\n    "7.0.4",\n    "7.0.5",\n    "7.0.6",\n    "7.0.7",\n    "7.0.8"\n  ],\n  "jxxcarlson/elm-typed-time": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "jxxcarlson/elm-widget": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0"\n  ],\n  "jxxcarlson/geometry": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "jxxcarlson/graphdisplay": [\n    "1.0.0"\n  ],\n  "jxxcarlson/hex": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "jxxcarlson/htree": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "jxxcarlson/math-markdown": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5",\n    "2.0.6",\n    "2.0.7",\n    "2.0.8",\n    "2.0.9",\n    "2.0.10",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "3.0.5",\n    "3.0.6"\n  ],\n  "jxxcarlson/meenylatex": [\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "5.1.0",\n    "5.1.1",\n    "5.1.2",\n    "6.0.0",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "7.0.3",\n    "7.0.4",\n    "7.0.5",\n    "7.0.6",\n    "7.0.7",\n    "7.0.8",\n    "7.0.9",\n    "8.0.0",\n    "9.0.0",\n    "9.0.1",\n    "9.0.2",\n    "9.1.0",\n    "10.0.0",\n    "10.0.1",\n    "10.0.2",\n    "10.0.3",\n    "10.0.4",\n    "10.0.5",\n    "10.0.6",\n    "10.0.7",\n    "10.0.8",\n    "11.0.0",\n    "11.0.1",\n    "11.0.2",\n    "12.0.0",\n    "12.0.1",\n    "12.1.0",\n    "13.0.0"\n  ],\n  "jxxcarlson/minilatex": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "2.1.4",\n    "2.1.5",\n    "2.1.6",\n    "2.1.7",\n    "2.1.8",\n    "2.1.9"\n  ],\n  "jxxcarlson/particle": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "jxxcarlson/tree-extra": [\n    "1.0.0"\n  ],\n  "jystic/elm-font-awesome": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "jzxhuang/http-extras": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0"\n  ],\n  "kallaspriit/elm-basic-auth": [\n    "1.0.0"\n  ],\n  "kalutheo/elm-snapshot-tests": [\n    "1.0.0"\n  ],\n  "kalutheo/elm-ui-explorer": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0",\n    "7.0.1",\n    "8.0.0"\n  ],\n  "karldray/elm-ref": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.3.0"\n  ],\n  "kennib/elm-maps": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0",\n    "4.2.1"\n  ],\n  "kennib/elm-swipe": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0"\n  ],\n  "kfish/glsl-pasta": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0"\n  ],\n  "kfish/quaternion": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "kintail/elm-publish-test": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "kintail/input-widget": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6"\n  ],\n  "kirchner/elm-selectize": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5",\n    "2.0.6",\n    "2.0.7"\n  ],\n  "kirchner/form-validation": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "kkpoon/elm-auth0": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "kkpoon/elm-auth0-urlparser": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "kkpoon/elm-echarts": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "5.0.0",\n    "6.0.0",\n    "6.1.0",\n    "7.0.0",\n    "8.0.0",\n    "9.0.0",\n    "9.0.1",\n    "10.0.0",\n    "10.0.1"\n  ],\n  "klaftertief/elm-heatmap": [\n    "1.0.0"\n  ],\n  "klazuka/elm-json-tree-view": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "kmbn/elm-hotkeys": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "knewter/elm-rfc5988-parser": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "knledg/touch-events": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2"\n  ],\n  "korutx/elm-rut": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "koskoci/elm-sortable-table": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "koyachi/elm-sha": [\n    "1.0.0"\n  ],\n  "kress95/random-pcg-extra": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "krisajenkins/elm-astar": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3"\n  ],\n  "krisajenkins/elm-cdn": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0",\n    "1.3.1",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0",\n    "2.0.0"\n  ],\n  "krisajenkins/elm-dialog": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3"\n  ],\n  "krisajenkins/elm-exts": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.2.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.1.0",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0",\n    "8.0.0",\n    "8.1.0",\n    "8.2.0",\n    "8.3.0",\n    "8.4.0",\n    "9.0.0",\n    "9.1.0",\n    "9.2.0",\n    "9.3.0",\n    "9.4.0",\n    "10.0.0",\n    "10.1.0",\n    "10.2.0",\n    "10.2.1",\n    "10.2.2",\n    "10.2.3",\n    "10.2.4",\n    "10.2.5",\n    "10.2.6",\n    "10.3.0",\n    "10.3.1",\n    "10.3.2",\n    "10.3.3",\n    "10.4.0",\n    "10.4.1",\n    "10.5.0",\n    "10.6.0",\n    "10.7.0",\n    "10.8.0",\n    "11.0.0",\n    "12.0.0",\n    "12.1.0",\n    "12.2.0",\n    "12.3.0",\n    "12.3.1",\n    "12.4.0",\n    "12.5.0",\n    "12.6.0",\n    "12.7.0",\n    "12.8.0",\n    "12.9.0",\n    "12.10.0",\n    "12.11.0",\n    "13.0.0",\n    "14.0.0",\n    "14.0.1",\n    "15.0.0",\n    "15.0.1",\n    "16.0.0",\n    "17.0.0",\n    "17.1.0",\n    "17.1.1",\n    "18.0.0",\n    "18.1.0",\n    "18.1.1",\n    "19.0.0",\n    "19.1.0",\n    "19.2.0",\n    "19.3.0",\n    "19.4.0",\n    "20.0.0",\n    "21.0.0",\n    "22.0.0",\n    "23.0.0",\n    "23.1.0",\n    "23.2.0",\n    "23.2.1",\n    "23.3.0",\n    "24.0.0",\n    "24.1.0",\n    "24.2.0",\n    "24.3.0",\n    "25.0.0",\n    "25.0.1",\n    "25.1.0",\n    "25.2.0",\n    "25.3.0",\n    "25.4.0",\n    "25.5.0",\n    "25.6.0",\n    "25.6.1",\n    "25.6.2",\n    "25.7.0",\n    "25.8.0",\n    "25.8.1",\n    "25.9.0",\n    "25.10.0",\n    "25.11.0",\n    "25.12.0",\n    "25.13.0",\n    "26.0.0",\n    "26.1.0",\n    "26.1.1",\n    "26.2.0",\n    "26.3.0",\n    "26.4.0",\n    "26.5.0",\n    "27.0.0",\n    "27.1.0",\n    "27.2.0",\n    "27.3.0",\n    "27.4.0",\n    "28.0.0"\n  ],\n  "krisajenkins/formatting": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.2.0",\n    "2.3.0",\n    "2.4.0",\n    "2.4.1",\n    "2.5.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "3.2.0",\n    "3.3.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "4.0.5",\n    "4.0.6",\n    "4.0.7",\n    "4.1.0",\n    "4.2.0"\n  ],\n  "krisajenkins/history": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "krisajenkins/remotedata": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "2.2.1",\n    "2.3.0",\n    "2.4.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "4.2.0",\n    "4.2.1",\n    "4.3.0",\n    "4.3.1",\n    "4.3.2",\n    "4.3.3",\n    "4.4.0",\n    "4.5.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1"\n  ],\n  "ktonon/elm-aws-core": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "ktonon/elm-child-update": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "ktonon/elm-crypto": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "ktonon/elm-hmac": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ktonon/elm-jsonwebtoken": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "ktonon/elm-memo-pure": [\n    "1.0.0"\n  ],\n  "ktonon/elm-serverless": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "ktonon/elm-serverless-auth-jwt": [\n    "1.0.0"\n  ],\n  "ktonon/elm-serverless-cors": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "ktonon/elm-test-extra": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.5.1",\n    "1.6.0",\n    "1.6.1",\n    "1.6.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "ktonon/elm-word": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2"\n  ],\n  "kuon/elm-hsluv": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "kuon/elm-string-normalize": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "kuzminadya/mogeefont": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "kuzzmi/elm-gravatar": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "kyasu1/elm-ulid": [\n    "1.0.0"\n  ],\n  "labzero/elm-google-geocoding": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0"\n  ],\n  "larribas/elm-image-slider": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "larribas/elm-multi-email-input": [\n    "1.0.0"\n  ],\n  "larribas/elm-multi-input": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "laserpants/elm-burrito-update": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.3.1",\n    "2.3.2",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4"\n  ],\n  "laserpants/elm-update-pipeline": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.3.2"\n  ],\n  "laszlopandy/elm-console": [\n    "1.0.1",\n    "1.0.0",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "lattenwald/elm-base64": [\n    "1.0.1",\n    "1.0.0",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "lattyware/elm-fontawesome": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "2.3.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "lattyware/elm-json-diff": [\n    "1.0.0"\n  ],\n  "layer6ai/elm-filter-box": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "layer6ai/elm-query-builder": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3"\n  ],\n  "layflags/elm-bic": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "lazamar/dict-parser": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "league/difference-list": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "league/unique-id": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "leojpod/review-no-empty-html-text": [\n    "1.0.0"\n  ],\n  "leonardanyer/elm-combox": [\n    "1.0.0"\n  ],\n  "lettenj61/elm-reusable-html": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "lgastako/elm-select": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "liamcurry/elm-media": [\n    "1.0.0"\n  ],\n  "linuss/smooth-scroll": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "lionar/select": [\n    "1.0.0"\n  ],\n  "ljuglaret/combinatoire": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "ljuglaret/fraction": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "lorenzo/elm-string-addons": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "lorenzo/elm-tree-diagram": [\n    "1.0.0"\n  ],\n  "lovasoa/choices": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "3.1.3",\n    "3.1.4",\n    "3.1.5",\n    "3.1.6"\n  ],\n  "lovasoa/elm-component-list": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6"\n  ],\n  "lovasoa/elm-csv": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.1.5",\n    "1.1.6",\n    "1.1.7"\n  ],\n  "lovasoa/elm-format-number": [\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3"\n  ],\n  "lovasoa/elm-jsonpseudolist": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "lovasoa/elm-median": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "lovasoa/elm-nested-list": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1"\n  ],\n  "lovasoa/elm-rolling-list": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4"\n  ],\n  "lucamug/elm-style-framework": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2"\n  ],\n  "lucamug/elm-styleguide-generator": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "lucamug/style-framework": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "lucasssm/simpledate": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "ludvigsen/elm-svg-ast": [\n    "1.0.0"\n  ],\n  "luftzig/elm-quadtree": [\n    "1.0.1",\n    "1.0.0"\n  ],\n  "lukewestby/accessible-html-with-css-temp-19": [\n    "1.0.0"\n  ],\n  "lukewestby/elm-http-builder": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "5.2.0",\n    "6.0.0",\n    "7.0.0",\n    "7.0.1"\n  ],\n  "lukewestby/elm-http-extra": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "5.2.0"\n  ],\n  "lukewestby/elm-i18n": [\n    "1.0.0"\n  ],\n  "lukewestby/elm-string-interpolate": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "lukewestby/elm-template": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "lukewestby/http-extra": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "lukewestby/lru-cache": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "lukewestby/package-info": [\n    "1.0.0"\n  ],\n  "lukewestby/worker": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "lxierita/no-typealias-constructor-call": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "lynn/elm-arithmetic": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0"\n  ],\n  "lynn/elm-ordinal": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "lzrski/elm-polymer": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7"\n  ],\n  "m-mullins/elm-console": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "m00qek/elm-applicative": [\n    "1.0.0"\n  ],\n  "m00qek/elm-cpf": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "2.0.0"\n  ],\n  "maca/crdt-replicated-graph": [\n    "1.0.0"\n  ],\n  "maca/crdt-replicated-tree": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0"\n  ],\n  "maksar/elm-function-extra": [\n    "1.0.1",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "maksar/elm-workflow": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "malaire/elm-safe-int": [\n    "1.0.0"\n  ],\n  "malaire/elm-uint64": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "malinoff/elm-jwt": [\n    "1.0.0"\n  ],\n  "malinoff/elm-uniform": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "maorleger/elm-flash": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "maorleger/elm-infinite-zipper": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "marcosccm/elm-datepicker": [\n    "1.0.0"\n  ],\n  "marcosh/elm-html-to-unicode": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "marshallformula/arrangeable-list": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "marshallformula/elm-swiper": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "martin-volf/elm-jsonrpc": [\n    "1.0.0"\n  ],\n  "martinos/elm-sortable-table": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "martinsk/elm-datastructures": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "massung/elm-css": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "matheus23/elm-drag-and-drop": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0"\n  ],\n  "matheus23/elm-figma-api": [\n    "1.0.0"\n  ],\n  "matheus23/elm-markdown-transforms": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "matheus23/please-focus-more": [\n    "1.0.0"\n  ],\n  "matthewrankin/elm-mdl": [\n    "1.0.0"\n  ],\n  "matthewsj/elm-ordering": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "mattjbray/elm-prismicio": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0"\n  ],\n  "mattrrichard/elm-disjoint-set": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "maximoleinyk/elm-parser-utils": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "maxsnew/lazy": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "mbr/elm-extras": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0"\n  ],\n  "mbr/elm-mouse-events": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "mbylstra/elm-html-helpers": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "mc706/elm-clarity-ui": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.5.1",\n    "1.5.2",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "2.3.0",\n    "2.4.0",\n    "2.5.0",\n    "2.6.0",\n    "2.7.0",\n    "2.7.1",\n    "2.8.0",\n    "2.8.1"\n  ],\n  "mcordova47/elm-natural-ordering": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "mdgriffith/elm-animation-pack": [\n    "1.0.0"\n  ],\n  "mdgriffith/elm-animator": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "mdgriffith/elm-color-mixing": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "mdgriffith/elm-debug-watch": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "mdgriffith/elm-html-animation": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4"\n  ],\n  "mdgriffith/elm-markup": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5",\n    "2.0.6",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "mdgriffith/elm-style-animation": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.3.0",\n    "3.4.0",\n    "3.5.0",\n    "3.5.1",\n    "3.5.2",\n    "3.5.3",\n    "3.5.4",\n    "3.5.5",\n    "4.0.0"\n  ],\n  "mdgriffith/elm-style-animation-zero-sixteen": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "mdgriffith/elm-ui": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.1.5",\n    "1.1.6",\n    "1.1.7"\n  ],\n  "mdgriffith/style-elements": [\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.2.1",\n    "3.2.2",\n    "3.2.3",\n    "3.3.0",\n    "3.4.0",\n    "3.4.1",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0",\n    "4.2.1",\n    "4.3.0",\n    "5.0.0",\n    "5.0.1"\n  ],\n  "mdgriffith/stylish-elephants": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "7.0.0",\n    "8.0.0",\n    "8.0.1",\n    "8.0.2",\n    "8.1.0"\n  ],\n  "melon-love/elm-gab-api": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "7.0.0",\n    "8.0.0",\n    "8.0.1",\n    "9.0.0",\n    "10.0.0",\n    "11.0.0"\n  ],\n  "mercurymedia/elm-datetime-picker": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "mercurymedia/elm-message-toast": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0"\n  ],\n  "mercurymedia/elm-smart-select": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3"\n  ],\n  "mgold/elm-animation": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "2.0.0"\n  ],\n  "mgold/elm-date-format": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.1.5",\n    "1.1.6",\n    "1.1.7",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.4.1",\n    "1.4.2",\n    "1.5.0",\n    "1.6.0",\n    "1.7.0",\n    "1.8.0"\n  ],\n  "mgold/elm-geojson": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "mgold/elm-join": [\n    "1.0.0"\n  ],\n  "mgold/elm-nonempty-list": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0",\n    "1.7.0",\n    "1.7.1",\n    "1.8.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.1.0"\n  ],\n  "mgold/elm-random-pcg": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "4.0.2",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2"\n  ],\n  "mgold/elm-random-sample": [\n    "1.0.0"\n  ],\n  "mgold/elm-socketio": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4"\n  ],\n  "mgold/elm-turtle-graphics": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "mgree/trampoline": [\n    "1.0.0"\n  ],\n  "mhoare/elm-stack": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2"\n  ],\n  "miaEngiadina/elm-ghost": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "micktwomey/elmo-8": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "mikaxyz/elm-cropper": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "milesrock/elm-creditcard": [\n    "1.0.0"\n  ],\n  "miniBill/date-format-languages": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1"\n  ],\n  "miniBill/elm-avataaars": [\n    "1.0.0"\n  ],\n  "miniBill/elm-codec": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0"\n  ],\n  "miyamoen/bibliopola": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "miyamoen/elm-command-pallet": [\n    "1.0.0"\n  ],\n  "miyamoen/elm-todofuken": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "miyamoen/select-list": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0"\n  ],\n  "miyamoen/tree-with-zipper": [\n    "1.0.0"\n  ],\n  "mkovacs/quaternion": [\n    "1.0.0"\n  ],\n  "mmetcalfe/elm-random-distributions": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "monty5811/elm-bible": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "monty5811/remote-list": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "mpdairy/elm-component-updater": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "mpizenberg/elm-debounce": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "mpizenberg/elm-image-annotation": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "2.1.4",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "6.0.0",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "7.0.3",\n    "8.0.0",\n    "8.0.1",\n    "8.1.0",\n    "8.2.0"\n  ],\n  "mpizenberg/elm-image-collection": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.3.0",\n    "2.3.1",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2"\n  ],\n  "mpizenberg/elm-mouse-compat": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "mpizenberg/elm-mouse-events": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0"\n  ],\n  "mpizenberg/elm-pointer-events": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2"\n  ],\n  "mpizenberg/elm-touch-events": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "mrdimosthenis/turtle-graphics": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "mrpinsky/elm-keyed-list": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "mrvicadai/elm-palette": [\n    "1.0.0"\n  ],\n  "mrvicadai/elm-stats": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "mthadley/elm-byte": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "mthadley/elm-hash-routing": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "mthadley/elm-typewriter": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "mtonnberg/refinement-proofs": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1"\n  ],\n  "mukeshsoni/elm-rope": [\n    "1.0.0"\n  ],\n  "mulander/diceware": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "munksgaard/char-extra": [\n    "1.0.0"\n  ],\n  "munksgaard/elm-charts": [\n    "1.0.0"\n  ],\n  "munksgaard/elm-data-uri": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "munksgaard/elm-media-type": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "mweiss/elm-rte-toolkit": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "mxgrn/elm-phoenix-socket": [\n    "1.0.0"\n  ],\n  "myrho/dive": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "myrho/elm-round": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "myrho/elm-statistics": [\n    "1.0.0"\n  ],\n  "naddeoa/elm-simple-bootstrap": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "naddeoa/quick-cache": [\n    "1.0.0"\n  ],\n  "naddeoa/stream": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "2.3.0",\n    "2.4.0"\n  ],\n  "nathanfox/elm-string-format": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "nathanjohnson320/base58": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "nathanjohnson320/coinmarketcap-elm": [\n    "1.0.0"\n  ],\n  "nathanjohnson320/ecurve": [\n    "1.0.0"\n  ],\n  "nathanjohnson320/elm-ui-components": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "2.3.0"\n  ],\n  "nathanjohnson320/elmark": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "ndortega/elm-gtranslate": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "nedSaf/elm-bootstrap-grid": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "neurodynamic/elm-parse-html": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "newlandsvalley/elm-abc-parser": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "newlandsvalley/elm-binary-base64": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "newlandsvalley/elm-comidi": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.2.0",\n    "3.0.0"\n  ],\n  "newmana/chroma-elm": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.2.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.1.0",\n    "4.2.0",\n    "4.3.0",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0",\n    "8.0.0",\n    "8.1.0",\n    "9.0.0",\n    "10.0.0",\n    "10.0.1",\n    "10.1.0",\n    "10.1.1",\n    "11.0.0",\n    "11.0.1",\n    "11.0.2",\n    "12.0.0",\n    "12.1.0",\n    "12.1.1",\n    "12.1.2",\n    "13.0.0",\n    "13.1.0",\n    "13.1.1",\n    "13.2.0",\n    "13.3.0",\n    "14.0.0",\n    "15.0.0",\n    "16.0.0",\n    "16.0.1",\n    "16.0.2",\n    "16.0.3",\n    "16.0.4",\n    "17.0.0",\n    "17.1.0",\n    "17.1.1",\n    "17.2.0",\n    "18.0.0"\n  ],\n  "nicmr/compgeo": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "niho/json-schema-form": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "niho/personal-number": [\n    "1.0.0"\n  ],\n  "nik-garmash/elm-test": [\n    "1.0.0"\n  ],\n  "nikita-volkov/hashing-containers": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0"\n  ],\n  "nikita-volkov/typeclasses": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "1.4.1",\n    "1.5.0",\n    "1.6.0",\n    "1.6.1",\n    "1.7.0",\n    "1.8.0"\n  ],\n  "nishiurahiroki/elm-simple-pagenate": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "nkotzias/elm-jsonp": [\n    "1.0.0"\n  ],\n  "noahzgordon/elm-color-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "noahzgordon/elm-jsonapi": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "noahzgordon/elm-jsonapi-http": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "nonpop/elm-purl": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "noredink/elm-rollbar": [\n    "1.0.0"\n  ],\n  "noredink/string-conversions": [\n    "1.0.0"\n  ],\n  "norpan/elm-file-reader": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "norpan/elm-html5-drag-drop": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.3",\n    "1.0.2",\n    "1.0.4",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "3.1.3",\n    "3.1.4"\n  ],\n  "norpan/elm-json-patch": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "not1602/elm-feather": [\n    "1.0.0"\n  ],\n  "nphollon/collision": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "nphollon/collisions": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "nphollon/geo3d": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "nphollon/interpolate": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4"\n  ],\n  "nphollon/mechanics": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "nphollon/update-clock": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "oaalto/time-values": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "ohanhi/autoexpand": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0"\n  ],\n  "ohanhi/elm-web-data": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "ohanhi/keyboard": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "ohanhi/keyboard-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4"\n  ],\n  "ohanhi/lorem": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "ohanhi/remotedata-http": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "oleiade/elm-maestro": [\n    "1.0.0"\n  ],\n  "ondras/elm-irc": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "opensolid/geometry": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "opensolid/linear-algebra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "opensolid/linear-algebra-interop": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "opensolid/mesh": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "opensolid/svg": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "opensolid/webgl-math": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "opensolid/webgl-math-interop": [\n    "1.0.0"\n  ],\n  "opvasger/amr": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.1.0",\n    "3.1.1"\n  ],\n  "orus-io/elm-openid-connect": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "overminddl1/program-ex": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "owanturist/elm-avl-dict": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "owanturist/elm-bulletproof": [\n    "1.0.0"\n  ],\n  "owanturist/elm-graphql": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0"\n  ],\n  "owanturist/elm-queue": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "owanturist/elm-union-find": [\n    "1.0.0"\n  ],\n  "owanturist/elm-validation": [\n    "1.0.0"\n  ],\n  "ozmat/elm-forms": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "ozmat/elm-validation": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1"\n  ],\n  "ozyinc/elm-sortable-table-with-row-id": [\n    "1.0.0"\n  ],\n  "pablen/toasty": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0"\n  ],\n  "pablohirafuji/elm-char-codepoint": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "pablohirafuji/elm-markdown": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5"\n  ],\n  "pablohirafuji/elm-qrcode": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "3.3.0",\n    "3.3.1"\n  ],\n  "pablohirafuji/elm-syntax-highlight": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "3.3.0"\n  ],\n  "panthershark/email-parser": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "panthershark/snackbar": [\n    "1.0.0"\n  ],\n  "paramanders/elm-hexagon": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "pascallemerrer/elm-advanced-grid": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "passiomatic/elm-figma-api": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "pastelInc/elm-validator": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "patrickjtoy/elm-table": [\n    "1.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0"\n  ],\n  "paul-freeman/elm-ipfs": [\n    "1.0.0"\n  ],\n  "paulcorke/elm-number-format": [\n    "1.0.0"\n  ],\n  "paulcorke/elm-string-split": [\n    "1.0.0"\n  ],\n  "pd-andy/elm-audio-graph": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "pd-andy/elm-limiter": [\n    "1.0.0"\n  ],\n  "pd-andy/elm-web-audio": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0"\n  ],\n  "pd-andy/tuple-extra": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "pdamoc/elm-css": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2"\n  ],\n  "pdamoc/elm-hashids": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "pdamoc/elm-ports-driver": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "pehota/elm-zondicons": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "periodic/elm-csv": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "perzanko/elm-loading": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4"\n  ],\n  "peterszerzo/elm-arborist": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "2.3.0",\n    "2.3.1",\n    "2.4.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.0.3",\n    "6.1.0",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "7.1.0",\n    "8.0.0",\n    "8.0.1",\n    "8.0.2",\n    "8.0.3",\n    "8.0.4",\n    "8.0.5",\n    "8.1.0",\n    "8.1.1",\n    "8.1.2",\n    "8.1.3",\n    "8.2.0",\n    "8.3.0",\n    "8.4.0",\n    "8.5.0"\n  ],\n  "peterszerzo/elm-cms": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "peterszerzo/elm-gameroom": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "peterszerzo/elm-json-tree-view": [\n    "1.0.0"\n  ],\n  "peterszerzo/elm-natural-ui": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.2.1",\n    "3.3.0",\n    "3.3.1",\n    "3.3.2",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0",\n    "4.3.0",\n    "4.4.0",\n    "4.4.1",\n    "4.4.2",\n    "4.5.0",\n    "4.5.1",\n    "4.6.0",\n    "4.7.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.1.0",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0",\n    "8.0.0",\n    "8.1.0",\n    "8.2.0",\n    "8.3.0",\n    "8.3.1",\n    "9.0.0",\n    "9.1.0",\n    "9.1.1",\n    "10.0.0",\n    "10.1.0",\n    "10.1.1",\n    "10.2.0",\n    "10.2.1",\n    "10.2.2",\n    "10.3.0",\n    "11.0.0",\n    "11.0.1",\n    "11.1.0",\n    "11.2.0",\n    "12.0.0",\n    "12.0.1",\n    "13.0.0",\n    "13.0.1",\n    "13.1.0",\n    "13.2.0",\n    "13.2.1",\n    "13.3.0",\n    "13.4.0",\n    "13.5.0",\n    "13.5.1",\n    "13.5.2",\n    "13.5.3",\n    "13.5.4",\n    "13.5.5",\n    "13.5.6",\n    "13.5.7",\n    "14.0.0",\n    "15.0.0",\n    "15.0.1",\n    "15.1.0",\n    "15.2.0",\n    "15.2.1",\n    "15.2.2",\n    "16.0.0"\n  ],\n  "peterszerzo/elm-porter": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "3.0.0"\n  ],\n  "peterszerzo/line-charts": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "pfcoperez/elm-playground": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "phollyer/elm-phoenix-websocket": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0"\n  ],\n  "phollyer/elm-ui-colors": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "pietro909/elm-sticky-header": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "pilatch/elm-chess": [\n    "1.0.0"\n  ],\n  "pilatch/flip": [\n    "1.0.0"\n  ],\n  "pinx/elm-mdl": [\n    "1.0.0"\n  ],\n  "piotrdubiel/elm-art-in-pi": [\n    "1.0.0"\n  ],\n  "powet/elm-funfolding": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "poying/elm-router": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "poying/elm-style": [\n    "1.0.0"\n  ],\n  "prikhi/bootstrap-gallery": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "prikhi/decimal": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "prikhi/elm-http-builder": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "prikhi/http-tasks": [\n    "1.0.0"\n  ],\n  "prikhi/paginate": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.1.0"\n  ],\n  "prikhi/remote-status": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "primait/elm-autocomplete": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "primait/elm-form": [\n    "2.0.0",\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "8.0.0",\n    "8.0.1",\n    "8.0.2",\n    "8.0.3",\n    "8.0.4",\n    "9.0.0",\n    "10.0.0",\n    "11.0.0",\n    "12.0.0",\n    "12.0.1",\n    "12.0.2",\n    "12.0.3",\n    "13.0.0",\n    "13.1.0",\n    "13.1.1",\n    "13.2.0",\n    "13.2.1",\n    "13.2.2",\n    "13.2.3",\n    "13.2.4",\n    "13.2.6",\n    "13.2.7"\n  ],\n  "primait/forms": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "primait/pyxis-components": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "3.3.0",\n    "3.3.1",\n    "3.3.2",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "5.0.0",\n    "6.0.0"\n  ],\n  "pristap/smart-text": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6"\n  ],\n  "pro100filipp/elm-graphql": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "3.0.0",\n    "3.1.0"\n  ],\n  "proda-ai/elm-dropzone": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "proda-ai/elm-logger": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "proda-ai/elm-svg-loader": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "proda-ai/formatting": [\n    "1.0.0"\n  ],\n  "project-fuzzball/node": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "project-fuzzball/test": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "5.0.3",\n    "5.0.4",\n    "6.0.0"\n  ],\n  "project-fuzzball/test-runner": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "prozacchiwawa/effmodel": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "prozacchiwawa/elm-json-codec": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.3.0",\n    "3.3.1"\n  ],\n  "prozacchiwawa/elm-keccak": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0"\n  ],\n  "prozacchiwawa/elm-urlbase64": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "publeaks/elm-rivescript": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "pukkamustard/elm-identicon": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0"\n  ],\n  "purohit/style-elements": [\n    "1.0.0"\n  ],\n  "pwentz/elm-pretty-printer": [\n    "2.0.0",\n    "3.0.0"\n  ],\n  "pzingg/elm-navigation-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3"\n  ],\n  "pzp1997/assoc-list": [\n    "1.0.0"\n  ],\n  "r-k-b/complex": [\n    "1.0.0"\n  ],\n  "r-k-b/elm-interval": [\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "r-k-b/map-accumulate": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "r-k-b/no-float-ids": [\n    "1.0.0"\n  ],\n  "r-k-b/no-long-import-lines": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "rainteller/elm-capitalize": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "rajasharan/elm-automatic-differentiation": [\n    "1.0.0"\n  ],\n  "rametta/elm-datetime-picker": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "realyarilabs/yarimoji": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "rehno-lindeque/elm-signal-alt": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "reiner-dolp/elm-natural-ordering": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "relabsoss/elm-date-extra": [\n    "1.0.0"\n  ],\n  "remoteradio/elm-widgets": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "renanpvaz/elm-bem": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "reserve-protocol/elm-i3166-data": [\n    "1.0.0"\n  ],\n  "reserve-protocol/elm-iso3166-data": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "rgrempel/elm-http-decorators": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "rgrempel/elm-route-url": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0"\n  ],\n  "rhofour/elm-astar": [\n    "1.0.0"\n  ],\n  "rhofour/elm-pairing-heap": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "rielas/measurement": [\n    "1.0.0"\n  ],\n  "ringvold/elm-iso8601-date-strings": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "rix501/elm-sortable-table": [\n    "1.0.0"\n  ],\n  "rizafahmi/elm-semantic-ui": [\n    "1.0.0"\n  ],\n  "rjbma/elm-listview": [\n    "1.0.0"\n  ],\n  "rjbma/elm-modal": [\n    "1.0.0"\n  ],\n  "rjdestigter/elm-convert-units": [\n    "1.0.0"\n  ],\n  "rkrupinski/elm-range-slider": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "rl-king/elm-gallery": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "rl-king/elm-inview": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "rl-king/elm-iso3166-country-codes": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "rl-king/elm-masonry": [\n    "1.0.0"\n  ],\n  "rl-king/elm-modular-scale": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "rl-king/elm-scroll-to": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "rluiten/elm-date-extra": [\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.0.1",\n    "6.1.0",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0",\n    "7.2.1",\n    "8.0.0",\n    "8.1.0",\n    "8.1.1",\n    "8.1.2",\n    "8.2.0",\n    "8.3.0",\n    "8.4.0",\n    "8.5.0",\n    "8.5.1",\n    "8.6.0",\n    "8.6.1",\n    "8.6.2",\n    "8.7.0",\n    "9.0.0",\n    "9.0.1",\n    "9.1.0",\n    "9.1.1",\n    "9.1.2",\n    "9.2.0",\n    "9.2.1",\n    "9.2.2",\n    "9.2.3",\n    "9.3.0",\n    "9.3.1",\n    "9.4.0"\n  ],\n  "rluiten/elm-text-search": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "5.0.0",\n    "5.0.1"\n  ],\n  "rluiten/mailcheck": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2",\n    "4.1.3",\n    "4.1.4",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2"\n  ],\n  "rluiten/sparsevector": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "rluiten/stemmer": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "rluiten/stringdistance": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "rluiten/trie": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "rnons/elm-svg-loader": [\n    "1.0.0"\n  ],\n  "rnons/elm-svg-parser": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1"\n  ],\n  "rnons/ordered-containers": [\n    "1.0.0"\n  ],\n  "roSievers/font-awesome": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "robertjlooby/elm-draggable-form": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "robertjlooby/elm-generic-dict": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "robinpokorny/elm-brainfuck": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "robotmay/s3-direct-file-upload": [\n    "1.0.0"\n  ],\n  "robwhitaker/elm-infinite-stream": [\n    "1.0.0"\n  ],\n  "robwhitaker/elm-uuid-stream": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "robx/elm-edn": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0"\n  ],\n  "rodinalex/elm-cron": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "rogeriochaves/elm-ternary": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "rogeriochaves/elm-test-bdd-style": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.0.3",\n    "6.1.0",\n    "6.1.1",\n    "6.1.2"\n  ],\n  "rogeriochaves/elm-testable": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1"\n  ],\n  "rogeriochaves/elm-testable-css-helpers": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "roine/elm-perimeter": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "rolograaf/elm-favicon": [\n    "1.0.0"\n  ],\n  "romariolopezc/elm-hmac-sha1": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "romariolopezc/elm-sentry": [\n    "1.0.0"\n  ],\n  "romstad/elm-chess": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "ronanyeah/calendar-dates": [\n    "1.0.0"\n  ],\n  "ronanyeah/helpers": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0"\n  ],\n  "rsignavong/elm-cloudinary-video-player": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "rsignavong/elm-leaflet-map": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "4.1.0"\n  ],\n  "rtfeldman/console-print": [\n    "1.0.0"\n  ],\n  "rtfeldman/count": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "rtfeldman/elm-css": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.2.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "5.0.0",\n    "6.0.0",\n    "6.1.0",\n    "7.0.0",\n    "8.0.0",\n    "8.1.0",\n    "8.2.0",\n    "9.0.0",\n    "9.1.0",\n    "10.0.0",\n    "11.0.0",\n    "11.1.0",\n    "11.2.0",\n    "12.0.0",\n    "12.0.1",\n    "13.0.0",\n    "13.0.1",\n    "13.1.0",\n    "13.1.1",\n    "14.0.0",\n    "15.0.0",\n    "15.1.0",\n    "16.0.0",\n    "16.0.1"\n  ],\n  "rtfeldman/elm-css-helpers": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0"\n  ],\n  "rtfeldman/elm-css-util": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "rtfeldman/elm-hex": [\n    "1.0.0"\n  ],\n  "rtfeldman/elm-iso8601-date-strings": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3"\n  ],\n  "rtfeldman/elm-sorter-experiment": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "rtfeldman/elm-validate": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "rtfeldman/hashed-class": [\n    "1.0.0"\n  ],\n  "rtfeldman/hex": [\n    "1.0.0"\n  ],\n  "rtfeldman/html-test-runner": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "rtfeldman/legacy-elm-test": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "rtfeldman/node-test-runner": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "rtfeldman/selectlist": [\n    "1.0.0"\n  ],\n  "rtfeldman/test-update": [\n    "1.0.0"\n  ],\n  "rtfeldman/ziplist": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "rundis/elm-bootstrap": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "5.1.0",\n    "5.2.0"\n  ],\n  "russelldavies/elm-range": [\n    "1.0.0"\n  ],\n  "ryan-senn/elm-compiler-error-sscce": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0"\n  ],\n  "ryan-senn/elm-google-domains": [\n    "1.0.0"\n  ],\n  "ryan-senn/elm-readability": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "ryan-senn/elm-tlds": [\n    "1.0.0"\n  ],\n  "ryan-senn/stellar-elm-sdk": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "ryannhg/date-format": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0"\n  ],\n  "ryannhg/elm-date-format": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "ryannhg/elm-moment": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "ryannhg/elm-spa": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1"\n  ],\n  "ryanolsonx/elm-mock-http": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "ryanolsonx/elm-time-range": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "ryota0624/date-controll": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "ryry0/elm-numeric": [\n    "1.0.0"\n  ],\n  "s3k/latte-charts": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "s6o/elm-recase": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "s6o/elm-simplify": [\n    "1.0.0"\n  ],\n  "samhstn/time-format": [\n    "1.0.0"\n  ],\n  "samueldple/material-color": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "samuelstevens/elm-csv": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "sanichi/elm-md5": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "1.0.7",\n    "1.0.8"\n  ],\n  "sashaafm/eetf": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "savardd/elm-time-travel": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "sawaken-experiment/elm-lisp-parser": [\n    "1.0.0"\n  ],\n  "sch/elm-aspect-ratio": [\n    "1.0.0"\n  ],\n  "scottcorgan/elm-css-normalize": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.1.5",\n    "1.1.6",\n    "1.1.7",\n    "1.1.8",\n    "1.1.9"\n  ],\n  "scottcorgan/elm-css-reset": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "scottcorgan/elm-html-template": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "scottcorgan/elm-keyboard-combo": [\n    "1.0.0"\n  ],\n  "scottcorgan/keyboard-combo": [\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0"\n  ],\n  "seanhess/elm-style": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "seanpile/elm-orbit-controls": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "seanpoulter/elm-versioning-spike": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "seurimas/slime": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0"\n  ],\n  "sgraf812/elm-access": [\n    "1.0.0"\n  ],\n  "sgraf812/elm-graph": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "sgraf812/elm-intdict": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0",\n    "1.4.0",\n    "1.4.1",\n    "1.4.2",\n    "1.4.3"\n  ],\n  "sgraf812/elm-stateful": [\n    "1.0.0"\n  ],\n  "sh4r3m4n/elm-piano": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3"\n  ],\n  "shelakel/elm-validate": [\n    "1.0.0"\n  ],\n  "shmookey/cmd-extra": [\n    "1.0.0"\n  ],\n  "showell/binary-tree-diagram": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "showell/dict-dot-dot": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "showell/elm-data-util": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "showell/meta-elm": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.1.0"\n  ],\n  "shutej/elm-rpcplus-runtime": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "simanaitis/elm-mdl": [\n    "2.0.0",\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.2.0"\n  ],\n  "simonewebdesign/elm-timer": [\n    "1.0.0"\n  ],\n  "simonh1000/elm-charts": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "3.1.0"\n  ],\n  "simonh1000/elm-colorpicker": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.1.4",\n    "1.1.5",\n    "1.1.6",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "simonh1000/elm-jwt": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "5.0.0",\n    "5.1.0",\n    "5.2.0",\n    "5.2.1",\n    "5.2.2",\n    "5.3.0",\n    "6.0.0",\n    "7.0.0",\n    "7.1.0"\n  ],\n  "simonh1000/elm-sliding-menus": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "simplystuart/elm-scroll-to": [\n    "1.0.0"\n  ],\n  "sindikat/elm-matrix": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "sindikat/elm-maybe-experimental": [\n    "1.0.0"\n  ],\n  "sixty-north/elm-price-chart": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "sixty-north/elm-task-repeater": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "sjorn3/elm-fields": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "skyqrose/assoc-list-extra": [\n    "1.0.0"\n  ],\n  "slashmili/phoenix-socket": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0",\n    "4.2.1"\n  ],\n  "sli/autotable": [\n    "1.0.0"\n  ],\n  "smucode/elm-flat-colors": [\n    "1.0.0"\n  ],\n  "smurfix/elm-dict-tree-zipper": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "soenkehahn/elm-operational": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "soenkehahn/elm-operational-mocks": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1"\n  ],\n  "solcates/elm-openid-connect": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "sparksp/elm-review-always": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "sparksp/elm-review-camelcase": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0"\n  ],\n  "sparksp/elm-review-forbidden-words": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "sparksp/elm-review-ports": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "spect88/romkan-elm": [\n    "1.0.0"\n  ],\n  "splodingsocks/elm-add-import": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "splodingsocks/elm-easy-events": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "1.2.0"\n  ],\n  "splodingsocks/elm-html-table": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "splodingsocks/elm-tailwind": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1"\n  ],\n  "splodingsocks/elm-type-extractor": [\n    "1.0.0"\n  ],\n  "splodingsocks/hipstore-ui": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "splodingsocks/validatable": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "sporto/elm-autocomplete": [\n    "1.0.0"\n  ],\n  "sporto/elm-countries": [\n    "1.0.0"\n  ],\n  "sporto/elm-dropdown": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.3.0",\n    "1.4.0"\n  ],\n  "sporto/elm-select": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.4.0",\n    "2.5.0",\n    "2.5.1",\n    "2.6.0",\n    "2.7.0",\n    "2.8.0",\n    "2.9.0",\n    "2.10.0",\n    "2.11.0",\n    "2.12.0",\n    "2.12.1",\n    "2.13.0",\n    "2.14.0",\n    "2.15.0",\n    "2.15.1",\n    "2.16.0",\n    "2.17.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "3.1.3",\n    "3.2.0"\n  ],\n  "sporto/erl": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.1.0",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0",\n    "7.3.0",\n    "8.0.0",\n    "9.0.0",\n    "9.0.1",\n    "10.0.0",\n    "10.0.1",\n    "10.0.2",\n    "11.0.0",\n    "11.1.0",\n    "11.1.1",\n    "12.0.0",\n    "13.0.0",\n    "13.0.1",\n    "13.0.2",\n    "14.0.0"\n  ],\n  "sporto/hop": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "5.0.0",\n    "5.0.1",\n    "5.1.0",\n    "6.0.0",\n    "6.0.1"\n  ],\n  "sporto/polylinear-scale": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "sporto/qs": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "sporto/time-distance": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "stephenreddek/elm-emoji": [\n    "1.0.0"\n  ],\n  "stephenreddek/elm-range-slider": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "stephenreddek/elm-time-picker": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "stil4m/elm-aui-css": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1"\n  ],\n  "stil4m/elm-devcards": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "stil4m/elm-syntax": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "3.1.3",\n    "3.1.4",\n    "3.2.0",\n    "3.3.0",\n    "3.3.1",\n    "3.4.0",\n    "3.4.1",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "6.0.1",\n    "6.1.0",\n    "6.1.1",\n    "7.0.0",\n    "7.0.1",\n    "7.0.2",\n    "7.0.3",\n    "7.0.4",\n    "7.0.5",\n    "7.0.6",\n    "7.1.0",\n    "7.1.1",\n    "7.1.2",\n    "7.1.3"\n  ],\n  "stil4m/rfc2822-datetime": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "stil4m/structured-writer": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "stoeffel/datetimepicker": [\n    "1.0.0"\n  ],\n  "stoeffel/editable": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "stoeffel/elm-verify": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0"\n  ],\n  "stoeffel/resetable": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "stoeffel/set-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.2.3"\n  ],\n  "stowga/elm-datepicker": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "sudo-rushil/elm-cards": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0"\n  ],\n  "supermacro/elm-antd": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0"\n  ],\n  "supermario/elm-countries": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0"\n  ],\n  "supermario/html-test-runner": [\n    "1.0.2",\n    "1.0.3",\n    "1.0.4"\n  ],\n  "surprisetalk/elm-bulma": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2",\n    "4.1.3",\n    "4.1.4",\n    "4.1.5",\n    "5.0.0",\n    "6.0.0",\n    "6.0.1",\n    "6.0.2",\n    "6.1.0",\n    "6.1.1",\n    "6.1.2",\n    "6.1.3",\n    "6.1.4",\n    "6.1.5",\n    "6.1.6"\n  ],\n  "surprisetalk/elm-font-awesome": [\n    "1.0.0"\n  ],\n  "surprisetalk/elm-icon": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "surprisetalk/elm-ionicons": [\n    "1.0.0"\n  ],\n  "surprisetalk/elm-material-icons": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "surprisetalk/elm-open-iconic": [\n    "1.0.0"\n  ],\n  "surprisetalk/elm-pointless": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "swiftengineer/elm-data": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0"\n  ],\n  "swiftsnamesake/euclidean-space": [\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1"\n  ],\n  "synbioz/elm-time-overlap": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "szabba/elm-animations": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0"\n  ],\n  "szabba/elm-laws": [\n    "1.0.0"\n  ],\n  "szabba/elm-timestamp": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "tad-lispy/springs": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5"\n  ],\n  "tapeinosyne/elm-microkanren": [\n    "1.0.0"\n  ],\n  "teepark/elmoji": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "teocollin1995/complex": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "terezka/app": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0"\n  ],\n  "terezka/colors": [\n    "1.0.0"\n  ],\n  "terezka/elm-cartesian-svg": [\n    "1.0.1"\n  ],\n  "terezka/elm-charts": [\n    "1.0.0"\n  ],\n  "terezka/elm-charts-alpha": [\n    "1.0.0"\n  ],\n  "terezka/elm-plot": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "4.1.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "5.1.0"\n  ],\n  "terezka/elm-plot-rouge": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0",\n    "2.4.0",\n    "2.4.1",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "4.0.0",\n    "4.1.0"\n  ],\n  "terezka/line-charts": [\n    "2.0.0",\n    "2.0.1"\n  ],\n  "terezka/url-parser": [\n    "1.0.0"\n  ],\n  "terezka/yaml": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "tesk9/accessible-html": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "tesk9/accessible-html-with-css": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "tesk9/elm-html-a11y": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2"\n  ],\n  "tesk9/elm-html-textup": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "tesk9/elm-tabs": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "tesk9/focus-style-manager": [\n    "1.0.0"\n  ],\n  "tesk9/modal": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "7.0.0"\n  ],\n  "tesk9/palette": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "thSoft/key-constants": [\n    "1.0.2",\n    "1.0.3"\n  ],\n  "thalissonmelo/elmcounter": [\n    "1.0.0"\n  ],\n  "thaterikperson/elm-blackjack": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "thaterikperson/elm-strftime": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "the-sett/ai-search": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.1.0",\n    "4.1.1",\n    "5.0.0"\n  ],\n  "the-sett/auth-elm": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "3.0.5"\n  ],\n  "the-sett/decode-generic": [\n    "1.0.0"\n  ],\n  "the-sett/elm-auth": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "5.0.0"\n  ],\n  "the-sett/elm-auth-aws": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "the-sett/elm-aws-cognito": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "2.0.0"\n  ],\n  "the-sett/elm-aws-core": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0",\n    "7.0.0",\n    "7.1.0"\n  ],\n  "the-sett/elm-color": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "the-sett/elm-enum": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "the-sett/elm-error-handling": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.2.0"\n  ],\n  "the-sett/elm-localstorage": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "the-sett/elm-one-many": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "the-sett/elm-pretty-printer": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "2.2.0",\n    "2.2.1",\n    "2.2.2",\n    "2.2.3"\n  ],\n  "the-sett/elm-refine": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.4.0"\n  ],\n  "the-sett/elm-serverless": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "the-sett/elm-state-machines": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "the-sett/elm-string-case": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "the-sett/elm-syntax-dsl": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "2.2.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.1.0"\n  ],\n  "the-sett/elm-update-helper": [\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.4.0",\n    "1.4.1"\n  ],\n  "the-sett/json-optional": [\n    "1.0.0"\n  ],\n  "the-sett/lazy-list": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "the-sett/salix": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "the-sett/svg-text-fonts": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "4.0.0"\n  ],\n  "the-sett/tea-tree": [\n    "1.0.0"\n  ],\n  "the-sett/the-sett-laf": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0",\n    "6.1.0"\n  ],\n  "thebookofeveryone/elm-composer": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "thebritican/elm-autocomplete": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.2.0",\n    "3.2.1",\n    "3.3.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3"\n  ],\n  "thematthopkins/elm-test-journey": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "thomasloh/elm-phone": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "thought2/elm-interactive": [\n    "1.0.0"\n  ],\n  "thought2/elm-vectors": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "thought2/elm-wikimedia-commons": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "thoughtbot/expirable": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "tilmans/elm-style-elements-drag-drop": [\n    "1.0.0",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "timjs/elm-collage": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.3.1",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "timo-weike/generic-collections": [\n    "1.0.0"\n  ],\n  "tiziano88/elm-oauth": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "tiziano88/elm-protobuf": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "tiziano88/elm-tfl": [\n    "1.0.0"\n  ],\n  "tj/elm-svg-loaders": [\n    "1.0.0"\n  ],\n  "tlentz/elm-adjustable-table": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "tlentz/elm-fancy-table": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "toastal/either": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "3.3.0",\n    "3.4.0",\n    "3.4.1",\n    "3.5.0",\n    "3.5.1",\n    "3.5.2"\n  ],\n  "toastal/endo": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0"\n  ],\n  "toastal/mailto": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "toastal/return-optics": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "toastal/select-prism": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "toastal/trinary": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "tomjkidd/elm-multiway-tree-zipper": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.3.0",\n    "1.4.0",\n    "1.5.0",\n    "1.6.0",\n    "1.7.0",\n    "1.8.0",\n    "1.9.0",\n    "1.10.0",\n    "1.10.1",\n    "1.10.2",\n    "1.10.3"\n  ],\n  "torgeir/elm-github-events": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "torreyatcitty/the-best-decimal": [\n    "1.0.0"\n  ],\n  "tortis/elm-sat": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "tortus/elm-array-2d": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.0.5",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "3.0.0"\n  ],\n  "treffynnon/elm-tfn": [\n    "1.0.0"\n  ],\n  "tremlab/bugsnag-elm": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "tricycle/elm-actor-framework": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0"\n  ],\n  "tricycle/elm-actor-framework-sandbox": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "tricycle/elm-actor-framework-template": [\n    "1.0.0"\n  ],\n  "tricycle/elm-actor-framework-template-html": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "tricycle/elm-actor-framework-template-markdown": [\n    "1.0.0"\n  ],\n  "tricycle/elm-email": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "tricycle/elm-embed-youtube": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2"\n  ],\n  "tricycle/elm-eventstream": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "tricycle/elm-imgix": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0"\n  ],\n  "tricycle/elm-infinite-gallery": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "tricycle/elm-infnite-gallery": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "tricycle/elm-parse-dont-validate": [\n    "1.0.0"\n  ],\n  "tricycle/elm-storage": [\n    "1.0.0"\n  ],\n  "tricycle/morty-api": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0"\n  ],\n  "tricycle/system-actor-model": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2",\n    "4.1.3",\n    "4.2.0",\n    "4.2.1",\n    "4.2.2",\n    "4.2.3",\n    "4.2.4",\n    "4.3.0",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "7.0.0",\n    "8.0.0",\n    "8.0.1",\n    "8.0.2",\n    "9.0.0"\n  ],\n  "trifectalabs/elm-polyline": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "tripokey/elm-fuzzy": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "5.0.3",\n    "5.1.0",\n    "5.2.0",\n    "5.2.1"\n  ],\n  "truqu/elm-base64": [\n    "1.0.0",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "1.0.6",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4"\n  ],\n  "truqu/elm-dictset": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.0.5",\n    "2.0.0",\n    "2.1.0"\n  ],\n  "truqu/elm-md5": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "truqu/elm-mustache": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3"\n  ],\n  "truqu/elm-oauth2": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.1.0",\n    "2.2.0",\n    "2.2.1",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "6.0.0",\n    "7.0.0"\n  ],\n  "truqu/elm-review-nobooleancase": [\n    "1.0.0"\n  ],\n  "truqu/elm-review-noleftpizza": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "truqu/elm-review-noredundantconcat": [\n    "1.0.0"\n  ],\n  "truqu/elm-review-noredundantcons": [\n    "1.0.0"\n  ],\n  "truqu/line-charts": [\n    "1.0.0"\n  ],\n  "tryzniak/assoc": [\n    "1.0.0"\n  ],\n  "tunguski/elm-ast": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3"\n  ],\n  "turboMaCk/any-dict": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "2.2.0",\n    "2.3.0"\n  ],\n  "turboMaCk/any-set": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.2.0",\n    "1.3.0",\n    "1.4.0"\n  ],\n  "turboMaCk/chae-tree": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "2.1.0",\n    "2.1.1"\n  ],\n  "turboMaCk/elm-continue": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "turboMaCk/glue": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "6.0.0",\n    "6.1.0",\n    "6.2.0"\n  ],\n  "turboMaCk/grid-solver": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0"\n  ],\n  "turboMaCk/lazy-tree-with-zipper": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.1.0",\n    "3.1.1",\n    "3.1.2"\n  ],\n  "turboMaCk/non-empty-list-alias": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "turboMaCk/queue": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "tuxagon/elm-pokeapi": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "typed-wire/elm-typed-wire-utils": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "ucode/elm-path": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ursi/elm-css-colors": [\n    "1.0.0"\n  ],\n  "ursi/elm-scroll": [\n    "1.0.0"\n  ],\n  "ursi/elm-throttle": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ursi/support": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "utkarshkukreti/elm-inflect": [\n    "1.0.0"\n  ],\n  "vViktorPL/elm-incremental-list": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "vViktorPL/elm-jira-connector": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "valberg/elm-django-channels": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0"\n  ],\n  "valentinomicko/test-forms": [\n    "1.0.0"\n  ],\n  "vateira/elm-bem-helpers": [\n    "1.0.0"\n  ],\n  "vernacular-ai/elm-flow-chart": [\n    "1.0.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0"\n  ],\n  "vieiralucas/elm-collections": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0"\n  ],\n  "viir/simplegamedev": [\n    "1.0.0"\n  ],\n  "vilterp/elm-diagrams": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.0.3",\n    "2.0.4",\n    "2.1.0",\n    "2.1.1",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0"\n  ],\n  "vilterp/elm-html-extra": [\n    "1.0.1"\n  ],\n  "vilterp/elm-pretty-print": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "vipentti/elm-dispatch": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "visotype/elm-dom": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.1.2",\n    "1.1.3"\n  ],\n  "visotype/elm-eval": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "vito/elm-ansi": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "2.1.0",\n    "2.1.1",\n    "2.1.2",\n    "2.1.3",\n    "3.0.0",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2",\n    "5.0.3",\n    "5.0.4",\n    "6.0.0",\n    "6.0.1",\n    "7.0.0",\n    "7.0.1",\n    "8.0.0",\n    "8.0.1",\n    "8.0.2",\n    "8.0.3",\n    "8.1.0",\n    "9.0.0",\n    "9.0.1"\n  ],\n  "vjrasane/elm-dynamic-json": [\n    "1.0.0"\n  ],\n  "vmchale/elm-composition": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "volumeint/screen-overlay": [\n    "1.0.0"\n  ],\n  "volumeint/sortable-table": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "w0rm/elm-physics": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.2.1",\n    "3.2.2",\n    "4.0.0",\n    "5.0.0"\n  ],\n  "w0rm/elm-slice-show": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "3.0.1",\n    "3.0.2",\n    "3.0.3",\n    "3.0.4",\n    "4.0.0",\n    "4.1.0",\n    "5.0.0",\n    "5.0.1",\n    "5.0.2"\n  ],\n  "waratuman/elm-coder": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0",\n    "3.0.1"\n  ],\n  "waratuman/elm-json-extra": [\n    "1.0.0"\n  ],\n  "waratuman/elm-standardapi": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "5.0.0",\n    "6.0.0"\n  ],\n  "waratuman/json-extra": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "waratuman/time-extra": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "warry/ascii-table": [\n    "1.0.0"\n  ],\n  "wearsunscreen/gen-garden": [\n    "1.0.0"\n  ],\n  "webbhuset/elm-actor-model": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "3.0.0",\n    "4.0.0"\n  ],\n  "webbhuset/elm-actor-model-elm-ui": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "webbhuset/elm-json-decode": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0"\n  ],\n  "wells-wood-research/elm-molecules": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "wende/elm-ast": [\n    "1.0.0"\n  ],\n  "werner/diyalog": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "wernerdegroot/listzipper": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "3.2.0",\n    "4.0.0"\n  ],\n  "whage/elm-validate": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "whale9490/elm-split-pane": [\n    "1.0.0"\n  ],\n  "will-clarke/elm-tiled-map": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "williamwhitacre/elm-encoding": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "williamwhitacre/elm-lexer": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "williamwhitacre/pylon": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.2.0",\n    "4.3.0",\n    "4.4.0",\n    "4.4.1",\n    "4.5.0",\n    "4.6.0",\n    "4.6.1",\n    "4.7.0",\n    "4.7.1",\n    "4.7.2",\n    "4.7.3",\n    "4.7.4",\n    "4.7.5",\n    "4.8.0",\n    "4.9.0",\n    "4.10.0",\n    "4.11.0",\n    "4.12.0",\n    "4.13.0",\n    "4.13.1",\n    "4.14.0",\n    "4.15.0",\n    "4.16.0",\n    "4.17.0",\n    "4.18.0",\n    "5.0.0",\n    "5.1.0",\n    "6.0.0",\n    "6.0.1",\n    "6.1.0",\n    "6.2.0",\n    "6.3.0",\n    "6.4.0",\n    "6.5.0",\n    "6.5.1",\n    "6.5.2",\n    "6.5.3",\n    "6.5.4",\n    "6.6.0",\n    "6.7.0",\n    "6.7.1",\n    "6.8.0",\n    "6.9.0",\n    "6.10.0",\n    "7.0.0",\n    "7.1.0",\n    "7.2.0",\n    "7.3.0",\n    "7.4.0",\n    "7.5.0",\n    "7.6.0",\n    "8.0.0",\n    "8.0.1",\n    "8.0.2",\n    "8.1.0",\n    "8.1.1",\n    "8.1.2",\n    "8.1.3",\n    "8.1.4",\n    "8.1.5",\n    "8.1.6",\n    "8.1.7",\n    "8.1.8",\n    "8.1.9",\n    "8.1.10",\n    "8.1.11",\n    "8.1.12",\n    "8.2.0",\n    "8.3.0",\n    "8.4.0",\n    "8.5.0",\n    "8.5.1",\n    "8.5.2",\n    "8.5.3",\n    "8.5.4",\n    "8.5.5",\n    "8.6.0",\n    "8.7.0",\n    "8.7.1",\n    "8.7.2",\n    "8.7.4",\n    "8.8.0",\n    "8.8.1",\n    "8.8.2",\n    "8.9.0",\n    "8.10.0",\n    "9.0.0"\n  ],\n  "wingyplus/thai-citizen-id": [\n    "1.0.0"\n  ],\n  "wintvelt/elm-print-any": [\n    "1.0.0"\n  ],\n  "wittjosiah/elm-alerts": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "wittjosiah/elm-ordered-dict": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "wjdhamilton/elm-json-api-helpers": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "wking-io/pair": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "wolfadex/elm-text-adventure": [\n    "1.0.0",\n    "2.0.0"\n  ],\n  "wolfadex/locale-negotiation": [\n    "1.0.0"\n  ],\n  "wolfadex/tiler": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "wuct/elm-charts": [\n    "1.0.2"\n  ],\n  "xarvh/elm-dropdown-menu": [\n    "1.0.0"\n  ],\n  "xarvh/elm-gamepad": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "3.0.0"\n  ],\n  "xarvh/elm-slides": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.1.1",\n    "4.0.0",\n    "4.0.1",\n    "5.0.0",\n    "5.0.1"\n  ],\n  "xarvh/elm-styled-html": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "xarvh/lexical-random-generator": [\n    "1.0.0"\n  ],\n  "xdelph/elm-slick-grid": [\n    "1.0.0",\n    "1.1.0"\n  ],\n  "xdelph/elm-sortable-table": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "xerono/pinnablecache": [\n    "1.0.0"\n  ],\n  "xilnocas/step": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0",\n    "2.1.0",\n    "3.0.0",\n    "3.0.1",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2",\n    "4.1.3",\n    "4.1.4"\n  ],\n  "y-taka-23/elm-github-ribbon": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "y047aka/elm-hsl-color": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "y047aka/elm-reset-css": [\n    "1.0.0",\n    "1.1.0",\n    "2.0.0"\n  ],\n  "y0hy0h/ordered-containers": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "ydschneider/regex-builder": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "ymtszw/elm-amazon-product-advertising": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.1.0"\n  ],\n  "ymtszw/elm-broker": [\n    "1.0.0"\n  ],\n  "ymtszw/elm-http-xml": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "2.0.0"\n  ],\n  "ymtszw/elm-xml-decode": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0",\n    "3.2.0",\n    "3.2.1"\n  ],\n  "yotamDvir/elm-katex": [\n    "1.0.0",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "yotamDvir/elm-pivot": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "3.0.0",\n    "3.1.0"\n  ],\n  "yujota/elm-asap-pathology-format": [\n    "1.0.0"\n  ],\n  "yujota/elm-collision-detection": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "yujota/elm-makie": [\n    "1.0.0"\n  ],\n  "yujota/elm-pascal-voc": [\n    "1.0.0"\n  ],\n  "yumlonne/elm-japanese-calendar": [\n    "1.0.0"\n  ],\n  "z5h/component-result": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0"\n  ],\n  "z5h/jaro-winkler": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2"\n  ],\n  "z5h/timeline": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "z5h/zipper": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "zaboco/elm-draggable": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "1.0.3",\n    "1.0.4",\n    "1.1.0",\n    "1.1.1",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2",\n    "2.1.0",\n    "3.0.0",\n    "2.1.1",\n    "3.1.0",\n    "4.0.0",\n    "4.0.1",\n    "4.0.2",\n    "4.0.3",\n    "4.0.4",\n    "4.0.5",\n    "4.0.6"\n  ],\n  "zaidan/elm-collision": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "zaidan/elm-gridbox": [\n    "1.0.0"\n  ],\n  "zaptic/elm-decode-pipeline-strict": [\n    "1.0.0"\n  ],\n  "zarvunk/tuple-map": [\n    "1.0.0"\n  ],\n  "zeckalpha/char-extra": [\n    "1.0.0"\n  ],\n  "zeckalpha/elm-sexp": [\n    "1.0.0"\n  ],\n  "zgohr/elm-csv": [\n    "1.0.0",\n    "1.0.1"\n  ],\n  "zwilias/elm-avl-dict-exploration": [\n    "1.0.0",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2"\n  ],\n  "zwilias/elm-bytes-parser": [\n    "1.0.0"\n  ],\n  "zwilias/elm-disco": [\n    "1.0.0"\n  ],\n  "zwilias/elm-holey-zipper": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1"\n  ],\n  "zwilias/elm-html-string": [\n    "1.0.0",\n    "1.0.1",\n    "1.0.2",\n    "2.0.0",\n    "2.0.1",\n    "2.0.2"\n  ],\n  "zwilias/elm-reorderable": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.1.1",\n    "1.2.0",\n    "1.3.0"\n  ],\n  "zwilias/elm-rosetree": [\n    "1.0.0",\n    "1.1.0",\n    "1.2.0",\n    "1.2.1",\n    "1.2.2",\n    "1.3.0",\n    "1.3.1",\n    "1.4.0",\n    "1.5.0"\n  ],\n  "zwilias/elm-toml": [\n    "1.0.0"\n  ],\n  "zwilias/elm-touch-events": [\n    "1.0.0",\n    "1.0.1",\n    "1.1.0",\n    "1.2.0"\n  ],\n  "zwilias/elm-transcoder": [\n    "1.0.0"\n  ],\n  "zwilias/elm-tree": [\n    "1.0.0"\n  ],\n  "zwilias/elm-utf-tools": [\n    "1.0.0",\n    "1.0.1",\n    "2.0.0",\n    "2.0.1"\n  ],\n  "zwilias/json-decode-exploration": [\n    "1.0.0",\n    "2.0.0",\n    "3.0.0",\n    "4.0.0",\n    "4.1.0",\n    "4.1.1",\n    "4.1.2",\n    "4.2.0",\n    "4.2.1",\n    "4.3.0",\n    "5.0.0",\n    "5.0.1",\n    "6.0.0"\n  ],\n  "zwilias/json-encode-exploration": [\n    "1.0.0"\n  ]\n}\n';
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$project_metadata_utils$Elm$Version$Version = F3(
	function (a, b, c) {
		return {$: 'Version', a: a, b: b, c: c};
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$project_metadata_utils$Elm$Version$checkNumbers = F3(
	function (major, minor, patch) {
		return ((major >= 0) && ((minor >= 0) && (patch >= 0))) ? $elm$core$Maybe$Just(
			A3($elm$project_metadata_utils$Elm$Version$Version, major, minor, patch)) : $elm$core$Maybe$Nothing;
	});
var $elm$project_metadata_utils$Elm$Version$fromString = function (string) {
	var _v0 = A2(
		$elm$core$List$map,
		$elm$core$String$toInt,
		A2($elm$core$String$split, '.', string));
	if ((((((_v0.b && (_v0.a.$ === 'Just')) && _v0.b.b) && (_v0.b.a.$ === 'Just')) && _v0.b.b.b) && (_v0.b.b.a.$ === 'Just')) && (!_v0.b.b.b.b)) {
		var major = _v0.a.a;
		var _v1 = _v0.b;
		var minor = _v1.a.a;
		var _v2 = _v1.b;
		var patch = _v2.a.a;
		return A3($elm$project_metadata_utils$Elm$Version$checkNumbers, major, minor, patch);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Version$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Version$fromString(string);
	if (_v0.$ === 'Just') {
		var version = _v0.a;
		return $elm$json$Json$Decode$succeed(version);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid version like \"2.0.1\"');
	}
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$project_metadata_utils$Elm$Version$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Version$decoderHelp, $elm$json$Json$Decode$string);
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$ElmPackages$rawHistoryDecoder = $elm$json$Json$Decode$dict(
	$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Version$decoder));
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$ElmPackages$allPackages = A2(
	$elm$core$Result$withDefault,
	$elm$core$Dict$empty,
	A2($elm$json$Json$Decode$decodeString, $author$project$ElmPackages$rawHistoryDecoder, $author$project$ElmPackages$raw));
var $author$project$PubGrub$Cache$empty = $author$project$PubGrub$Cache$Cache(
	{dependencies: $elm$core$Dict$empty, packages: $elm$core$Dict$empty, packagesRaw: $elm$core$Array$empty});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$PubGrub$Cache$addPackageVersion = F2(
	function (_v0, _v1) {
		var _package = _v0.a;
		var version = _v0.b;
		var raw = _v1.a;
		var packages = _v1.b;
		var _v2 = A2($elm$core$Dict$get, _package, packages);
		if (_v2.$ === 'Nothing') {
			return _Utils_Tuple2(
				A2(
					$elm$core$Array$push,
					_Utils_Tuple2(_package, version),
					raw),
				A3(
					$elm$core$Dict$insert,
					_package,
					_List_fromArray(
						[version]),
					packages));
		} else {
			var versions = _v2.a;
			return A2($elm$core$List$member, version, versions) ? _Utils_Tuple2(raw, packages) : _Utils_Tuple2(
				A2(
					$elm$core$Array$push,
					_Utils_Tuple2(_package, version),
					raw),
				A3(
					$elm$core$Dict$update,
					_package,
					$elm$core$Maybe$map(
						$elm$core$List$cons(version)),
					packages));
		}
	});
var $author$project$PubGrub$Cache$addPackageVersions = F2(
	function (packagesVersions, _v0) {
		var packagesRaw = _v0.a.packagesRaw;
		var packages = _v0.a.packages;
		var dependencies = _v0.a.dependencies;
		var _v1 = A3(
			$elm$core$List$foldl,
			$author$project$PubGrub$Cache$addPackageVersion,
			_Utils_Tuple2(packagesRaw, packages),
			packagesVersions);
		var updatedRaw = _v1.a;
		var updatePackages = _v1.b;
		return $author$project$PubGrub$Cache$Cache(
			{dependencies: dependencies, packages: updatePackages, packagesRaw: updatedRaw});
	});
var $elm$project_metadata_utils$Elm$Version$toTuple = function (_v0) {
	var major = _v0.a;
	var minor = _v0.b;
	var patch = _v0.c;
	return _Utils_Tuple3(major, minor, patch);
};
var $author$project$Solver$insertVersions = F3(
	function (_package, versions, cache) {
		return function (l) {
			return A2($author$project$PubGrub$Cache$addPackageVersions, l, cache);
		}(
			A2(
				$elm$core$List$map,
				function (v) {
					return _Utils_Tuple2(_package, v);
				},
				A2(
					$elm$core$List$map,
					A2($elm$core$Basics$composeR, $elm$project_metadata_utils$Elm$Version$toTuple, $author$project$PubGrub$Version$fromTuple),
					versions)));
	});
var $author$project$Solver$initCache = A3($elm$core$Dict$foldl, $author$project$Solver$insertVersions, $author$project$PubGrub$Cache$empty, $author$project$ElmPackages$allPackages);
var $author$project$Main$Init = F2(
	function (a, b) {
		return {$: 'Init', a: a, b: b};
	});
var $author$project$Main$initialState = A2($author$project$Main$Init, '', $elm$core$Maybe$Nothing);
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$PubGrub$Version$bumpPatch = function (_v0) {
	var major = _v0.a.major;
	var minor = _v0.a.minor;
	var patch = _v0.a.patch;
	return $author$project$PubGrub$Version$Version(
		{major: major, minor: minor, patch: patch + 1});
};
var $author$project$PubGrub$Range$Range = function (a) {
	return {$: 'Range', a: a};
};
var $author$project$PubGrub$Range$higherThan = function (version) {
	return $author$project$PubGrub$Range$Range(
		_List_fromArray(
			[
				_Utils_Tuple2(version, $elm$core$Maybe$Nothing)
			]));
};
var $author$project$PubGrub$Version$higherThan = F2(
	function (_v0, _v1) {
		var v = _v0.a;
		var vRef = _v1.a;
		return (_Utils_cmp(vRef.major, v.major) > 0) ? true : ((_Utils_cmp(vRef.major, v.major) < 0) ? false : ((_Utils_cmp(vRef.minor, v.minor) > 0) ? true : ((_Utils_cmp(vRef.minor, v.minor) < 0) ? false : (_Utils_cmp(vRef.patch, v.patch) > 0))));
	});
var $author$project$PubGrub$Version$lowerThan = F2(
	function (_v0, _v1) {
		var v = _v0.a;
		var vRef = _v1.a;
		return (_Utils_cmp(vRef.major, v.major) > 0) ? false : ((_Utils_cmp(vRef.major, v.major) < 0) ? true : ((_Utils_cmp(vRef.minor, v.minor) > 0) ? false : ((_Utils_cmp(vRef.minor, v.minor) < 0) ? true : (_Utils_cmp(vRef.patch, v.patch) < 0))));
	});
var $author$project$PubGrub$Version$max = F2(
	function (v1, v2) {
		return A2($author$project$PubGrub$Version$higherThan, v1, v2) ? v2 : v1;
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$PubGrub$Range$reversePrepend = F2(
	function (rev, accum) {
		reversePrepend:
		while (true) {
			if (!rev.b) {
				return accum;
			} else {
				var x = rev.a;
				var xs = rev.b;
				var $temp$rev = xs,
					$temp$accum = A2($elm$core$List$cons, x, accum);
				rev = $temp$rev;
				accum = $temp$accum;
				continue reversePrepend;
			}
		}
	});
var $author$project$PubGrub$Range$intersectionHelper = F3(
	function (accum, left, right) {
		intersectionHelper:
		while (true) {
			var _v0 = _Utils_Tuple2(left, right);
			_v0$4:
			while (true) {
				if (_v0.a.b) {
					if (_v0.a.a.b.$ === 'Just') {
						if (_v0.b.b) {
							if (_v0.b.a.b.$ === 'Just') {
								var _v1 = _v0.a;
								var _v2 = _v1.a;
								var l1 = _v2.a;
								var l2 = _v2.b.a;
								var ls = _v1.b;
								var _v3 = _v0.b;
								var _v4 = _v3.a;
								var r1 = _v4.a;
								var r2 = _v4.b.a;
								var rs = _v3.b;
								if (!A2($author$project$PubGrub$Version$lowerThan, l2, r1)) {
									var $temp$accum = accum,
										$temp$left = ls,
										$temp$right = right;
									accum = $temp$accum;
									left = $temp$left;
									right = $temp$right;
									continue intersectionHelper;
								} else {
									if (!A2($author$project$PubGrub$Version$lowerThan, r2, l1)) {
										var $temp$accum = accum,
											$temp$left = left,
											$temp$right = rs;
										accum = $temp$accum;
										left = $temp$left;
										right = $temp$right;
										continue intersectionHelper;
									} else {
										var start = A2($author$project$PubGrub$Version$max, l1, r1);
										if (A2($author$project$PubGrub$Version$higherThan, l2, r2)) {
											var $temp$accum = A2(
												$elm$core$List$cons,
												_Utils_Tuple2(
													start,
													$elm$core$Maybe$Just(l2)),
												accum),
												$temp$left = ls,
												$temp$right = right;
											accum = $temp$accum;
											left = $temp$left;
											right = $temp$right;
											continue intersectionHelper;
										} else {
											var $temp$accum = A2(
												$elm$core$List$cons,
												_Utils_Tuple2(
													start,
													$elm$core$Maybe$Just(r2)),
												accum),
												$temp$left = left,
												$temp$right = rs;
											accum = $temp$accum;
											left = $temp$left;
											right = $temp$right;
											continue intersectionHelper;
										}
									}
								}
							} else {
								var _v5 = _v0.a;
								var _v6 = _v5.a;
								var l1 = _v6.a;
								var l2 = _v6.b.a;
								var ls = _v5.b;
								var _v7 = _v0.b;
								var _v8 = _v7.a;
								var r1 = _v8.a;
								var _v9 = _v8.b;
								if (A2($author$project$PubGrub$Version$higherThan, l2, r1)) {
									var $temp$accum = accum,
										$temp$left = ls,
										$temp$right = right;
									accum = $temp$accum;
									left = $temp$left;
									right = $temp$right;
									continue intersectionHelper;
								} else {
									if (_Utils_eq(l2, r1)) {
										return A2($author$project$PubGrub$Range$reversePrepend, accum, ls);
									} else {
										if (A2($author$project$PubGrub$Version$higherThan, l1, r1)) {
											return A2(
												$author$project$PubGrub$Range$reversePrepend,
												accum,
												A2(
													$elm$core$List$cons,
													_Utils_Tuple2(
														r1,
														$elm$core$Maybe$Just(l2)),
													ls));
										} else {
											return A2($author$project$PubGrub$Range$reversePrepend, accum, left);
										}
									}
								}
							}
						} else {
							break _v0$4;
						}
					} else {
						if (_v0.b.b && (_v0.b.a.b.$ === 'Nothing')) {
							var _v10 = _v0.a;
							var _v11 = _v10.a;
							var l1 = _v11.a;
							var _v12 = _v11.b;
							var _v13 = _v0.b;
							var _v14 = _v13.a;
							var r1 = _v14.a;
							var _v15 = _v14.b;
							return $elm$core$List$reverse(
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2(
										A2($author$project$PubGrub$Version$max, l1, r1),
										$elm$core$Maybe$Nothing),
									accum));
						} else {
							break _v0$4;
						}
					}
				} else {
					return $elm$core$List$reverse(accum);
				}
			}
			var $temp$accum = accum,
				$temp$left = right,
				$temp$right = left;
			accum = $temp$accum;
			left = $temp$left;
			right = $temp$right;
			continue intersectionHelper;
		}
	});
var $author$project$PubGrub$Range$intersection = F2(
	function (_v0, _v1) {
		var i1 = _v0.a;
		var i2 = _v1.a;
		return $author$project$PubGrub$Range$Range(
			A3($author$project$PubGrub$Range$intersectionHelper, _List_Nil, i1, i2));
	});
var $author$project$PubGrub$Range$none = $author$project$PubGrub$Range$Range(_List_Nil);
var $author$project$PubGrub$Version$zero = $author$project$PubGrub$Version$Version(
	{major: 0, minor: 0, patch: 0});
var $author$project$PubGrub$Range$lowerThan = function (version) {
	return _Utils_eq(version, $author$project$PubGrub$Version$zero) ? $author$project$PubGrub$Range$none : $author$project$PubGrub$Range$Range(
		_List_fromArray(
			[
				_Utils_Tuple2(
				$author$project$PubGrub$Version$zero,
				$elm$core$Maybe$Just(version))
			]));
};
var $elm$core$Debug$todo = _Debug_todo;
var $author$project$Project$rangeFromString = function (str) {
	var _v0 = A2($elm$core$String$split, ' ', str);
	if (((((_v0.b && _v0.b.b) && _v0.b.b.b) && _v0.b.b.b.b) && _v0.b.b.b.b.b) && (!_v0.b.b.b.b.b.b)) {
		var low = _v0.a;
		var _v1 = _v0.b;
		var sep1 = _v1.a;
		var _v2 = _v1.b;
		var _v3 = _v2.b;
		var sep2 = _v3.a;
		var _v4 = _v3.b;
		var high = _v4.a;
		var _v5 = _Utils_Tuple2(
			$elm$project_metadata_utils$Elm$Version$fromString(low),
			$elm$project_metadata_utils$Elm$Version$fromString(high));
		if ((_v5.a.$ === 'Just') && (_v5.b.$ === 'Just')) {
			var vLow = _v5.a.a;
			var vHigh = _v5.b.a;
			var v2 = $author$project$PubGrub$Version$fromTuple(
				$elm$project_metadata_utils$Elm$Version$toTuple(vHigh));
			var v1 = $author$project$PubGrub$Version$fromTuple(
				$elm$project_metadata_utils$Elm$Version$toTuple(vLow));
			var range2 = (sep2 === '<') ? $author$project$PubGrub$Range$lowerThan(v2) : $author$project$PubGrub$Range$lowerThan(
				$author$project$PubGrub$Version$bumpPatch(v2));
			var range1 = (sep1 === '<=') ? $author$project$PubGrub$Range$higherThan(v1) : $author$project$PubGrub$Range$higherThan(
				$author$project$PubGrub$Version$bumpPatch(v1));
			return A2($author$project$PubGrub$Range$intersection, range1, range2);
		} else {
			return _Debug_todo(
				'Project',
				{
					start: {line: 81, column: 21},
					end: {line: 81, column: 31}
				})('Elm version should be correctly formatted');
		}
	} else {
		return _Debug_todo(
			'Project',
			{
				start: {line: 84, column: 13},
				end: {line: 84, column: 23}
			})('Elm constraint should be correctly formatted');
	}
};
var $author$project$Main$packageRangeFromString = function (str) {
	var _v0 = A2($elm$core$String$split, '@', str);
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var _package = _v0.a;
		var _v1 = _v0.b;
		var rangeStr = _v1.a;
		return $elm$core$Result$Ok(
			_Utils_Tuple2(
				_package,
				$author$project$Project$rangeFromString(rangeStr)));
	} else {
		return $elm$core$Result$Err('Wrong package range format: ' + str);
	}
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$ElmPackages$packageVersionFromString = function (str) {
	var _v0 = A2($elm$core$String$split, '@', str);
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var _package = _v0.a;
		var _v1 = _v0.b;
		var version = _v1.a;
		var _v2 = A2(
			$elm$json$Json$Decode$decodeValue,
			$elm$project_metadata_utils$Elm$Version$decoder,
			$elm$json$Json$Encode$string(version));
		if (_v2.$ === 'Ok') {
			var elmVersion = _v2.a;
			return $elm$core$Result$Ok(
				_Utils_Tuple2(_package, elmVersion));
		} else {
			var err = _v2.a;
			return $elm$core$Result$Err(
				$elm$json$Json$Decode$errorToString(err));
		}
	} else {
		return $elm$core$Result$Err('Invalid package and version format: ' + str);
	}
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$init = function (flags) {
	var valuesStringDecoder = A2(
		$elm$json$Json$Decode$field,
		'values',
		$elm$json$Json$Decode$list(
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
	var keysStringDecoder = A2(
		$elm$json$Json$Decode$field,
		'keys',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string));
	var keysString = A2(
		$elm$core$Result$withDefault,
		_List_Nil,
		A2($elm$json$Json$Decode$decodeValue, keysStringDecoder, flags));
	var keys = A2(
		$elm$core$List$filterMap,
		A2(
			$elm$core$Basics$composeR,
			$author$project$ElmPackages$packageVersionFromString,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$toMaybe,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Maybe$map(
						$elm$core$Tuple$mapSecond($elm$project_metadata_utils$Elm$Version$toTuple)),
					$elm$core$Maybe$map(
						$elm$core$Tuple$mapSecond($author$project$PubGrub$Version$fromTuple))))),
		keysString);
	var dependenciesString = A2(
		$elm$core$Result$withDefault,
		_List_Nil,
		A2($elm$json$Json$Decode$decodeValue, valuesStringDecoder, flags));
	var dependencies = A2(
		$elm$core$List$map,
		$elm$core$List$filterMap(
			A2($elm$core$Basics$composeR, $author$project$Main$packageRangeFromString, $elm$core$Result$toMaybe)),
		dependenciesString);
	var keysAndDeps = A3($elm$core$List$map2, $elm$core$Tuple$pair, keys, dependencies);
	return _Utils_Tuple2(
		{
			cache: A3(
				$elm$core$List$foldl,
				function (_v0) {
					var _v1 = _v0.a;
					var _package = _v1.a;
					var version = _v1.b;
					var deps = _v0.b;
					return A3($author$project$PubGrub$Cache$addDependencies, _package, version, deps);
				},
				$author$project$Solver$initCache,
				keysAndDeps),
			state: $author$project$Main$initialState
		},
		$elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$ApiMsg = function (a) {
	return {$: 'ApiMsg', a: a};
};
var $author$project$Main$ElmJsonContent = function (a) {
	return {$: 'ElmJsonContent', a: a};
};
var $author$project$Main$ElmJsonFile = function (a) {
	return {$: 'ElmJsonFile', a: a};
};
var $author$project$Main$Error = function (a) {
	return {$: 'Error', a: a};
};
var $author$project$Main$LoadedProject = F2(
	function (a, b) {
		return {$: 'LoadedProject', a: a, b: b};
	});
var $author$project$Main$PickedPackage = F3(
	function (a, b, c) {
		return {$: 'PickedPackage', a: a, b: b, c: c};
	});
var $author$project$Main$Solution = function (a) {
	return {$: 'Solution', a: a};
};
var $author$project$Main$Solving = function (a) {
	return {$: 'Solving', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$project_metadata_utils$Elm$Project$Application = function (a) {
	return {$: 'Application', a: a};
};
var $elm$project_metadata_utils$Elm$Project$Package = function (a) {
	return {$: 'Package', a: a};
};
var $elm$project_metadata_utils$Elm$Project$ApplicationInfo = F6(
	function (elm, dirs, depsDirect, depsIndirect, testDepsDirect, testDepsIndirect) {
		return {depsDirect: depsDirect, depsIndirect: depsIndirect, dirs: dirs, elm: elm, testDepsDirect: testDepsDirect, testDepsIndirect: testDepsIndirect};
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$project_metadata_utils$Elm$Package$Name = F2(
	function (a, b) {
		return {$: 'Name', a: a, b: b};
	});
var $elm$core$String$any = _String_any;
var $elm$project_metadata_utils$Elm$Package$isBadChar = function (_char) {
	return $elm$core$Char$isUpper(_char) || (_Utils_eq(
		_char,
		_Utils_chr('.')) || _Utils_eq(
		_char,
		_Utils_chr('_')));
};
var $elm$project_metadata_utils$Elm$Package$isBadProjectName = function (project) {
	var _v0 = $elm$core$String$uncons(project);
	if (_v0.$ === 'Nothing') {
		return true;
	} else {
		var _v1 = _v0.a;
		var c = _v1.a;
		return A2($elm$core$String$contains, '--', project) || (A2($elm$core$String$any, $elm$project_metadata_utils$Elm$Package$isBadChar, project) || (A2($elm$core$String$startsWith, '-', project) || (!$elm$core$Char$isLower(c))));
	}
};
var $elm$project_metadata_utils$Elm$Package$fromString = function (string) {
	var _v0 = A2($elm$core$String$split, '/', string);
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var author = _v0.a;
		var _v1 = _v0.b;
		var project = _v1.a;
		return $elm$project_metadata_utils$Elm$Package$isBadProjectName(project) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
			A2($elm$project_metadata_utils$Elm$Package$Name, author, project));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Project$verifyDepNames = F2(
	function (revDeps, pairs) {
		verifyDepNames:
		while (true) {
			if (!pairs.b) {
				return $elm$json$Json$Decode$succeed(
					$elm$core$List$reverse(revDeps));
			} else {
				var _v1 = pairs.a;
				var key = _v1.a;
				var con = _v1.b;
				var otherPairs = pairs.b;
				var _v2 = $elm$project_metadata_utils$Elm$Package$fromString(key);
				if (_v2.$ === 'Just') {
					var pkg = _v2.a;
					var $temp$revDeps = A2(
						$elm$core$List$cons,
						_Utils_Tuple2(pkg, con),
						revDeps),
						$temp$pairs = otherPairs;
					revDeps = $temp$revDeps;
					pairs = $temp$pairs;
					continue verifyDepNames;
				} else {
					return $elm$json$Json$Decode$fail('\"' + (key + '\" is not a valid package name.'));
				}
			}
		}
	});
var $elm$project_metadata_utils$Elm$Project$depsDecoder = function (constraintDecoder) {
	return A2(
		$elm$json$Json$Decode$andThen,
		$elm$project_metadata_utils$Elm$Project$verifyDepNames(_List_Nil),
		$elm$json$Json$Decode$keyValuePairs(constraintDecoder));
};
var $elm$json$Json$Decode$map6 = _Json_map6;
var $elm$project_metadata_utils$Elm$Project$applicationDecoder = A7(
	$elm$json$Json$Decode$map6,
	$elm$project_metadata_utils$Elm$Project$ApplicationInfo,
	A2($elm$json$Json$Decode$field, 'elm-version', $elm$project_metadata_utils$Elm$Version$decoder),
	A2(
		$elm$json$Json$Decode$field,
		'source-directories',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['dependencies', 'direct']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['dependencies', 'indirect']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['test-dependencies', 'direct']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['test-dependencies', 'indirect']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)));
var $elm$project_metadata_utils$Elm$Project$PackageInfo = F8(
	function (name, summary, license, version, exposed, deps, testDeps, elm) {
		return {deps: deps, elm: elm, exposed: exposed, license: license, name: name, summary: summary, testDeps: testDeps, version: version};
	});
var $elm$project_metadata_utils$Elm$Constraint$Constraint = F4(
	function (a, b, c, d) {
		return {$: 'Constraint', a: a, b: b, c: c, d: d};
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$project_metadata_utils$Elm$Version$compare = F2(
	function (_v0, _v1) {
		var major1 = _v0.a;
		var minor1 = _v0.b;
		var patch1 = _v0.c;
		var major2 = _v1.a;
		var minor2 = _v1.b;
		var patch2 = _v1.c;
		var _v2 = A2($elm$core$Basics$compare, major1, major2);
		switch (_v2.$) {
			case 'LT':
				return $elm$core$Basics$LT;
			case 'GT':
				return $elm$core$Basics$GT;
			default:
				var _v3 = A2($elm$core$Basics$compare, minor1, minor2);
				switch (_v3.$) {
					case 'LT':
						return $elm$core$Basics$LT;
					case 'EQ':
						return A2($elm$core$Basics$compare, patch1, patch2);
					default:
						return $elm$core$Basics$GT;
				}
		}
	});
var $elm$project_metadata_utils$Elm$Constraint$checkConstraint = function (constraint) {
	var lower = constraint.a;
	var upper = constraint.d;
	var _v0 = A2($elm$project_metadata_utils$Elm$Version$compare, lower, upper);
	switch (_v0.$) {
		case 'LT':
			return $elm$core$Maybe$Just(constraint);
		case 'EQ':
			return $elm$core$Maybe$Just(constraint);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					if (md.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var d = md.a;
						return $elm$core$Maybe$Just(
							A4(func, a, b, c, d));
					}
				}
			}
		}
	});
var $elm$project_metadata_utils$Elm$Constraint$LessOrEq = {$: 'LessOrEq'};
var $elm$project_metadata_utils$Elm$Constraint$LessThan = {$: 'LessThan'};
var $elm$project_metadata_utils$Elm$Constraint$opFromString = function (op) {
	switch (op) {
		case '<':
			return $elm$core$Maybe$Just($elm$project_metadata_utils$Elm$Constraint$LessThan);
		case '<=':
			return $elm$core$Maybe$Just($elm$project_metadata_utils$Elm$Constraint$LessOrEq);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Constraint$fromString = function (string) {
	var _v0 = A2($elm$core$String$split, ' ', string);
	if ((((((_v0.b && _v0.b.b) && _v0.b.b.b) && (_v0.b.b.a === 'v')) && _v0.b.b.b.b) && _v0.b.b.b.b.b) && (!_v0.b.b.b.b.b.b)) {
		var lower = _v0.a;
		var _v1 = _v0.b;
		var lop = _v1.a;
		var _v2 = _v1.b;
		var _v3 = _v2.b;
		var uop = _v3.a;
		var _v4 = _v3.b;
		var upper = _v4.a;
		return A2(
			$elm$core$Maybe$andThen,
			$elm$project_metadata_utils$Elm$Constraint$checkConstraint,
			A5(
				$elm$core$Maybe$map4,
				$elm$project_metadata_utils$Elm$Constraint$Constraint,
				$elm$project_metadata_utils$Elm$Version$fromString(lower),
				$elm$project_metadata_utils$Elm$Constraint$opFromString(lop),
				$elm$project_metadata_utils$Elm$Constraint$opFromString(uop),
				$elm$project_metadata_utils$Elm$Version$fromString(upper)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Constraint$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Constraint$fromString(string);
	if (_v0.$ === 'Just') {
		var constraint = _v0.a;
		return $elm$json$Json$Decode$succeed(constraint);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid constraint like \"1.0.0 <= v < 2.0.0\"');
	}
};
var $elm$project_metadata_utils$Elm$Constraint$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Constraint$decoderHelp, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$License$License = F2(
	function (a, b) {
		return {$: 'License', a: a, b: b};
	});
var $elm$project_metadata_utils$Elm$License$osiApprovedSpdxLicenses = _List_fromArray(
	[
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-1.1', 'Academic Free License v1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-1.2', 'Academic Free License v1.2'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-2.0', 'Academic Free License v2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-2.1', 'Academic Free License v2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-3.0', 'Academic Free License v3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APL-1.0', 'Adaptive Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Apache-1.1', 'Apache License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Apache-2.0', 'Apache License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-1.0', 'Apple Public Source License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-1.1', 'Apple Public Source License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-1.2', 'Apple Public Source License 1.2'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-2.0', 'Apple Public Source License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-1.0', 'Artistic License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-1.0-Perl', 'Artistic License 1.0 (Perl)'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-1.0-cl8', 'Artistic License 1.0 w/clause 8'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-2.0', 'Artistic License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AAL', 'Attribution Assurance License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'BSL-1.0', 'Boost Software License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'BSD-2-Clause', 'BSD 2-clause \"Simplified\" License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'BSD-3-Clause', 'BSD 3-clause \"New\" or \"Revised\" License'),
		A2($elm$project_metadata_utils$Elm$License$License, '0BSD', 'BSD Zero Clause License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CECILL-2.1', 'CeCILL Free Software License Agreement v2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CNRI-Python', 'CNRI Python License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CDDL-1.0', 'Common Development and Distribution License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CPAL-1.0', 'Common Public Attribution License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CPL-1.0', 'Common Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CATOSL-1.1', 'Computer Associates Trusted Open Source License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CUA-OPL-1.0', 'CUA Office Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EPL-1.0', 'Eclipse Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ECL-1.0', 'Educational Community License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ECL-2.0', 'Educational Community License v2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EFL-1.0', 'Eiffel Forum License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EFL-2.0', 'Eiffel Forum License v2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Entessa', 'Entessa Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EUDatagrid', 'EU DataGrid Software License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EUPL-1.1', 'European Union Public License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Fair', 'Fair License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Frameworx-1.0', 'Frameworx Open License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AGPL-3.0', 'GNU Affero General Public License v3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'GPL-2.0', 'GNU General Public License v2.0 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'GPL-3.0', 'GNU General Public License v3.0 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LGPL-2.1', 'GNU Lesser General Public License v2.1 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LGPL-3.0', 'GNU Lesser General Public License v3.0 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LGPL-2.0', 'GNU Library General Public License v2 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'HPND', 'Historic Permission Notice and Disclaimer'),
		A2($elm$project_metadata_utils$Elm$License$License, 'IPL-1.0', 'IBM Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Intel', 'Intel Open Source License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'IPA', 'IPA Font License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ISC', 'ISC License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LPPL-1.3c', 'LaTeX Project Public License v1.3c'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LiLiQ-P-1.1', 'Licence Libre du Québec – Permissive version 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LiLiQ-Rplus-1.1', 'Licence Libre du Québec – Réciprocité forte version 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LiLiQ-R-1.1', 'Licence Libre du Québec – Réciprocité version 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LPL-1.02', 'Lucent Public License v1.02'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LPL-1.0', 'Lucent Public License Version 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MS-PL', 'Microsoft Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MS-RL', 'Microsoft Reciprocal License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MirOS', 'MirOS Licence'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MIT', 'MIT License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Motosoto', 'Motosoto License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-1.0', 'Mozilla Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-1.1', 'Mozilla Public License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-2.0', 'Mozilla Public License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-2.0-no-copyleft-exception', 'Mozilla Public License 2.0 (no copyleft exception)'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Multics', 'Multics License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NASA-1.3', 'NASA Open Source Agreement 1.3'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Naumen', 'Naumen Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NGPL', 'Nethack General Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Nokia', 'Nokia Open Source License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NPOSL-3.0', 'Non-Profit Open Software License 3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NTP', 'NTP License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OCLC-2.0', 'OCLC Research Public License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OGTSL', 'Open Group Test Suite License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-1.0', 'Open Software License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-2.0', 'Open Software License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-2.1', 'Open Software License 2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-3.0', 'Open Software License 3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSET-PL-2.1', 'OSET Public License version 2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'PHP-3.0', 'PHP License v3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'PostgreSQL', 'PostgreSQL License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Python-2.0', 'Python License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'QPL-1.0', 'Q Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RPSL-1.0', 'RealNetworks Public Source License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RPL-1.1', 'Reciprocal Public License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RPL-1.5', 'Reciprocal Public License 1.5'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RSCPL', 'Ricoh Source Code Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OFL-1.1', 'SIL Open Font License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'SimPL-2.0', 'Simple Public License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Sleepycat', 'Sleepycat License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'SISSL', 'Sun Industry Standards Source License v1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'SPL-1.0', 'Sun Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Watcom-1.0', 'Sybase Open Watcom Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'UPL-1.0', 'Universal Permissive License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NCSA', 'University of Illinois/NCSA Open Source License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'VSL-1.0', 'Vovida Software License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'W3C', 'W3C Software Notice and License (2002-12-31)'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Xnet', 'X.Net License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Zlib', 'zlib License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ZPL-2.0', 'Zope Public License 2.0')
	]);
var $elm$project_metadata_utils$Elm$License$spdxDict = $elm$core$Dict$fromList(
	A2(
		$elm$core$List$map,
		function (license) {
			var abbr = license.a;
			return _Utils_Tuple2(abbr, license);
		},
		$elm$project_metadata_utils$Elm$License$osiApprovedSpdxLicenses));
var $elm$project_metadata_utils$Elm$License$fromString = function (string) {
	return A2($elm$core$Dict$get, string, $elm$project_metadata_utils$Elm$License$spdxDict);
};
var $elm$project_metadata_utils$Elm$License$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$License$fromString(string);
	if (_v0.$ === 'Just') {
		var license = _v0.a;
		return $elm$json$Json$Decode$succeed(license);
	} else {
		return $elm$json$Json$Decode$fail('I need an OSI approved license in SPDX format <https://spdx.org/licenses/>');
	}
};
var $elm$project_metadata_utils$Elm$License$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$License$decoderHelp, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Package$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Package$fromString(string);
	if (_v0.$ === 'Just') {
		var name = _v0.a;
		return $elm$json$Json$Decode$succeed(name);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid package name like \"elm/core\"');
	}
};
var $elm$project_metadata_utils$Elm$Package$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Package$decoderHelp, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Project$ExposedDict = function (a) {
	return {$: 'ExposedDict', a: a};
};
var $elm$project_metadata_utils$Elm$Project$ExposedList = function (a) {
	return {$: 'ExposedList', a: a};
};
var $elm$project_metadata_utils$Elm$Project$checkHeaders = function (dict) {
	checkHeaders:
	while (true) {
		if (!dict.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = dict.a;
			var header = _v1.a;
			var others = dict.b;
			if ($elm$core$String$length(header) < 20) {
				var $temp$dict = others;
				dict = $temp$dict;
				continue checkHeaders;
			} else {
				return $elm$core$Maybe$Just(header);
			}
		}
	}
};
var $elm$project_metadata_utils$Elm$Project$checkExposedDict = function (dict) {
	var _v0 = $elm$project_metadata_utils$Elm$Project$checkHeaders(dict);
	if (_v0.$ === 'Nothing') {
		return $elm$json$Json$Decode$succeed(dict);
	} else {
		var badHeader = _v0.a;
		return $elm$json$Json$Decode$fail('The \"' + (badHeader + '\" header is too long. Twenty characters max!'));
	}
};
var $elm$project_metadata_utils$Elm$Module$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$project_metadata_utils$Elm$Module$isGoodChunk = function (chunk) {
	var _v0 = $elm$core$String$uncons(chunk);
	if (_v0.$ === 'Nothing') {
		return false;
	} else {
		var _v1 = _v0.a;
		var _char = _v1.a;
		var rest = _v1.b;
		return $elm$core$Char$isUpper(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
	}
};
var $elm$project_metadata_utils$Elm$Module$fromString = function (string) {
	return A2(
		$elm$core$List$all,
		$elm$project_metadata_utils$Elm$Module$isGoodChunk,
		A2($elm$core$String$split, '.', string)) ? $elm$core$Maybe$Just(
		$elm$project_metadata_utils$Elm$Module$Name(string)) : $elm$core$Maybe$Nothing;
};
var $elm$project_metadata_utils$Elm$Module$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Module$fromString(string);
	if (_v0.$ === 'Just') {
		var name = _v0.a;
		return $elm$json$Json$Decode$succeed(name);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid module name like \"Json.Decode\"');
	}
};
var $elm$project_metadata_utils$Elm$Module$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Module$decoderHelp, $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$project_metadata_utils$Elm$Project$exposedDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$map,
			$elm$project_metadata_utils$Elm$Project$ExposedList,
			$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Module$decoder)),
			A2(
			$elm$json$Json$Decode$map,
			$elm$project_metadata_utils$Elm$Project$ExposedDict,
			A2(
				$elm$json$Json$Decode$andThen,
				$elm$project_metadata_utils$Elm$Project$checkExposedDict,
				$elm$json$Json$Decode$keyValuePairs(
					$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Module$decoder))))
		]));
var $elm$json$Json$Decode$map8 = _Json_map8;
var $elm$project_metadata_utils$Elm$Project$summaryCheck = function (summary) {
	return ($elm$core$String$length(summary) < 80) ? $elm$json$Json$Decode$succeed(summary) : $elm$json$Json$Decode$fail('The \"summary\" field must have fewer than 80 characters.');
};
var $elm$project_metadata_utils$Elm$Project$summaryDecoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Project$summaryCheck, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Project$packageDecoder = A9(
	$elm$json$Json$Decode$map8,
	$elm$project_metadata_utils$Elm$Project$PackageInfo,
	A2($elm$json$Json$Decode$field, 'name', $elm$project_metadata_utils$Elm$Package$decoder),
	A2($elm$json$Json$Decode$field, 'summary', $elm$project_metadata_utils$Elm$Project$summaryDecoder),
	A2($elm$json$Json$Decode$field, 'license', $elm$project_metadata_utils$Elm$License$decoder),
	A2($elm$json$Json$Decode$field, 'version', $elm$project_metadata_utils$Elm$Version$decoder),
	A2($elm$json$Json$Decode$field, 'exposed-modules', $elm$project_metadata_utils$Elm$Project$exposedDecoder),
	A2(
		$elm$json$Json$Decode$field,
		'dependencies',
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Constraint$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'test-dependencies',
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Constraint$decoder)),
	A2($elm$json$Json$Decode$field, 'elm-version', $elm$project_metadata_utils$Elm$Constraint$decoder));
var $elm$project_metadata_utils$Elm$Project$decoderHelp = function (tipe) {
	switch (tipe) {
		case 'application':
			return A2($elm$json$Json$Decode$map, $elm$project_metadata_utils$Elm$Project$Application, $elm$project_metadata_utils$Elm$Project$applicationDecoder);
		case 'package':
			return A2($elm$json$Json$Decode$map, $elm$project_metadata_utils$Elm$Project$Package, $elm$project_metadata_utils$Elm$Project$packageDecoder);
		default:
			var other = tipe;
			return $elm$json$Json$Decode$fail('The "type" field must be either "application" or "package", so ' + ('\"' + (other + '\" is not acceptable.')));
	}
};
var $elm$project_metadata_utils$Elm$Project$decoder = A2(
	$elm$json$Json$Decode$andThen,
	$elm$project_metadata_utils$Elm$Project$decoderHelp,
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Solver$Newest = {$: 'Newest'};
var $author$project$Solver$defaultConfig = {online: false, strategy: $author$project$Solver$Newest};
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $author$project$Project$Application = function (a) {
	return {$: 'Application', a: a};
};
var $author$project$Project$Package = F3(
	function (a, b, c) {
		return {$: 'Package', a: a, b: b, c: c};
	});
var $author$project$PubGrub$Range$exact = function (version) {
	return $author$project$PubGrub$Range$Range(
		_List_fromArray(
			[
				_Utils_Tuple2(
				version,
				$elm$core$Maybe$Just(
					$author$project$PubGrub$Version$bumpPatch(version)))
			]));
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$project_metadata_utils$Elm$Constraint$opToString = function (op) {
	if (op.$ === 'LessThan') {
		return ' < ';
	} else {
		return ' <= ';
	}
};
var $elm$project_metadata_utils$Elm$Version$toString = function (_v0) {
	var major = _v0.a;
	var minor = _v0.b;
	var patch = _v0.c;
	return $elm$core$String$fromInt(major) + ('.' + ($elm$core$String$fromInt(minor) + ('.' + $elm$core$String$fromInt(patch))));
};
var $elm$project_metadata_utils$Elm$Constraint$toString = function (_v0) {
	var lower = _v0.a;
	var lop = _v0.b;
	var uop = _v0.c;
	var upper = _v0.d;
	return $elm$project_metadata_utils$Elm$Version$toString(lower) + ($elm$project_metadata_utils$Elm$Constraint$opToString(lop) + ('v' + ($elm$project_metadata_utils$Elm$Constraint$opToString(uop) + $elm$project_metadata_utils$Elm$Version$toString(upper))));
};
var $elm$project_metadata_utils$Elm$Package$toString = function (_v0) {
	var user = _v0.a;
	var project = _v0.b;
	return user + ('/' + project);
};
var $author$project$Project$fromElmProject = function (elmProject) {
	if (elmProject.$ === 'Package') {
		var name = elmProject.a.name;
		var version = elmProject.a.version;
		var deps = elmProject.a.deps;
		var packageVersion = $author$project$PubGrub$Version$fromTuple(
			$elm$project_metadata_utils$Elm$Version$toTuple(version));
		var _package = $elm$project_metadata_utils$Elm$Package$toString(name);
		var dependencies = A2(
			$elm$core$List$map,
			$elm$core$Tuple$mapSecond(
				A2($elm$core$Basics$composeR, $elm$project_metadata_utils$Elm$Constraint$toString, $author$project$Project$rangeFromString)),
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapFirst($elm$project_metadata_utils$Elm$Package$toString),
				deps));
		return A3($author$project$Project$Package, _package, packageVersion, dependencies);
	} else {
		var depsDirect = elmProject.a.depsDirect;
		return $author$project$Project$Application(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond(
					A2(
						$elm$core$Basics$composeR,
						$elm$project_metadata_utils$Elm$Version$toTuple,
						A2($elm$core$Basics$composeR, $author$project$PubGrub$Version$fromTuple, $author$project$PubGrub$Range$exact))),
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$mapFirst($elm$project_metadata_utils$Elm$Package$toString),
					depsDirect)));
	}
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Solver$Finished = function (a) {
	return {$: 'Finished', a: a};
};
var $author$project$PubGrub$Cache$listDependencies = F3(
	function (_v0, _package, version) {
		var dependencies = _v0.a.dependencies;
		return A2(
			$elm$core$Dict$get,
			_Utils_Tuple2(
				_package,
				$author$project$PubGrub$Version$toTuple(version)),
			dependencies);
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$PubGrub$Cache$listVersions = F2(
	function (_v0, _package) {
		var packages = _v0.a.packages;
		return A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2($elm$core$Dict$get, _package, packages));
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Solver$sortStrategy = F2(
	function (strategy, versions) {
		if (strategy.$ === 'Oldest') {
			return A2($elm$core$List$sortBy, $author$project$PubGrub$Version$toTuple, versions);
		} else {
			return $elm$core$List$reverse(
				A2($elm$core$List$sortBy, $author$project$PubGrub$Version$toTuple, versions));
		}
	});
var $author$project$Solver$configFrom = F5(
	function (cache, strategy, rootPackage, rootVersion, dependencies) {
		return {
			getDependencies: F2(
				function (_package, version) {
					return (_Utils_eq(_package, rootPackage) && _Utils_eq(version, rootVersion)) ? $elm$core$Maybe$Just(dependencies) : A3($author$project$PubGrub$Cache$listDependencies, cache, _package, version);
				}),
			listAvailableVersions: function (_package) {
				return _Utils_eq(_package, rootPackage) ? _List_fromArray(
					[rootVersion]) : A2(
					$author$project$Solver$sortStrategy,
					strategy,
					A2($author$project$PubGrub$Cache$listVersions, cache, _package));
			}
		};
	});
var $author$project$PubGrub$Internal$PartialSolution$PartialSolution = function (a) {
	return {$: 'PartialSolution', a: a};
};
var $author$project$PubGrub$Internal$PartialSolution$empty = $author$project$PubGrub$Internal$PartialSolution$PartialSolution(_List_Nil);
var $author$project$PubGrub$Internal$Incompatibility$Incompatibility = F2(
	function (a, b) {
		return {$: 'Incompatibility', a: a, b: b};
	});
var $author$project$PubGrub$Internal$Term$Negative = function (a) {
	return {$: 'Negative', a: a};
};
var $author$project$PubGrub$Internal$Incompatibility$NotRoot = {$: 'NotRoot'};
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $author$project$PubGrub$Internal$Incompatibility$notRoot = F2(
	function (_package, version) {
		var term = $author$project$PubGrub$Internal$Term$Negative(
			$author$project$PubGrub$Range$exact(version));
		return A2(
			$author$project$PubGrub$Internal$Incompatibility$Incompatibility,
			{
				asDict: A2($elm$core$Dict$singleton, _package, term),
				asList: _List_fromArray(
					[
						_Utils_Tuple2(_package, term)
					])
			},
			$author$project$PubGrub$Internal$Incompatibility$NotRoot);
	});
var $author$project$PubGrub$Internal$Core$init = F2(
	function (root, version) {
		return {
			incompatibilities: _List_fromArray(
				[
					A2($author$project$PubGrub$Internal$Incompatibility$notRoot, root, version)
				]),
			partialSolution: $author$project$PubGrub$Internal$PartialSolution$empty
		};
	});
var $author$project$PubGrub$ListVersions = function (a) {
	return {$: 'ListVersions', a: a};
};
var $author$project$PubGrub$SignalEnd = function (a) {
	return {$: 'SignalEnd', a: a};
};
var $author$project$PubGrub$State = function (a) {
	return {$: 'State', a: a};
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$PubGrub$Internal$Term$Positive = function (a) {
	return {$: 'Positive', a: a};
};
var $author$project$PubGrub$Range$cleanFirstInterval = function (intervals) {
	if (intervals.b && (intervals.a.b.$ === 'Just')) {
		var _v1 = intervals.a;
		var end = _v1.b.a;
		var others = intervals.b;
		return _Utils_eq(end, $author$project$PubGrub$Version$zero) ? $author$project$PubGrub$Range$Range(others) : $author$project$PubGrub$Range$Range(intervals);
	} else {
		return $author$project$PubGrub$Range$Range(intervals);
	}
};
var $author$project$PubGrub$Range$negateHelper = F3(
	function (lastVersion, accum, intervals) {
		negateHelper:
		while (true) {
			if (!intervals.b) {
				return $elm$core$List$reverse(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(lastVersion, $elm$core$Maybe$Nothing),
						accum));
			} else {
				if (intervals.a.b.$ === 'Nothing') {
					var _v1 = intervals.a;
					var start = _v1.a;
					var _v2 = _v1.b;
					return $elm$core$List$reverse(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								lastVersion,
								$elm$core$Maybe$Just(start)),
							accum));
				} else {
					var _v3 = intervals.a;
					var start = _v3.a;
					var end = _v3.b.a;
					var rest = intervals.b;
					var $temp$lastVersion = end,
						$temp$accum = A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							lastVersion,
							$elm$core$Maybe$Just(start)),
						accum),
						$temp$intervals = rest;
					lastVersion = $temp$lastVersion;
					accum = $temp$accum;
					intervals = $temp$intervals;
					continue negateHelper;
				}
			}
		}
	});
var $author$project$PubGrub$Range$negate = function (_v0) {
	var intervals = _v0.a;
	return $author$project$PubGrub$Range$cleanFirstInterval(
		A3($author$project$PubGrub$Range$negateHelper, $author$project$PubGrub$Version$zero, _List_Nil, intervals));
};
var $author$project$PubGrub$Range$union = F2(
	function (r1, r2) {
		return $author$project$PubGrub$Range$negate(
			A2(
				$author$project$PubGrub$Range$intersection,
				$author$project$PubGrub$Range$negate(r1),
				$author$project$PubGrub$Range$negate(r2)));
	});
var $author$project$PubGrub$Internal$Term$intersection = F2(
	function (t1, t2) {
		var _v0 = _Utils_Tuple2(t1, t2);
		if (_v0.a.$ === 'Positive') {
			if (_v0.b.$ === 'Positive') {
				var r1 = _v0.a.a;
				var r2 = _v0.b.a;
				return $author$project$PubGrub$Internal$Term$Positive(
					A2($author$project$PubGrub$Range$intersection, r1, r2));
			} else {
				var r1 = _v0.a.a;
				var r2 = _v0.b.a;
				return $author$project$PubGrub$Internal$Term$Positive(
					A2(
						$author$project$PubGrub$Range$intersection,
						r1,
						$author$project$PubGrub$Range$negate(r2)));
			}
		} else {
			if (_v0.b.$ === 'Positive') {
				var r1 = _v0.a.a;
				var r2 = _v0.b.a;
				return $author$project$PubGrub$Internal$Term$Positive(
					A2(
						$author$project$PubGrub$Range$intersection,
						$author$project$PubGrub$Range$negate(r1),
						r2));
			} else {
				var r1 = _v0.a.a;
				var r2 = _v0.b.a;
				return $author$project$PubGrub$Internal$Term$Negative(
					A2($author$project$PubGrub$Range$union, r1, r2));
			}
		}
	});
var $author$project$PubGrub$Internal$Term$listIntersection = F2(
	function (initial, terms) {
		return A3(
			$elm$core$List$foldl,
			$author$project$PubGrub$Internal$Term$intersection,
			A2(
				$elm$core$Maybe$withDefault,
				$author$project$PubGrub$Internal$Term$Negative($author$project$PubGrub$Range$none),
				initial),
			terms);
	});
var $author$project$Utils$dictFilterMap = F2(
	function (f, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, acc) {
					var _v0 = A2(f, k, v);
					if (_v0.$ === 'Just') {
						var newVal = _v0.a;
						return A3($elm$core$Dict$insert, k, newVal, acc);
					} else {
						return acc;
					}
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $author$project$PubGrub$Internal$Term$isPositive = function (term) {
	if (term.$ === 'Positive') {
		return true;
	} else {
		return false;
	}
};
var $author$project$PubGrub$Internal$Memory$potentialPackage = function (_v0) {
	var decision = _v0.decision;
	var derivations = _v0.derivations;
	return (_Utils_eq(decision, $elm$core$Maybe$Nothing) && A2($elm$core$List$any, $author$project$PubGrub$Internal$Term$isPositive, derivations)) ? $elm$core$Maybe$Just(derivations) : $elm$core$Maybe$Nothing;
};
var $author$project$PubGrub$Internal$Memory$potentialPackages = function (memory) {
	return A2(
		$author$project$Utils$dictFilterMap,
		F2(
			function (_v0, p) {
				return $author$project$PubGrub$Internal$Memory$potentialPackage(p);
			}),
		memory);
};
var $author$project$PubGrub$Internal$PartialSolution$potentialPackages = function (_v0) {
	var partial = _v0.a;
	if (!partial.b) {
		return $elm$core$Dict$empty;
	} else {
		var _v2 = partial.a;
		var memory = _v2.b;
		return $author$project$PubGrub$Internal$Memory$potentialPackages(memory);
	}
};
var $author$project$PubGrub$Internal$Core$pickPackage = function (partial) {
	return A2(
		$elm$core$Maybe$map,
		$elm$core$Tuple$mapSecond(
			$author$project$PubGrub$Internal$Term$listIntersection($elm$core$Maybe$Nothing)),
		$elm$core$List$head(
			$elm$core$Dict$toList(
				$author$project$PubGrub$Internal$PartialSolution$potentialPackages(partial))));
};
var $author$project$Utils$dictAll = F2(
	function (predicate, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, acc) {
					return acc && A2(predicate, k, v);
				}),
			true,
			dict);
	});
var $author$project$PubGrub$Internal$Memory$isValidPackage = F2(
	function (_v0, _v1) {
		var decision = _v1.decision;
		var derivations = _v1.derivations;
		if (decision.$ === 'Nothing') {
			return !A2($elm$core$List$any, $author$project$PubGrub$Internal$Term$isPositive, derivations);
		} else {
			return true;
		}
	});
var $author$project$PubGrub$Internal$Memory$solution = function (memory) {
	return A2($author$project$Utils$dictAll, $author$project$PubGrub$Internal$Memory$isValidPackage, memory) ? $elm$core$Maybe$Just(
		$elm$core$Dict$toList(
			A2(
				$author$project$Utils$dictFilterMap,
				F2(
					function (_v0, _v1) {
						var decision = _v1.decision;
						return decision;
					}),
				memory))) : $elm$core$Maybe$Nothing;
};
var $author$project$PubGrub$Internal$PartialSolution$solution = function (_v0) {
	var partial = _v0.a;
	if (!partial.b) {
		return $elm$core$Maybe$Just(_List_Nil);
	} else {
		var _v2 = partial.a;
		var memory = _v2.b;
		return $author$project$PubGrub$Internal$Memory$solution(memory);
	}
};
var $author$project$PubGrub$Internal$Incompatibility$asDict = function (_v0) {
	var incompat = _v0.a;
	return incompat.asDict;
};
var $author$project$PubGrub$Internal$PartialSolution$dropUntilLevel = F2(
	function (level, partial) {
		dropUntilLevel:
		while (true) {
			if (!partial.b) {
				return _List_Nil;
			} else {
				var _v1 = partial.a;
				var decisionLevel = _v1.a.decisionLevel;
				var others = partial.b;
				if (_Utils_cmp(decisionLevel, level) > 0) {
					var $temp$level = level,
						$temp$partial = others;
					level = $temp$level;
					partial = $temp$partial;
					continue dropUntilLevel;
				} else {
					return partial;
				}
			}
		}
	});
var $elm$core$Debug$log = _Debug_log;
var $author$project$PubGrub$Internal$PartialSolution$backtrack = F2(
	function (level, _v0) {
		var partial = _v0.a;
		var _v1 = A2($elm$core$Debug$log, 'backtrack to level', level);
		return $author$project$PubGrub$Internal$PartialSolution$PartialSolution(
			A2($author$project$PubGrub$Internal$PartialSolution$dropUntilLevel, level, partial));
	});
var $author$project$PubGrub$Internal$Incompatibility$merge = F2(
	function (incompat, allIncompats) {
		return A2($elm$core$List$cons, incompat, allIncompats);
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $author$project$PubGrub$Version$toDebugString = function (_v0) {
	var major = _v0.a.major;
	var minor = _v0.a.minor;
	var patch = _v0.a.patch;
	return A2(
		$elm$core$String$join,
		'.',
		A2(
			$elm$core$List$map,
			$elm$core$String$fromInt,
			_List_fromArray(
				[major, minor, patch])));
};
var $author$project$PubGrub$Range$intervalToString = function (interval) {
	if (interval.b.$ === 'Just') {
		var start = interval.a;
		var end = interval.b.a;
		return '[ ' + ($author$project$PubGrub$Version$toDebugString(start) + (', ' + ($author$project$PubGrub$Version$toDebugString(end) + ' [')));
	} else {
		var start = interval.a;
		var _v1 = interval.b;
		return '[ ' + ($author$project$PubGrub$Version$toDebugString(start) + ', ∞ [');
	}
};
var $author$project$PubGrub$Version$new_ = F3(
	function (major, minor, patch) {
		return $author$project$PubGrub$Version$new(
			{major: major, minor: minor, patch: patch});
	});
var $author$project$PubGrub$Range$toDebugString = function (_v0) {
	var intervals = _v0.a;
	_v1$3:
	while (true) {
		if (!intervals.b) {
			return '∅';
		} else {
			if (intervals.a.b.$ === 'Nothing') {
				if (!intervals.b.b) {
					var _v2 = intervals.a;
					var start = _v2.a;
					var _v3 = _v2.b;
					return _Utils_eq(start, $author$project$PubGrub$Version$zero) ? '∗' : ($author$project$PubGrub$Version$toDebugString(start) + ' <= v');
				} else {
					break _v1$3;
				}
			} else {
				if (!intervals.b.b) {
					var _v4 = intervals.a;
					var start = _v4.a;
					var end = _v4.b.a;
					return _Utils_eq(
						end,
						A3($author$project$PubGrub$Version$new_, 0, 0, 1)) ? $author$project$PubGrub$Version$toDebugString(start) : (_Utils_eq(start, $author$project$PubGrub$Version$zero) ? ('v < ' + $author$project$PubGrub$Version$toDebugString(end)) : (_Utils_eq(
						$author$project$PubGrub$Version$bumpPatch(start),
						end) ? $author$project$PubGrub$Version$toDebugString(start) : ($author$project$PubGrub$Version$toDebugString(start) + (' <= v < ' + $author$project$PubGrub$Version$toDebugString(end)))));
				} else {
					break _v1$3;
				}
			}
		}
	}
	return A2(
		$elm$core$String$join,
		'  ',
		A2($elm$core$List$map, $author$project$PubGrub$Range$intervalToString, intervals));
};
var $author$project$PubGrub$Internal$Term$toDebugString = function (term) {
	if (term.$ === 'Positive') {
		var range = term.a;
		return $author$project$PubGrub$Range$toDebugString(range);
	} else {
		var range = term.a;
		return 'Not ( ' + ($author$project$PubGrub$Range$toDebugString(range) + ' )');
	}
};
var $author$project$PubGrub$Internal$Incompatibility$termsString = function (terms) {
	return A2(
		$elm$core$String$join,
		', ',
		A2(
			$elm$core$List$map,
			function (_v0) {
				var name = _v0.a;
				var term = _v0.b;
				return name + (': ' + $author$project$PubGrub$Internal$Term$toDebugString(term));
			},
			terms));
};
var $author$project$PubGrub$Internal$Incompatibility$toDebugString = F3(
	function (recursiveDepth, indent, _v0) {
		var asList = _v0.a.asList;
		var kind = _v0.b;
		var _v1 = _Utils_Tuple2(recursiveDepth, kind);
		_v1$0:
		while (true) {
			switch (_v1.b.$) {
				case 'FromDependencyOf':
					if (!_v1.a) {
						break _v1$0;
					} else {
						var _v2 = _v1.b;
						var _package = _v2.a;
						var version = _v2.b;
						return _Utils_ap(
							A2($elm$core$String$repeat, indent, ' '),
							$author$project$PubGrub$Internal$Incompatibility$termsString(
								$elm$core$List$reverse(asList))) + ('  <<<  from dependency of ' + (_package + (' at version ' + $author$project$PubGrub$Version$toDebugString(version))));
					}
				case 'NotRoot':
					if (!_v1.a) {
						break _v1$0;
					} else {
						var _v3 = _v1.b;
						return A2($elm$core$String$repeat, indent, ' ') + ($author$project$PubGrub$Internal$Incompatibility$termsString(asList) + '  <<<  initial \'not root\' incompatibility');
					}
				case 'NoVersion':
					if (!_v1.a) {
						break _v1$0;
					} else {
						var _v4 = _v1.b;
						return A2($elm$core$String$repeat, indent, ' ') + ($author$project$PubGrub$Internal$Incompatibility$termsString(asList) + '  <<<  no version');
					}
				case 'UnavailableDependencies':
					if (!_v1.a) {
						break _v1$0;
					} else {
						var _v5 = _v1.b;
						return A2($elm$core$String$repeat, indent, ' ') + ($author$project$PubGrub$Internal$Incompatibility$termsString(asList) + '  <<<  unavailable dependencies');
					}
				default:
					switch (_v1.a) {
						case 0:
							break _v1$0;
						case 1:
							var _v6 = _v1.b;
							return A2($elm$core$String$repeat, indent, ' ') + ($author$project$PubGrub$Internal$Incompatibility$termsString(asList) + '  <<<  derived');
						default:
							var _v7 = _v1.b;
							var cause1 = _v7.a;
							var cause2 = _v7.b;
							return (A2($elm$core$String$repeat, indent, ' ') + ($author$project$PubGrub$Internal$Incompatibility$termsString(asList) + '  <<<  derived from:')) + (('\n' + A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, recursiveDepth - 1, indent + 3, cause1)) + ('\n' + A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, recursiveDepth - 1, indent + 3, cause2)));
					}
			}
		}
		return '';
	});
var $author$project$PubGrub$Internal$Core$backtrack = F4(
	function (incompatChanged, previousSatisfierLevel, rootCause, model) {
		return {
			incompatibilities: function () {
				if (incompatChanged) {
					var _v0 = A2(
						$elm$core$Debug$log,
						'Add root cause incompatibility:\n' + A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, -1, 3, rootCause),
						'');
					return A2($author$project$PubGrub$Internal$Incompatibility$merge, rootCause, model.incompatibilities);
				} else {
					return model.incompatibilities;
				}
			}(),
			partialSolution: A2($author$project$PubGrub$Internal$PartialSolution$backtrack, previousSatisfierLevel, model.partialSolution)
		};
	});
var $author$project$PubGrub$Internal$Memory$updateDecision = F2(
	function (version, maybe) {
		if (maybe.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				{
					decision: $elm$core$Maybe$Just(version),
					derivations: _List_Nil
				});
		} else {
			var decision = maybe.a.decision;
			var derivations = maybe.a.derivations;
			if (decision.$ === 'Nothing') {
				return $elm$core$Maybe$Just(
					{
						decision: $elm$core$Maybe$Just(version),
						derivations: derivations
					});
			} else {
				return _Debug_todo(
					'PubGrub.Internal.Memory',
					{
						start: {line: 135, column: 21},
						end: {line: 135, column: 31}
					})('Cannot change a decision already made!');
			}
		}
	});
var $author$project$PubGrub$Internal$Memory$addDecision = F3(
	function (_package, version, memory) {
		return A3(
			$elm$core$Dict$update,
			_package,
			$author$project$PubGrub$Internal$Memory$updateDecision(version),
			memory);
	});
var $author$project$PubGrub$Internal$Memory$updateDerivations = F2(
	function (term, maybe) {
		if (maybe.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				{
					decision: $elm$core$Maybe$Nothing,
					derivations: _List_fromArray(
						[term])
				});
		} else {
			var decision = maybe.a.decision;
			var derivations = maybe.a.derivations;
			return $elm$core$Maybe$Just(
				{
					decision: decision,
					derivations: A2($elm$core$List$cons, term, derivations)
				});
		}
	});
var $author$project$PubGrub$Internal$Memory$addDerivation = F3(
	function (_package, term, memory) {
		return A3(
			$elm$core$Dict$update,
			_package,
			$author$project$PubGrub$Internal$Memory$updateDerivations(term),
			memory);
	});
var $author$project$PubGrub$Internal$Memory$addAssignment = F2(
	function (assignment, memory) {
		var _v0 = assignment.kind;
		if (_v0.$ === 'Decision') {
			var version = _v0.a;
			return A3($author$project$PubGrub$Internal$Memory$addDecision, assignment._package, version, memory);
		} else {
			var term = _v0.a;
			return A3($author$project$PubGrub$Internal$Memory$addDerivation, assignment._package, term, memory);
		}
	});
var $yotamDvir$elm_pivot$Pivot$Get$getC = function (_v0) {
	var c = _v0.a;
	return c;
};
var $yotamDvir$elm_pivot$Pivot$getC = $yotamDvir$elm_pivot$Pivot$Get$getC;
var $yotamDvir$elm_pivot$Pivot$Get$getR = function (_v0) {
	var _v1 = _v0.b;
	var r = _v1.b;
	return r;
};
var $yotamDvir$elm_pivot$Pivot$getR = $yotamDvir$elm_pivot$Pivot$Get$getR;
var $yotamDvir$elm_pivot$Pivot$Types$Pivot = F2(
	function (a, b) {
		return {$: 'Pivot', a: a, b: b};
	});
var $yotamDvir$elm_pivot$Pivot$Position$goR = function (_v0) {
	var cx = _v0.a;
	var _v1 = _v0.b;
	var lt = _v1.a;
	var rt = _v1.b;
	if (!rt.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var hd = rt.a;
		var tl = rt.b;
		return $elm$core$Maybe$Just(
			A2(
				$yotamDvir$elm_pivot$Pivot$Types$Pivot,
				hd,
				_Utils_Tuple2(
					A2($elm$core$List$cons, cx, lt),
					tl)));
	}
};
var $yotamDvir$elm_pivot$Pivot$Utilities$reverse = function (_v0) {
	var c = _v0.a;
	var _v1 = _v0.b;
	var l = _v1.a;
	var r = _v1.b;
	return A2(
		$yotamDvir$elm_pivot$Pivot$Types$Pivot,
		c,
		_Utils_Tuple2(r, l));
};
var $yotamDvir$elm_pivot$Pivot$Utilities$mirrorM = function (f) {
	return A2(
		$elm$core$Basics$composeR,
		$yotamDvir$elm_pivot$Pivot$Utilities$reverse,
		A2(
			$elm$core$Basics$composeR,
			f,
			$elm$core$Maybe$map($yotamDvir$elm_pivot$Pivot$Utilities$reverse)));
};
var $yotamDvir$elm_pivot$Pivot$Position$goL = $yotamDvir$elm_pivot$Pivot$Utilities$mirrorM($yotamDvir$elm_pivot$Pivot$Position$goR);
var $yotamDvir$elm_pivot$Pivot$Position$goRelative = F2(
	function (steps, pvt) {
		return (!steps) ? $elm$core$Maybe$Just(pvt) : ((steps > 0) ? A2(
			$elm$core$Maybe$andThen,
			$yotamDvir$elm_pivot$Pivot$Position$goRelative(steps - 1),
			$yotamDvir$elm_pivot$Pivot$Position$goR(pvt)) : A2(
			$elm$core$Maybe$andThen,
			$yotamDvir$elm_pivot$Pivot$Position$goRelative(steps + 1),
			$yotamDvir$elm_pivot$Pivot$Position$goL(pvt)));
	});
var $yotamDvir$elm_pivot$Pivot$goRelative = $yotamDvir$elm_pivot$Pivot$Position$goRelative;
var $author$project$Utils$findHelper = F3(
	function (search, sizes, zip) {
		findHelper:
		while (true) {
			var left = sizes.left;
			var right = sizes.right;
			var _v0 = A3(
				search,
				sizes,
				$yotamDvir$elm_pivot$Pivot$getC(zip),
				$yotamDvir$elm_pivot$Pivot$getR(zip));
			switch (_v0.$) {
				case 'Stop':
					return $elm$core$Maybe$Nothing;
				case 'Found':
					var b = _v0.a;
					return $elm$core$Maybe$Just(b);
				case 'GoLeft':
					var step = _v0.a;
					var _v1 = A2($yotamDvir$elm_pivot$Pivot$goRelative, -step, zip);
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var newZip = _v1.a;
						var $temp$search = search,
							$temp$sizes = {left: left - step, right: step - 1},
							$temp$zip = newZip;
						search = $temp$search;
						sizes = $temp$sizes;
						zip = $temp$zip;
						continue findHelper;
					}
				case 'KeepGoLeft':
					var step = _v0.a;
					var _v2 = A2($yotamDvir$elm_pivot$Pivot$goRelative, -step, zip);
					if (_v2.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var newZip = _v2.a;
						var $temp$search = search,
							$temp$sizes = {left: left - step, right: step},
							$temp$zip = newZip;
						search = $temp$search;
						sizes = $temp$sizes;
						zip = $temp$zip;
						continue findHelper;
					}
				case 'GoRight':
					var step = _v0.a;
					var _v3 = A2($yotamDvir$elm_pivot$Pivot$goRelative, step, zip);
					if (_v3.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var newZip = _v3.a;
						var $temp$search = search,
							$temp$sizes = {left: step - 1, right: right - step},
							$temp$zip = newZip;
						search = $temp$search;
						sizes = $temp$sizes;
						zip = $temp$zip;
						continue findHelper;
					}
				default:
					var step = _v0.a;
					var _v4 = A2($yotamDvir$elm_pivot$Pivot$goRelative, step, zip);
					if (_v4.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var newZip = _v4.a;
						var $temp$search = search,
							$temp$sizes = {left: step, right: right - step},
							$temp$zip = newZip;
						search = $temp$search;
						sizes = $temp$sizes;
						zip = $temp$zip;
						continue findHelper;
					}
			}
		}
	});
var $yotamDvir$elm_pivot$Pivot$Create$fromCons = F2(
	function (x, xs) {
		return A2(
			$yotamDvir$elm_pivot$Pivot$Types$Pivot,
			x,
			_Utils_Tuple2(_List_Nil, xs));
	});
var $yotamDvir$elm_pivot$Pivot$fromCons = $yotamDvir$elm_pivot$Pivot$Create$fromCons;
var $author$project$Utils$find = F2(
	function (search, list) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var x = list.a;
			var xs = list.b;
			return A3(
				$author$project$Utils$findHelper,
				search,
				{
					left: 0,
					right: $elm$core$List$length(xs)
				},
				A2($yotamDvir$elm_pivot$Pivot$fromCons, x, xs));
		}
	});
var $author$project$Utils$Found = function (a) {
	return {$: 'Found', a: a};
};
var $author$project$Utils$GoLeft = function (a) {
	return {$: 'GoLeft', a: a};
};
var $author$project$Utils$KeepGoRight = function (a) {
	return {$: 'KeepGoRight', a: a};
};
var $author$project$Utils$Stop = {$: 'Stop'};
var $author$project$PubGrub$Internal$Incompatibility$Satisfies = {$: 'Satisfies'};
var $author$project$PubGrub$Internal$Incompatibility$AlmostSatisfies = F2(
	function (a, b) {
		return {$: 'AlmostSatisfies', a: a, b: b};
	});
var $author$project$PubGrub$Internal$Incompatibility$Contradicts = F2(
	function (a, b) {
		return {$: 'Contradicts', a: a, b: b};
	});
var $author$project$PubGrub$Internal$Incompatibility$Inconclusive = {$: 'Inconclusive'};
var $author$project$PubGrub$Internal$Term$Contradicts = {$: 'Contradicts'};
var $author$project$PubGrub$Internal$Term$Inconclusive = {$: 'Inconclusive'};
var $author$project$PubGrub$Internal$Term$Satisfies = {$: 'Satisfies'};
var $author$project$PubGrub$Internal$Term$relation = F2(
	function (term, set) {
		var setIntersection = A2($author$project$PubGrub$Internal$Term$listIntersection, $elm$core$Maybe$Nothing, set);
		var fullIntersection = A2($author$project$PubGrub$Internal$Term$intersection, term, setIntersection);
		return _Utils_eq(setIntersection, fullIntersection) ? $author$project$PubGrub$Internal$Term$Satisfies : (_Utils_eq(
			$author$project$PubGrub$Internal$Term$Positive($author$project$PubGrub$Range$none),
			fullIntersection) ? $author$project$PubGrub$Internal$Term$Contradicts : $author$project$PubGrub$Internal$Term$Inconclusive);
	});
var $author$project$PubGrub$Internal$Incompatibility$relationStep = F3(
	function (set, incompat, relationAccum) {
		relationStep:
		while (true) {
			if (!incompat.b) {
				return relationAccum;
			} else {
				var _v1 = incompat.a;
				var name = _v1.a;
				var term = _v1.b;
				var otherIncompats = incompat.b;
				var nameSet = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2($elm$core$Dict$get, name, set));
				var _v2 = A2($author$project$PubGrub$Internal$Term$relation, term, nameSet);
				switch (_v2.$) {
					case 'Satisfies':
						var $temp$set = set,
							$temp$incompat = otherIncompats,
							$temp$relationAccum = relationAccum;
						set = $temp$set;
						incompat = $temp$incompat;
						relationAccum = $temp$relationAccum;
						continue relationStep;
					case 'Contradicts':
						return A2($author$project$PubGrub$Internal$Incompatibility$Contradicts, name, term);
					default:
						if (relationAccum.$ === 'Satisfies') {
							var $temp$set = set,
								$temp$incompat = otherIncompats,
								$temp$relationAccum = A2($author$project$PubGrub$Internal$Incompatibility$AlmostSatisfies, name, term);
							set = $temp$set;
							incompat = $temp$incompat;
							relationAccum = $temp$relationAccum;
							continue relationStep;
						} else {
							var $temp$set = set,
								$temp$incompat = otherIncompats,
								$temp$relationAccum = $author$project$PubGrub$Internal$Incompatibility$Inconclusive;
							set = $temp$set;
							incompat = $temp$incompat;
							relationAccum = $temp$relationAccum;
							continue relationStep;
						}
				}
			}
		}
	});
var $author$project$PubGrub$Internal$Incompatibility$relation = F2(
	function (set, _v0) {
		var asList = _v0.a.asList;
		return A3($author$project$PubGrub$Internal$Incompatibility$relationStep, set, asList, $author$project$PubGrub$Internal$Incompatibility$Satisfies);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$PubGrub$Internal$Memory$assignmentTerms = F2(
	function (_v0, _v1) {
		var decision = _v1.decision;
		var derivations = _v1.derivations;
		if (decision.$ === 'Nothing') {
			return derivations;
		} else {
			var version = decision.a;
			return A2(
				$elm$core$List$cons,
				$author$project$PubGrub$Internal$Term$Positive(
					$author$project$PubGrub$Range$exact(version)),
				derivations);
		}
	});
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $author$project$PubGrub$Internal$Memory$terms = function (memory) {
	return A2($elm$core$Dict$map, $author$project$PubGrub$Internal$Memory$assignmentTerms, memory);
};
var $author$project$PubGrub$Internal$PartialSolution$searchSatisfier = F5(
	function (incompat, buildMemory, _v0, _v1, earlier) {
		var left = _v0.left;
		var right = _v0.right;
		var assignment = _v1.a;
		var earlierMemory = A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Dict$empty,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$second,
				$elm$core$List$head(earlier)));
		var memory = A2(buildMemory, assignment, earlierMemory);
		var _v2 = A2(
			$author$project$PubGrub$Internal$Incompatibility$relation,
			$author$project$PubGrub$Internal$Memory$terms(memory),
			incompat);
		if (_v2.$ === 'Satisfies') {
			if (!right) {
				var _v3 = A2(
					$elm$core$Dict$get,
					assignment._package,
					$author$project$PubGrub$Internal$Incompatibility$asDict(incompat));
				if (_v3.$ === 'Just') {
					var term = _v3.a;
					return $author$project$Utils$Found(
						_Utils_Tuple3(
							assignment,
							$author$project$PubGrub$Internal$PartialSolution$PartialSolution(earlier),
							term));
				} else {
					return $author$project$Utils$Stop;
				}
			} else {
				return $author$project$Utils$KeepGoRight(
					A2($elm$core$Basics$max, 1, (right / 2) | 0));
			}
		} else {
			return (!left) ? $author$project$Utils$Stop : $author$project$Utils$GoLeft(
				A2($elm$core$Basics$max, 1, (left / 2) | 0));
		}
	});
var $author$project$PubGrub$Internal$PartialSolution$findPreviousSatisfier = F3(
	function (satisfier, incompat, _v0) {
		var earlierPartial = _v0.a;
		var buildMemory = F2(
			function (assignment, earlierMemory) {
				return A2(
					$author$project$PubGrub$Internal$Memory$addAssignment,
					satisfier,
					A2($author$project$PubGrub$Internal$Memory$addAssignment, assignment, earlierMemory));
			});
		return A2(
			$author$project$Utils$find,
			A2($author$project$PubGrub$Internal$PartialSolution$searchSatisfier, incompat, buildMemory),
			earlierPartial);
	});
var $author$project$PubGrub$Internal$PartialSolution$findSatisfier = F2(
	function (incompat, _v0) {
		var partial = _v0.a;
		var _v1 = A2(
			$author$project$Utils$find,
			A2($author$project$PubGrub$Internal$PartialSolution$searchSatisfier, incompat, $author$project$PubGrub$Internal$Memory$addAssignment),
			partial);
		if (_v1.$ === 'Just') {
			var x = _v1.a;
			return x;
		} else {
			return _Debug_todo(
				'PubGrub.Internal.PartialSolution',
				{
					start: {line: 248, column: 13},
					end: {line: 248, column: 23}
				})('should always find something');
		}
	});
var $author$project$PubGrub$Internal$Report$addLine = F2(
	function (line, accum) {
		return _Utils_update(
			accum,
			{
				lines: A2($elm$core$List$cons, line, accum.lines)
			});
	});
var $author$project$PubGrub$Internal$Report$appendLineRef = F2(
	function (lineRef, lines) {
		if (!lines.b) {
			return _List_Nil;
		} else {
			var latestLine = lines.a;
			var olderLines = lines.b;
			return A2(
				$elm$core$List$cons,
				latestLine + (' (' + ($elm$core$String$fromInt(lineRef) + ')')),
				olderLines);
		}
	});
var $author$project$PubGrub$Internal$Report$addLineRef = function (_v0) {
	var refCount = _v0.refCount;
	var sharedWithRef = _v0.sharedWithRef;
	var lines = _v0.lines;
	return _Utils_Tuple2(
		{
			lines: A2($author$project$PubGrub$Internal$Report$appendLineRef, refCount + 1, lines),
			refCount: refCount + 1,
			sharedWithRef: sharedWithRef
		},
		refCount + 1);
};
var $pzp1997$assoc_list$AssocList$D = function (a) {
	return {$: 'D', a: a};
};
var $pzp1997$assoc_list$AssocList$get = F2(
	function (targetKey, _v0) {
		get:
		while (true) {
			var alist = _v0.a;
			if (!alist.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v2 = alist.a;
				var key = _v2.a;
				var value = _v2.b;
				var rest = alist.b;
				if (_Utils_eq(key, targetKey)) {
					return $elm$core$Maybe$Just(value);
				} else {
					var $temp$targetKey = targetKey,
						$temp$_v0 = $pzp1997$assoc_list$AssocList$D(rest);
					targetKey = $temp$targetKey;
					_v0 = $temp$_v0;
					continue get;
				}
			}
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $pzp1997$assoc_list$AssocList$remove = F2(
	function (targetKey, _v0) {
		var alist = _v0.a;
		return $pzp1997$assoc_list$AssocList$D(
			A2(
				$elm$core$List$filter,
				function (_v1) {
					var key = _v1.a;
					return !_Utils_eq(key, targetKey);
				},
				alist));
	});
var $pzp1997$assoc_list$AssocList$insert = F3(
	function (key, value, dict) {
		var _v0 = A2($pzp1997$assoc_list$AssocList$remove, key, dict);
		var alteredAlist = _v0.a;
		return $pzp1997$assoc_list$AssocList$D(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(key, value),
				alteredAlist));
	});
var $author$project$PubGrub$Internal$Report$updateSharedRef = F3(
	function (incompat, lineRef, accum) {
		var sharedWithRef = accum.sharedWithRef;
		return _Utils_update(
			accum,
			{
				sharedWithRef: A3($pzp1997$assoc_list$AssocList$insert, incompat, lineRef, sharedWithRef)
			});
	});
var $author$project$PubGrub$Internal$Report$addLineRefIfNoneYet = F2(
	function (incompat, accum) {
		var _v0 = A2($pzp1997$assoc_list$AssocList$get, incompat, accum.sharedWithRef);
		if (_v0.$ === 'Nothing') {
			return function (_v1) {
				var acc = _v1.a;
				var lineRef = _v1.b;
				return A3($author$project$PubGrub$Internal$Report$updateSharedRef, incompat, lineRef, acc);
			}(
				$author$project$PubGrub$Internal$Report$addLineRef(accum));
		} else {
			return accum;
		}
	});
var $author$project$PubGrub$Internal$Report$dependenceReport = F5(
	function (_package, range, liaison, dependency, depRange) {
		return (_package + (' ' + $author$project$PubGrub$Range$toDebugString(range))) + (liaison + (dependency + (' ' + $author$project$PubGrub$Range$toDebugString(depRange))));
	});
var $author$project$PubGrub$Internal$Report$incompatReport = F2(
	function (liaison, incompat) {
		_v0$5:
		while (true) {
			if (incompat.b) {
				if (incompat.a.b.$ === 'Positive') {
					if (incompat.b.b) {
						if ((incompat.b.a.b.$ === 'Negative') && (!incompat.b.b.b)) {
							var _v1 = incompat.a;
							var _package = _v1.a;
							var range = _v1.b.a;
							var _v2 = incompat.b;
							var _v3 = _v2.a;
							var dependency = _v3.a;
							var depRange = _v3.b.a;
							return A5($author$project$PubGrub$Internal$Report$dependenceReport, _package, range, liaison, dependency, depRange);
						} else {
							break _v0$5;
						}
					} else {
						var _v7 = incompat.a;
						var _package = _v7.a;
						var range = _v7.b.a;
						return _package + (' ' + ($author$project$PubGrub$Range$toDebugString(range) + ' is forbidden'));
					}
				} else {
					if (incompat.b.b) {
						if ((incompat.b.a.b.$ === 'Positive') && (!incompat.b.b.b)) {
							var _v4 = incompat.a;
							var dependency = _v4.a;
							var depRange = _v4.b.a;
							var _v5 = incompat.b;
							var _v6 = _v5.a;
							var _package = _v6.a;
							var range = _v6.b.a;
							return A5($author$project$PubGrub$Internal$Report$dependenceReport, _package, range, liaison, dependency, depRange);
						} else {
							break _v0$5;
						}
					} else {
						var _v8 = incompat.a;
						var _package = _v8.a;
						var range = _v8.b.a;
						return _package + (' ' + ($author$project$PubGrub$Range$toDebugString(range) + ' is mandatory'));
					}
				}
			} else {
				return 'no package can be selected';
			}
		}
		return function (terms) {
			return terms + ' are incompatible';
		}(
			A2(
				$elm$core$String$join,
				', ',
				A2(
					$elm$core$List$map,
					function (_v9) {
						var p = _v9.a;
						var t = _v9.b;
						return p + (' ' + $author$project$PubGrub$Internal$Term$toDebugString(t));
					},
					incompat)));
	});
var $author$project$PubGrub$Internal$Report$externalReport = F3(
	function (liaison, incompat, kind) {
		switch (kind.$) {
			case 'NoVersion':
				return A2($author$project$PubGrub$Internal$Report$incompatReport, liaison, incompat) + ' (no version)';
			case 'UnavailableDependencies':
				return A2($author$project$PubGrub$Internal$Report$incompatReport, liaison, incompat) + ' (dependencies unavailable)';
			default:
				return A2($author$project$PubGrub$Internal$Report$incompatReport, liaison, incompat);
		}
	});
var $author$project$PubGrub$Internal$Report$andExplainExternal = F3(
	function (external, kind, consequence) {
		return 'And because ' + (A3($author$project$PubGrub$Internal$Report$externalReport, ' depends on ', external, kind) + (', ' + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' requires ', consequence) + '.')));
	});
var $author$project$PubGrub$Internal$Report$andExplainPriorAndExternal = F5(
	function (priorExternal, pKind, external, kind, consequence) {
		return 'And because ' + (A3($author$project$PubGrub$Internal$Report$externalReport, ' depends on ', priorExternal, pKind) + (' and ' + (A3($author$project$PubGrub$Internal$Report$externalReport, ' depends on ', external, kind) + (', ' + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' requires ', consequence) + '.')))));
	});
var $author$project$PubGrub$Internal$Report$andExplainRef = F3(
	function (ref, derived, consequence) {
		return 'And because ' + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' depends on ', derived) + ((' (' + ($elm$core$String$fromInt(ref) + '), ')) + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' requires ', consequence) + '.')));
	});
var $author$project$PubGrub$Internal$Report$explainBothExternal = F5(
	function (external1, k1, external2, k2, consequence) {
		return 'Because ' + (A3($author$project$PubGrub$Internal$Report$externalReport, ' depends on ', external1, k1) + (' and ' + (A3($author$project$PubGrub$Internal$Report$externalReport, ' depends on ', external2, k2) + (', ' + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' requires ', consequence) + '.')))));
	});
var $author$project$PubGrub$Internal$Report$explainBothRef = F5(
	function (ref1, derived1, ref2, derived2, consequence) {
		return 'Because ' + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' depends on ', derived1) + ((' (' + ($elm$core$String$fromInt(ref1) + ') and ')) + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' depends on ', derived2) + ((' (' + ($elm$core$String$fromInt(ref2) + '), ')) + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' requires ', consequence) + '.')))));
	});
var $author$project$PubGrub$Internal$Report$explainRefAndExternal = F5(
	function (ref, derived, external, kind, consequence) {
		return 'Because ' + (A3($author$project$PubGrub$Internal$Report$externalReport, ' depends on ', external, kind) + (' and ' + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' depends on ', derived) + ((' (' + ($elm$core$String$fromInt(ref) + '), ')) + (A2($author$project$PubGrub$Internal$Report$incompatReport, ' requires ', consequence) + '.')))));
	});
var $author$project$PubGrub$Internal$Report$getLineRef = F2(
	function (derived, _v0) {
		var sharedWithRef = _v0.sharedWithRef;
		return derived.shared ? A2($pzp1997$assoc_list$AssocList$get, derived.incompat, sharedWithRef) : $elm$core$Maybe$Nothing;
	});
var $author$project$PubGrub$Internal$Report$buildFromDerived = F2(
	function (derived, accum) {
		return derived.shared ? A2(
			$author$project$PubGrub$Internal$Report$addLineRefIfNoneYet,
			derived.incompat,
			A2($author$project$PubGrub$Internal$Report$buildFromHelper, derived, accum)) : A2($author$project$PubGrub$Internal$Report$buildFromHelper, derived, accum);
	});
var $author$project$PubGrub$Internal$Report$buildFromHelper = F2(
	function (current, accum) {
		var incompat = current.incompat;
		var cause1 = current.cause1;
		var cause2 = current.cause2;
		var _v4 = _Utils_Tuple2(cause1, cause2);
		if (_v4.a.$ === 'External') {
			if (_v4.b.$ === 'External') {
				var _v5 = _v4.a;
				var external1 = _v5.a;
				var k1 = _v5.b;
				var _v6 = _v4.b;
				var external2 = _v6.a;
				var k2 = _v6.b;
				return A2(
					$author$project$PubGrub$Internal$Report$addLine,
					A5($author$project$PubGrub$Internal$Report$explainBothExternal, external1, k1, external2, k2, incompat),
					accum);
			} else {
				var _v8 = _v4.a;
				var external = _v8.a;
				var kind = _v8.b;
				var derived = _v4.b.a;
				return A5($author$project$PubGrub$Internal$Report$reportOneEach, derived, external, kind, incompat, accum);
			}
		} else {
			if (_v4.b.$ === 'External') {
				var derived = _v4.a.a;
				var _v7 = _v4.b;
				var external = _v7.a;
				var kind = _v7.b;
				return A5($author$project$PubGrub$Internal$Report$reportOneEach, derived, external, kind, incompat, accum);
			} else {
				var derived1 = _v4.a.a;
				var derived2 = _v4.b.a;
				var _v9 = _Utils_Tuple2(
					A2($author$project$PubGrub$Internal$Report$getLineRef, derived1, accum),
					A2($author$project$PubGrub$Internal$Report$getLineRef, derived2, accum));
				if (_v9.a.$ === 'Just') {
					if (_v9.b.$ === 'Just') {
						var ref1 = _v9.a.a;
						var ref2 = _v9.b.a;
						return A2(
							$author$project$PubGrub$Internal$Report$addLine,
							A5($author$project$PubGrub$Internal$Report$explainBothRef, ref1, derived1.incompat, ref2, derived2.incompat, incompat),
							accum);
					} else {
						var ref = _v9.a.a;
						var _v10 = _v9.b;
						return A2(
							$author$project$PubGrub$Internal$Report$addLine,
							A3($author$project$PubGrub$Internal$Report$andExplainRef, ref, derived1.incompat, incompat),
							A2($author$project$PubGrub$Internal$Report$buildFromDerived, derived2, accum));
					}
				} else {
					if (_v9.b.$ === 'Just') {
						var _v11 = _v9.a;
						var ref = _v9.b.a;
						return A2(
							$author$project$PubGrub$Internal$Report$addLine,
							A3($author$project$PubGrub$Internal$Report$andExplainRef, ref, derived2.incompat, incompat),
							A2($author$project$PubGrub$Internal$Report$buildFromDerived, derived1, accum));
					} else {
						var _v12 = _v9.a;
						var _v13 = _v9.b;
						if (derived1.shared) {
							return A2(
								$author$project$PubGrub$Internal$Report$buildFromDerived,
								current,
								A2(
									$author$project$PubGrub$Internal$Report$addLine,
									'',
									A2($author$project$PubGrub$Internal$Report$buildFromDerived, derived1, accum)));
						} else {
							var _v14 = $author$project$PubGrub$Internal$Report$addLineRef(
								A2($author$project$PubGrub$Internal$Report$buildFromDerived, derived1, accum));
							var newAccum = _v14.a;
							var lineRef = _v14.b;
							return A2(
								$author$project$PubGrub$Internal$Report$addLine,
								A3($author$project$PubGrub$Internal$Report$andExplainRef, lineRef, derived1.incompat, incompat),
								A2(
									$author$project$PubGrub$Internal$Report$buildFromDerived,
									derived2,
									A2($author$project$PubGrub$Internal$Report$addLine, '', newAccum)));
						}
					}
				}
			}
		}
	});
var $author$project$PubGrub$Internal$Report$reportOneEach = F5(
	function (derived, external, kind, incompat, accum) {
		var _v3 = A2($author$project$PubGrub$Internal$Report$getLineRef, derived, accum);
		if (_v3.$ === 'Just') {
			var ref = _v3.a;
			return A2(
				$author$project$PubGrub$Internal$Report$addLine,
				A5($author$project$PubGrub$Internal$Report$explainRefAndExternal, ref, derived.incompat, external, kind, incompat),
				accum);
		} else {
			return A5($author$project$PubGrub$Internal$Report$reportRecurseOneEach, derived, external, kind, incompat, accum);
		}
	});
var $author$project$PubGrub$Internal$Report$reportRecurseOneEach = F5(
	function (derived, external, kind, incompat, accum) {
		var _v0 = _Utils_Tuple2(derived.cause1, derived.cause2);
		_v0$2:
		while (true) {
			if (_v0.a.$ === 'Derived') {
				if (_v0.b.$ === 'External') {
					var priorDerived = _v0.a.a;
					var _v1 = _v0.b;
					var priorExternal = _v1.a;
					var pKind = _v1.b;
					return A2(
						$author$project$PubGrub$Internal$Report$addLine,
						A5($author$project$PubGrub$Internal$Report$andExplainPriorAndExternal, priorExternal, pKind, external, kind, incompat),
						A2($author$project$PubGrub$Internal$Report$buildFromDerived, priorDerived, accum));
				} else {
					break _v0$2;
				}
			} else {
				if (_v0.b.$ === 'Derived') {
					var _v2 = _v0.a;
					var priorExternal = _v2.a;
					var pKind = _v2.b;
					var priorDerived = _v0.b.a;
					return A2(
						$author$project$PubGrub$Internal$Report$addLine,
						A5($author$project$PubGrub$Internal$Report$andExplainPriorAndExternal, priorExternal, pKind, external, kind, incompat),
						A2($author$project$PubGrub$Internal$Report$buildFromDerived, priorDerived, accum));
				} else {
					break _v0$2;
				}
			}
		}
		return A2(
			$author$project$PubGrub$Internal$Report$addLine,
			A3($author$project$PubGrub$Internal$Report$andExplainExternal, external, kind, incompat),
			A2($author$project$PubGrub$Internal$Report$buildFromDerived, derived, accum));
	});
var $author$project$PubGrub$Internal$Report$explainExternal = F2(
	function (external, kind) {
		return A3($author$project$PubGrub$Internal$Report$externalReport, ' requires ', external, kind);
	});
var $author$project$PubGrub$Internal$Report$buildFromTree = F2(
	function (tree, accum) {
		if (tree.$ === 'Derived') {
			var derived = tree.a;
			return A2($author$project$PubGrub$Internal$Report$buildFromDerived, derived, accum);
		} else {
			var external = tree.a;
			var kind = tree.b;
			return A2(
				$author$project$PubGrub$Internal$Report$addLine,
				A2($author$project$PubGrub$Internal$Report$explainExternal, external, kind),
				accum);
		}
	});
var $pzp1997$assoc_list$AssocList$empty = $pzp1997$assoc_list$AssocList$D(_List_Nil);
var $author$project$PubGrub$Internal$Report$generate = function (tree) {
	return A2(
		$elm$core$String$join,
		'\n',
		$elm$core$List$reverse(
			A2(
				$author$project$PubGrub$Internal$Report$buildFromTree,
				tree,
				{lines: _List_Nil, refCount: 0, sharedWithRef: $pzp1997$assoc_list$AssocList$empty}).lines));
};
var $author$project$PubGrub$Internal$Incompatibility$isTerminal = F2(
	function (rootPackage, _v0) {
		var incompat = _v0.a;
		var _v1 = incompat.asList;
		if (!_v1.b) {
			return true;
		} else {
			if ((_v1.a.b.$ === 'Positive') && (!_v1.b.b)) {
				var _v2 = _v1.a;
				var _package = _v2.a;
				return _Utils_eq(_package, rootPackage);
			} else {
				return false;
			}
		}
	});
var $author$project$PubGrub$Internal$Incompatibility$DerivedFrom = F2(
	function (a, b) {
		return {$: 'DerivedFrom', a: a, b: b};
	});
var $author$project$PubGrub$Internal$Incompatibility$empty = function (kind) {
	return A2(
		$author$project$PubGrub$Internal$Incompatibility$Incompatibility,
		{asDict: $elm$core$Dict$empty, asList: _List_Nil},
		kind);
};
var $author$project$PubGrub$Internal$Incompatibility$insert = F3(
	function (name, term, _v0) {
		var incompat = _v0.a;
		var kind = _v0.b;
		return A2(
			$author$project$PubGrub$Internal$Incompatibility$Incompatibility,
			{
				asDict: A3($elm$core$Dict$insert, name, term, incompat.asDict),
				asList: A2(
					$elm$core$List$cons,
					_Utils_Tuple2(name, term),
					incompat.asList)
			},
			kind);
	});
var $author$project$PubGrub$Internal$Term$negate = function (term) {
	if (term.$ === 'Positive') {
		var range = term.a;
		return $author$project$PubGrub$Internal$Term$Negative(range);
	} else {
		var range = term.a;
		return $author$project$PubGrub$Internal$Term$Positive(range);
	}
};
var $author$project$PubGrub$Internal$Term$union = F2(
	function (t1, t2) {
		return $author$project$PubGrub$Internal$Term$negate(
			A2(
				$author$project$PubGrub$Internal$Term$intersection,
				$author$project$PubGrub$Internal$Term$negate(t1),
				$author$project$PubGrub$Internal$Term$negate(t2)));
	});
var $author$project$PubGrub$Internal$Incompatibility$fuse = F4(
	function (name, t1, t2, incompatibility) {
		var termUnion = A2($author$project$PubGrub$Internal$Term$union, t1, t2);
		return _Utils_eq(
			termUnion,
			$author$project$PubGrub$Internal$Term$Negative($author$project$PubGrub$Range$none)) ? incompatibility : A3($author$project$PubGrub$Internal$Incompatibility$insert, name, termUnion, incompatibility);
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $author$project$PubGrub$Internal$Incompatibility$union = F3(
	function (i1, i2, kind) {
		return A6(
			$elm$core$Dict$merge,
			$author$project$PubGrub$Internal$Incompatibility$insert,
			$author$project$PubGrub$Internal$Incompatibility$fuse,
			$author$project$PubGrub$Internal$Incompatibility$insert,
			i1,
			i2,
			$author$project$PubGrub$Internal$Incompatibility$empty(kind));
	});
var $author$project$PubGrub$Internal$Incompatibility$priorCause = F2(
	function (i1, i2) {
		var cause = i1.a;
		var incompat = i2.a;
		return A3(
			$author$project$PubGrub$Internal$Incompatibility$union,
			cause.asDict,
			incompat.asDict,
			A2($author$project$PubGrub$Internal$Incompatibility$DerivedFrom, i1, i2));
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$PubGrub$Internal$Assignment$encodeDebug = function (_v0) {
	var _package = _v0._package;
	var decisionLevel = _v0.decisionLevel;
	var kind = _v0.kind;
	if (kind.$ === 'Decision') {
		var version = kind.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'kind',
					$elm$json$Json$Encode$string('Decision')),
					_Utils_Tuple2(
					'package',
					$elm$json$Json$Encode$string(_package)),
					_Utils_Tuple2(
					'decisionLevel',
					$elm$json$Json$Encode$int(decisionLevel)),
					_Utils_Tuple2(
					'version',
					$elm$json$Json$Encode$string(
						$author$project$PubGrub$Version$toDebugString(version)))
				]));
	} else {
		var term = kind.a;
		var cause = kind.b.cause;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'kind',
					$elm$json$Json$Encode$string('Derivation')),
					_Utils_Tuple2(
					'package',
					$elm$json$Json$Encode$string(_package)),
					_Utils_Tuple2(
					'decisionLevel',
					$elm$json$Json$Encode$int(decisionLevel)),
					_Utils_Tuple2(
					'term',
					$elm$json$Json$Encode$string(
						$author$project$PubGrub$Internal$Term$toDebugString(term))),
					_Utils_Tuple2(
					'cause',
					$elm$json$Json$Encode$string(
						A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, 1, 0, cause)))
				]));
	}
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$PubGrub$Internal$PartialSolution$encode = function (_v0) {
	var partial = _v0.a;
	return A2(
		$elm$json$Json$Encode$list,
		A2($elm$core$Basics$composeL, $author$project$PubGrub$Internal$Assignment$encodeDebug, $elm$core$Tuple$first),
		partial);
};
var $author$project$PubGrub$Internal$PartialSolution$toDebugString = function (partial) {
	return A2(
		$elm$json$Json$Encode$encode,
		2,
		$author$project$PubGrub$Internal$PartialSolution$encode(partial));
};
var $pzp1997$assoc_list$AssocList$member = F2(
	function (targetKey, dict) {
		var _v0 = A2($pzp1997$assoc_list$AssocList$get, targetKey, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $author$project$PubGrub$Internal$Incompatibility$sharedNodes = F2(
	function (_v0, seenAndShared) {
		var asList = _v0.a.asList;
		var kind = _v0.b;
		if (kind.$ === 'DerivedFrom') {
			var i1 = kind.a;
			var i2 = kind.b;
			var _v2 = A2(
				$author$project$PubGrub$Internal$Incompatibility$sharedNodes,
				i1,
				A2($author$project$PubGrub$Internal$Incompatibility$sharedNodes, i2, seenAndShared));
			var seen = _v2.a;
			var shared = _v2.b;
			return A2($pzp1997$assoc_list$AssocList$member, asList, seen) ? _Utils_Tuple2(
				seen,
				A3($pzp1997$assoc_list$AssocList$insert, asList, _Utils_Tuple0, shared)) : _Utils_Tuple2(
				A3($pzp1997$assoc_list$AssocList$insert, asList, _Utils_Tuple0, seen),
				shared);
		} else {
			return seenAndShared;
		}
	});
var $author$project$PubGrub$Internal$Report$Dependencies = {$: 'Dependencies'};
var $author$project$PubGrub$Internal$Report$Derived = function (a) {
	return {$: 'Derived', a: a};
};
var $author$project$PubGrub$Internal$Report$External = F2(
	function (a, b) {
		return {$: 'External', a: a, b: b};
	});
var $author$project$PubGrub$Internal$Report$NoVersion = {$: 'NoVersion'};
var $author$project$PubGrub$Internal$Report$UnavailableDependencies = {$: 'UnavailableDependencies'};
var $author$project$PubGrub$Internal$Incompatibility$toReportTreeHelper = F2(
	function (shared, _v0) {
		var asList = _v0.a.asList;
		var kind = _v0.b;
		switch (kind.$) {
			case 'DerivedFrom':
				var i1 = kind.a;
				var i2 = kind.b;
				var t2 = A2($author$project$PubGrub$Internal$Incompatibility$toReportTreeHelper, shared, i2);
				var t1 = A2($author$project$PubGrub$Internal$Incompatibility$toReportTreeHelper, shared, i1);
				return $author$project$PubGrub$Internal$Report$Derived(
					{
						cause1: t1,
						cause2: t2,
						incompat: asList,
						shared: A2($pzp1997$assoc_list$AssocList$member, asList, shared)
					});
			case 'NoVersion':
				return A2($author$project$PubGrub$Internal$Report$External, asList, $author$project$PubGrub$Internal$Report$NoVersion);
			case 'UnavailableDependencies':
				return A2($author$project$PubGrub$Internal$Report$External, asList, $author$project$PubGrub$Internal$Report$UnavailableDependencies);
			case 'FromDependencyOf':
				return A2($author$project$PubGrub$Internal$Report$External, asList, $author$project$PubGrub$Internal$Report$Dependencies);
			default:
				return _Debug_todo(
					'PubGrub.Internal.Incompatibility',
					{
						start: {line: 417, column: 13},
						end: {line: 417, column: 23}
					})('This should not appear in the report tree');
		}
	});
var $author$project$PubGrub$Internal$Incompatibility$toReportTree = function (incompat) {
	var _v0 = A2(
		$author$project$PubGrub$Internal$Incompatibility$sharedNodes,
		incompat,
		_Utils_Tuple2($pzp1997$assoc_list$AssocList$empty, $pzp1997$assoc_list$AssocList$empty));
	var shared = _v0.b;
	return A2($author$project$PubGrub$Internal$Incompatibility$toReportTreeHelper, shared, incompat);
};
var $author$project$PubGrub$Internal$Core$conflictResolution = F4(
	function (incompatChanged, root, incompat, model) {
		conflictResolution:
		while (true) {
			if (A2($author$project$PubGrub$Internal$Incompatibility$isTerminal, root, incompat)) {
				var explanation = $author$project$PubGrub$Internal$Report$generate(
					$author$project$PubGrub$Internal$Incompatibility$toReportTree(incompat));
				var _v0 = A2(
					$elm$core$Debug$log,
					'Final incompatibility:\n' + A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, -1, 3, incompat),
					'');
				var _v1 = A2($elm$core$Debug$log, 'Model incompatibilities:', '');
				var _v2 = A2(
					$elm$core$List$map,
					function (i) {
						return A2(
							$elm$core$Debug$log,
							A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, 1, 3, i),
							'');
					},
					model.incompatibilities);
				var _v3 = A2(
					$elm$core$Debug$log,
					'Model partial solution:' + $author$project$PubGrub$Internal$PartialSolution$toDebugString(model.partialSolution),
					'');
				var _v4 = A2($elm$core$Debug$log, 'Textual explanation:\n' + explanation, '');
				return $elm$core$Result$Err(explanation);
			} else {
				var _v5 = A2($author$project$PubGrub$Internal$PartialSolution$findSatisfier, incompat, model.partialSolution);
				var satisfier = _v5.a;
				var earlierPartial = _v5.b;
				var term = _v5.c;
				var maybePreviousSatisfier = A3($author$project$PubGrub$Internal$PartialSolution$findPreviousSatisfier, satisfier, incompat, earlierPartial);
				var previousSatisfierLevel = A2(
					$elm$core$Maybe$withDefault,
					1,
					A2(
						$elm$core$Maybe$map,
						$elm$core$Basics$max(1),
						A2(
							$elm$core$Maybe$map,
							function (_v14) {
								var a = _v14.a;
								return a.decisionLevel;
							},
							maybePreviousSatisfier)));
				var _v6 = satisfier.kind;
				if (_v6.$ === 'Decision') {
					return $elm$core$Result$Ok(
						_Utils_Tuple2(
							incompat,
							A4($author$project$PubGrub$Internal$Core$backtrack, incompatChanged, previousSatisfierLevel, incompat, model)));
				} else {
					var satisfierTerm = _v6.a;
					var cause = _v6.b.cause;
					if (!_Utils_eq(previousSatisfierLevel, satisfier.decisionLevel)) {
						var _v7 = A2($elm$core$Debug$log, 'previousLevel /= satisfierLevel', '');
						var _v8 = A2(
							$elm$core$Debug$log,
							A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, -1, 3, incompat),
							'');
						return $elm$core$Result$Ok(
							_Utils_Tuple2(
								incompat,
								A4($author$project$PubGrub$Internal$Core$backtrack, incompatChanged, previousSatisfierLevel, incompat, model)));
					} else {
						var priorCause = A2($author$project$PubGrub$Internal$Incompatibility$priorCause, cause, incompat);
						var _v9 = A2($elm$core$Debug$log, 'previousLevel == satisfierLevel', '');
						var _v10 = A2(
							$elm$core$Debug$log,
							'   satisfier ' + (satisfier._package + (' ' + $author$project$PubGrub$Internal$Term$toDebugString(satisfierTerm))),
							'');
						var _v11 = A2(
							$elm$core$Debug$log,
							'   cause\n' + A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, -1, 6, cause),
							'');
						var _v12 = A2(
							$elm$core$Debug$log,
							'   incompat\n' + A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, -1, 6, incompat),
							'');
						var _v13 = A2(
							$elm$core$Debug$log,
							'   priorCause\n' + A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, -1, 3, priorCause),
							'');
						var $temp$incompatChanged = true,
							$temp$root = root,
							$temp$incompat = priorCause,
							$temp$model = model;
						incompatChanged = $temp$incompatChanged;
						root = $temp$root;
						incompat = $temp$incompat;
						model = $temp$model;
						continue conflictResolution;
					}
				}
			}
		}
	});
var $author$project$PubGrub$Internal$Core$mapPartialSolution = F2(
	function (f, _v0) {
		var incompatibilities = _v0.incompatibilities;
		var partialSolution = _v0.partialSolution;
		return {
			incompatibilities: incompatibilities,
			partialSolution: f(partialSolution)
		};
	});
var $author$project$PubGrub$Internal$Assignment$Derivation = F2(
	function (a, b) {
		return {$: 'Derivation', a: a, b: b};
	});
var $author$project$PubGrub$Internal$Assignment$newDerivation = F4(
	function (_package, term, decisionLevel, cause) {
		return {
			decisionLevel: decisionLevel,
			kind: A2(
				$author$project$PubGrub$Internal$Assignment$Derivation,
				term,
				{cause: cause}),
			_package: _package
		};
	});
var $author$project$PubGrub$Internal$PartialSolution$prependDerivation = F4(
	function (_package, term, cause, _v0) {
		var partial = _v0.a;
		if (!partial.b) {
			return $author$project$PubGrub$Internal$PartialSolution$PartialSolution(
				_List_fromArray(
					[
						_Utils_Tuple2(
						A4($author$project$PubGrub$Internal$Assignment$newDerivation, _package, term, 0, cause),
						A2(
							$elm$core$Dict$singleton,
							_package,
							{
								decision: $elm$core$Maybe$Nothing,
								derivations: _List_fromArray(
									[term])
							}))
					]));
		} else {
			var _v2 = partial.a;
			var decisionLevel = _v2.a.decisionLevel;
			var memory = _v2.b;
			var newMemory = A3($author$project$PubGrub$Internal$Memory$addDerivation, _package, term, memory);
			var derivation = A4($author$project$PubGrub$Internal$Assignment$newDerivation, _package, term, decisionLevel, cause);
			var _v3 = A2(
				$elm$core$Debug$log,
				'Derivation : ' + (_package + (' : ' + $author$project$PubGrub$Internal$Term$toDebugString(term))),
				'');
			return $author$project$PubGrub$Internal$PartialSolution$PartialSolution(
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(derivation, newMemory),
					partial));
		}
	});
var $author$project$PubGrub$Internal$PartialSolution$relation = F2(
	function (incompatibility, _v0) {
		var partial = _v0.a;
		if (!partial.b) {
			return A2($author$project$PubGrub$Internal$Incompatibility$relation, $elm$core$Dict$empty, incompatibility);
		} else {
			var _v2 = partial.a;
			var memory = _v2.b;
			return A2(
				$author$project$PubGrub$Internal$Incompatibility$relation,
				$author$project$PubGrub$Internal$Memory$terms(memory),
				incompatibility);
		}
	});
var $author$project$PubGrub$Internal$Core$unitPropagationLoop = F5(
	function (root, _package, changed, loopIncompatibilities, model) {
		unitPropagationLoop:
		while (true) {
			if (!loopIncompatibilities.b) {
				if (!changed.b) {
					return $elm$core$Result$Ok(model);
				} else {
					var pack = changed.a;
					var othersChanged = changed.b;
					var $temp$root = root,
						$temp$package = pack,
						$temp$changed = othersChanged,
						$temp$loopIncompatibilities = model.incompatibilities,
						$temp$model = model;
					root = $temp$root;
					_package = $temp$package;
					changed = $temp$changed;
					loopIncompatibilities = $temp$loopIncompatibilities;
					model = $temp$model;
					continue unitPropagationLoop;
				}
			} else {
				var incompat = loopIncompatibilities.a;
				var othersIncompat = loopIncompatibilities.b;
				if (A2(
					$elm$core$Dict$member,
					_package,
					$author$project$PubGrub$Internal$Incompatibility$asDict(incompat))) {
					var _v2 = A2($author$project$PubGrub$Internal$PartialSolution$relation, incompat, model.partialSolution);
					switch (_v2.$) {
						case 'Satisfies':
							var _v3 = A4($author$project$PubGrub$Internal$Core$conflictResolution, false, root, incompat, model);
							if (_v3.$ === 'Err') {
								var msg = _v3.a;
								return $elm$core$Result$Err(msg);
							} else {
								var _v4 = _v3.a;
								var rootCause = _v4.a;
								var updatedModel = _v4.b;
								var _v5 = A2($author$project$PubGrub$Internal$PartialSolution$relation, rootCause, updatedModel.partialSolution);
								if (_v5.$ === 'AlmostSatisfies') {
									var name = _v5.a;
									var term = _v5.b;
									var updatedAgainModel = A2(
										$author$project$PubGrub$Internal$Core$mapPartialSolution,
										A3(
											$author$project$PubGrub$Internal$PartialSolution$prependDerivation,
											name,
											$author$project$PubGrub$Internal$Term$negate(term),
											rootCause),
										updatedModel);
									var $temp$root = root,
										$temp$package = _package,
										$temp$changed = _List_fromArray(
										[name]),
										$temp$loopIncompatibilities = othersIncompat,
										$temp$model = updatedAgainModel;
									root = $temp$root;
									_package = $temp$package;
									changed = $temp$changed;
									loopIncompatibilities = $temp$loopIncompatibilities;
									model = $temp$model;
									continue unitPropagationLoop;
								} else {
									return $elm$core$Result$Err('This should never happen, rootCause is guaranted to be almost satisfied by the partial solution');
								}
							}
						case 'AlmostSatisfies':
							var name = _v2.a;
							var term = _v2.b;
							var updatedModel = A2(
								$author$project$PubGrub$Internal$Core$mapPartialSolution,
								A3(
									$author$project$PubGrub$Internal$PartialSolution$prependDerivation,
									name,
									$author$project$PubGrub$Internal$Term$negate(term),
									incompat),
								model);
							var $temp$root = root,
								$temp$package = _package,
								$temp$changed = A2($elm$core$List$cons, name, changed),
								$temp$loopIncompatibilities = othersIncompat,
								$temp$model = updatedModel;
							root = $temp$root;
							_package = $temp$package;
							changed = $temp$changed;
							loopIncompatibilities = $temp$loopIncompatibilities;
							model = $temp$model;
							continue unitPropagationLoop;
						default:
							var $temp$root = root,
								$temp$package = _package,
								$temp$changed = changed,
								$temp$loopIncompatibilities = othersIncompat,
								$temp$model = model;
							root = $temp$root;
							_package = $temp$package;
							changed = $temp$changed;
							loopIncompatibilities = $temp$loopIncompatibilities;
							model = $temp$model;
							continue unitPropagationLoop;
					}
				} else {
					var $temp$root = root,
						$temp$package = _package,
						$temp$changed = changed,
						$temp$loopIncompatibilities = othersIncompat,
						$temp$model = model;
					root = $temp$root;
					_package = $temp$package;
					changed = $temp$changed;
					loopIncompatibilities = $temp$loopIncompatibilities;
					model = $temp$model;
					continue unitPropagationLoop;
				}
			}
		}
	});
var $author$project$PubGrub$Internal$Core$unitPropagation = F3(
	function (root, _package, model) {
		return A5(
			$author$project$PubGrub$Internal$Core$unitPropagationLoop,
			root,
			'',
			_List_fromArray(
				[_package]),
			_List_Nil,
			model);
	});
var $author$project$PubGrub$solveStep = F3(
	function (root, _package, pgModel) {
		var _v0 = A3($author$project$PubGrub$Internal$Core$unitPropagation, root, _package, pgModel);
		if (_v0.$ === 'Err') {
			var msg = _v0.a;
			return _Utils_Tuple2(
				$author$project$PubGrub$State(
					{pgModel: pgModel, root: root}),
				$author$project$PubGrub$SignalEnd(
					$elm$core$Result$Err(msg)));
		} else {
			var updatedModel = _v0.a;
			var _v1 = $author$project$PubGrub$Internal$Core$pickPackage(updatedModel.partialSolution);
			if (_v1.$ === 'Nothing') {
				var _v2 = $author$project$PubGrub$Internal$PartialSolution$solution(updatedModel.partialSolution);
				if (_v2.$ === 'Just') {
					var solution = _v2.a;
					return _Utils_Tuple2(
						$author$project$PubGrub$State(
							{pgModel: updatedModel, root: root}),
						$author$project$PubGrub$SignalEnd(
							$elm$core$Result$Ok(solution)));
				} else {
					return _Utils_Tuple2(
						$author$project$PubGrub$State(
							{pgModel: updatedModel, root: root}),
						$author$project$PubGrub$SignalEnd(
							$elm$core$Result$Err('How did we end up with no package to choose but no solution?')));
				}
			} else {
				var packageAndTerm = _v1.a;
				return _Utils_Tuple2(
					$author$project$PubGrub$State(
						{pgModel: updatedModel, root: root}),
					$author$project$PubGrub$ListVersions(packageAndTerm));
			}
		}
	});
var $author$project$PubGrub$Internal$Core$Model = F2(
	function (incompatibilities, partialSolution) {
		return {incompatibilities: incompatibilities, partialSolution: partialSolution};
	});
var $author$project$PubGrub$Internal$PartialSolution$doesNotSatisfy = F2(
	function (newIncompatibilities, _v0) {
		doesNotSatisfy:
		while (true) {
			var partial = _v0.a;
			var _v1 = _Utils_Tuple2(newIncompatibilities, partial);
			if (!_v1.b.b) {
				return true;
			} else {
				if (!_v1.a.b) {
					return true;
				} else {
					var _v2 = _v1.a;
					var incompat = _v2.a;
					var others = _v2.b;
					var _v3 = _v1.b;
					var _v4 = _v3.a;
					var memory = _v4.b;
					var _v5 = A2(
						$author$project$PubGrub$Internal$Incompatibility$relation,
						$author$project$PubGrub$Internal$Memory$terms(memory),
						incompat);
					if (_v5.$ === 'Satisfies') {
						return false;
					} else {
						var $temp$newIncompatibilities = others,
							$temp$_v0 = $author$project$PubGrub$Internal$PartialSolution$PartialSolution(partial);
						newIncompatibilities = $temp$newIncompatibilities;
						_v0 = $temp$_v0;
						continue doesNotSatisfy;
					}
				}
			}
		}
	});
var $author$project$PubGrub$Internal$Assignment$Decision = function (a) {
	return {$: 'Decision', a: a};
};
var $author$project$PubGrub$Internal$Assignment$newDecision = F3(
	function (_package, version, decisionLevel) {
		return {
			decisionLevel: decisionLevel,
			kind: $author$project$PubGrub$Internal$Assignment$Decision(version),
			_package: _package
		};
	});
var $author$project$PubGrub$Internal$PartialSolution$prependDecision = F3(
	function (_package, version, _v0) {
		var partial = _v0.a;
		if (!partial.b) {
			return $author$project$PubGrub$Internal$PartialSolution$PartialSolution(
				_List_fromArray(
					[
						_Utils_Tuple2(
						A3($author$project$PubGrub$Internal$Assignment$newDecision, _package, version, 0),
						A2(
							$elm$core$Dict$singleton,
							_package,
							{
								decision: $elm$core$Maybe$Just(version),
								derivations: _List_Nil
							}))
					]));
		} else {
			var _v2 = partial.a;
			var decisionLevel = _v2.a.decisionLevel;
			var memory = _v2.b;
			var newMemory = A3($author$project$PubGrub$Internal$Memory$addDecision, _package, version, memory);
			var decision = A3($author$project$PubGrub$Internal$Assignment$newDecision, _package, version, decisionLevel + 1);
			var _v3 = A2(
				$elm$core$Debug$log,
				'Decision level ' + ($elm$core$String$fromInt(decisionLevel + 1) + (' : ' + (_package + (' : ' + $author$project$PubGrub$Version$toDebugString(version))))),
				'');
			return $author$project$PubGrub$Internal$PartialSolution$PartialSolution(
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(decision, newMemory),
					partial));
		}
	});
var $author$project$PubGrub$Internal$PartialSolution$addVersion = F4(
	function (_package, version, newIncompatibilities, partial) {
		var updatedPartial = A3($author$project$PubGrub$Internal$PartialSolution$prependDecision, _package, version, partial);
		return A2($author$project$PubGrub$Internal$PartialSolution$doesNotSatisfy, newIncompatibilities, updatedPartial) ? $elm$core$Maybe$Just(updatedPartial) : $elm$core$Maybe$Nothing;
	});
var $author$project$PubGrub$Internal$Incompatibility$FromDependencyOf = F2(
	function (a, b) {
		return {$: 'FromDependencyOf', a: a, b: b};
	});
var $author$project$PubGrub$Internal$Incompatibility$singleton = F3(
	function (_package, term, kind) {
		return A2(
			$author$project$PubGrub$Internal$Incompatibility$Incompatibility,
			{
				asDict: A2($elm$core$Dict$singleton, _package, term),
				asList: _List_fromArray(
					[
						_Utils_Tuple2(_package, term)
					])
			},
			kind);
	});
var $author$project$PubGrub$Internal$Incompatibility$fromDependency = F3(
	function (_package, version, _v0) {
		var depPackage = _v0.a;
		var depRange = _v0.b;
		var term = $author$project$PubGrub$Internal$Term$Positive(
			$author$project$PubGrub$Range$exact(version));
		return A3(
			$author$project$PubGrub$Internal$Incompatibility$insert,
			depPackage,
			$author$project$PubGrub$Internal$Term$Negative(depRange),
			A3(
				$author$project$PubGrub$Internal$Incompatibility$singleton,
				_package,
				term,
				A2($author$project$PubGrub$Internal$Incompatibility$FromDependencyOf, _package, version)));
	});
var $author$project$PubGrub$Internal$Incompatibility$fromDependencies = F3(
	function (_package, version, dependencies) {
		var addDependency = F2(
			function (dep, accumIncompats) {
				return A2(
					$elm$core$List$cons,
					A3($author$project$PubGrub$Internal$Incompatibility$fromDependency, _package, version, dep),
					accumIncompats);
			});
		return A3($elm$core$List$foldl, addDependency, _List_Nil, dependencies);
	});
var $author$project$PubGrub$Internal$Core$setIncompatibilities = F2(
	function (incompatibilities, model) {
		return {incompatibilities: incompatibilities, partialSolution: model.partialSolution};
	});
var $author$project$PubGrub$applyDecision = F4(
	function (dependencies, _package, version, pgModel) {
		var depIncompats = A3($author$project$PubGrub$Internal$Incompatibility$fromDependencies, _package, version, dependencies);
		var updatedIncompatibilities = A3($elm$core$List$foldr, $author$project$PubGrub$Internal$Incompatibility$merge, pgModel.incompatibilities, depIncompats);
		var _v0 = A2(
			$elm$core$Debug$log,
			'Add the following ' + ($elm$core$String$fromInt(
				$elm$core$List$length(depIncompats)) + (' incompatibilities from dependencies of ' + _package)),
			'');
		var _v1 = A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$elm$core$Debug$log,
					A3($author$project$PubGrub$Internal$Incompatibility$toDebugString, 1, 3, i),
					'');
			},
			depIncompats);
		var _v2 = A4($author$project$PubGrub$Internal$PartialSolution$addVersion, _package, version, depIncompats, pgModel.partialSolution);
		if (_v2.$ === 'Nothing') {
			return A2($author$project$PubGrub$Internal$Core$setIncompatibilities, updatedIncompatibilities, pgModel);
		} else {
			var updatedPartial = _v2.a;
			return A2($author$project$PubGrub$Internal$Core$Model, updatedIncompatibilities, updatedPartial);
		}
	});
var $author$project$PubGrub$tryUpdateCached = F2(
	function (cache, stateAndEffect) {
		if (stateAndEffect.b.$ === 'RetrieveDependencies') {
			var root = stateAndEffect.a.a.root;
			var pgModel = stateAndEffect.a.a.pgModel;
			var _v1 = stateAndEffect.b.a;
			var _package = _v1.a;
			var version = _v1.b;
			var _v2 = A3($author$project$PubGrub$Cache$listDependencies, cache, _package, version);
			if (_v2.$ === 'Just') {
				var deps = _v2.a;
				return A2(
					$author$project$PubGrub$tryUpdateCached,
					cache,
					A3(
						$author$project$PubGrub$solveStep,
						root,
						_package,
						A4($author$project$PubGrub$applyDecision, deps, _package, version, pgModel)));
			} else {
				return stateAndEffect;
			}
		} else {
			return stateAndEffect;
		}
	});
var $author$project$PubGrub$init = F3(
	function (cache, root, version) {
		return A2(
			$author$project$PubGrub$tryUpdateCached,
			cache,
			A3(
				$author$project$PubGrub$solveStep,
				root,
				root,
				A2($author$project$PubGrub$Internal$Core$init, root, version)));
	});
var $author$project$PubGrub$Version$one = $author$project$PubGrub$Version$Version(
	{major: 1, minor: 0, patch: 0});
var $author$project$PubGrub$AvailableVersions = F3(
	function (a, b, c) {
		return {$: 'AvailableVersions', a: a, b: b, c: c};
	});
var $author$project$PubGrub$PackageDependencies = F3(
	function (a, b, c) {
		return {$: 'PackageDependencies', a: a, b: b, c: c};
	});
var $author$project$Solver$ProjectSolving = F6(
	function (a, b, c, d, e, f) {
		return {$: 'ProjectSolving', a: a, b: b, c: c, d: d, e: e, f: f};
	});
var $author$project$API$GotDeps = F3(
	function (a, b, c) {
		return {$: 'GotDeps', a: a, b: b, c: c};
	});
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 'NetworkError_':
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: r.expect, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $author$project$API$getDependencies = F2(
	function (_package, version) {
		return $elm$http$Http$get(
			{
				expect: A2(
					$elm$http$Http$expectJson,
					A2($author$project$API$GotDeps, _package, version),
					$elm$project_metadata_utils$Elm$Project$decoder),
				url: 'https://cors-anywhere.herokuapp.com/' + ('https://package.elm-lang.org/packages/' + (_package + ('/' + ($author$project$PubGrub$Version$toDebugString(version) + '/elm.json'))))
			});
	});
var $author$project$PubGrub$NoEffect = {$: 'NoEffect'};
var $author$project$PubGrub$RetrieveDependencies = function (a) {
	return {$: 'RetrieveDependencies', a: a};
};
var $author$project$PubGrub$Internal$Core$mapIncompatibilities = F2(
	function (f, _v0) {
		var incompatibilities = _v0.incompatibilities;
		var partialSolution = _v0.partialSolution;
		return {
			incompatibilities: f(incompatibilities),
			partialSolution: partialSolution
		};
	});
var $author$project$PubGrub$Internal$Incompatibility$NoVersion = {$: 'NoVersion'};
var $author$project$PubGrub$Internal$Incompatibility$noVersion = F2(
	function (_package, term) {
		return A2(
			$author$project$PubGrub$Internal$Incompatibility$Incompatibility,
			{
				asDict: A2($elm$core$Dict$singleton, _package, term),
				asList: _List_fromArray(
					[
						_Utils_Tuple2(_package, term)
					])
			},
			$author$project$PubGrub$Internal$Incompatibility$NoVersion);
	});
var $author$project$PubGrub$Range$intervalsContains = F2(
	function (version, intervals) {
		intervalsContains:
		while (true) {
			if (!intervals.b) {
				return false;
			} else {
				if (intervals.a.b.$ === 'Nothing') {
					var _v1 = intervals.a;
					var start = _v1.a;
					var _v2 = _v1.b;
					return !A2($author$project$PubGrub$Version$lowerThan, start, version);
				} else {
					var _v3 = intervals.a;
					var start = _v3.a;
					var end = _v3.b.a;
					var others = intervals.b;
					var found = (!A2($author$project$PubGrub$Version$lowerThan, start, version)) && A2($author$project$PubGrub$Version$higherThan, version, end);
					if (found) {
						return true;
					} else {
						var $temp$version = version,
							$temp$intervals = others;
						version = $temp$version;
						intervals = $temp$intervals;
						continue intervalsContains;
					}
				}
			}
		}
	});
var $author$project$PubGrub$Range$contains = F2(
	function (version, _v0) {
		var intervals = _v0.a;
		return A2($author$project$PubGrub$Range$intervalsContains, version, intervals);
	});
var $author$project$PubGrub$Internal$Term$acceptVersionJust = F2(
	function (version, term) {
		if (term.$ === 'Positive') {
			var range = term.a;
			return A2($author$project$PubGrub$Range$contains, version, range);
		} else {
			var range = term.a;
			return A2(
				$author$project$PubGrub$Range$contains,
				version,
				$author$project$PubGrub$Range$negate(range));
		}
	});
var $author$project$PubGrub$Internal$Core$pickVersion = F2(
	function (availableVersions, partialSolutionTerm) {
		pickVersion:
		while (true) {
			if (!availableVersions.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var v = availableVersions.a;
				var others = availableVersions.b;
				if (A2($author$project$PubGrub$Internal$Term$acceptVersionJust, v, partialSolutionTerm)) {
					return $elm$core$Maybe$Just(v);
				} else {
					var $temp$availableVersions = others,
						$temp$partialSolutionTerm = partialSolutionTerm;
					availableVersions = $temp$availableVersions;
					partialSolutionTerm = $temp$partialSolutionTerm;
					continue pickVersion;
				}
			}
		}
	});
var $author$project$PubGrub$Internal$Incompatibility$UnavailableDependencies = F2(
	function (a, b) {
		return {$: 'UnavailableDependencies', a: a, b: b};
	});
var $author$project$PubGrub$Internal$Incompatibility$unavailableDeps = F2(
	function (_package, version) {
		var term = $author$project$PubGrub$Internal$Term$Positive(
			$author$project$PubGrub$Range$exact(version));
		return A2(
			$author$project$PubGrub$Internal$Incompatibility$Incompatibility,
			{
				asDict: A2($elm$core$Dict$singleton, _package, term),
				asList: _List_fromArray(
					[
						_Utils_Tuple2(_package, term)
					])
			},
			A2($author$project$PubGrub$Internal$Incompatibility$UnavailableDependencies, _package, version));
	});
var $author$project$PubGrub$updateEffect = F2(
	function (msg, state) {
		var root = state.a.root;
		var pgModel = state.a.pgModel;
		switch (msg.$) {
			case 'AvailableVersions':
				var _package = msg.a;
				var term = msg.b;
				var versions = msg.c;
				var _v1 = A2($author$project$PubGrub$Internal$Core$pickVersion, versions, term);
				if (_v1.$ === 'Just') {
					var version = _v1.a;
					return _Utils_Tuple2(
						state,
						$author$project$PubGrub$RetrieveDependencies(
							_Utils_Tuple2(_package, version)));
				} else {
					var noVersionIncompat = A2($author$project$PubGrub$Internal$Incompatibility$noVersion, _package, term);
					var updatedModel = A2(
						$author$project$PubGrub$Internal$Core$mapIncompatibilities,
						$author$project$PubGrub$Internal$Incompatibility$merge(noVersionIncompat),
						pgModel);
					return A3($author$project$PubGrub$solveStep, root, _package, updatedModel);
				}
			case 'PackageDependencies':
				var _package = msg.a;
				var version = msg.b;
				var maybeDependencies = msg.c;
				if (maybeDependencies.$ === 'Nothing') {
					var unavailableDepsIncompat = A2($author$project$PubGrub$Internal$Incompatibility$unavailableDeps, _package, version);
					var updatedModel = A2(
						$author$project$PubGrub$Internal$Core$mapIncompatibilities,
						$author$project$PubGrub$Internal$Incompatibility$merge(unavailableDepsIncompat),
						pgModel);
					return A3($author$project$PubGrub$solveStep, root, _package, updatedModel);
				} else {
					var deps = maybeDependencies.a;
					return A3(
						$author$project$PubGrub$solveStep,
						root,
						_package,
						A4($author$project$PubGrub$applyDecision, deps, _package, version, pgModel));
				}
			default:
				return _Utils_Tuple2(state, $author$project$PubGrub$NoEffect);
		}
	});
var $author$project$PubGrub$update = F3(
	function (cache, msg, state) {
		return A2(
			$author$project$PubGrub$tryUpdateCached,
			cache,
			A2($author$project$PubGrub$updateEffect, msg, state));
	});
var $author$project$Solver$projectUpdateHelper = F6(
	function (cache, strategy, root, rootVersion, dependencies, _v0) {
		var pgState = _v0.a;
		var effect = _v0.b;
		switch (effect.$) {
			case 'NoEffect':
				return _Utils_Tuple2(
					A6($author$project$Solver$ProjectSolving, strategy, root, rootVersion, dependencies, pgState, effect),
					$elm$core$Platform$Cmd$none);
			case 'ListVersions':
				var _v2 = effect.a;
				var _package = _v2.a;
				var term = _v2.b;
				var versions = _Utils_eq(_package, root) ? _List_fromArray(
					[rootVersion]) : A2(
					$author$project$Solver$sortStrategy,
					strategy,
					A2($author$project$PubGrub$Cache$listVersions, cache, _package));
				var msg = A3($author$project$PubGrub$AvailableVersions, _package, term, versions);
				return A6(
					$author$project$Solver$projectUpdateHelper,
					cache,
					strategy,
					root,
					rootVersion,
					dependencies,
					A3($author$project$PubGrub$update, cache, msg, pgState));
			case 'RetrieveDependencies':
				var _v3 = effect.a;
				var _package = _v3.a;
				var version = _v3.b;
				if (_Utils_eq(_package, root) && _Utils_eq(version, rootVersion)) {
					var msg = A3(
						$author$project$PubGrub$PackageDependencies,
						root,
						rootVersion,
						$elm$core$Maybe$Just(dependencies));
					return A6(
						$author$project$Solver$projectUpdateHelper,
						cache,
						strategy,
						root,
						rootVersion,
						dependencies,
						A3($author$project$PubGrub$update, cache, msg, pgState));
				} else {
					return _Utils_Tuple2(
						A6($author$project$Solver$ProjectSolving, strategy, root, rootVersion, dependencies, pgState, effect),
						A2($author$project$API$getDependencies, _package, version));
				}
			default:
				var result = effect.a;
				return _Utils_Tuple2(
					$author$project$Solver$Finished(result),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$PubGrub$NoMsg = {$: 'NoMsg'};
var $author$project$PubGrub$performSync = F2(
	function (config, effect) {
		switch (effect.$) {
			case 'NoEffect':
				return $author$project$PubGrub$NoMsg;
			case 'ListVersions':
				var _v1 = effect.a;
				var _package = _v1.a;
				var term = _v1.b;
				return A3(
					$author$project$PubGrub$AvailableVersions,
					_package,
					term,
					config.listAvailableVersions(_package));
			case 'RetrieveDependencies':
				var _v2 = effect.a;
				var _package = _v2.a;
				var version = _v2.b;
				return A3(
					$author$project$PubGrub$PackageDependencies,
					_package,
					version,
					A2(config.getDependencies, _package, version));
			default:
				return $author$project$PubGrub$NoMsg;
		}
	});
var $author$project$PubGrub$updateUntilFinished = F2(
	function (config, _v0) {
		updateUntilFinished:
		while (true) {
			var state = _v0.a;
			var effect = _v0.b;
			if (effect.$ === 'SignalEnd') {
				var result = effect.a;
				return result;
			} else {
				var $temp$config = config,
					$temp$_v0 = A2(
					$author$project$PubGrub$updateEffect,
					A2($author$project$PubGrub$performSync, config, effect),
					state);
				config = $temp$config;
				_v0 = $temp$_v0;
				continue updateUntilFinished;
			}
		}
	});
var $author$project$PubGrub$solve = F3(
	function (config, root, version) {
		return A2(
			$author$project$PubGrub$updateUntilFinished,
			config,
			A3(
				$author$project$PubGrub$solveStep,
				root,
				root,
				A2($author$project$PubGrub$Internal$Core$init, root, version)));
	});
var $author$project$Solver$solve = F3(
	function (project, _v0, cache) {
		var online = _v0.online;
		var strategy = _v0.strategy;
		if (project.$ === 'Package') {
			var _package = project.a;
			var version = project.b;
			var dependencies = project.c;
			return online ? A6(
				$author$project$Solver$projectUpdateHelper,
				cache,
				strategy,
				_package,
				version,
				dependencies,
				A3($author$project$PubGrub$init, cache, _package, version)) : _Utils_Tuple2(
				$author$project$Solver$Finished(
					A3(
						$author$project$PubGrub$solve,
						A5($author$project$Solver$configFrom, cache, strategy, _package, version, dependencies),
						_package,
						version)),
				$elm$core$Platform$Cmd$none);
		} else {
			var dependencies = project.a;
			return online ? A6(
				$author$project$Solver$projectUpdateHelper,
				cache,
				strategy,
				'root',
				$author$project$PubGrub$Version$one,
				dependencies,
				A3($author$project$PubGrub$init, cache, 'root', $author$project$PubGrub$Version$one)) : _Utils_Tuple2(
				$author$project$Solver$Finished(
					A3(
						$author$project$PubGrub$solve,
						A5($author$project$Solver$configFrom, cache, strategy, 'root', $author$project$PubGrub$Version$one, dependencies),
						'root',
						$author$project$PubGrub$Version$one)),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Solver$Solving = F3(
	function (a, b, c) {
		return {$: 'Solving', a: a, b: b, c: c};
	});
var $author$project$Solver$updateHelper = F3(
	function (cache, strategy, _v0) {
		var pgState = _v0.a;
		var effect = _v0.b;
		switch (effect.$) {
			case 'NoEffect':
				return _Utils_Tuple2(
					A3($author$project$Solver$Solving, strategy, pgState, effect),
					$elm$core$Platform$Cmd$none);
			case 'ListVersions':
				var _v2 = effect.a;
				var _package = _v2.a;
				var term = _v2.b;
				var versions = A2(
					$author$project$Solver$sortStrategy,
					strategy,
					A2($author$project$PubGrub$Cache$listVersions, cache, _package));
				var msg = A3($author$project$PubGrub$AvailableVersions, _package, term, versions);
				return A3(
					$author$project$Solver$updateHelper,
					cache,
					strategy,
					A3($author$project$PubGrub$update, cache, msg, pgState));
			case 'RetrieveDependencies':
				var _v3 = effect.a;
				var _package = _v3.a;
				var version = _v3.b;
				return _Utils_Tuple2(
					A3($author$project$Solver$Solving, strategy, pgState, effect),
					A2($author$project$API$getDependencies, _package, version));
			default:
				var result = effect.a;
				return _Utils_Tuple2(
					$author$project$Solver$Finished(result),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Solver$solvePackage = F4(
	function (root, rootVersion, _v0, cache) {
		var online = _v0.online;
		var strategy = _v0.strategy;
		return online ? A3(
			$author$project$Solver$updateHelper,
			cache,
			strategy,
			A3($author$project$PubGrub$init, cache, root, rootVersion)) : _Utils_Tuple2(
			$author$project$Solver$Finished(
				A3(
					$author$project$PubGrub$solve,
					A5($author$project$Solver$configFrom, cache, strategy, '', $author$project$PubGrub$Version$zero, _List_Nil),
					root,
					rootVersion)),
			$elm$core$Platform$Cmd$none);
	});
var $elm$file$File$toString = _File_toString;
var $author$project$Solver$encodeDependency = function (_v0) {
	var _package = _v0.a;
	var range = _v0.b;
	return $elm$json$Json$Encode$string(
		_package + ('@' + $author$project$PubGrub$Range$toDebugString(range)));
};
var $author$project$Solver$encodePackageVersion = function (_v0) {
	var _package = _v0.a;
	var version = _v0.b;
	return $elm$json$Json$Encode$string(
		_package + ('@' + $author$project$PubGrub$Version$toDebugString(version)));
};
var $author$project$Solver$saveDependencies = _Platform_outgoingPort('saveDependencies', $elm$core$Basics$identity);
var $elm$core$Debug$toString = _Debug_toString;
var $author$project$Solver$update = F4(
	function (toMsg, cache, msg, state) {
		var _v0 = _Utils_Tuple2(msg, state);
		_v0$4:
		while (true) {
			if (_v0.a.c.$ === 'Ok') {
				switch (_v0.b.$) {
					case 'Solving':
						var _v1 = _v0.a;
						var _package = _v1.a;
						var version = _v1.b;
						var elmProject = _v1.c.a;
						var _v2 = _v0.b;
						var strategy = _v2.a;
						var pgState = _v2.b;
						var dependencies = function () {
							var _v4 = $author$project$Project$fromElmProject(elmProject);
							if (_v4.$ === 'Package') {
								var deps = _v4.c;
								return deps;
							} else {
								var deps = _v4.a;
								return deps;
							}
						}();
						var depsValue = $elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'key',
									$author$project$Solver$encodePackageVersion(
										_Utils_Tuple2(_package, version))),
									_Utils_Tuple2(
									'value',
									A2($elm$json$Json$Encode$list, $author$project$Solver$encodeDependency, dependencies))
								]));
						var newCache = A4($author$project$PubGrub$Cache$addDependencies, _package, version, dependencies, cache);
						var pgMsg = A3(
							$author$project$PubGrub$PackageDependencies,
							_package,
							version,
							$elm$core$Maybe$Just(dependencies));
						var _v3 = A3(
							$author$project$Solver$updateHelper,
							newCache,
							strategy,
							A3($author$project$PubGrub$update, newCache, pgMsg, pgState));
						var newPgState = _v3.a;
						var newCmd = _v3.b;
						return _Utils_Tuple3(
							newCache,
							newPgState,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2($elm$core$Platform$Cmd$map, toMsg, newCmd),
										$author$project$Solver$saveDependencies(depsValue)
									])));
					case 'ProjectSolving':
						var _v5 = _v0.a;
						var _package = _v5.a;
						var version = _v5.b;
						var elmProject = _v5.c.a;
						var _v6 = _v0.b;
						var strategy = _v6.a;
						var root = _v6.b;
						var rootVersion = _v6.c;
						var rootDependencies = _v6.d;
						var pgState = _v6.e;
						var dependencies = function () {
							var _v8 = $author$project$Project$fromElmProject(elmProject);
							if (_v8.$ === 'Package') {
								var deps = _v8.c;
								return deps;
							} else {
								var deps = _v8.a;
								return deps;
							}
						}();
						var depsValue = $elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'key',
									$author$project$Solver$encodePackageVersion(
										_Utils_Tuple2(_package, version))),
									_Utils_Tuple2(
									'value',
									A2($elm$json$Json$Encode$list, $author$project$Solver$encodeDependency, dependencies))
								]));
						var newCache = A4($author$project$PubGrub$Cache$addDependencies, _package, version, dependencies, cache);
						var pgMsg = A3(
							$author$project$PubGrub$PackageDependencies,
							_package,
							version,
							$elm$core$Maybe$Just(dependencies));
						var _v7 = A6(
							$author$project$Solver$projectUpdateHelper,
							newCache,
							strategy,
							root,
							rootVersion,
							rootDependencies,
							A3($author$project$PubGrub$update, newCache, pgMsg, pgState));
						var newPgState = _v7.a;
						var newCmd = _v7.b;
						return _Utils_Tuple3(
							newCache,
							newPgState,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2($elm$core$Platform$Cmd$map, toMsg, newCmd),
										$author$project$Solver$saveDependencies(depsValue)
									])));
					default:
						break _v0$4;
				}
			} else {
				switch (_v0.b.$) {
					case 'Solving':
						var _v9 = _v0.a;
						var httpError = _v9.c.a;
						var _v10 = _v0.b;
						return _Utils_Tuple3(
							cache,
							$author$project$Solver$Finished(
								$elm$core$Result$Err(
									$elm$core$Debug$toString(httpError))),
							$elm$core$Platform$Cmd$none);
					case 'ProjectSolving':
						var _v11 = _v0.a;
						var httpError = _v11.c.a;
						var _v12 = _v0.b;
						return _Utils_Tuple3(
							cache,
							$author$project$Solver$Finished(
								$elm$core$Result$Err(
									$elm$core$Debug$toString(httpError))),
							$elm$core$Platform$Cmd$none);
					default:
						break _v0$4;
				}
			}
		}
		return _Utils_Tuple3(cache, state, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model.state);
		_v0$13:
		while (true) {
			switch (_v0.a.$) {
				case 'BackHome':
					var _v1 = _v0.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{state: $author$project$Main$initialState}),
						$elm$core$Platform$Cmd$none);
				case 'LoadElmJson':
					if (_v0.b.$ === 'Init') {
						var _v2 = _v0.a;
						var _v3 = _v0.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									state: A2($author$project$Main$Init, '', $elm$core$Maybe$Nothing)
								}),
							A2(
								$elm$file$File$Select$file,
								_List_fromArray(
									['application/json']),
								$author$project$Main$ElmJsonFile));
					} else {
						break _v0$13;
					}
				case 'ElmJsonFile':
					if (_v0.b.$ === 'Init') {
						var file = _v0.a.a;
						var _v4 = _v0.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									state: A2($author$project$Main$Init, '', $elm$core$Maybe$Nothing)
								}),
							A2(
								$elm$core$Task$perform,
								$author$project$Main$ElmJsonContent,
								$elm$file$File$toString(file)));
					} else {
						break _v0$13;
					}
				case 'ElmJsonContent':
					if (_v0.b.$ === 'Init') {
						var content = _v0.a.a;
						var _v5 = _v0.b;
						var _v6 = A2($elm$json$Json$Decode$decodeString, $elm$project_metadata_utils$Elm$Project$decoder, content);
						if (_v6.$ === 'Ok') {
							var elmProject = _v6.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										state: A2(
											$author$project$Main$LoadedProject,
											$author$project$Project$fromElmProject(elmProject),
											$author$project$Solver$defaultConfig)
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							var err = _v6.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										state: $author$project$Main$Error(
											$elm$json$Json$Decode$errorToString(err))
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$13;
					}
				case 'Input':
					if (_v0.b.$ === 'Init') {
						var input = _v0.a.a;
						var _v12 = _v0.b;
						var maybePackage = A2(
							$elm$core$Maybe$map,
							$elm$core$Tuple$mapSecond(
								A2($elm$core$Basics$composeL, $author$project$PubGrub$Version$fromTuple, $elm$project_metadata_utils$Elm$Version$toTuple)),
							$elm$core$Result$toMaybe(
								$author$project$ElmPackages$packageVersionFromString(input)));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									state: A2($author$project$Main$Init, input, maybePackage)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						break _v0$13;
					}
				case 'PickPackage':
					if (_v0.b.$ === 'Init') {
						var _v13 = _v0.a.a;
						var _package = _v13.a;
						var version = _v13.b;
						var _v14 = _v0.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									state: A3($author$project$Main$PickedPackage, _package, version, $author$project$Solver$defaultConfig)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						break _v0$13;
					}
				case 'SwitchConnectivity':
					switch (_v0.b.$) {
						case 'LoadedProject':
							var online = _v0.a.a;
							var _v7 = _v0.b;
							var p = _v7.a;
							var config = _v7.b;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										state: A2(
											$author$project$Main$LoadedProject,
											p,
											_Utils_update(
												config,
												{online: online}))
									}),
								$elm$core$Platform$Cmd$none);
						case 'PickedPackage':
							var online = _v0.a.a;
							var _v15 = _v0.b;
							var p = _v15.a;
							var v = _v15.b;
							var config = _v15.c;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										state: A3(
											$author$project$Main$PickedPackage,
											p,
											v,
											_Utils_update(
												config,
												{online: online}))
									}),
								$elm$core$Platform$Cmd$none);
						default:
							break _v0$13;
					}
				case 'SwitchStrategy':
					switch (_v0.b.$) {
						case 'LoadedProject':
							var strategy = _v0.a.a;
							var _v8 = _v0.b;
							var p = _v8.a;
							var config = _v8.b;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										state: A2(
											$author$project$Main$LoadedProject,
											p,
											_Utils_update(
												config,
												{strategy: strategy}))
									}),
								$elm$core$Platform$Cmd$none);
						case 'PickedPackage':
							var strategy = _v0.a.a;
							var _v16 = _v0.b;
							var p = _v16.a;
							var v = _v16.b;
							var config = _v16.c;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										state: A3(
											$author$project$Main$PickedPackage,
											p,
											v,
											_Utils_update(
												config,
												{strategy: strategy}))
									}),
								$elm$core$Platform$Cmd$none);
						default:
							break _v0$13;
					}
				case 'Solve':
					switch (_v0.b.$) {
						case 'LoadedProject':
							var _v9 = _v0.a;
							var _v10 = _v0.b;
							var project = _v10.a;
							var config = _v10.b;
							var _v11 = A3($author$project$Solver$solve, project, config, model.cache);
							if (_v11.a.$ === 'Finished') {
								if (_v11.a.a.$ === 'Ok') {
									var solution = _v11.a.a.a;
									var cmd = _v11.b;
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												state: $author$project$Main$Solution(solution)
											}),
										A2($elm$core$Platform$Cmd$map, $author$project$Main$ApiMsg, cmd));
								} else {
									var error = _v11.a.a.a;
									var cmd = _v11.b;
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												state: $author$project$Main$Error(error)
											}),
										A2($elm$core$Platform$Cmd$map, $author$project$Main$ApiMsg, cmd));
								}
							} else {
								var solverState = _v11.a;
								var cmd = _v11.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											state: $author$project$Main$Solving(solverState)
										}),
									A2($elm$core$Platform$Cmd$map, $author$project$Main$ApiMsg, cmd));
							}
						case 'PickedPackage':
							var _v17 = _v0.a;
							var _v18 = _v0.b;
							var _package = _v18.a;
							var version = _v18.b;
							var config = _v18.c;
							var _v19 = A4($author$project$Solver$solvePackage, _package, version, config, model.cache);
							if (_v19.a.$ === 'Finished') {
								if (_v19.a.a.$ === 'Ok') {
									var solution = _v19.a.a.a;
									var cmd = _v19.b;
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												state: $author$project$Main$Solution(solution)
											}),
										A2($elm$core$Platform$Cmd$map, $author$project$Main$ApiMsg, cmd));
								} else {
									var error = _v19.a.a.a;
									var cmd = _v19.b;
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												state: $author$project$Main$Error(error)
											}),
										A2($elm$core$Platform$Cmd$map, $author$project$Main$ApiMsg, cmd));
								}
							} else {
								var solverState = _v19.a;
								var cmd = _v19.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											state: $author$project$Main$Solving(solverState)
										}),
									A2($elm$core$Platform$Cmd$map, $author$project$Main$ApiMsg, cmd));
							}
						default:
							break _v0$13;
					}
				case 'ApiMsg':
					if (_v0.b.$ === 'Solving') {
						var apiMsg = _v0.a.a;
						var solverState = _v0.b.a;
						var _v20 = A4($author$project$Solver$update, $author$project$Main$ApiMsg, model.cache, apiMsg, solverState);
						if (_v20.b.$ === 'Finished') {
							if (_v20.b.a.$ === 'Ok') {
								var newCache = _v20.a;
								var solution = _v20.b.a.a;
								var cmd = _v20.c;
								return _Utils_Tuple2(
									{
										cache: newCache,
										state: $author$project$Main$Solution(solution)
									},
									cmd);
							} else {
								var newCache = _v20.a;
								var error = _v20.b.a.a;
								var cmd = _v20.c;
								return _Utils_Tuple2(
									{
										cache: newCache,
										state: $author$project$Main$Error(error)
									},
									cmd);
							}
						} else {
							var newCache = _v20.a;
							var newSolverState = _v20.b;
							var cmd = _v20.c;
							return _Utils_Tuple2(
								{
									cache: newCache,
									state: $author$project$Main$Solving(newSolverState)
								},
								cmd);
						}
					} else {
						break _v0$13;
					}
				default:
					break _v0$13;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $mdgriffith$elm_ui$Internal$Style$classes = {above: 'a', active: 'atv', alignBottom: 'ab', alignCenterX: 'cx', alignCenterY: 'cy', alignContainerBottom: 'acb', alignContainerCenterX: 'accx', alignContainerCenterY: 'accy', alignContainerRight: 'acr', alignLeft: 'al', alignRight: 'ar', alignTop: 'at', alignedHorizontally: 'ah', alignedVertically: 'av', any: 's', behind: 'bh', below: 'b', bold: 'w7', borderDashed: 'bd', borderDotted: 'bdt', borderNone: 'bn', borderSolid: 'bs', capturePointerEvents: 'cpe', clip: 'cp', clipX: 'cpx', clipY: 'cpy', column: 'c', container: 'ctr', contentBottom: 'cb', contentCenterX: 'ccx', contentCenterY: 'ccy', contentLeft: 'cl', contentRight: 'cr', contentTop: 'ct', cursorPointer: 'cptr', cursorText: 'ctxt', focus: 'fcs', focusedWithin: 'focus-within', fullSize: 'fs', grid: 'g', hasBehind: 'hbh', heightContent: 'hc', heightExact: 'he', heightFill: 'hf', heightFillPortion: 'hfp', hover: 'hv', imageContainer: 'ic', inFront: 'fr', inputLabel: 'lbl', inputMultiline: 'iml', inputMultilineFiller: 'imlf', inputMultilineParent: 'imlp', inputMultilineWrapper: 'implw', inputText: 'it', italic: 'i', link: 'lnk', nearby: 'nb', noTextSelection: 'notxt', onLeft: 'ol', onRight: 'or', opaque: 'oq', overflowHidden: 'oh', page: 'pg', paragraph: 'p', passPointerEvents: 'ppe', root: 'ui', row: 'r', scrollbars: 'sb', scrollbarsX: 'sbx', scrollbarsY: 'sby', seButton: 'sbt', single: 'e', sizeByCapital: 'cap', spaceEvenly: 'sev', strike: 'sk', text: 't', textCenter: 'tc', textExtraBold: 'w8', textExtraLight: 'w2', textHeavy: 'w9', textJustify: 'tj', textJustifyAll: 'tja', textLeft: 'tl', textLight: 'w3', textMedium: 'w5', textNormalWeight: 'w4', textRight: 'tr', textSemiBold: 'w6', textThin: 'w1', textUnitalicized: 'tun', transition: 'ts', transparent: 'clr', underline: 'u', widthContent: 'wc', widthExact: 'we', widthFill: 'wf', widthFillPortion: 'wfp', wrapped: 'wrp'};
var $mdgriffith$elm_ui$Internal$Model$Attr = function (a) {
	return {$: 'Attr', a: a};
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $mdgriffith$elm_ui$Internal$Model$htmlClass = function (cls) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		$elm$html$Html$Attributes$class(cls));
};
var $mdgriffith$elm_ui$Internal$Model$OnlyDynamic = F2(
	function (a, b) {
		return {$: 'OnlyDynamic', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic = F2(
	function (a, b) {
		return {$: 'StaticRootAndDynamic', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Unkeyed = function (a) {
	return {$: 'Unkeyed', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$AsEl = {$: 'AsEl'};
var $mdgriffith$elm_ui$Internal$Model$asEl = $mdgriffith$elm_ui$Internal$Model$AsEl;
var $mdgriffith$elm_ui$Internal$Model$Generic = {$: 'Generic'};
var $mdgriffith$elm_ui$Internal$Model$div = $mdgriffith$elm_ui$Internal$Model$Generic;
var $mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 'NoNearbyChildren'};
var $mdgriffith$elm_ui$Internal$Model$columnClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.column);
var $mdgriffith$elm_ui$Internal$Model$gridClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.grid);
var $mdgriffith$elm_ui$Internal$Model$pageClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.page);
var $mdgriffith$elm_ui$Internal$Model$paragraphClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.paragraph);
var $mdgriffith$elm_ui$Internal$Model$rowClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.row);
var $mdgriffith$elm_ui$Internal$Model$singleClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.single);
var $mdgriffith$elm_ui$Internal$Model$contextClasses = function (context) {
	switch (context.$) {
		case 'AsRow':
			return $mdgriffith$elm_ui$Internal$Model$rowClass;
		case 'AsColumn':
			return $mdgriffith$elm_ui$Internal$Model$columnClass;
		case 'AsEl':
			return $mdgriffith$elm_ui$Internal$Model$singleClass;
		case 'AsGrid':
			return $mdgriffith$elm_ui$Internal$Model$gridClass;
		case 'AsParagraph':
			return $mdgriffith$elm_ui$Internal$Model$paragraphClass;
		default:
			return $mdgriffith$elm_ui$Internal$Model$pageClass;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Keyed = function (a) {
	return {$: 'Keyed', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$NoStyleSheet = {$: 'NoStyleSheet'};
var $mdgriffith$elm_ui$Internal$Model$Styled = function (a) {
	return {$: 'Styled', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Unstyled = function (a) {
	return {$: 'Unstyled', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addChildren = F2(
	function (existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 'NoNearbyChildren':
				return existing;
			case 'ChildrenBehind':
				var behind = nearbyChildren.a;
				return _Utils_ap(behind, existing);
			case 'ChildrenInFront':
				var inFront = nearbyChildren.a;
				return _Utils_ap(existing, inFront);
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					behind,
					_Utils_ap(existing, inFront));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$addKeyedChildren = F3(
	function (key, existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 'NoNearbyChildren':
				return existing;
			case 'ChildrenBehind':
				var behind = nearbyChildren.a;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					existing);
			case 'ChildrenInFront':
				var inFront = nearbyChildren.a;
				return _Utils_ap(
					existing,
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						inFront));
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					_Utils_ap(
						existing,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_Tuple2(key, x);
							},
							inFront)));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$AsParagraph = {$: 'AsParagraph'};
var $mdgriffith$elm_ui$Internal$Model$asParagraph = $mdgriffith$elm_ui$Internal$Model$AsParagraph;
var $mdgriffith$elm_ui$Internal$Flag$Flag = function (a) {
	return {$: 'Flag', a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Second = function (a) {
	return {$: 'Second', a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$flag = function (i) {
	return (i > 31) ? $mdgriffith$elm_ui$Internal$Flag$Second(1 << (i - 32)) : $mdgriffith$elm_ui$Internal$Flag$Flag(1 << i);
};
var $mdgriffith$elm_ui$Internal$Flag$alignBottom = $mdgriffith$elm_ui$Internal$Flag$flag(41);
var $mdgriffith$elm_ui$Internal$Flag$alignRight = $mdgriffith$elm_ui$Internal$Flag$flag(40);
var $mdgriffith$elm_ui$Internal$Flag$centerX = $mdgriffith$elm_ui$Internal$Flag$flag(42);
var $mdgriffith$elm_ui$Internal$Flag$centerY = $mdgriffith$elm_ui$Internal$Flag$flag(43);
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $mdgriffith$elm_ui$Internal$Model$lengthClassName = function (x) {
	switch (x.$) {
		case 'Px':
			var px = x.a;
			return $elm$core$String$fromInt(px) + 'px';
		case 'Content':
			return 'auto';
		case 'Fill':
			var i = x.a;
			return $elm$core$String$fromInt(i) + 'fr';
		case 'Min':
			var min = x.a;
			var len = x.b;
			return 'min' + ($elm$core$String$fromInt(min) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
		default:
			var max = x.a;
			var len = x.b;
			return 'max' + ($elm$core$String$fromInt(max) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
	}
};
var $elm$core$Basics$round = _Basics_round;
var $mdgriffith$elm_ui$Internal$Model$floatClass = function (x) {
	return $elm$core$String$fromInt(
		$elm$core$Basics$round(x * 255));
};
var $mdgriffith$elm_ui$Internal$Model$transformClass = function (transform) {
	switch (transform.$) {
		case 'Untransformed':
			return $elm$core$Maybe$Nothing;
		case 'Moved':
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'mv-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(x) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(y) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(z))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			return $elm$core$Maybe$Just(
				'tfrm-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ty) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ox) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oz) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(angle))))))))))))))))))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$getStyleName = function (style) {
	switch (style.$) {
		case 'Shadows':
			var name = style.a;
			return name;
		case 'Transparency':
			var name = style.a;
			var o = style.b;
			return name;
		case 'Style':
			var _class = style.a;
			return _class;
		case 'FontFamily':
			var name = style.a;
			return name;
		case 'FontSize':
			var i = style.a;
			return 'font-size-' + $elm$core$String$fromInt(i);
		case 'Single':
			var _class = style.a;
			return _class;
		case 'Colored':
			var _class = style.a;
			return _class;
		case 'SpacingStyle':
			var cls = style.a;
			var x = style.b;
			var y = style.c;
			return cls;
		case 'PaddingStyle':
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 'BorderWidth':
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 'GridTemplateStyle':
			var template = style.a;
			return 'grid-rows-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.rows)) + ('-cols-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.columns)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.spacing.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.spacing.b)))))));
		case 'GridPosition':
			var pos = style.a;
			return 'gp grid-pos-' + ($elm$core$String$fromInt(pos.row) + ('-' + ($elm$core$String$fromInt(pos.col) + ('-' + ($elm$core$String$fromInt(pos.width) + ('-' + $elm$core$String$fromInt(pos.height)))))));
		case 'PseudoSelector':
			var selector = style.a;
			var subStyle = style.b;
			var name = function () {
				switch (selector.$) {
					case 'Focus':
						return 'fs';
					case 'Hover':
						return 'hv';
					default:
						return 'act';
				}
			}();
			return A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (sty) {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$getStyleName(sty);
						if (_v1 === '') {
							return '';
						} else {
							var styleName = _v1;
							return styleName + ('-' + name);
						}
					},
					subStyle));
		default:
			var x = style.a;
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$mdgriffith$elm_ui$Internal$Model$transformClass(x));
	}
};
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $mdgriffith$elm_ui$Internal$Model$reduceStyles = F2(
	function (style, nevermind) {
		var cache = nevermind.a;
		var existing = nevermind.b;
		var styleName = $mdgriffith$elm_ui$Internal$Model$getStyleName(style);
		return A2($elm$core$Set$member, styleName, cache) ? nevermind : _Utils_Tuple2(
			A2($elm$core$Set$insert, styleName, cache),
			A2($elm$core$List$cons, style, existing));
	});
var $mdgriffith$elm_ui$Internal$Model$Property = F2(
	function (a, b) {
		return {$: 'Property', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Style = F2(
	function (a, b) {
		return {$: 'Style', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$dot = function (c) {
	return '.' + c;
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $mdgriffith$elm_ui$Internal$Model$formatColor = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return 'rgba(' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(red * 255)) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(green * 255))) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(blue * 255))) + (',' + ($elm$core$String$fromFloat(alpha) + ')')))));
};
var $mdgriffith$elm_ui$Internal$Model$formatBoxShadow = function (shadow) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					shadow.inset ? $elm$core$Maybe$Just('inset') : $elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.offset.a) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.offset.b) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.blur) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.size) + 'px'),
					$elm$core$Maybe$Just(
					$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.color))
				])));
};
var $mdgriffith$elm_ui$Internal$Model$renderFocusStyle = function (focus) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.focusedWithin) + ':focus-within',
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.borderColor),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.backgroundColor),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										blur: shadow.blur,
										color: shadow.color,
										inset: false,
										offset: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.offset)),
										size: shadow.size
									}));
						},
						focus.shadow),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					]))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + (':focus .focusable, ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + '.focusable:focus')),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.borderColor),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.backgroundColor),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										blur: shadow.blur,
										color: shadow.color,
										inset: false,
										offset: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.offset)),
										size: shadow.size
									}));
						},
						focus.shadow),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					])))
		]);
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Style$AllChildren = F2(
	function (a, b) {
		return {$: 'AllChildren', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Batch = function (a) {
	return {$: 'Batch', a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Child = F2(
	function (a, b) {
		return {$: 'Child', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Class = F2(
	function (a, b) {
		return {$: 'Class', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Descriptor = F2(
	function (a, b) {
		return {$: 'Descriptor', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Left = {$: 'Left'};
var $mdgriffith$elm_ui$Internal$Style$Prop = F2(
	function (a, b) {
		return {$: 'Prop', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Right = {$: 'Right'};
var $mdgriffith$elm_ui$Internal$Style$Self = function (a) {
	return {$: 'Self', a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Supports = F2(
	function (a, b) {
		return {$: 'Supports', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Content = function (a) {
	return {$: 'Content', a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Bottom = {$: 'Bottom'};
var $mdgriffith$elm_ui$Internal$Style$CenterX = {$: 'CenterX'};
var $mdgriffith$elm_ui$Internal$Style$CenterY = {$: 'CenterY'};
var $mdgriffith$elm_ui$Internal$Style$Top = {$: 'Top'};
var $mdgriffith$elm_ui$Internal$Style$alignments = _List_fromArray(
	[$mdgriffith$elm_ui$Internal$Style$Top, $mdgriffith$elm_ui$Internal$Style$Bottom, $mdgriffith$elm_ui$Internal$Style$Right, $mdgriffith$elm_ui$Internal$Style$Left, $mdgriffith$elm_ui$Internal$Style$CenterX, $mdgriffith$elm_ui$Internal$Style$CenterY]);
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $mdgriffith$elm_ui$Internal$Style$contentName = function (desc) {
	switch (desc.a.$) {
		case 'Top':
			var _v1 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentTop);
		case 'Bottom':
			var _v2 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentBottom);
		case 'Right':
			var _v3 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentRight);
		case 'Left':
			var _v4 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentLeft);
		case 'CenterX':
			var _v5 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentCenterX);
		default:
			var _v6 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentCenterY);
	}
};
var $mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc.a.$) {
		case 'Top':
			var _v1 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignTop);
		case 'Bottom':
			var _v2 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignBottom);
		case 'Right':
			var _v3 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignRight);
		case 'Left':
			var _v4 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignLeft);
		case 'CenterX':
			var _v5 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterX);
		default:
			var _v6 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY);
	}
};
var $mdgriffith$elm_ui$Internal$Style$describeAlignment = function (values) {
	var createDescription = function (alignment) {
		var _v0 = values(alignment);
		var content = _v0.a;
		var indiv = _v0.b;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$contentName(
					$mdgriffith$elm_ui$Internal$Style$Content(alignment)),
				content),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(
							$mdgriffith$elm_ui$Internal$Style$Self(alignment)),
						indiv)
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$elDescription = _List_fromArray(
	[
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hasBehind),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.behind),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.seButton),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.text),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightContent),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFillPortion),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthContent),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
			])),
		$mdgriffith$elm_ui$Internal$Style$describeAlignment(
		function (alignment) {
			switch (alignment.$) {
				case 'Top':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
							]));
				case 'Bottom':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
							]));
				case 'Right':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
							]));
				case 'Left':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							]));
				case 'CenterX':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
							]));
				default:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
									]))
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
							]));
			}
		})
	]);
var $mdgriffith$elm_ui$Internal$Style$gridAlignments = function (values) {
	var createDescription = function (alignment) {
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(
							$mdgriffith$elm_ui$Internal$Style$Self(alignment)),
						values(alignment))
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$Above = {$: 'Above'};
var $mdgriffith$elm_ui$Internal$Style$Behind = {$: 'Behind'};
var $mdgriffith$elm_ui$Internal$Style$Below = {$: 'Below'};
var $mdgriffith$elm_ui$Internal$Style$OnLeft = {$: 'OnLeft'};
var $mdgriffith$elm_ui$Internal$Style$OnRight = {$: 'OnRight'};
var $mdgriffith$elm_ui$Internal$Style$Within = {$: 'Within'};
var $mdgriffith$elm_ui$Internal$Style$locations = function () {
	var loc = $mdgriffith$elm_ui$Internal$Style$Above;
	var _v0 = function () {
		switch (loc.$) {
			case 'Above':
				return _Utils_Tuple0;
			case 'Below':
				return _Utils_Tuple0;
			case 'OnRight':
				return _Utils_Tuple0;
			case 'OnLeft':
				return _Utils_Tuple0;
			case 'Within':
				return _Utils_Tuple0;
			default:
				return _Utils_Tuple0;
		}
	}();
	return _List_fromArray(
		[$mdgriffith$elm_ui$Internal$Style$Above, $mdgriffith$elm_ui$Internal$Style$Below, $mdgriffith$elm_ui$Internal$Style$OnRight, $mdgriffith$elm_ui$Internal$Style$OnLeft, $mdgriffith$elm_ui$Internal$Style$Within, $mdgriffith$elm_ui$Internal$Style$Behind]);
}();
var $mdgriffith$elm_ui$Internal$Style$baseSheet = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		'html,body',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		_Utils_ap(
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
			_Utils_ap(
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.imageContainer))),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'img',
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'max-height', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'object-fit', 'cover')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'img',
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'max-width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'object-fit', 'cover')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + ':focus',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.root),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inFront),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nearby),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nearby),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				$mdgriffith$elm_ui$Internal$Style$Batch(
				function (fn) {
					return A2($elm$core$List$map, fn, $mdgriffith$elm_ui$Internal$Style$locations);
				}(
					function (loc) {
						switch (loc.$) {
							case 'Above':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.above),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
												])),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 'Below':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.below),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 'OnRight':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.onRight),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 'OnLeft':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.onLeft),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'right', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 'Within':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inFront),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							default:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.behind),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
						}
					}))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'resize', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'box-sizing', 'border-box'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-size', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-family', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'inherit'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wrapped),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.noTextSelection),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cursorPointer),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cursorText),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.passPointerEvents),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.capturePointerEvents),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.transparent),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.opaque),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.hover, $mdgriffith$elm_ui$Internal$Style$classes.transparent)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.hover, $mdgriffith$elm_ui$Internal$Style$classes.opaque)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.focus, $mdgriffith$elm_ui$Internal$Style$classes.transparent)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.focus, $mdgriffith$elm_ui$Internal$Style$classes.opaque)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.active, $mdgriffith$elm_ui$Internal$Style$classes.transparent)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.active, $mdgriffith$elm_ui$Internal$Style$classes.opaque)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.transition),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Prop,
						'transition',
						A2(
							$elm$core$String$join,
							', ',
							A2(
								$elm$core$List$map,
								function (x) {
									return x + ' 160ms';
								},
								_List_fromArray(
									['transform', 'opacity', 'filter', 'background-color', 'color', 'font-size']))))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.scrollbars),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.scrollbarsX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.scrollbarsY),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.column),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.clip),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.clipX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.clipY),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthContent),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.borderNone),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.borderDashed),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.borderDotted),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.borderSolid),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.text),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputText),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background', 'transparent'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'inherit')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthExact),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.link),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFillPortion),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.container),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerRight,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterX),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterX),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.alignContainerRight + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 'Bottom':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 'Right':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_Nil);
								case 'Left':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_Nil);
								case 'CenterX':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.spaceEvenly),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputLabel),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'baseline')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.column),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFillPortion),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthContent),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerBottom,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.alignContainerBottom + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
											]));
								case 'Bottom':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto')
											]));
								case 'Right':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 'Left':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 'CenterX':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.container),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.spaceEvenly),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.grid),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', '-ms-grid'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'.gp',
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Supports,
						_Utils_Tuple2('display', 'grid'),
						_List_fromArray(
							[
								_Utils_Tuple2('display', 'grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$gridAlignments(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
										]);
								case 'Bottom':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
										]);
								case 'Right':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
										]);
								case 'Left':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
										]);
								case 'CenterX':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
										]);
								default:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
										]);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.page),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any + ':first-child'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.any + ($mdgriffith$elm_ui$Internal$Style$selfName(
								$mdgriffith$elm_ui$Internal$Style$Self($mdgriffith$elm_ui$Internal$Style$Left)) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.any))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.any + ($mdgriffith$elm_ui$Internal$Style$selfName(
								$mdgriffith$elm_ui$Internal$Style$Self($mdgriffith$elm_ui$Internal$Style$Right)) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.any))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 'Bottom':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 'Right':
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 'Left':
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 'CenterX':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputMultiline),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background-color', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineWrapper),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineParent),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineFiller),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'transparent')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.paragraph),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-wrap', 'break-word'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hasBehind),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.behind),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.text),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.paragraph),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								'::after',
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', 'none')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								'::before',
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', 'none')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthExact),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inFront),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.behind),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.above),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.below),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.onRight),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.onLeft),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.text),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.column),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.grid),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 'Bottom':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 'Right':
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right')
											]));
								case 'Left':
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left')
											]));
								case 'CenterX':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.hidden',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textThin),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textExtraLight),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textLight),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textNormalWeight),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textMedium),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textSemiBold),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bold),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textExtraBold),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textHeavy),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.italic),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.strike),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.underline),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.underline),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.strike)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textUnitalicized),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textJustify),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textJustifyAll),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textCenter),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textRight),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textLeft),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'left')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.modal',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none')
					]))
			]))
	]);
var $mdgriffith$elm_ui$Internal$Style$fontVariant = function (_var) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + _var,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\"'))
				])),
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + (_var + '-off'),
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\" 0'))
				]))
		]);
};
var $mdgriffith$elm_ui$Internal$Style$commonValues = $elm$core$List$concat(
	_List_fromArray(
		[
			A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.border-' + $elm$core$String$fromInt(x),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'border-width',
							$elm$core$String$fromInt(x) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 6)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 8, 32)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.p-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'padding',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 24)),
			_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'small-caps')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp-off',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'normal')
					]))
			]),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('zero'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('onum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('liga'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('dlig'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('ordn'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('tnum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('afrc'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('frac')
		]));
var $mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + ($mdgriffith$elm_ui$Internal$Style$classes.any + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + ($mdgriffith$elm_ui$Internal$Style$classes.any + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var $mdgriffith$elm_ui$Internal$Style$inputTextReset = '\ninput[type="search"],\ninput[type="search"]::-webkit-search-decoration,\ninput[type="search"]::-webkit-search-cancel-button,\ninput[type="search"]::-webkit-search-results-button,\ninput[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance:none;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$sliderReset = '\ninput[type=range] {\n  -webkit-appearance: none; \n  background: transparent;\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$thumbReset = '\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var $mdgriffith$elm_ui$Internal$Style$trackReset = '\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + (' { flex-basis: auto !important; } ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.container) + (' { flex-basis: auto !important; }}' + ($mdgriffith$elm_ui$Internal$Style$inputTextReset + ($mdgriffith$elm_ui$Internal$Style$sliderReset + ($mdgriffith$elm_ui$Internal$Style$trackReset + ($mdgriffith$elm_ui$Internal$Style$thumbReset + $mdgriffith$elm_ui$Internal$Style$explainer)))))))))))))));
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $mdgriffith$elm_ui$Internal$Style$Intermediate = function (a) {
	return {$: 'Intermediate', a: a};
};
var $mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return $mdgriffith$elm_ui$Internal$Style$Intermediate(
			{closing: closing, others: _List_Nil, props: _List_Nil, selector: selector});
	});
var $mdgriffith$elm_ui$Internal$Style$renderRules = F2(
	function (_v0, rulesToRender) {
		var parent = _v0.a;
		var generateIntermediates = F2(
			function (rule, rendered) {
				switch (rule.$) {
					case 'Prop':
						var name = rule.a;
						var val = rule.b;
						return _Utils_update(
							rendered,
							{
								props: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.props)
							});
					case 'Supports':
						var _v2 = rule.a;
						var prop = _v2.a;
						var value = _v2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Style$Intermediate(
										{closing: '\n}', others: _List_Nil, props: props, selector: '@supports (' + (prop + (':' + (value + (') {' + parent.selector))))}),
									rendered.others)
							});
					case 'Adjacent':
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.selector + (' + ' + selector), ''),
										adjRules),
									rendered.others)
							});
					case 'Child':
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.selector + (' > ' + child), ''),
										childRules),
									rendered.others)
							});
					case 'AllChildren':
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.selector + (' ' + child), ''),
										childRules),
									rendered.others)
							});
					case 'Descriptor':
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											$mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.selector, descriptor),
											''),
										descriptorRules),
									rendered.others)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.selector, ''),
										batched),
									rendered.others)
							});
				}
			});
		return $mdgriffith$elm_ui$Internal$Style$Intermediate(
			A3($elm$core$List$foldr, generateIntermediates, parent, rulesToRender));
	});
var $mdgriffith$elm_ui$Internal$Style$renderCompact = function (styleClasses) {
	var renderValues = function (values) {
		return $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return x + (':' + (y + ';'));
				},
				values));
	};
	var renderClass = function (rule) {
		var _v2 = rule.props;
		if (!_v2.b) {
			return '';
		} else {
			return rule.selector + ('{' + (renderValues(rule.props) + (rule.closing + '}')));
		}
	};
	var renderIntermediate = function (_v0) {
		var rule = _v0.a;
		return _Utils_ap(
			renderClass(rule),
			$elm$core$String$concat(
				A2($elm$core$List$map, renderIntermediate, rule.others)));
	};
	return $elm$core$String$concat(
		A2(
			$elm$core$List$map,
			renderIntermediate,
			A3(
				$elm$core$List$foldr,
				F2(
					function (_v1, existing) {
						var name = _v1.a;
						var styleRules = _v1.b;
						return A2(
							$elm$core$List$cons,
							A2(
								$mdgriffith$elm_ui$Internal$Style$renderRules,
								A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, name, ''),
								styleRules),
							existing);
					}),
				_List_Nil,
				styleClasses)));
};
var $mdgriffith$elm_ui$Internal$Style$rules = _Utils_ap(
	$mdgriffith$elm_ui$Internal$Style$overrides,
	$mdgriffith$elm_ui$Internal$Style$renderCompact(
		_Utils_ap($mdgriffith$elm_ui$Internal$Style$baseSheet, $mdgriffith$elm_ui$Internal$Style$commonValues)));
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $mdgriffith$elm_ui$Internal$Model$staticRoot = function (opts) {
	var _v0 = opts.mode;
	switch (_v0.$) {
		case 'Layout':
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'div',
				_List_Nil,
				_List_fromArray(
					[
						A3(
						$elm$virtual_dom$VirtualDom$node,
						'style',
						_List_Nil,
						_List_fromArray(
							[
								$elm$virtual_dom$VirtualDom$text($mdgriffith$elm_ui$Internal$Style$rules)
							]))
					]));
		case 'NoStaticStyleSheet':
			return $elm$virtual_dom$VirtualDom$text('');
		default:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'elm-ui-static-rules',
				_List_fromArray(
					[
						A2(
						$elm$virtual_dom$VirtualDom$property,
						'rules',
						$elm$json$Json$Encode$string($mdgriffith$elm_ui$Internal$Style$rules))
					]),
				_List_Nil);
	}
};
var $mdgriffith$elm_ui$Internal$Model$fontName = function (font) {
	switch (font.$) {
		case 'Serif':
			return 'serif';
		case 'SansSerif':
			return 'sans-serif';
		case 'Monospace':
			return 'monospace';
		case 'Typeface':
			var name = font.a;
			return '\"' + (name + '\"');
		case 'ImportFont':
			var name = font.a;
			var url = font.b;
			return '\"' + (name + '\"');
		default:
			var name = font.a.name;
			return '\"' + (name + '\"');
	}
};
var $mdgriffith$elm_ui$Internal$Model$isSmallCaps = function (_var) {
	switch (_var.$) {
		case 'VariantActive':
			var name = _var.a;
			return name === 'smcp';
		case 'VariantOff':
			var name = _var.a;
			return false;
		default:
			var name = _var.a;
			var index = _var.b;
			return (name === 'smcp') && (index === 1);
	}
};
var $mdgriffith$elm_ui$Internal$Model$hasSmallCaps = function (typeface) {
	if (typeface.$ === 'FontWith') {
		var font = typeface.a;
		return A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.variants);
	} else {
		return false;
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $mdgriffith$elm_ui$Internal$Model$renderProps = F3(
	function (force, _v0, existing) {
		var key = _v0.a;
		var val = _v0.b;
		return force ? (existing + ('\n  ' + (key + (': ' + (val + ' !important;'))))) : (existing + ('\n  ' + (key + (': ' + (val + ';')))));
	});
var $mdgriffith$elm_ui$Internal$Model$renderStyle = F4(
	function (options, maybePseudo, selector, props) {
		if (maybePseudo.$ === 'Nothing') {
			return _List_fromArray(
				[
					selector + ('{' + (A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_ui$Internal$Model$renderProps(false),
					'',
					props) + '\n}'))
				]);
		} else {
			var pseudo = maybePseudo.a;
			switch (pseudo.$) {
				case 'Hover':
					var _v2 = options.hover;
					switch (_v2.$) {
						case 'NoHover':
							return _List_Nil;
						case 'ForceHover':
							return _List_fromArray(
								[
									selector + ('-hv {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(true),
									'',
									props) + '\n}'))
								]);
						default:
							return _List_fromArray(
								[
									selector + ('-hv:hover {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(false),
									'',
									props) + '\n}'))
								]);
					}
				case 'Focus':
					var renderedProps = A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props);
					return _List_fromArray(
						[selector + ('-fs:focus {' + (renderedProps + '\n}')), ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.any + (':focus ' + (selector + '-fs  {')))) + (renderedProps + '\n}'), (selector + '-fs:focus-within {') + (renderedProps + '\n}'), ('.focusable-parent:focus ~ ' + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + (selector + '-fs {'))))) + (renderedProps + '\n}')]);
				default:
					return _List_fromArray(
						[
							selector + ('-act:active {' + (A3(
							$elm$core$List$foldl,
							$mdgriffith$elm_ui$Internal$Model$renderProps(false),
							'',
							props) + '\n}'))
						]);
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderVariant = function (_var) {
	switch (_var.$) {
		case 'VariantActive':
			var name = _var.a;
			return '\"' + (name + '\"');
		case 'VariantOff':
			var name = _var.a;
			return '\"' + (name + '\" 0');
		default:
			var name = _var.a;
			var index = _var.b;
			return '\"' + (name + ('\" ' + $elm$core$String$fromInt(index)));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderVariants = function (typeface) {
	if (typeface.$ === 'FontWith') {
		var font = typeface.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$renderVariant, font.variants)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformValue = function (transform) {
	switch (transform.$) {
		case 'Untransformed':
			return $elm$core$Maybe$Nothing;
		case 'Moved':
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'translate3d(' + ($elm$core$String$fromFloat(x) + ('px, ' + ($elm$core$String$fromFloat(y) + ('px, ' + ($elm$core$String$fromFloat(z) + 'px)'))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			var translate = 'translate3d(' + ($elm$core$String$fromFloat(tx) + ('px, ' + ($elm$core$String$fromFloat(ty) + ('px, ' + ($elm$core$String$fromFloat(tz) + 'px)')))));
			var scale = 'scale3d(' + ($elm$core$String$fromFloat(sx) + (', ' + ($elm$core$String$fromFloat(sy) + (', ' + ($elm$core$String$fromFloat(sz) + ')')))));
			var rotate = 'rotate3d(' + ($elm$core$String$fromFloat(ox) + (', ' + ($elm$core$String$fromFloat(oy) + (', ' + ($elm$core$String$fromFloat(oz) + (', ' + ($elm$core$String$fromFloat(angle) + 'rad)')))))));
			return $elm$core$Maybe$Just(translate + (' ' + (scale + (' ' + rotate))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderStyleRule = F3(
	function (options, rule, maybePseudo) {
		switch (rule.$) {
			case 'Style':
				var selector = rule.a;
				var props = rule.b;
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, selector, props);
			case 'Shadows':
				var name = rule.a;
				var prop = rule.b;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, 'box-shadow', prop)
						]));
			case 'Transparency':
				var name = rule.a;
				var transparency = rule.b;
				var opacity = A2(
					$elm$core$Basics$max,
					0,
					A2($elm$core$Basics$min, 1, 1 - transparency));
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'opacity',
							$elm$core$String$fromFloat(opacity))
						]));
			case 'FontSize':
				var i = rule.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			case 'FontFamily':
				var name = rule.a;
				var typefaces = rule.b;
				var features = A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Internal$Model$renderVariants, typefaces));
				var families = _List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-family',
						A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$fontName, typefaces))),
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'font-feature-settings', features),
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-variant',
						A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$hasSmallCaps, typefaces) ? 'small-caps' : 'normal')
					]);
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, '.' + name, families);
			case 'Single':
				var _class = rule.a;
				var prop = rule.b;
				var val = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, prop, val)
						]));
			case 'Colored':
				var _class = rule.a;
				var prop = rule.b;
				var color = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							prop,
							$mdgriffith$elm_ui$Internal$Model$formatColor(color))
						]));
			case 'SpacingStyle':
				var cls = rule.a;
				var x = rule.b;
				var y = rule.c;
				var yPx = $elm$core$String$fromInt(y) + 'px';
				var xPx = $elm$core$String$fromInt(x) + 'px';
				var single = '.' + $mdgriffith$elm_ui$Internal$Style$classes.single;
				var row = '.' + $mdgriffith$elm_ui$Internal$Style$classes.row;
				var wrappedRow = '.' + ($mdgriffith$elm_ui$Internal$Style$classes.wrapped + row);
				var right = '.' + $mdgriffith$elm_ui$Internal$Style$classes.alignRight;
				var paragraph = '.' + $mdgriffith$elm_ui$Internal$Style$classes.paragraph;
				var page = '.' + $mdgriffith$elm_ui$Internal$Style$classes.page;
				var left = '.' + $mdgriffith$elm_ui$Internal$Style$classes.alignLeft;
				var halfY = $elm$core$String$fromFloat(y / 2) + 'px';
				var halfX = $elm$core$String$fromFloat(x / 2) + 'px';
				var column = '.' + $mdgriffith$elm_ui$Internal$Style$classes.column;
				var _class = '.' + cls;
				var any = '.' + $mdgriffith$elm_ui$Internal$Style$classes.any;
				return $elm$core$List$concat(
					_List_fromArray(
						[
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (row + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (wrappedRow + (' > ' + any)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (column + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_Utils_ap(_class, paragraph),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							'textarea' + (any + _class),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)')),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'height',
									'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::after'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-top',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::before'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-bottom',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								]))
						]));
			case 'PaddingStyle':
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'padding',
							$elm$core$String$fromFloat(top) + ('px ' + ($elm$core$String$fromFloat(right) + ('px ' + ($elm$core$String$fromFloat(bottom) + ('px ' + ($elm$core$String$fromFloat(left) + 'px')))))))
						]));
			case 'BorderWidth':
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'border-width',
							$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
						]));
			case 'GridTemplateStyle':
				var template = rule.a;
				var toGridLengthHelper = F3(
					function (minimum, maximum, x) {
						toGridLengthHelper:
						while (true) {
							switch (x.$) {
								case 'Px':
									var px = x.a;
									return $elm$core$String$fromInt(px) + 'px';
								case 'Content':
									var _v2 = _Utils_Tuple2(minimum, maximum);
									if (_v2.a.$ === 'Nothing') {
										if (_v2.b.$ === 'Nothing') {
											var _v3 = _v2.a;
											var _v4 = _v2.b;
											return 'max-content';
										} else {
											var _v6 = _v2.a;
											var maxSize = _v2.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v2.b.$ === 'Nothing') {
											var minSize = _v2.a.a;
											var _v5 = _v2.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + 'max-content)'));
										} else {
											var minSize = _v2.a.a;
											var maxSize = _v2.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 'Fill':
									var i = x.a;
									var _v7 = _Utils_Tuple2(minimum, maximum);
									if (_v7.a.$ === 'Nothing') {
										if (_v7.b.$ === 'Nothing') {
											var _v8 = _v7.a;
											var _v9 = _v7.b;
											return $elm$core$String$fromInt(i) + 'fr';
										} else {
											var _v11 = _v7.a;
											var maxSize = _v7.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v7.b.$ === 'Nothing') {
											var minSize = _v7.a.a;
											var _v10 = _v7.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(i) + ('fr' + 'fr)'))));
										} else {
											var minSize = _v7.a.a;
											var maxSize = _v7.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 'Min':
									var m = x.a;
									var len = x.b;
									var $temp$minimum = $elm$core$Maybe$Just(m),
										$temp$maximum = maximum,
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
								default:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = minimum,
										$temp$maximum = $elm$core$Maybe$Just(m),
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
							}
						}
					});
				var toGridLength = function (x) {
					return A3(toGridLengthHelper, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, x);
				};
				var xSpacing = toGridLength(template.spacing.a);
				var ySpacing = toGridLength(template.spacing.b);
				var rows = function (x) {
					return 'grid-template-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.rows)));
				var msRows = function (x) {
					return '-ms-grid-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.columns)));
				var msColumns = function (x) {
					return '-ms-grid-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.columns)));
				var gapY = 'grid-row-gap:' + (toGridLength(template.spacing.b) + ';');
				var gapX = 'grid-column-gap:' + (toGridLength(template.spacing.a) + ';');
				var columns = function (x) {
					return 'grid-template-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.columns)));
				var _class = '.grid-rows-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.rows)) + ('-cols-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.columns)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.spacing.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.spacing.b)))))));
				var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msColumns + (msRows + '}')));
				return _List_fromArray(
					[base, supports]);
			case 'GridPosition':
				var position = rule.a;
				var msPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'-ms-grid-row: ' + ($elm$core$String$fromInt(position.row) + ';'),
							'-ms-grid-row-span: ' + ($elm$core$String$fromInt(position.height) + ';'),
							'-ms-grid-column: ' + ($elm$core$String$fromInt(position.col) + ';'),
							'-ms-grid-column-span: ' + ($elm$core$String$fromInt(position.width) + ';')
						]));
				var modernPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'grid-row: ' + ($elm$core$String$fromInt(position.row) + (' / ' + ($elm$core$String$fromInt(position.row + position.height) + ';'))),
							'grid-column: ' + ($elm$core$String$fromInt(position.col) + (' / ' + ($elm$core$String$fromInt(position.col + position.width) + ';')))
						]));
				var _class = '.grid-pos-' + ($elm$core$String$fromInt(position.row) + ('-' + ($elm$core$String$fromInt(position.col) + ('-' + ($elm$core$String$fromInt(position.width) + ('-' + $elm$core$String$fromInt(position.height)))))));
				var modernGrid = _class + ('{' + (modernPosition + '}'));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msPosition + '}'));
				return _List_fromArray(
					[base, supports]);
			case 'PseudoSelector':
				var _class = rule.a;
				var styles = rule.b;
				var renderPseudoRule = function (style) {
					return A3(
						$mdgriffith$elm_ui$Internal$Model$renderStyleRule,
						options,
						style,
						$elm$core$Maybe$Just(_class));
				};
				return A2($elm$core$List$concatMap, renderPseudoRule, styles);
			default:
				var transform = rule.a;
				var val = $mdgriffith$elm_ui$Internal$Model$transformValue(transform);
				var _class = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				var _v12 = _Utils_Tuple2(_class, val);
				if ((_v12.a.$ === 'Just') && (_v12.b.$ === 'Just')) {
					var cls = _v12.a.a;
					var v = _v12.b.a;
					return A4(
						$mdgriffith$elm_ui$Internal$Model$renderStyle,
						options,
						maybePseudo,
						'.' + cls,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
							]));
				} else {
					return _List_Nil;
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$encodeStyles = F2(
	function (options, stylesheet) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$map,
				function (style) {
					var styled = A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing);
					return _Utils_Tuple2(
						$mdgriffith$elm_ui$Internal$Model$getStyleName(style),
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, styled));
				},
				stylesheet));
	});
var $mdgriffith$elm_ui$Internal$Model$bracket = F2(
	function (selector, rules) {
		var renderPair = function (_v0) {
			var name = _v0.a;
			var val = _v0.b;
			return name + (': ' + (val + ';'));
		};
		return selector + (' {' + (A2(
			$elm$core$String$join,
			'',
			A2($elm$core$List$map, renderPair, rules)) + '}'));
	});
var $mdgriffith$elm_ui$Internal$Model$fontRule = F3(
	function (name, modifier, _v0) {
		var parentAdj = _v0.a;
		var textAdjustment = _v0.b;
		return _List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + (', ' + ('.' + (name + (' .' + modifier))))))), parentAdj),
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.text + (', .' + (name + (' .' + (modifier + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.text)))))))))), textAdjustment)
			]);
	});
var $mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule = F3(
	function (fontToAdjust, _v0, otherFontName) {
		var full = _v0.a;
		var capital = _v0.b;
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_Utils_ap(
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital, capital),
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.fullSize, full)));
	});
var $mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule = F2(
	function (fontToAdjust, otherFontName) {
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital + (', ' + ('.' + (name + (' .' + $mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.text + (', .' + (name + (' .' + ($mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.text)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {height: height / size, size: size, vertical: vertical};
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$convertAdjustment = function (adjustment) {
	var lines = _List_fromArray(
		[adjustment.capital, adjustment.baseline, adjustment.descender, adjustment.lowercase]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.descender,
		$elm$core$List$minimum(lines));
	var newBaseline = A2(
		$elm$core$Maybe$withDefault,
		adjustment.baseline,
		$elm$core$List$minimum(
			A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, descender);
				},
				lines)));
	var base = lineHeight;
	var ascender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.capital,
		$elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		capital: A3($mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		full: A3($mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
	};
};
var $mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules = function (converted) {
	return _Utils_Tuple2(
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'block')
			]),
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'inline-block'),
				_Utils_Tuple2(
				'line-height',
				$elm$core$String$fromFloat(converted.height)),
				_Utils_Tuple2(
				'vertical-align',
				$elm$core$String$fromFloat(converted.vertical) + 'em'),
				_Utils_Tuple2(
				'font-size',
				$elm$core$String$fromFloat(converted.size) + 'em')
			]));
};
var $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment = function (typefaces) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (face, found) {
				if (found.$ === 'Nothing') {
					if (face.$ === 'FontWith') {
						var _with = face.a;
						var _v2 = _with.adjustment;
						if (_v2.$ === 'Nothing') {
							return found;
						} else {
							var adjustment = _v2.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.full;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.capital;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment)))));
						}
					} else {
						return found;
					}
				} else {
					return found;
				}
			}),
		$elm$core$Maybe$Nothing,
		typefaces);
};
var $mdgriffith$elm_ui$Internal$Model$renderTopLevelValues = function (rules) {
	var withImport = function (font) {
		if (font.$ === 'ImportFont') {
			var url = font.b;
			return $elm$core$Maybe$Just('@import url(\'' + (url + '\');'));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var fontImports = function (_v2) {
		var name = _v2.a;
		var typefaces = _v2.b;
		var imports = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$filterMap, withImport, typefaces));
		return imports;
	};
	var allNames = A2($elm$core$List$map, $elm$core$Tuple$first, rules);
	var fontAdjustments = function (_v1) {
		var name = _v1.a;
		var typefaces = _v1.b;
		var _v0 = $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment(typefaces);
		if (_v0.$ === 'Nothing') {
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule(name),
					allNames));
		} else {
			var adjustment = _v0.a;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					A2($mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule, name, adjustment),
					allNames));
		}
	};
	return _Utils_ap(
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontImports, rules)),
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontAdjustments, rules)));
};
var $mdgriffith$elm_ui$Internal$Model$topLevelValue = function (rule) {
	if (rule.$ === 'FontFamily') {
		var name = rule.a;
		var typefaces = rule.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(name, typefaces));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var combine = F2(
			function (style, rendered) {
				return {
					rules: _Utils_ap(
						rendered.rules,
						A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing)),
					topLevel: function () {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_v1.$ === 'Nothing') {
							return rendered.topLevel;
						} else {
							var topLevel = _v1.a;
							return A2($elm$core$List$cons, topLevel, rendered.topLevel);
						}
					}()
				};
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			combine,
			{rules: _List_Nil, topLevel: _List_Nil},
			stylesheet);
		var topLevel = _v0.topLevel;
		var rules = _v0.rules;
		return _Utils_ap(
			$mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			$elm$core$String$concat(rules));
	});
var $mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		var _v0 = options.mode;
		switch (_v0.$) {
			case 'Layout':
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			case 'NoStaticStyleSheet':
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			default:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'elm-ui-rules',
					_List_fromArray(
						[
							A2(
							$elm$virtual_dom$VirtualDom$property,
							'rules',
							A2($mdgriffith$elm_ui$Internal$Model$encodeStyles, options, styleSheet))
						]),
					_List_Nil);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.focus)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'static-stylesheet',
				$mdgriffith$elm_ui$Internal$Model$staticRoot(opts)),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
				children)) : A2(
			$elm$core$List$cons,
			_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
			children);
	});
var $mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.focus)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Internal$Model$staticRoot(opts),
			A2($elm$core$List$cons, dynamicStyleSheet, children)) : A2($elm$core$List$cons, dynamicStyleSheet, children);
	});
var $mdgriffith$elm_ui$Internal$Flag$heightBetween = $mdgriffith$elm_ui$Internal$Flag$flag(45);
var $mdgriffith$elm_ui$Internal$Flag$heightFill = $mdgriffith$elm_ui$Internal$Flag$flag(37);
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $mdgriffith$elm_ui$Internal$Flag$present = F2(
	function (myFlag, _v0) {
		var fieldOne = _v0.a;
		var fieldTwo = _v0.b;
		if (myFlag.$ === 'Flag') {
			var first = myFlag.a;
			return _Utils_eq(first & fieldOne, first);
		} else {
			var second = myFlag.a;
			return _Utils_eq(second & fieldTwo, second);
		}
	});
var $elm$html$Html$s = _VirtualDom_node('s');
var $elm$html$Html$u = _VirtualDom_node('u');
var $mdgriffith$elm_ui$Internal$Flag$widthBetween = $mdgriffith$elm_ui$Internal$Flag$flag(44);
var $mdgriffith$elm_ui$Internal$Flag$widthFill = $mdgriffith$elm_ui$Internal$Flag$flag(39);
var $mdgriffith$elm_ui$Internal$Model$finalizeNode = F6(
	function (has, node, attributes, children, embedMode, parentContext) {
		var createNode = F2(
			function (nodeName, attrs) {
				if (children.$ === 'Keyed') {
					var keyed = children.a;
					return A3(
						$elm$virtual_dom$VirtualDom$keyedNode,
						nodeName,
						attrs,
						function () {
							switch (embedMode.$) {
								case 'NoStyleSheet':
									return keyed;
								case 'OnlyDynamic':
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, false, opts, styles, keyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, true, opts, styles, keyed);
							}
						}());
				} else {
					var unkeyed = children.a;
					return A2(
						function () {
							switch (nodeName) {
								case 'div':
									return $elm$html$Html$div;
								case 'p':
									return $elm$html$Html$p;
								default:
									return $elm$virtual_dom$VirtualDom$node(nodeName);
							}
						}(),
						attrs,
						function () {
							switch (embedMode.$) {
								case 'NoStyleSheet':
									return unkeyed;
								case 'OnlyDynamic':
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, false, opts, styles, unkeyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, true, opts, styles, unkeyed);
							}
						}());
				}
			});
		var html = function () {
			switch (node.$) {
				case 'Generic':
					return A2(createNode, 'div', attributes);
				case 'NodeName':
					var nodeName = node.a;
					return A2(createNode, nodeName, attributes);
				default:
					var nodeName = node.a;
					var internal = node.b;
					return A3(
						$elm$virtual_dom$VirtualDom$node,
						nodeName,
						attributes,
						_List_fromArray(
							[
								A2(
								createNode,
								internal,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.single))
									]))
							]));
			}
		}();
		switch (parentContext.$) {
			case 'AsRow':
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignRight, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.container, $mdgriffith$elm_ui$Internal$Style$classes.contentCenterY, $mdgriffith$elm_ui$Internal$Style$classes.alignContainerRight])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerX, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.container, $mdgriffith$elm_ui$Internal$Style$classes.contentCenterY, $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX])))
						]),
					_List_fromArray(
						[html])) : html));
			case 'AsColumn':
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerY, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.container, $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignBottom, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.container, $mdgriffith$elm_ui$Internal$Style$classes.alignContainerBottom])))
						]),
					_List_fromArray(
						[html])) : html));
			default:
				return html;
		}
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $mdgriffith$elm_ui$Internal$Model$textElementClasses = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.text + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.widthContent + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.heightContent)))));
var $mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textElementFillClasses = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.text + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.widthFill + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.heightFill)))));
var $mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementFillClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$createElement = F3(
	function (context, children, rendered) {
		var gatherKeyed = F2(
			function (_v8, _v9) {
				var key = _v8.a;
				var child = _v8.b;
				var htmls = _v9.a;
				var existingStyles = _v9.b;
				switch (child.$) {
					case 'Unstyled':
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles);
					case 'Styled':
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.styles : _Utils_ap(styled.styles, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.styles : _Utils_ap(styled.styles, existingStyles));
					case 'Text':
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str)),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		var gather = F2(
			function (child, _v6) {
				var htmls = _v6.a;
				var existingStyles = _v6.b;
				switch (child.$) {
					case 'Unstyled':
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles);
					case 'Styled':
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.styles : _Utils_ap(styled.styles, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.styles : _Utils_ap(styled.styles, existingStyles));
					case 'Text':
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		if (children.$ === 'Keyed') {
			var keyedChildren = children.a;
			var _v1 = A3(
				$elm$core$List$foldr,
				gatherKeyed,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				keyedChildren);
			var keyed = _v1.a;
			var styles = _v1.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.styles : _Utils_ap(rendered.styles, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.has,
						rendered.node,
						rendered.attributes,
						$mdgriffith$elm_ui$Internal$Model$Keyed(
							A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.children)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						html: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.has,
							rendered.node,
							rendered.attributes,
							$mdgriffith$elm_ui$Internal$Model$Keyed(
								A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.children))),
						styles: allStyles
					});
			}
		} else {
			var unkeyedChildren = children.a;
			var _v3 = A3(
				$elm$core$List$foldr,
				gather,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				unkeyedChildren);
			var unkeyed = _v3.a;
			var styles = _v3.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.styles : _Utils_ap(rendered.styles, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.has,
						rendered.node,
						rendered.attributes,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.children)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						html: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.has,
							rendered.node,
							rendered.attributes,
							$mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.children))),
						styles: allStyles
					});
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Single = F3(
	function (a, b, c) {
		return {$: 'Single', a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$Transform = function (a) {
	return {$: 'Transform', a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $mdgriffith$elm_ui$Internal$Flag$add = F2(
	function (myFlag, _v0) {
		var one = _v0.a;
		var two = _v0.b;
		if (myFlag.$ === 'Flag') {
			var first = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, first | one, two);
		} else {
			var second = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, one, second | two);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehind = function (a) {
	return {$: 'ChildrenBehind', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront = F2(
	function (a, b) {
		return {$: 'ChildrenBehindAndInFront', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenInFront = function (a) {
	return {$: 'ChildrenInFront', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$nearbyElement = F2(
	function (location, elem) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					function () {
						switch (location.$) {
							case 'Above':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.above]));
							case 'Below':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.below]));
							case 'OnRight':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.onRight]));
							case 'OnLeft':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.onLeft]));
							case 'InFront':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.inFront]));
							default:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.behind]));
						}
					}())
				]),
			_List_fromArray(
				[
					function () {
					switch (elem.$) {
						case 'Empty':
							return $elm$virtual_dom$VirtualDom$text('');
						case 'Text':
							var str = elem.a;
							return $mdgriffith$elm_ui$Internal$Model$textElement(str);
						case 'Unstyled':
							var html = elem.a;
							return html($mdgriffith$elm_ui$Internal$Model$asEl);
						default:
							var styled = elem.a;
							return A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, $mdgriffith$elm_ui$Internal$Model$asEl);
					}
				}()
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$addNearbyElement = F3(
	function (location, elem, existing) {
		var nearby = A2($mdgriffith$elm_ui$Internal$Model$nearbyElement, location, elem);
		switch (existing.$) {
			case 'NoNearbyChildren':
				if (location.$ === 'Behind') {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						_List_fromArray(
							[nearby]));
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						_List_fromArray(
							[nearby]));
				}
			case 'ChildrenBehind':
				var existingBehind = existing.a;
				if (location.$ === 'Behind') {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						A2($elm$core$List$cons, nearby, existingBehind));
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						_List_fromArray(
							[nearby]));
				}
			case 'ChildrenInFront':
				var existingInFront = existing.a;
				if (location.$ === 'Behind') {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						_List_fromArray(
							[nearby]),
						existingInFront);
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						A2($elm$core$List$cons, nearby, existingInFront));
				}
			default:
				var existingBehind = existing.a;
				var existingInFront = existing.b;
				if (location.$ === 'Behind') {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						A2($elm$core$List$cons, nearby, existingBehind),
						existingInFront);
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						A2($elm$core$List$cons, nearby, existingInFront));
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 'Embedded', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 'NodeName', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addNodeName = F2(
	function (newNode, old) {
		switch (old.$) {
			case 'Generic':
				return $mdgriffith$elm_ui$Internal$Model$NodeName(newNode);
			case 'NodeName':
				var name = old.a;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, name, newNode);
			default:
				var x = old.a;
				var y = old.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$alignXName = function (align) {
	switch (align.$) {
		case 'Left':
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedHorizontally + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignLeft);
		case 'Right':
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedHorizontally + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignRight);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedHorizontally + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignCenterX);
	}
};
var $mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align.$) {
		case 'Top':
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedVertically + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignTop);
		case 'Bottom':
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedVertically + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignBottom);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedVertically + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignCenterY);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Model$FullTransform = F4(
	function (a, b, c, d) {
		return {$: 'FullTransform', a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$Moved = function (a) {
	return {$: 'Moved', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$composeTransformation = F2(
	function (transform, component) {
		switch (transform.$) {
			case 'Untransformed':
				switch (component.$) {
					case 'MoveX':
						var x = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, 0, 0));
					case 'MoveY':
						var y = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, y, 0));
					case 'MoveZ':
						var z = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, 0, z));
					case 'MoveXYZ':
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 'Rotate':
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var xyz = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							xyz,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			case 'Moved':
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				switch (component.$) {
					case 'MoveX':
						var newX = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(newX, y, z));
					case 'MoveY':
						var newY = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, newY, z));
					case 'MoveZ':
						var newZ = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, y, newZ));
					case 'MoveXYZ':
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 'Rotate':
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var scale = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							scale,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			default:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				var scaled = transform.b;
				var origin = transform.c;
				var angle = transform.d;
				switch (component.$) {
					case 'MoveX':
						var newX = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(newX, y, z),
							scaled,
							origin,
							angle);
					case 'MoveY':
						var newY = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, newY, z),
							scaled,
							origin,
							angle);
					case 'MoveZ':
						var newZ = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, y, newZ),
							scaled,
							origin,
							angle);
					case 'MoveXYZ':
						var newMove = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, newMove, scaled, origin, angle);
					case 'Rotate':
						var newOrigin = component.a;
						var newAngle = component.b;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, scaled, newOrigin, newAngle);
					default:
						var newScale = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, newScale, origin, angle);
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$height = $mdgriffith$elm_ui$Internal$Flag$flag(7);
var $mdgriffith$elm_ui$Internal$Flag$heightContent = $mdgriffith$elm_ui$Internal$Flag$flag(36);
var $mdgriffith$elm_ui$Internal$Flag$merge = F2(
	function (_v0, _v1) {
		var one = _v0.a;
		var two = _v0.b;
		var three = _v1.a;
		var four = _v1.b;
		return A2($mdgriffith$elm_ui$Internal$Flag$Field, one | three, two | four);
	});
var $mdgriffith$elm_ui$Internal$Flag$none = A2($mdgriffith$elm_ui$Internal$Flag$Field, 0, 0);
var $mdgriffith$elm_ui$Internal$Model$renderHeight = function (h) {
	switch (h.$) {
		case 'Px':
			var px = h.a;
			var val = $elm$core$String$fromInt(px);
			var name = 'height-px-' + val;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.heightExact + (' ' + name),
				_List_fromArray(
					[
						A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 'Content':
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.heightContent,
				_List_Nil);
		case 'Fill':
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.heightFill,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.heightFillPortion + (' height-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.any + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.column + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'height-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 'Min':
			var minSize = h.a;
			var len = h.b;
			var cls = 'min-height-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-height',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = h.a;
			var len = h.b;
			var cls = 'max-height-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-height',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$widthContent = $mdgriffith$elm_ui$Internal$Flag$flag(38);
var $mdgriffith$elm_ui$Internal$Model$renderWidth = function (w) {
	switch (w.$) {
		case 'Px':
			var px = w.a;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.widthExact + (' width-px-' + $elm$core$String$fromInt(px)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						'width-px-' + $elm$core$String$fromInt(px),
						'width',
						$elm$core$String$fromInt(px) + 'px')
					]));
		case 'Content':
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.widthContent,
				_List_Nil);
		case 'Fill':
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.widthFill,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.widthFillPortion + (' width-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.any + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.row + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'width-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 'Min':
			var minSize = w.a;
			var len = w.b;
			var cls = 'min-width-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-width',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = w.a;
			var len = w.b;
			var cls = 'max-width-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-width',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$borderWidth = $mdgriffith$elm_ui$Internal$Flag$flag(27);
var $mdgriffith$elm_ui$Internal$Model$skippable = F2(
	function (flag, style) {
		if (_Utils_eq(flag, $mdgriffith$elm_ui$Internal$Flag$borderWidth)) {
			if (style.$ === 'Single') {
				var val = style.c;
				switch (val) {
					case '0px':
						return true;
					case '1px':
						return true;
					case '2px':
						return true;
					case '3px':
						return true;
					case '4px':
						return true;
					case '5px':
						return true;
					case '6px':
						return true;
					default:
						return false;
				}
			} else {
				return false;
			}
		} else {
			switch (style.$) {
				case 'FontSize':
					var i = style.a;
					return (i >= 8) && (i <= 32);
				case 'PaddingStyle':
					var name = style.a;
					var t = style.b;
					var r = style.c;
					var b = style.d;
					var l = style.e;
					return _Utils_eq(t, b) && (_Utils_eq(t, r) && (_Utils_eq(t, l) && ((t >= 0) && (t <= 24))));
				default:
					return false;
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$width = $mdgriffith$elm_ui$Internal$Flag$flag(6);
var $mdgriffith$elm_ui$Internal$Flag$xAlign = $mdgriffith$elm_ui$Internal$Flag$flag(30);
var $mdgriffith$elm_ui$Internal$Flag$yAlign = $mdgriffith$elm_ui$Internal$Flag$flag(29);
var $mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive = F8(
	function (classes, node, has, transform, styles, attrs, children, elementAttrs) {
		gatherAttrRecursive:
		while (true) {
			if (!elementAttrs.b) {
				var _v1 = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				if (_v1.$ === 'Nothing') {
					return {
						attributes: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes),
							attrs),
						children: children,
						has: has,
						node: node,
						styles: styles
					};
				} else {
					var _class = _v1.a;
					return {
						attributes: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						children: children,
						has: has,
						node: node,
						styles: A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$Transform(transform),
							styles)
					};
				}
			} else {
				var attribute = elementAttrs.a;
				var remaining = elementAttrs.b;
				switch (attribute.$) {
					case 'NoAttribute':
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 'Class':
						var flag = attribute.a;
						var exactClassName = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = exactClassName + (' ' + classes),
								$temp$node = node,
								$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					case 'Attr':
						var actualAttribute = attribute.a;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = A2($elm$core$List$cons, actualAttribute, attrs),
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 'StyleClass':
						var flag = attribute.a;
						var style = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							if (A2($mdgriffith$elm_ui$Internal$Model$skippable, flag, style)) {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							} else {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = A2($elm$core$List$cons, style, styles),
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							}
						}
					case 'TransformComponent':
						var flag = attribute.a;
						var component = attribute.b;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
							$temp$transform = A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, transform, component),
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 'Width':
						var width = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$width, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (width.$) {
								case 'Px':
									var px = width.a;
									var $temp$classes = ($mdgriffith$elm_ui$Internal$Style$classes.widthExact + (' width-px-' + $elm$core$String$fromInt(px))) + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3(
											$mdgriffith$elm_ui$Internal$Model$Single,
											'width-px-' + $elm$core$String$fromInt(px),
											'width',
											$elm$core$String$fromInt(px) + 'px'),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 'Content':
									var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.widthContent),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$widthContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 'Fill':
									var portion = width.a;
									if (portion === 1) {
										var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.widthFill),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.widthFillPortion + (' width-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.any + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.row + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'width-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v4 = $mdgriffith$elm_ui$Internal$Model$renderWidth(width);
									var addToFlags = _v4.a;
									var newClass = _v4.b;
									var newStyles = _v4.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 'Height':
						var height = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$height, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (height.$) {
								case 'Px':
									var px = height.a;
									var val = $elm$core$String$fromInt(px) + 'px';
									var name = 'height-px-' + val;
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.heightExact + (' ' + (name + (' ' + classes))),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height ', val),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 'Content':
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.heightContent + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$heightContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 'Fill':
									var portion = height.a;
									if (portion === 1) {
										var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.heightFill + (' ' + classes),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.heightFillPortion + (' height-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.any + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.column + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'height-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v6 = $mdgriffith$elm_ui$Internal$Model$renderHeight(height);
									var addToFlags = _v6.a;
									var newClass = _v6.b;
									var newStyles = _v6.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 'Describe':
						var description = attribute.a;
						switch (description.$) {
							case 'Main':
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'main', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Navigation':
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'nav', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'ContentInfo':
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'footer', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Complementary':
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'aside', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Heading':
								var i = description.a;
								if (i <= 1) {
									var $temp$classes = classes,
										$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h1', node),
										$temp$has = has,
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								} else {
									if (i < 7) {
										var $temp$classes = classes,
											$temp$node = A2(
											$mdgriffith$elm_ui$Internal$Model$addNodeName,
											'h' + $elm$core$String$fromInt(i),
											node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes,
											$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h6', node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								}
							case 'Paragraph':
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Button':
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'role', 'button'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Label':
								var label = description.a;
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-label', label),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'LivePolite':
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'polite'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							default:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'assertive'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
						}
					case 'Nearby':
						var location = attribute.a;
						var elem = attribute.b;
						var newStyles = function () {
							switch (elem.$) {
								case 'Empty':
									return styles;
								case 'Text':
									var str = elem.a;
									return styles;
								case 'Unstyled':
									var html = elem.a;
									return styles;
								default:
									var styled = elem.a;
									return _Utils_ap(styles, styled.styles);
							}
						}();
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = newStyles,
							$temp$attrs = attrs,
							$temp$children = A3($mdgriffith$elm_ui$Internal$Model$addNearbyElement, location, elem, children),
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 'AlignX':
						var x = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignXName(x) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (x.$) {
									case 'CenterX':
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerX, flags);
									case 'Right':
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignRight, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					default:
						var y = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignYName(y) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (y.$) {
									case 'CenterY':
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerY, flags);
									case 'Bottom':
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignBottom, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
				}
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Untransformed = {$: 'Untransformed'};
var $mdgriffith$elm_ui$Internal$Model$untransformed = $mdgriffith$elm_ui$Internal$Model$Untransformed;
var $mdgriffith$elm_ui$Internal$Model$element = F4(
	function (context, node, attributes, children) {
		return A3(
			$mdgriffith$elm_ui$Internal$Model$createElement,
			context,
			children,
			A8(
				$mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive,
				$mdgriffith$elm_ui$Internal$Model$contextClasses(context),
				node,
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Model$untransformed,
				_List_Nil,
				_List_Nil,
				$mdgriffith$elm_ui$Internal$Model$NoNearbyChildren,
				$elm$core$List$reverse(attributes)));
	});
var $mdgriffith$elm_ui$Internal$Model$AllowHover = {$: 'AllowHover'};
var $mdgriffith$elm_ui$Internal$Model$Layout = {$: 'Layout'};
var $mdgriffith$elm_ui$Internal$Model$Rgba = F4(
	function (a, b, c, d) {
		return {$: 'Rgba', a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	backgroundColor: $elm$core$Maybe$Nothing,
	borderColor: $elm$core$Maybe$Nothing,
	shadow: $elm$core$Maybe$Just(
		{
			blur: 0,
			color: A4($mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			offset: _Utils_Tuple2(0, 0),
			size: 3
		})
};
var $mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 'HoverOption':
					var hoverable = opt.a;
					var _v4 = record.hover;
					if (_v4.$ === 'Nothing') {
						return _Utils_update(
							record,
							{
								hover: $elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 'FocusStyleOption':
					var focusStyle = opt.a;
					var _v5 = record.focus;
					if (_v5.$ === 'Nothing') {
						return _Utils_update(
							record,
							{
								focus: $elm$core$Maybe$Just(focusStyle)
							});
					} else {
						return record;
					}
				default:
					var renderMode = opt.a;
					var _v6 = record.mode;
					if (_v6.$ === 'Nothing') {
						return _Utils_update(
							record,
							{
								mode: $elm$core$Maybe$Just(renderMode)
							});
					} else {
						return record;
					}
			}
		});
	var andFinally = function (record) {
		return {
			focus: function () {
				var _v0 = record.focus;
				if (_v0.$ === 'Nothing') {
					return $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _v0.a;
					return focusable;
				}
			}(),
			hover: function () {
				var _v1 = record.hover;
				if (_v1.$ === 'Nothing') {
					return $mdgriffith$elm_ui$Internal$Model$AllowHover;
				} else {
					var hoverable = _v1.a;
					return hoverable;
				}
			}(),
			mode: function () {
				var _v2 = record.mode;
				if (_v2.$ === 'Nothing') {
					return $mdgriffith$elm_ui$Internal$Model$Layout;
				} else {
					var actualMode = _v2.a;
					return actualMode;
				}
			}()
		};
	};
	return andFinally(
		A3(
			$elm$core$List$foldr,
			combine,
			{focus: $elm$core$Maybe$Nothing, hover: $elm$core$Maybe$Nothing, mode: $elm$core$Maybe$Nothing},
			options));
};
var $mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 'Unstyled':
				var html = el.a;
				return html($mdgriffith$elm_ui$Internal$Model$asEl);
			case 'Styled':
				var styles = el.a.styles;
				var html = el.a.html;
				return A2(
					html,
					mode(styles),
					$mdgriffith$elm_ui$Internal$Model$asEl);
			case 'Text':
				var text = el.a;
				return $mdgriffith$elm_ui$Internal$Model$textElement(text);
			default:
				return $mdgriffith$elm_ui$Internal$Model$textElement('');
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderRoot = F3(
	function (optionList, attributes, child) {
		var options = $mdgriffith$elm_ui$Internal$Model$optionsToRecord(optionList);
		var embedStyle = function () {
			var _v0 = options.mode;
			if (_v0.$ === 'NoStaticStyleSheet') {
				return $mdgriffith$elm_ui$Internal$Model$OnlyDynamic(options);
			} else {
				return $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic(options);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Internal$Model$toHtml,
			embedStyle,
			A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				attributes,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[child]))));
	});
var $mdgriffith$elm_ui$Internal$Model$Colored = F3(
	function (a, b, c) {
		return {$: 'Colored', a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$FontFamily = F2(
	function (a, b) {
		return {$: 'FontFamily', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$FontSize = function (a) {
	return {$: 'FontSize', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$SansSerif = {$: 'SansSerif'};
var $mdgriffith$elm_ui$Internal$Model$StyleClass = F2(
	function (a, b) {
		return {$: 'StyleClass', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Typeface = function (a) {
	return {$: 'Typeface', a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$bgColor = $mdgriffith$elm_ui$Internal$Flag$flag(8);
var $mdgriffith$elm_ui$Internal$Flag$fontColor = $mdgriffith$elm_ui$Internal$Flag$flag(14);
var $mdgriffith$elm_ui$Internal$Flag$fontFamily = $mdgriffith$elm_ui$Internal$Flag$flag(5);
var $mdgriffith$elm_ui$Internal$Flag$fontSize = $mdgriffith$elm_ui$Internal$Flag$flag(4);
var $mdgriffith$elm_ui$Internal$Model$formatColorClass = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return $mdgriffith$elm_ui$Internal$Model$floatClass(red) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(green) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(blue) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(alpha))))));
};
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$words = _String_words;
var $mdgriffith$elm_ui$Internal$Model$renderFontClassName = F2(
	function (font, current) {
		return _Utils_ap(
			current,
			function () {
				switch (font.$) {
					case 'Serif':
						return 'serif';
					case 'SansSerif':
						return 'sans-serif';
					case 'Monospace':
						return 'monospace';
					case 'Typeface':
						var name = font.a;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					case 'ImportFont':
						var name = font.a;
						var url = font.b;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					default:
						var name = font.a.name;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
				}
			}());
	});
var $mdgriffith$elm_ui$Internal$Model$rootStyle = function () {
	var families = _List_fromArray(
		[
			$mdgriffith$elm_ui$Internal$Model$Typeface('Open Sans'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Helvetica'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Verdana'),
			$mdgriffith$elm_ui$Internal$Model$SansSerif
		]);
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$bgColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1)),
				'color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontSize,
			$mdgriffith$elm_ui$Internal$Model$FontSize(20)),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontFamily,
			A2(
				$mdgriffith$elm_ui$Internal$Model$FontFamily,
				A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'font-', families),
				families))
		]);
}();
var $mdgriffith$elm_ui$Element$layoutWith = F3(
	function (_v0, attrs, child) {
		var options = _v0.options;
		return A3(
			$mdgriffith$elm_ui$Internal$Model$renderRoot,
			options,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass(
					A2(
						$elm$core$String$join,
						' ',
						_List_fromArray(
							[$mdgriffith$elm_ui$Internal$Style$classes.root, $mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single]))),
				_Utils_ap($mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var $mdgriffith$elm_ui$Element$layout = $mdgriffith$elm_ui$Element$layoutWith(
	{options: _List_Nil});
var $mdgriffith$elm_ui$Internal$Model$PaddingStyle = F5(
	function (a, b, c, d, e) {
		return {$: 'PaddingStyle', a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Flag$padding = $mdgriffith$elm_ui$Internal$Flag$flag(2);
var $mdgriffith$elm_ui$Element$padding = function (x) {
	var f = x;
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(x),
			f,
			f,
			f,
			f));
};
var $mdgriffith$elm_ui$Internal$Model$AlignX = function (a) {
	return {$: 'AlignX', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterX = {$: 'CenterX'};
var $mdgriffith$elm_ui$Element$centerX = $mdgriffith$elm_ui$Internal$Model$AlignX($mdgriffith$elm_ui$Internal$Model$CenterX);
var $mdgriffith$elm_ui$Internal$Model$AsColumn = {$: 'AsColumn'};
var $mdgriffith$elm_ui$Internal$Model$asColumn = $mdgriffith$elm_ui$Internal$Model$AsColumn;
var $mdgriffith$elm_ui$Internal$Model$Height = function (a) {
	return {$: 'Height', a: a};
};
var $mdgriffith$elm_ui$Element$height = $mdgriffith$elm_ui$Internal$Model$Height;
var $mdgriffith$elm_ui$Internal$Model$Content = {$: 'Content'};
var $mdgriffith$elm_ui$Element$shrink = $mdgriffith$elm_ui$Internal$Model$Content;
var $mdgriffith$elm_ui$Internal$Model$Width = function (a) {
	return {$: 'Width', a: a};
};
var $mdgriffith$elm_ui$Element$width = $mdgriffith$elm_ui$Internal$Model$Width;
var $mdgriffith$elm_ui$Element$column = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentTop + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.contentLeft)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Element$Font$family = function (families) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontFamily,
		A2(
			$mdgriffith$elm_ui$Internal$Model$FontFamily,
			A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'ff-', families),
			families));
};
var $mdgriffith$elm_ui$Internal$Model$Monospace = {$: 'Monospace'};
var $mdgriffith$elm_ui$Element$Font$monospace = $mdgriffith$elm_ui$Internal$Model$Monospace;
var $mdgriffith$elm_ui$Internal$Model$Describe = function (a) {
	return {$: 'Describe', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Paragraph = {$: 'Paragraph'};
var $mdgriffith$elm_ui$Internal$Model$Fill = function (a) {
	return {$: 'Fill', a: a};
};
var $mdgriffith$elm_ui$Element$fill = $mdgriffith$elm_ui$Internal$Model$Fill(1);
var $mdgriffith$elm_ui$Internal$Model$SpacingStyle = F3(
	function (a, b, c) {
		return {$: 'SpacingStyle', a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Flag$spacing = $mdgriffith$elm_ui$Internal$Flag$flag(3);
var $mdgriffith$elm_ui$Internal$Model$spacingName = F2(
	function (x, y) {
		return 'spacing-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y)));
	});
var $mdgriffith$elm_ui$Element$spacing = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$spacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
			A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, x),
			x,
			x));
};
var $mdgriffith$elm_ui$Element$paragraph = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asParagraph,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Paragraph),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$spacing(5),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Internal$Model$Text = function (a) {
	return {$: 'Text', a: a};
};
var $mdgriffith$elm_ui$Element$text = function (content) {
	return $mdgriffith$elm_ui$Internal$Model$Text(content);
};
var $author$project$Main$monospaced = function (str) {
	return A2(
		$mdgriffith$elm_ui$Element$paragraph,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$family(
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$Font$monospace]))
			]),
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$text(str)
			]));
};
var $mdgriffith$elm_ui$Element$Font$size = function (i) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontSize,
		$mdgriffith$elm_ui$Internal$Model$FontSize(i));
};
var $author$project$Main$BackHome = {$: 'BackHome'};
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$scaleFrom255 = function (c) {
	return c / 255;
};
var $avh4$elm_color$Color$rgb255 = F3(
	function (r, g, b) {
		return A4(
			$avh4$elm_color$Color$RgbaSpace,
			$avh4$elm_color$Color$scaleFrom255(r),
			$avh4$elm_color$Color$scaleFrom255(g),
			$avh4$elm_color$Color$scaleFrom255(b),
			1.0);
	});
var $Orasund$elm_ui_widgets$Widget$Style$Material$defaultPalette = {
	background: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
	error: A3($avh4$elm_color$Color$rgb255, 176, 0, 32),
	on: {
		background: A3($avh4$elm_color$Color$rgb255, 0, 0, 0),
		error: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
		primary: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
		secondary: A3($avh4$elm_color$Color$rgb255, 0, 0, 0),
		surface: A3($avh4$elm_color$Color$rgb255, 0, 0, 0)
	},
	primary: A3($avh4$elm_color$Color$rgb255, 98, 0, 238),
	secondary: A3($avh4$elm_color$Color$rgb255, 3, 218, 198),
	surface: A3($avh4$elm_color$Color$rgb255, 255, 255, 255)
};
var $mdgriffith$elm_ui$Internal$Model$Button = {$: 'Button'};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $mdgriffith$elm_ui$Internal$Model$NoAttribute = {$: 'NoAttribute'};
var $mdgriffith$elm_ui$Element$Input$hasFocusStyle = function (attr) {
	if (((attr.$ === 'StyleClass') && (attr.b.$ === 'PseudoSelector')) && (attr.b.a.$ === 'Focus')) {
		var _v1 = attr.b;
		var _v2 = _v1.a;
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$focusDefault = function (attrs) {
	return A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, attrs) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onClick = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onClick);
var $mdgriffith$elm_ui$Element$Input$enter = 'Enter';
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $mdgriffith$elm_ui$Element$Input$onKey = F2(
	function (desiredCode, msg) {
		var decode = function (code) {
			return _Utils_eq(code, desiredCode) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('Not the enter key');
		};
		var isKey = A2(
			$elm$json$Json$Decode$andThen,
			decode,
			A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
		return $mdgriffith$elm_ui$Internal$Model$Attr(
			A2(
				$elm$html$Html$Events$preventDefaultOn,
				'keyup',
				A2(
					$elm$json$Json$Decode$map,
					function (fired) {
						return _Utils_Tuple2(fired, true);
					},
					isKey)));
	});
var $mdgriffith$elm_ui$Element$Input$onEnter = function (msg) {
	return A2($mdgriffith$elm_ui$Element$Input$onKey, $mdgriffith$elm_ui$Element$Input$enter, msg);
};
var $mdgriffith$elm_ui$Internal$Model$Class = F2(
	function (a, b) {
		return {$: 'Class', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$cursor = $mdgriffith$elm_ui$Internal$Flag$flag(21);
var $mdgriffith$elm_ui$Element$pointer = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.cursorPointer);
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $mdgriffith$elm_ui$Element$Input$button = F2(
	function (attrs, _v0) {
		var onPress = _v0.onPress;
		var label = _v0.label;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentCenterX + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.contentCenterY + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.seButton + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.noTextSelection)))))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$pointer,
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Button),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											$elm$html$Html$Attributes$tabindex(0)),
										function () {
											if (onPress.$ === 'Nothing') {
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Internal$Model$Attr(
														$elm$html$Html$Attributes$disabled(true)),
													attrs);
											} else {
												var msg = onPress.a;
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Element$Events$onClick(msg),
													A2(
														$elm$core$List$cons,
														$mdgriffith$elm_ui$Element$Input$onEnter(msg),
														attrs));
											}
										}()))))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $mdgriffith$elm_ui$Element$el = F2(
	function (attrs, child) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[child])));
	});
var $mdgriffith$elm_ui$Internal$Model$Empty = {$: 'Empty'};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $mdgriffith$elm_ui$Internal$Model$map = F2(
	function (fn, el) {
		switch (el.$) {
			case 'Styled':
				var styled = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						html: F2(
							function (add, context) {
								return A2(
									$elm$virtual_dom$VirtualDom$map,
									fn,
									A2(styled.html, add, context));
							}),
						styles: styled.styles
					});
			case 'Unstyled':
				var html = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A2(
						$elm$core$Basics$composeL,
						$elm$virtual_dom$VirtualDom$map(fn),
						html));
			case 'Text':
				var str = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Text(str);
			default:
				return $mdgriffith$elm_ui$Internal$Model$Empty;
		}
	});
var $mdgriffith$elm_ui$Element$map = $mdgriffith$elm_ui$Internal$Model$map;
var $mdgriffith$elm_ui$Internal$Model$AsRow = {$: 'AsRow'};
var $mdgriffith$elm_ui$Internal$Model$asRow = $mdgriffith$elm_ui$Internal$Model$AsRow;
var $mdgriffith$elm_ui$Element$row = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asRow,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentLeft + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.contentCenterY)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $Orasund$elm_ui_widgets$Internal$Button$button = F2(
	function (style, _v0) {
		var onPress = _v0.onPress;
		var text = _v0.text;
		var icon = _v0.icon;
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_Utils_ap(
				style.container,
				_Utils_eq(onPress, $elm$core$Maybe$Nothing) ? style.ifDisabled : style.otherwise),
			{
				label: A2(
					$mdgriffith$elm_ui$Element$row,
					style.labelRow,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Element$map, $elm$core$Basics$never, icon),
							A2(
							$mdgriffith$elm_ui$Element$el,
							style.text,
							$mdgriffith$elm_ui$Element$text(text))
						])),
				onPress: onPress
			});
	});
var $mdgriffith$elm_ui$Element$none = $mdgriffith$elm_ui$Internal$Model$Empty;
var $Orasund$elm_ui_widgets$Internal$Button$textButton = F2(
	function (style, _v0) {
		var onPress = _v0.onPress;
		var text = _v0.text;
		return A2(
			$Orasund$elm_ui_widgets$Internal$Button$button,
			style,
			{icon: $mdgriffith$elm_ui$Element$none, onPress: onPress, text: text});
	});
var $Orasund$elm_ui_widgets$Widget$textButton = F2(
	function (style, _v0) {
		var text = _v0.text;
		var onPress = _v0.onPress;
		return A2(
			$Orasund$elm_ui_widgets$Internal$Button$textButton,
			style,
			{onPress: onPress, text: text});
	});
var $mdgriffith$elm_ui$Element$htmlAttribute = $mdgriffith$elm_ui$Internal$Model$Attr;
var $mdgriffith$elm_ui$Internal$Flag$letterSpacing = $mdgriffith$elm_ui$Internal$Flag$flag(16);
var $mdgriffith$elm_ui$Element$Font$letterSpacing = function (offset) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$letterSpacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'ls-' + $mdgriffith$elm_ui$Internal$Model$floatClass(offset),
			'letter-spacing',
			$elm$core$String$fromFloat(offset) + 'px'));
};
var $mdgriffith$elm_ui$Internal$Flag$fontWeight = $mdgriffith$elm_ui$Internal$Flag$flag(13);
var $mdgriffith$elm_ui$Element$Font$semiBold = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontWeight, $mdgriffith$elm_ui$Internal$Style$classes.textSemiBold);
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $Orasund$elm_ui_widgets$Widget$Style$Material$buttonFont = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$htmlAttribute(
		A2($elm$html$Html$Attributes$style, 'text-transform', 'uppercase')),
		$mdgriffith$elm_ui$Element$Font$size(14),
		$mdgriffith$elm_ui$Element$Font$semiBold,
		$mdgriffith$elm_ui$Element$Font$letterSpacing(1.25)
	]);
var $mdgriffith$elm_ui$Internal$Model$AlignY = function (a) {
	return {$: 'AlignY', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterY = {$: 'CenterY'};
var $mdgriffith$elm_ui$Element$centerY = $mdgriffith$elm_ui$Internal$Model$AlignY($mdgriffith$elm_ui$Internal$Model$CenterY);
var $mdgriffith$elm_ui$Internal$Model$Min = F2(
	function (a, b) {
		return {$: 'Min', a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$minimum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Min, i, l);
	});
var $mdgriffith$elm_ui$Element$paddingXY = F2(
	function (x, y) {
		if (_Utils_eq(x, y)) {
			var f = x;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$padding,
				A5(
					$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
					'p-' + $elm$core$String$fromInt(x),
					f,
					f,
					f,
					f));
		} else {
			var yFloat = y;
			var xFloat = x;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$padding,
				A5(
					$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
					'p-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
					yFloat,
					xFloat,
					yFloat,
					xFloat));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Px = function (a) {
	return {$: 'Px', a: a};
};
var $mdgriffith$elm_ui$Element$px = $mdgriffith$elm_ui$Internal$Model$Px;
var $mdgriffith$elm_ui$Internal$Flag$borderRound = $mdgriffith$elm_ui$Internal$Flag$flag(17);
var $mdgriffith$elm_ui$Element$Border$rounded = function (radius) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + $elm$core$String$fromInt(radius),
			'border-radius',
			$elm$core$String$fromInt(radius) + 'px'));
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$baseButton = function (_v0) {
	return {
		container: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$buttonFont,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(36)),
					A2($mdgriffith$elm_ui$Element$paddingXY, 8, 8),
					$mdgriffith$elm_ui$Element$Border$rounded(4)
				])),
		ifActive: _List_Nil,
		ifDisabled: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$htmlAttribute(
				A2($elm$html$Html$Attributes$style, 'cursor', 'not-allowed'))
			]),
		labelRow: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(8),
				$mdgriffith$elm_ui$Element$width(
				A2($mdgriffith$elm_ui$Element$minimum, 32, $mdgriffith$elm_ui$Element$shrink)),
				$mdgriffith$elm_ui$Element$centerY
			]),
		otherwise: _List_Nil,
		text: _List_fromArray(
			[$mdgriffith$elm_ui$Element$centerX])
	};
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$buttonFocusOpacity = 0.24;
var $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity = 0.08;
var $Orasund$elm_ui_widgets$Widget$Style$Material$buttonPressedOpacity = 0.32;
var $mdgriffith$elm_ui$Element$Background$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$bgColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'background-color',
			clr));
};
var $mdgriffith$elm_ui$Element$Font$color = function (fontColor) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(fontColor),
			'color',
			fontColor));
};
var $mdgriffith$elm_ui$Internal$Model$Focus = {$: 'Focus'};
var $mdgriffith$elm_ui$Internal$Model$PseudoSelector = F2(
	function (a, b) {
		return {$: 'PseudoSelector', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$focus = $mdgriffith$elm_ui$Internal$Flag$flag(31);
var $mdgriffith$elm_ui$Internal$Model$Nearby = F2(
	function (a, b) {
		return {$: 'Nearby', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$TransformComponent = F2(
	function (a, b) {
		return {$: 'TransformComponent', a: a, b: b};
	});
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle = F2(
	function (fn, attr) {
		switch (attr.$) {
			case 'NoAttribute':
				return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
			case 'Describe':
				var description = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Describe(description);
			case 'AlignX':
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignX(x);
			case 'AlignY':
				var y = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignY(y);
			case 'Width':
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Width(x);
			case 'Height':
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Height(x);
			case 'Class':
				var x = attr.a;
				var y = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Class, x, y);
			case 'StyleClass':
				var flag = attr.a;
				var style = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$StyleClass, flag, style);
			case 'Nearby':
				var location = attr.a;
				var elem = attr.b;
				return A2(
					$mdgriffith$elm_ui$Internal$Model$Nearby,
					location,
					A2($mdgriffith$elm_ui$Internal$Model$map, fn, elem));
			case 'Attr':
				var htmlAttr = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Attr(
					A2($elm$virtual_dom$VirtualDom$mapAttribute, fn, htmlAttr));
			default:
				var fl = attr.a;
				var trans = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$TransformComponent, fl, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$removeNever = function (style) {
	return A2($mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle, $elm$core$Basics$never, style);
};
var $mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper = F2(
	function (attr, _v0) {
		var styles = _v0.a;
		var trans = _v0.b;
		var _v1 = $mdgriffith$elm_ui$Internal$Model$removeNever(attr);
		switch (_v1.$) {
			case 'StyleClass':
				var style = _v1.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, style, styles),
					trans);
			case 'TransformComponent':
				var flag = _v1.a;
				var component = _v1.b;
				return _Utils_Tuple2(
					styles,
					A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, trans, component));
			default:
				return _Utils_Tuple2(styles, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$unwrapDecorations = function (attrs) {
	var _v0 = A3(
		$elm$core$List$foldl,
		$mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper,
		_Utils_Tuple2(_List_Nil, $mdgriffith$elm_ui$Internal$Model$Untransformed),
		attrs);
	var styles = _v0.a;
	var transform = _v0.b;
	return A2(
		$elm$core$List$cons,
		$mdgriffith$elm_ui$Internal$Model$Transform(transform),
		styles);
};
var $mdgriffith$elm_ui$Element$focused = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$focus,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			$mdgriffith$elm_ui$Internal$Model$Focus,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $mdgriffith$elm_ui$Element$fromRgb = function (clr) {
	return A4($mdgriffith$elm_ui$Internal$Model$Rgba, clr.red, clr.green, clr.blue, clr.alpha);
};
var $avh4$elm_color$Color$toRgba = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	return {alpha: a, blue: b, green: g, red: r};
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$fromColor = A2($elm$core$Basics$composeR, $avh4$elm_color$Color$toRgba, $mdgriffith$elm_ui$Element$fromRgb);
var $Orasund$elm_ui_widgets$Widget$Style$Material$gray = A3($avh4$elm_color$Color$rgb255, 119, 119, 119);
var $mdgriffith$elm_ui$Internal$Model$Active = {$: 'Active'};
var $mdgriffith$elm_ui$Internal$Flag$active = $mdgriffith$elm_ui$Internal$Flag$flag(32);
var $mdgriffith$elm_ui$Element$mouseDown = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$active,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			$mdgriffith$elm_ui$Internal$Model$Active,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $mdgriffith$elm_ui$Internal$Model$Hover = {$: 'Hover'};
var $mdgriffith$elm_ui$Internal$Flag$hover = $mdgriffith$elm_ui$Internal$Flag$flag(33);
var $mdgriffith$elm_ui$Element$mouseOver = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$hover,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			$mdgriffith$elm_ui$Internal$Model$Hover,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $avh4$elm_color$Color$fromRgba = function (components) {
	return A4($avh4$elm_color$Color$RgbaSpace, components.red, components.green, components.blue, components.alpha);
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity = function (opacity) {
	return A2(
		$elm$core$Basics$composeR,
		$avh4$elm_color$Color$toRgba,
		A2(
			$elm$core$Basics$composeR,
			function (color) {
				return _Utils_update(
					color,
					{alpha: color.alpha * opacity});
			},
			$avh4$elm_color$Color$fromRgba));
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$textButton = function (palette) {
	return {
		container: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).container,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(palette.primary)),
					$mdgriffith$elm_ui$Element$mouseDown(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonPressedOpacity, palette.primary)))
						])),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonFocusOpacity, palette.primary)))
						])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity, palette.primary)))
						]))
				])),
		ifActive: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
					A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity, palette.primary)))
			]),
		ifDisabled: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).ifDisabled,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor($Orasund$elm_ui_widgets$Widget$Style$Material$gray)),
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
					$mdgriffith$elm_ui$Element$focused(_List_Nil)
				])),
		labelRow: $Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).labelRow,
		otherwise: _List_Nil,
		text: $Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).text
	};
};
var $author$project$Main$backToHomeButton = A2(
	$Orasund$elm_ui_widgets$Widget$textButton,
	$Orasund$elm_ui_widgets$Widget$Style$Material$textButton($Orasund$elm_ui_widgets$Widget$Style$Material$defaultPalette),
	{
		onPress: $elm$core$Maybe$Just($author$project$Main$BackHome),
		text: '↩  Home'
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $author$project$PubGrub$Cache$nbDependencies = function (_v0) {
	var dependencies = _v0.a.dependencies;
	return $elm$core$Dict$size(dependencies);
};
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $author$project$PubGrub$Cache$nbPackageVersions = function (_v0) {
	var packagesRaw = _v0.a.packagesRaw;
	return $elm$core$Array$length(packagesRaw);
};
var $author$project$Main$cacheSize = function (cache) {
	return $author$project$PubGrub$Cache$nbDependencies(cache) + $author$project$PubGrub$Cache$nbPackageVersions(cache);
};
var $author$project$Main$cacheInfo = function (cache) {
	return A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$size(12)
			]),
		$mdgriffith$elm_ui$Element$text(
			'Cached entries: ' + $elm$core$String$fromInt(
				$author$project$Main$cacheSize(cache))));
};
var $author$project$Main$filler = A2(
	$mdgriffith$elm_ui$Element$el,
	_List_fromArray(
		[
			$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
		]),
	$mdgriffith$elm_ui$Element$none);
var $author$project$Main$historyInfo = A2(
	$mdgriffith$elm_ui$Element$el,
	_List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Font$size(8)
		]),
	$mdgriffith$elm_ui$Element$text('this demo only works for dependencies previous to 2020/07/22'));
var $author$project$Main$viewTopBar = function (cache) {
	return A2(
		$mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$spacing(20)
			]),
		_List_fromArray(
			[
				$author$project$Main$backToHomeButton,
				$author$project$Main$filler,
				$author$project$Main$historyInfo,
				$author$project$Main$filler,
				$author$project$Main$cacheInfo(cache)
			]));
};
var $author$project$Main$viewError = F2(
	function (cache, error) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$spacing(20),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink)
				]),
			_List_fromArray(
				[
					$author$project$Main$viewTopBar(cache),
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(24)
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text('Something went wrong!')
						])),
					A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(20)
						]),
					A2(
						$elm$core$List$map,
						$author$project$Main$monospaced,
						A2($elm$core$String$split, '\n', error)))
				]));
	});
var $author$project$Main$Input = function (a) {
	return {$: 'Input', a: a};
};
var $author$project$Main$LoadElmJson = {$: 'LoadElmJson'};
var $author$project$Main$PickPackage = function (a) {
	return {$: 'PickPackage', a: a};
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$buttonDisabledOpacity = 0.38;
var $mdgriffith$elm_ui$Internal$Model$boxShadowClass = function (shadow) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				shadow.inset ? 'box-inset' : 'box-',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.offset.a) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.offset.b) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.blur) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.size) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.color)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$shadows = $mdgriffith$elm_ui$Internal$Flag$flag(19);
var $mdgriffith$elm_ui$Element$Border$shadow = function (almostShade) {
	var shade = {blur: almostShade.blur, color: almostShade.color, inset: false, offset: almostShade.offset, size: almostShade.size};
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$shadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$boxShadowClass(shade),
			'box-shadow',
			$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(shade)));
};
var $mdgriffith$elm_ui$Element$rgba255 = F4(
	function (red, green, blue, a) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, a);
	});
var $Orasund$elm_ui_widgets$Widget$Style$Material$shadow = function (_float) {
	return {
		blur: _float,
		color: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 0.2),
		offset: _Utils_Tuple2(0, _float),
		size: 0
	};
};
var $elm$core$Basics$pow = _Basics_pow;
var $noahzgordon$elm_color_extra$Color$Accessibility$luminance = function (cl) {
	var f = function (intensity) {
		return (intensity <= 0.03928) ? (intensity / 12.92) : A2($elm$core$Basics$pow, (intensity + 0.055) / 1.055, 2.4);
	};
	var _v0 = function (a) {
		return _Utils_Tuple3(
			f(a.red),
			f(a.green),
			f(a.blue));
	}(
		$avh4$elm_color$Color$toRgba(cl));
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	return ((0.2126 * r) + (0.7152 * g)) + (0.0722 * b);
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$accessibleTextColor = function (color) {
	var l = 1 + ($avh4$elm_color$Color$toRgba(color).alpha * ($noahzgordon$elm_color_extra$Color$Accessibility$luminance(color) - 1));
	var ratioBlack = 1.05 / (l + 0.05);
	var ratioWhite = (l + 0.05) / 0.05;
	return (_Utils_cmp(ratioBlack, ratioWhite) < 0) ? A3($avh4$elm_color$Color$rgb255, 0, 0, 0) : A3($avh4$elm_color$Color$rgb255, 255, 255, 255);
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground = function (color) {
	return _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Background$color(
			$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(color)),
			$mdgriffith$elm_ui$Element$Font$color(
			$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
				$Orasund$elm_ui_widgets$Widget$Style$Material$accessibleTextColor(color)))
		]);
};
var $elm$core$Basics$cos = _Basics_cos;
var $noahzgordon$elm_color_extra$Color$Convert$labToXyz = function (_v0) {
	var l = _v0.l;
	var a = _v0.a;
	var b = _v0.b;
	var y = (l + 16) / 116;
	var c = function (ch) {
		var ch_ = (ch * ch) * ch;
		return (ch_ > 8.856e-3) ? ch_ : ((ch - (16 / 116)) / 7.787);
	};
	return {
		x: c(y + (a / 500)) * 95.047,
		y: c(y) * 100,
		z: c(y - (b / 200)) * 108.883
	};
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var $noahzgordon$elm_color_extra$Color$Convert$xyzToColor = function (_v0) {
	var x = _v0.x;
	var y = _v0.y;
	var z = _v0.z;
	var z_ = z / 100;
	var y_ = y / 100;
	var x_ = x / 100;
	var r = ((x_ * 3.2404542) + (y_ * (-1.5371385))) + (z_ * (-0.4986));
	var g = ((x_ * (-0.969266)) + (y_ * 1.8760108)) + (z_ * 4.1556e-2);
	var c = function (ch) {
		var ch_ = (ch > 3.1308e-3) ? ((1.055 * A2($elm$core$Basics$pow, ch, 1 / 2.4)) - 5.5e-2) : (12.92 * ch);
		return A3($elm$core$Basics$clamp, 0, 1, ch_);
	};
	var b = ((x_ * 5.56434e-2) + (y_ * (-0.2040259))) + (z_ * 1.0572252);
	return A3(
		$avh4$elm_color$Color$rgb,
		c(r),
		c(g),
		c(b));
};
var $noahzgordon$elm_color_extra$Color$Convert$labToColor = A2($elm$core$Basics$composeR, $noahzgordon$elm_color_extra$Color$Convert$labToXyz, $noahzgordon$elm_color_extra$Color$Convert$xyzToColor);
var $elm$core$Basics$sin = _Basics_sin;
var $Orasund$elm_ui_widgets$Widget$Style$Material$fromCIELCH = A2(
	$elm$core$Basics$composeR,
	function (_v0) {
		var l = _v0.l;
		var c = _v0.c;
		var h = _v0.h;
		return {
			a: c * $elm$core$Basics$cos(h),
			b: c * $elm$core$Basics$sin(h),
			l: l
		};
	},
	$noahzgordon$elm_color_extra$Color$Convert$labToColor);
var $elm$core$Basics$atan2 = _Basics_atan2;
var $noahzgordon$elm_color_extra$Color$Convert$colorToXyz = function (cl) {
	var c = function (ch) {
		var ch_ = (ch > 4.045e-2) ? A2($elm$core$Basics$pow, (ch + 5.5e-2) / 1.055, 2.4) : (ch / 12.92);
		return ch_ * 100;
	};
	var _v0 = $avh4$elm_color$Color$toRgba(cl);
	var red = _v0.red;
	var green = _v0.green;
	var blue = _v0.blue;
	var b = c(blue);
	var g = c(green);
	var r = c(red);
	return {x: ((r * 0.4124) + (g * 0.3576)) + (b * 0.1805), y: ((r * 0.2126) + (g * 0.7152)) + (b * 7.22e-2), z: ((r * 1.93e-2) + (g * 0.1192)) + (b * 0.9505)};
};
var $noahzgordon$elm_color_extra$Color$Convert$xyzToLab = function (_v0) {
	var x = _v0.x;
	var y = _v0.y;
	var z = _v0.z;
	var c = function (ch) {
		return (ch > 8.856e-3) ? A2($elm$core$Basics$pow, ch, 1 / 3) : ((7.787 * ch) + (16 / 116));
	};
	var x_ = c(x / 95.047);
	var y_ = c(y / 100);
	var z_ = c(z / 108.883);
	return {a: 500 * (x_ - y_), b: 200 * (y_ - z_), l: (116 * y_) - 16};
};
var $noahzgordon$elm_color_extra$Color$Convert$colorToLab = A2($elm$core$Basics$composeR, $noahzgordon$elm_color_extra$Color$Convert$colorToXyz, $noahzgordon$elm_color_extra$Color$Convert$xyzToLab);
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $Orasund$elm_ui_widgets$Widget$Style$Material$toCIELCH = A2(
	$elm$core$Basics$composeR,
	$noahzgordon$elm_color_extra$Color$Convert$colorToLab,
	function (_v0) {
		var l = _v0.l;
		var a = _v0.a;
		var b = _v0.b;
		return {
			c: $elm$core$Basics$sqrt((a * a) + (b * b)),
			h: A2($elm$core$Basics$atan2, b, a),
			l: l
		};
	});
var $Orasund$elm_ui_widgets$Widget$Style$Material$withShade = F3(
	function (c2, amount, c1) {
		var fun = F2(
			function (a, b) {
				return {c: ((a.c * (1 - amount)) + (b.c * amount)) / 1, h: ((a.h * (1 - amount)) + (b.h * amount)) / 1, l: ((a.l * (1 - amount)) + (b.l * amount)) / 1};
			});
		var alpha = $avh4$elm_color$Color$toRgba(c1).alpha;
		return $avh4$elm_color$Color$fromRgba(
			function (color) {
				return _Utils_update(
					color,
					{alpha: alpha});
			}(
				$avh4$elm_color$Color$toRgba(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromCIELCH(
						A2(
							fun,
							$Orasund$elm_ui_widgets$Widget$Style$Material$toCIELCH(c1),
							$Orasund$elm_ui_widgets$Widget$Style$Material$toCIELCH(c2))))));
	});
var $Orasund$elm_ui_widgets$Widget$Style$Material$containedButton = function (palette) {
	return {
		container: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).container,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$shadow(
					$Orasund$elm_ui_widgets$Widget$Style$Material$shadow(2)),
					$mdgriffith$elm_ui$Element$mouseDown(
					_Utils_ap(
						$Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(
							A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.on.primary, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonPressedOpacity, palette.primary)),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Border$shadow(
								$Orasund$elm_ui_widgets$Widget$Style$Material$shadow(12))
							]))),
					$mdgriffith$elm_ui$Element$focused(
					_Utils_ap(
						$Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(
							A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.on.primary, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonFocusOpacity, palette.primary)),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Border$shadow(
								$Orasund$elm_ui_widgets$Widget$Style$Material$shadow(6))
							]))),
					$mdgriffith$elm_ui$Element$mouseOver(
					_Utils_ap(
						$Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(
							A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.on.primary, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity, palette.primary)),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Border$shadow(
								$Orasund$elm_ui_widgets$Widget$Style$Material$shadow(6))
							])))
				])),
		ifActive: $Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(
			A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.on.primary, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity, palette.primary)),
		ifDisabled: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).ifDisabled,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Background$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
						A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonDisabledOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$gray))),
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor($Orasund$elm_ui_widgets$Widget$Style$Material$gray)),
					$mdgriffith$elm_ui$Element$Border$shadow(
					$Orasund$elm_ui_widgets$Widget$Style$Material$shadow(0)),
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
					$mdgriffith$elm_ui$Element$focused(_List_Nil)
				])),
		labelRow: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).labelRow,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Element$paddingXY, 8, 0)
				])),
		otherwise: $Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(palette.primary),
		text: $Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).text
	};
};
var $mdgriffith$elm_ui$Internal$Model$Label = function (a) {
	return {$: 'Label', a: a};
};
var $mdgriffith$elm_ui$Element$Region$description = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Describe, $mdgriffith$elm_ui$Internal$Model$Label);
var $Orasund$elm_ui_widgets$Internal$Button$iconButton = F2(
	function (style, _v0) {
		var onPress = _v0.onPress;
		var text = _v0.text;
		var icon = _v0.icon;
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_Utils_ap(
				style.container,
				_Utils_ap(
					_Utils_eq(onPress, $elm$core$Maybe$Nothing) ? style.ifDisabled : style.otherwise,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Region$description(text)
						]))),
			{
				label: A2(
					$mdgriffith$elm_ui$Element$el,
					style.labelRow,
					A2($mdgriffith$elm_ui$Element$map, $elm$core$Basics$never, icon)),
				onPress: onPress
			});
	});
var $Orasund$elm_ui_widgets$Widget$iconButton = $Orasund$elm_ui_widgets$Internal$Button$iconButton;
var $mdgriffith$elm_ui$Element$Input$Label = F3(
	function (a, b, c) {
		return {$: 'Label', a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Element$Input$OnLeft = {$: 'OnLeft'};
var $mdgriffith$elm_ui$Element$Input$labelLeft = $mdgriffith$elm_ui$Element$Input$Label($mdgriffith$elm_ui$Element$Input$OnLeft);
var $mdgriffith$elm_ui$Internal$Flag$borderColor = $mdgriffith$elm_ui$Internal$Flag$flag(28);
var $mdgriffith$elm_ui$Element$Border$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'border-color',
			clr));
};
var $mdgriffith$elm_ui$Internal$Model$BorderWidth = F5(
	function (a, b, c, d, e) {
		return {$: 'BorderWidth', a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Element$Border$width = function (v) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + $elm$core$String$fromInt(v),
			v,
			v,
			v,
			v));
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$outlinedButton = function (palette) {
	return {
		container: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).container,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$width(1),
					$mdgriffith$elm_ui$Element$Border$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor($Orasund$elm_ui_widgets$Widget$Style$Material$gray)),
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(palette.primary)),
					$mdgriffith$elm_ui$Element$mouseDown(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonPressedOpacity, palette.primary))),
							$mdgriffith$elm_ui$Element$Border$color(
							$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
								A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.primary, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonPressedOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$gray)))
						])),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonFocusOpacity, palette.primary))),
							$mdgriffith$elm_ui$Element$Border$color(
							$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
								A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.primary, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonFocusOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$gray)))
						])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity, palette.primary))),
							$mdgriffith$elm_ui$Element$Border$color(
							$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
								A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.primary, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$gray)))
						]))
				])),
		ifActive: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
					A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity, palette.primary))),
				$mdgriffith$elm_ui$Element$Border$color(
				$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
					A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.primary, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity, $Orasund$elm_ui_widgets$Widget$Style$Material$gray)))
			]),
		ifDisabled: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).ifDisabled,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor($Orasund$elm_ui_widgets$Widget$Style$Material$gray)),
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
					$mdgriffith$elm_ui$Element$focused(_List_Nil)
				])),
		labelRow: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).labelRow,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Element$paddingXY, 8, 0)
				])),
		otherwise: _List_Nil,
		text: $Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).text
	};
};
var $mdgriffith$elm_ui$Element$Input$Placeholder = F2(
	function (a, b) {
		return {$: 'Placeholder', a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$Input$placeholder = $mdgriffith$elm_ui$Element$Input$Placeholder;
var $mdgriffith$elm_ui$Element$Input$TextInputNode = function (a) {
	return {$: 'TextInputNode', a: a};
};
var $mdgriffith$elm_ui$Element$Input$TextArea = {$: 'TextArea'};
var $mdgriffith$elm_ui$Internal$Model$LivePolite = {$: 'LivePolite'};
var $mdgriffith$elm_ui$Element$Region$announce = $mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$LivePolite);
var $mdgriffith$elm_ui$Element$Input$applyLabel = F3(
	function (attrs, label, input) {
		if (label.$ === 'HiddenLabel') {
			var labelText = label.a;
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asColumn,
				$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
				attrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[input])));
		} else {
			var position = label.a;
			var labelAttrs = label.b;
			var labelChild = label.c;
			var labelElement = A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				labelAttrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[labelChild])));
			switch (position.$) {
				case 'Above':
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputLabel),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
				case 'Below':
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputLabel),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				case 'OnRight':
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputLabel),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				default:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputLabel),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
			}
		}
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $mdgriffith$elm_ui$Element$Input$autofill = A2(
	$elm$core$Basics$composeL,
	$mdgriffith$elm_ui$Internal$Model$Attr,
	$elm$html$Html$Attributes$attribute('autocomplete'));
var $mdgriffith$elm_ui$Internal$Model$Behind = {$: 'Behind'};
var $mdgriffith$elm_ui$Element$createNearby = F2(
	function (loc, element) {
		if (element.$ === 'Empty') {
			return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
		} else {
			return A2($mdgriffith$elm_ui$Internal$Model$Nearby, loc, element);
		}
	});
var $mdgriffith$elm_ui$Element$behindContent = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, $mdgriffith$elm_ui$Internal$Model$Behind, element);
};
var $mdgriffith$elm_ui$Internal$Model$MoveY = function (a) {
	return {$: 'MoveY', a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$moveY = $mdgriffith$elm_ui$Internal$Flag$flag(26);
var $mdgriffith$elm_ui$Element$moveUp = function (y) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveY,
		$mdgriffith$elm_ui$Internal$Model$MoveY(-y));
};
var $mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding = function (attrs) {
	var gatherSpacing = F2(
		function (attr, found) {
			if ((attr.$ === 'StyleClass') && (attr.b.$ === 'SpacingStyle')) {
				var _v2 = attr.b;
				var x = _v2.b;
				var y = _v2.c;
				if (found.$ === 'Nothing') {
					return $elm$core$Maybe$Just(y);
				} else {
					return found;
				}
			} else {
				return found;
			}
		});
	var _v0 = A3($elm$core$List$foldr, gatherSpacing, $elm$core$Maybe$Nothing, attrs);
	if (_v0.$ === 'Nothing') {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	} else {
		var vSpace = _v0.a;
		return $mdgriffith$elm_ui$Element$moveUp(
			$elm$core$Basics$floor(vSpace / 2));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$overflow = $mdgriffith$elm_ui$Internal$Flag$flag(20);
var $mdgriffith$elm_ui$Element$clip = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.clip);
var $mdgriffith$elm_ui$Element$rgb = F3(
	function (r, g, b) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, r, g, b, 1);
	});
var $mdgriffith$elm_ui$Element$Input$darkGrey = A3($mdgriffith$elm_ui$Element$rgb, 186 / 255, 189 / 255, 182 / 255);
var $mdgriffith$elm_ui$Element$Input$defaultTextPadding = A2($mdgriffith$elm_ui$Element$paddingXY, 12, 12);
var $mdgriffith$elm_ui$Element$Input$white = A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1);
var $mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Input$defaultTextPadding,
		$mdgriffith$elm_ui$Element$Border$rounded(3),
		$mdgriffith$elm_ui$Element$Border$color($mdgriffith$elm_ui$Element$Input$darkGrey),
		$mdgriffith$elm_ui$Element$Background$color($mdgriffith$elm_ui$Element$Input$white),
		$mdgriffith$elm_ui$Element$Border$width(1),
		$mdgriffith$elm_ui$Element$spacing(5),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
		$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink)
	]);
var $mdgriffith$elm_ui$Element$Input$getHeight = function (attr) {
	if (attr.$ === 'Height') {
		var h = attr.a;
		return $elm$core$Maybe$Just(h);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute = function (label) {
	if (label.$ === 'HiddenLabel') {
		var textLabel = label.a;
		return $mdgriffith$elm_ui$Internal$Model$Describe(
			$mdgriffith$elm_ui$Internal$Model$Label(textLabel));
	} else {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	}
};
var $mdgriffith$elm_ui$Internal$Model$InFront = {$: 'InFront'};
var $mdgriffith$elm_ui$Element$inFront = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, $mdgriffith$elm_ui$Internal$Model$InFront, element);
};
var $mdgriffith$elm_ui$Element$Input$isConstrained = function (len) {
	isConstrained:
	while (true) {
		switch (len.$) {
			case 'Content':
				return false;
			case 'Px':
				return true;
			case 'Fill':
				return true;
			case 'Min':
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isConstrained;
			default:
				var l = len.b;
				return true;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isHiddenLabel = function (label) {
	if (label.$ === 'HiddenLabel') {
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$isStacked = function (label) {
	if (label.$ === 'Label') {
		var loc = label.a;
		switch (loc.$) {
			case 'OnRight':
				return false;
			case 'OnLeft':
				return false;
			case 'Above':
				return true;
			default:
				return true;
		}
	} else {
		return true;
	}
};
var $mdgriffith$elm_ui$Element$Input$negateBox = function (box) {
	return {bottom: -box.bottom, left: -box.left, right: -box.right, top: -box.top};
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $mdgriffith$elm_ui$Internal$Model$paddingName = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left)))))));
	});
var $mdgriffith$elm_ui$Element$paddingEach = function (_v0) {
	var top = _v0.top;
	var right = _v0.right;
	var bottom = _v0.bottom;
	var left = _v0.left;
	if (_Utils_eq(top, right) && (_Utils_eq(top, bottom) && _Utils_eq(top, left))) {
		var topFloat = top;
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + $elm$core$String$fromInt(top),
				topFloat,
				topFloat,
				topFloat,
				topFloat));
	} else {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				A4($mdgriffith$elm_ui$Internal$Model$paddingName, top, right, bottom, left),
				top,
				right,
				bottom,
				left));
	}
};
var $mdgriffith$elm_ui$Element$Input$isFill = function (len) {
	isFill:
	while (true) {
		switch (len.$) {
			case 'Fill':
				return true;
			case 'Content':
				return false;
			case 'Px':
				return false;
			case 'Min':
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isPixel = function (len) {
	isPixel:
	while (true) {
		switch (len.$) {
			case 'Content':
				return false;
			case 'Px':
				return true;
			case 'Fill':
				return false;
			case 'Min':
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
		}
	}
};
var $mdgriffith$elm_ui$Internal$Model$paddingNameFloat = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(top) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(right) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(bottom) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(left)))))));
	});
var $mdgriffith$elm_ui$Element$Input$redistributeOver = F4(
	function (isMultiline, stacked, attr, els) {
		switch (attr.$) {
			case 'Nearby':
				return _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					});
			case 'Width':
				var width = attr.a;
				return $mdgriffith$elm_ui$Element$Input$isFill(width) ? _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent),
						input: A2($elm$core$List$cons, attr, els.input),
						parent: A2($elm$core$List$cons, attr, els.parent)
					}) : (stacked ? _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent)
					}) : _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					}));
			case 'Height':
				var height = attr.a;
				return (!stacked) ? _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent),
						parent: A2($elm$core$List$cons, attr, els.parent)
					}) : ($mdgriffith$elm_ui$Element$Input$isFill(height) ? _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent),
						parent: A2($elm$core$List$cons, attr, els.parent)
					}) : ($mdgriffith$elm_ui$Element$Input$isPixel(height) ? _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					}) : _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					})));
			case 'AlignX':
				return _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent)
					});
			case 'AlignY':
				return _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent)
					});
			case 'StyleClass':
				switch (attr.b.$) {
					case 'SpacingStyle':
						var _v1 = attr.b;
						return _Utils_update(
							els,
							{
								fullParent: A2($elm$core$List$cons, attr, els.fullParent),
								input: A2($elm$core$List$cons, attr, els.input),
								parent: A2($elm$core$List$cons, attr, els.parent),
								wrapper: A2($elm$core$List$cons, attr, els.wrapper)
							});
					case 'PaddingStyle':
						var cls = attr.a;
						var _v2 = attr.b;
						var pad = _v2.a;
						var t = _v2.b;
						var r = _v2.c;
						var b = _v2.d;
						var l = _v2.e;
						if (isMultiline) {
							return _Utils_update(
								els,
								{
									cover: A2($elm$core$List$cons, attr, els.cover),
									parent: A2($elm$core$List$cons, attr, els.parent)
								});
						} else {
							var newTop = t - A2($elm$core$Basics$min, t, b);
							var newLineHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'line-height',
									'calc(1.0em + ' + ($elm$core$String$fromFloat(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'height',
									'calc(1.0em + ' + ($elm$core$String$fromFloat(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newBottom = b - A2($elm$core$Basics$min, t, b);
							var reducedVerticalPadding = A2(
								$mdgriffith$elm_ui$Internal$Model$StyleClass,
								$mdgriffith$elm_ui$Internal$Flag$padding,
								A5(
									$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
									A4($mdgriffith$elm_ui$Internal$Model$paddingNameFloat, newTop, r, newBottom, l),
									newTop,
									r,
									newBottom,
									l));
							return _Utils_update(
								els,
								{
									cover: A2($elm$core$List$cons, attr, els.cover),
									input: A2(
										$elm$core$List$cons,
										newHeight,
										A2($elm$core$List$cons, newLineHeight, els.input)),
									parent: A2($elm$core$List$cons, reducedVerticalPadding, els.parent)
								});
						}
					case 'BorderWidth':
						var _v3 = attr.b;
						return _Utils_update(
							els,
							{
								cover: A2($elm$core$List$cons, attr, els.cover),
								parent: A2($elm$core$List$cons, attr, els.parent)
							});
					case 'Transform':
						return _Utils_update(
							els,
							{
								cover: A2($elm$core$List$cons, attr, els.cover),
								parent: A2($elm$core$List$cons, attr, els.parent)
							});
					case 'FontSize':
						return _Utils_update(
							els,
							{
								fullParent: A2($elm$core$List$cons, attr, els.fullParent)
							});
					case 'FontFamily':
						var _v4 = attr.b;
						return _Utils_update(
							els,
							{
								fullParent: A2($elm$core$List$cons, attr, els.fullParent)
							});
					default:
						var flag = attr.a;
						var cls = attr.b;
						return _Utils_update(
							els,
							{
								parent: A2($elm$core$List$cons, attr, els.parent)
							});
				}
			case 'NoAttribute':
				return els;
			case 'Attr':
				var a = attr.a;
				return _Utils_update(
					els,
					{
						input: A2($elm$core$List$cons, attr, els.input)
					});
			case 'Describe':
				return _Utils_update(
					els,
					{
						input: A2($elm$core$List$cons, attr, els.input)
					});
			case 'Class':
				return _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					});
			default:
				return _Utils_update(
					els,
					{
						input: A2($elm$core$List$cons, attr, els.input)
					});
		}
	});
var $mdgriffith$elm_ui$Element$Input$redistribute = F3(
	function (isMultiline, stacked, attrs) {
		return function (redist) {
			return {
				cover: $elm$core$List$reverse(redist.cover),
				fullParent: $elm$core$List$reverse(redist.fullParent),
				input: $elm$core$List$reverse(redist.input),
				parent: $elm$core$List$reverse(redist.parent),
				wrapper: $elm$core$List$reverse(redist.wrapper)
			};
		}(
			A3(
				$elm$core$List$foldl,
				A2($mdgriffith$elm_ui$Element$Input$redistributeOver, isMultiline, stacked),
				{cover: _List_Nil, fullParent: _List_Nil, input: _List_Nil, parent: _List_Nil, wrapper: _List_Nil},
				attrs));
	});
var $mdgriffith$elm_ui$Element$Input$renderBox = function (_v0) {
	var top = _v0.top;
	var right = _v0.right;
	var bottom = _v0.bottom;
	var left = _v0.left;
	return $elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px'))))));
};
var $mdgriffith$elm_ui$Internal$Model$Transparency = F2(
	function (a, b) {
		return {$: 'Transparency', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$transparency = $mdgriffith$elm_ui$Internal$Flag$flag(0);
var $mdgriffith$elm_ui$Element$alpha = function (o) {
	var transparency = function (x) {
		return 1 - x;
	}(
		A2(
			$elm$core$Basics$min,
			1.0,
			A2($elm$core$Basics$max, 0.0, o)));
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2(
			$mdgriffith$elm_ui$Internal$Model$Transparency,
			'transparency-' + $mdgriffith$elm_ui$Internal$Model$floatClass(transparency),
			transparency));
};
var $mdgriffith$elm_ui$Element$Input$charcoal = A3($mdgriffith$elm_ui$Element$rgb, 136 / 255, 138 / 255, 133 / 255);
var $mdgriffith$elm_ui$Element$rgba = $mdgriffith$elm_ui$Internal$Model$Rgba;
var $mdgriffith$elm_ui$Element$Input$renderPlaceholder = F3(
	function (_v0, forPlaceholder, on) {
		var placeholderAttrs = _v0.a;
		var placeholderEl = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				forPlaceholder,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$color($mdgriffith$elm_ui$Element$Input$charcoal),
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.noTextSelection + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.passPointerEvents)),
							$mdgriffith$elm_ui$Element$clip,
							$mdgriffith$elm_ui$Element$Border$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$alpha(
							on ? 1 : 0)
						]),
					placeholderAttrs)),
			placeholderEl);
	});
var $mdgriffith$elm_ui$Element$scrollbarY = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.scrollbarsY);
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $mdgriffith$elm_ui$Element$Input$spellcheck = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$spellcheck);
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $mdgriffith$elm_ui$Internal$Model$unstyled = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Unstyled, $elm$core$Basics$always);
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $mdgriffith$elm_ui$Element$Input$value = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$value);
var $mdgriffith$elm_ui$Element$Input$textHelper = F3(
	function (textInput, attrs, textOptions) {
		var withDefaults = _Utils_ap($mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle, attrs);
		var redistributed = A3(
			$mdgriffith$elm_ui$Element$Input$redistribute,
			_Utils_eq(textInput.type_, $mdgriffith$elm_ui$Element$Input$TextArea),
			$mdgriffith$elm_ui$Element$Input$isStacked(textOptions.label),
			withDefaults);
		var onlySpacing = function (attr) {
			if ((attr.$ === 'StyleClass') && (attr.b.$ === 'SpacingStyle')) {
				var _v9 = attr.b;
				return true;
			} else {
				return false;
			}
		};
		var heightConstrained = function () {
			var _v7 = textInput.type_;
			if (_v7.$ === 'TextInputNode') {
				var inputType = _v7.a;
				return false;
			} else {
				return A2(
					$elm$core$Maybe$withDefault,
					false,
					A2(
						$elm$core$Maybe$map,
						$mdgriffith$elm_ui$Element$Input$isConstrained,
						$elm$core$List$head(
							$elm$core$List$reverse(
								A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Element$Input$getHeight, withDefaults)))));
			}
		}();
		var getPadding = function (attr) {
			if ((attr.$ === 'StyleClass') && (attr.b.$ === 'PaddingStyle')) {
				var cls = attr.a;
				var _v6 = attr.b;
				var pad = _v6.a;
				var t = _v6.b;
				var r = _v6.c;
				var b = _v6.d;
				var l = _v6.e;
				return $elm$core$Maybe$Just(
					{
						bottom: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(b - 3)),
						left: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(l - 3)),
						right: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(r - 3)),
						top: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(t - 3))
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var parentPadding = A2(
			$elm$core$Maybe$withDefault,
			{bottom: 0, left: 0, right: 0, top: 0},
			$elm$core$List$head(
				$elm$core$List$reverse(
					A2($elm$core$List$filterMap, getPadding, withDefaults))));
		var inputElement = A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			function () {
				var _v3 = textInput.type_;
				if (_v3.$ === 'TextInputNode') {
					var inputType = _v3.a;
					return $mdgriffith$elm_ui$Internal$Model$NodeName('input');
				} else {
					return $mdgriffith$elm_ui$Internal$Model$NodeName('textarea');
				}
			}(),
			_Utils_ap(
				function () {
					var _v4 = textInput.type_;
					if (_v4.$ === 'TextInputNode') {
						var inputType = _v4.a;
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$type_(inputType)),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputText)
							]);
					} else {
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$clip,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputMultiline),
								$mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding(withDefaults),
								$mdgriffith$elm_ui$Element$paddingEach(parentPadding),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2(
									$elm$html$Html$Attributes$style,
									'margin',
									$mdgriffith$elm_ui$Element$Input$renderBox(
										$mdgriffith$elm_ui$Element$Input$negateBox(parentPadding)))),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$style, 'box-sizing', 'content-box'))
							]);
					}
				}(),
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Input$value(textOptions.text),
							$mdgriffith$elm_ui$Internal$Model$Attr(
							$elm$html$Html$Events$onInput(textOptions.onChange)),
							$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(textOptions.label),
							$mdgriffith$elm_ui$Element$Input$spellcheck(textInput.spellchecked),
							A2(
							$elm$core$Maybe$withDefault,
							$mdgriffith$elm_ui$Internal$Model$NoAttribute,
							A2($elm$core$Maybe$map, $mdgriffith$elm_ui$Element$Input$autofill, textInput.autofill))
						]),
					redistributed.input)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil));
		var wrappedInput = function () {
			var _v0 = textInput.type_;
			if (_v0.$ === 'TextArea') {
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					_Utils_ap(
						(heightConstrained ? $elm$core$List$cons($mdgriffith$elm_ui$Element$scrollbarY) : $elm$core$Basics$identity)(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.focusedWithin),
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineWrapper)
								])),
						redistributed.parent),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asParagraph,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Element$inFront(inputElement),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineParent),
												redistributed.wrapper)))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(
									function () {
										if (textOptions.text === '') {
											var _v1 = textOptions.placeholder;
											if (_v1.$ === 'Nothing') {
												return _List_fromArray(
													[
														$mdgriffith$elm_ui$Element$text('\u00A0')
													]);
											} else {
												var place = _v1.a;
												return _List_fromArray(
													[
														A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, _List_Nil, textOptions.text === '')
													]);
											}
										} else {
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Internal$Model$unstyled(
													A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineFiller)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(textOptions.text + '\u00A0')
															])))
												]);
										}
									}()))
							])));
			} else {
				var inputType = _v0.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						A2(
							$elm$core$List$cons,
							A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.focusedWithin),
							$elm$core$List$concat(
								_List_fromArray(
									[
										redistributed.parent,
										function () {
										var _v2 = textOptions.placeholder;
										if (_v2.$ === 'Nothing') {
											return _List_Nil;
										} else {
											var place = _v2.a;
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Element$behindContent(
													A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, redistributed.cover, textOptions.text === ''))
												]);
										}
									}()
									])))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[inputElement])));
			}
		}();
		return A3(
			$mdgriffith$elm_ui$Element$Input$applyLabel,
			A2(
				$elm$core$List$cons,
				A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.cursorText),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$Input$isHiddenLabel(textOptions.label) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Element$spacing(5),
					A2($elm$core$List$cons, $mdgriffith$elm_ui$Element$Region$announce, redistributed.fullParent))),
			textOptions.label,
			wrappedInput);
	});
var $mdgriffith$elm_ui$Element$Input$text = $mdgriffith$elm_ui$Element$Input$textHelper(
	{
		autofill: $elm$core$Maybe$Nothing,
		spellchecked: false,
		type_: $mdgriffith$elm_ui$Element$Input$TextInputNode('text')
	});
var $author$project$Main$viewInit = F3(
	function (cache, inputText, maybePackage) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$spacing(20)
				]),
			_List_fromArray(
				[
					$author$project$Main$viewTopBar(cache),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX]),
					A2(
						$Orasund$elm_ui_widgets$Widget$textButton,
						$Orasund$elm_ui_widgets$Widget$Style$Material$outlinedButton($Orasund$elm_ui_widgets$Widget$Style$Material$defaultPalette),
						{
							onPress: $elm$core$Maybe$Just($author$project$Main$LoadElmJson),
							text: 'Load elm.json'
						})),
					$mdgriffith$elm_ui$Element$text('Or try an existing package ↓'),
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(20)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$Input$text,
							_List_Nil,
							{
								label: A2(
									$mdgriffith$elm_ui$Element$Input$labelLeft,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Package and version:')),
								onChange: $author$project$Main$Input,
								placeholder: $elm$core$Maybe$Just(
									A2(
										$mdgriffith$elm_ui$Element$Input$placeholder,
										_List_Nil,
										$mdgriffith$elm_ui$Element$text('elm/bytes@1.0.8'))),
								text: inputText
							}),
							A2(
							$Orasund$elm_ui_widgets$Widget$iconButton,
							$Orasund$elm_ui_widgets$Widget$Style$Material$containedButton($Orasund$elm_ui_widgets$Widget$Style$Material$defaultPalette),
							{
								icon: $mdgriffith$elm_ui$Element$text('▶'),
								onPress: A2($elm$core$Maybe$map, $author$project$Main$PickPackage, maybePackage),
								text: 'Pick'
							})
						]))
				]));
	});
var $mdgriffith$elm_ui$Element$Font$bold = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontWeight, $mdgriffith$elm_ui$Internal$Style$classes.bold);
var $author$project$Main$Solve = {$: 'Solve'};
var $author$project$Main$solveButton = A2(
	$mdgriffith$elm_ui$Element$el,
	_List_fromArray(
		[$mdgriffith$elm_ui$Element$centerX]),
	A2(
		$Orasund$elm_ui_widgets$Widget$textButton,
		$Orasund$elm_ui_widgets$Widget$Style$Material$containedButton($Orasund$elm_ui_widgets$Widget$Style$Material$defaultPalette),
		{
			onPress: $elm$core$Maybe$Just($author$project$Main$Solve),
			text: 'Solve'
		}));
var $author$project$Main$infoConnectivity = function (online) {
	return A2(
		$mdgriffith$elm_ui$Element$paragraph,
		_List_Nil,
		_List_fromArray(
			[
				online ? $mdgriffith$elm_ui$Element$text('Online mode will make http requests to package.elm-lang.org, use with moderation, preferably on small dependency trees. Your cache will grow (see top right corner) if new information is downloaded. PS: cache should be kept in indexeddb on page reload.') : $mdgriffith$elm_ui$Element$text('Offline mode will never make any http request. Solving will fail if a list of dependencies of some package is required but not available in cache. PS: cache should be kept in indexeddb on page reload.')
			]));
};
var $author$project$Main$infoStrategy = function (strategy) {
	return A2(
		$mdgriffith$elm_ui$Element$paragraph,
		_List_Nil,
		_List_fromArray(
			[
				function () {
				if (strategy.$ === 'Newest') {
					return $mdgriffith$elm_ui$Element$text('The \"Newest\" strategy consists in always picking the newest package that dependency constraints authorize');
				} else {
					return $mdgriffith$elm_ui$Element$text('The \"Oldest\" strategy consists in always picking the oldest package that dependency constraints authorize');
				}
			}()
			]));
};
var $author$project$Main$SwitchConnectivity = function (a) {
	return {$: 'SwitchConnectivity', a: a};
};
var $Orasund$elm_ui_widgets$Internal$Select$selectButton = F2(
	function (style, _v0) {
		var selected = _v0.a;
		var b = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_Utils_ap(
				style.container,
				_Utils_eq(b.onPress, $elm$core$Maybe$Nothing) ? style.ifDisabled : (selected ? style.ifActive : style.otherwise)),
			{
				label: A2(
					$mdgriffith$elm_ui$Element$row,
					style.labelRow,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Element$map, $elm$core$Basics$never, b.icon),
							A2(
							$mdgriffith$elm_ui$Element$el,
							style.text,
							$mdgriffith$elm_ui$Element$text(b.text))
						])),
				onPress: b.onPress
			});
	});
var $Orasund$elm_ui_widgets$Internal$List$internalButton = F2(
	function (style, list) {
		return A2(
			$elm$core$List$indexedMap,
			function (i) {
				return $Orasund$elm_ui_widgets$Internal$Select$selectButton(
					{
						container: _Utils_ap(
							style.button.container,
							_Utils_ap(
								style.list.element,
								($elm$core$List$length(list) === 1) ? _List_Nil : ((!i) ? style.list.ifFirst : (_Utils_eq(
									i,
									$elm$core$List$length(list) - 1) ? style.list.ifLast : style.list.otherwise)))),
						ifActive: style.button.ifActive,
						ifDisabled: style.button.ifDisabled,
						labelRow: style.button.labelRow,
						otherwise: style.button.otherwise,
						text: style.button.text
					});
			},
			list);
	});
var $Orasund$elm_ui_widgets$Internal$List$buttonRow = function (style) {
	return A2(
		$elm$core$Basics$composeR,
		$Orasund$elm_ui_widgets$Internal$List$internalButton(style),
		$mdgriffith$elm_ui$Element$row(style.list.containerRow));
};
var $Orasund$elm_ui_widgets$Widget$buttonRow = $Orasund$elm_ui_widgets$Internal$List$buttonRow;
var $mdgriffith$elm_ui$Element$Border$roundEach = function (_v0) {
	var topLeft = _v0.topLeft;
	var topRight = _v0.topRight;
	var bottomLeft = _v0.bottomLeft;
	var bottomRight = _v0.bottomRight;
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + ($elm$core$String$fromInt(topLeft) + ('-' + ($elm$core$String$fromInt(topRight) + ($elm$core$String$fromInt(bottomLeft) + ('-' + $elm$core$String$fromInt(bottomRight)))))),
			'border-radius',
			$elm$core$String$fromInt(topLeft) + ('px ' + ($elm$core$String$fromInt(topRight) + ('px ' + ($elm$core$String$fromInt(bottomRight) + ('px ' + ($elm$core$String$fromInt(bottomLeft) + 'px'))))))));
};
var $Orasund$elm_ui_widgets$Widget$Style$Material$buttonRow = {
	containerRow: _List_Nil,
	element: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Border$rounded(2)
		]),
	ifFirst: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Border$roundEach(
			{bottomLeft: 2, bottomRight: 0, topLeft: 2, topRight: 0})
		]),
	ifLast: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Border$roundEach(
			{bottomLeft: 0, bottomRight: 2, topLeft: 0, topRight: 2})
		]),
	otherwise: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Border$rounded(0)
		])
};
var $author$project$Main$materialButtonRow = $Orasund$elm_ui_widgets$Widget$Style$Material$buttonRow;
var $Orasund$elm_ui_widgets$Internal$Select$select = function (_v0) {
	var selected = _v0.selected;
	var options = _v0.options;
	var onSelect = _v0.onSelect;
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, a) {
				return _Utils_Tuple2(
					_Utils_eq(
						selected,
						$elm$core$Maybe$Just(i)),
					{
						icon: a.icon,
						onPress: onSelect(i),
						text: a.text
					});
			}),
		options);
};
var $Orasund$elm_ui_widgets$Widget$select = $Orasund$elm_ui_widgets$Internal$Select$select;
var $Orasund$elm_ui_widgets$Widget$Style$Material$buttonSelectedOpacity = 0.16;
var $Orasund$elm_ui_widgets$Widget$Style$Material$toggleButton = function (palette) {
	return {
		container: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$buttonFont,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(48)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(48)),
					$mdgriffith$elm_ui$Element$padding(4),
					$mdgriffith$elm_ui$Element$Border$width(1),
					$mdgriffith$elm_ui$Element$mouseDown(
					_Utils_ap(
						$Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(
							A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.on.surface, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonPressedOpacity, palette.surface)),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Border$color(
								$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
									A3(
										$Orasund$elm_ui_widgets$Widget$Style$Material$withShade,
										palette.on.surface,
										$Orasund$elm_ui_widgets$Widget$Style$Material$buttonPressedOpacity,
										A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, 0.14, palette.on.surface))))
							]))),
					$mdgriffith$elm_ui$Element$focused(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(
					_Utils_ap(
						$Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(
							A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.on.surface, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity, palette.surface)),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Border$color(
								$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
									A3(
										$Orasund$elm_ui_widgets$Widget$Style$Material$withShade,
										palette.on.surface,
										$Orasund$elm_ui_widgets$Widget$Style$Material$buttonHoverOpacity,
										A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, 0.14, palette.on.surface))))
							])))
				])),
		ifActive: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(
				A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.on.surface, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonSelectedOpacity, palette.surface)),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
						A3(
							$Orasund$elm_ui_widgets$Widget$Style$Material$withShade,
							palette.on.surface,
							$Orasund$elm_ui_widgets$Widget$Style$Material$buttonSelectedOpacity,
							A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, 0.14, palette.on.surface)))),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil)
				])),
		ifDisabled: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$baseButton(palette).ifDisabled,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Background$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(palette.surface)),
					$mdgriffith$elm_ui$Element$Border$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
						A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, 0.14, palette.on.surface))),
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor($Orasund$elm_ui_widgets$Widget$Style$Material$gray)),
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil)
				])),
		labelRow: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(8),
				$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$Border$rounded(24),
				$mdgriffith$elm_ui$Element$padding(8),
				$mdgriffith$elm_ui$Element$focused(
				$Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(
					A3($Orasund$elm_ui_widgets$Widget$Style$Material$withShade, palette.on.surface, $Orasund$elm_ui_widgets$Widget$Style$Material$buttonFocusOpacity, palette.surface)))
			]),
		otherwise: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Style$Material$textAndBackground(palette.surface),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$color(
					$Orasund$elm_ui_widgets$Widget$Style$Material$fromColor(
						A2($Orasund$elm_ui_widgets$Widget$Style$Material$scaleOpacity, 0.14, palette.on.surface)))
				])),
		text: _List_fromArray(
			[$mdgriffith$elm_ui$Element$centerX])
	};
};
var $author$project$Main$rowChoice = function (choices) {
	return A2(
		$Orasund$elm_ui_widgets$Widget$buttonRow,
		{
			button: $Orasund$elm_ui_widgets$Widget$Style$Material$toggleButton($Orasund$elm_ui_widgets$Widget$Style$Material$defaultPalette),
			list: _Utils_update(
				$author$project$Main$materialButtonRow,
				{
					element: A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						$author$project$Main$materialButtonRow.element)
				})
		},
		$Orasund$elm_ui_widgets$Widget$select(choices));
};
var $author$project$Main$viewConnectivity = function (online) {
	return $author$project$Main$rowChoice(
		{
			onSelect: function (id) {
				return (!id) ? $elm$core$Maybe$Just(
					$author$project$Main$SwitchConnectivity(false)) : $elm$core$Maybe$Just(
					$author$project$Main$SwitchConnectivity(true));
			},
			options: _List_fromArray(
				[
					{icon: $mdgriffith$elm_ui$Element$none, text: 'Offline'},
					{icon: $mdgriffith$elm_ui$Element$none, text: 'Online'}
				]),
			selected: online ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Just(0)
		});
};
var $author$project$Solver$Oldest = {$: 'Oldest'};
var $author$project$Main$SwitchStrategy = function (a) {
	return {$: 'SwitchStrategy', a: a};
};
var $author$project$Main$viewStrategy = function (strategy) {
	return $author$project$Main$rowChoice(
		{
			onSelect: function (id) {
				return (!id) ? $elm$core$Maybe$Just(
					$author$project$Main$SwitchStrategy($author$project$Solver$Newest)) : $elm$core$Maybe$Just(
					$author$project$Main$SwitchStrategy($author$project$Solver$Oldest));
			},
			options: _List_fromArray(
				[
					{icon: $mdgriffith$elm_ui$Element$none, text: 'Newest'},
					{icon: $mdgriffith$elm_ui$Element$none, text: 'Oldest'}
				]),
			selected: _Utils_eq(strategy, $author$project$Solver$Newest) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Just(1)
		});
};
var $author$project$Main$viewConfig = function (_v0) {
	var online = _v0.online;
	var strategy = _v0.strategy;
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(20)
			]),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(20)
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$text('Connectivity:'),
						$author$project$Main$viewConnectivity(online),
						$mdgriffith$elm_ui$Element$text('Version strategy:'),
						$author$project$Main$viewStrategy(strategy)
					])),
				$author$project$Main$infoConnectivity(online),
				$author$project$Main$infoStrategy(strategy)
			]));
};
var $author$project$Main$viewPicked = F4(
	function (cache, config, _package, version) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$spacing(20),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink)
				]),
			_List_fromArray(
				[
					$author$project$Main$viewTopBar(cache),
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(24)
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text('Selected '),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$Font$bold]),
							$mdgriffith$elm_ui$Element$text(_package)),
							$mdgriffith$elm_ui$Element$text(' at version '),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$Font$bold]),
							$mdgriffith$elm_ui$Element$text(
								$author$project$PubGrub$Version$toDebugString(version)))
						])),
					$author$project$Main$viewConfig(config),
					$author$project$Main$solveButton
				]));
	});
var $Orasund$elm_ui_widgets$Internal$List$internal = F2(
	function (style, list) {
		return A2(
			$elm$core$List$indexedMap,
			function (i) {
				return $mdgriffith$elm_ui$Element$el(
					_Utils_ap(
						style.element,
						($elm$core$List$length(list) === 1) ? _List_Nil : ((!i) ? style.ifFirst : (_Utils_eq(
							i,
							$elm$core$List$length(list) - 1) ? style.ifLast : style.otherwise))));
			},
			list);
	});
var $Orasund$elm_ui_widgets$Internal$List$column = function (style) {
	return A2(
		$elm$core$Basics$composeR,
		$Orasund$elm_ui_widgets$Internal$List$internal(style),
		$mdgriffith$elm_ui$Element$column(style.containerColumn));
};
var $Orasund$elm_ui_widgets$Widget$column = $Orasund$elm_ui_widgets$Internal$List$column;
var $Orasund$elm_ui_widgets$Widget$Style$Material$column = {
	containerColumn: _List_fromArray(
		[
			A2($mdgriffith$elm_ui$Element$paddingXY, 0, 8),
			$mdgriffith$elm_ui$Element$spacing(8)
		]),
	element: _List_Nil,
	ifFirst: _List_Nil,
	ifLast: _List_Nil,
	otherwise: _List_Nil
};
var $author$project$Main$viewDependency = function (_v0) {
	var _package = _v0.a;
	var range = _v0.b;
	return $mdgriffith$elm_ui$Element$text(
		_package + (' ' + $author$project$PubGrub$Range$toDebugString(range)));
};
var $author$project$Main$viewApplication = function (dependencies) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$size(20)
					]),
				$mdgriffith$elm_ui$Element$text('Project direct dependencies:')),
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$padding(20)
					]),
				$elm$core$List$isEmpty(dependencies) ? $mdgriffith$elm_ui$Element$text('No dependencies') : A2(
					$Orasund$elm_ui_widgets$Widget$column,
					$Orasund$elm_ui_widgets$Widget$Style$Material$column,
					A2($elm$core$List$map, $author$project$Main$viewDependency, dependencies)))
			]));
};
var $author$project$Main$viewPackage = F3(
	function (_package, version, dependencies) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(20)
						]),
					A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('Dependencies of '),
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$Font$bold]),
								$mdgriffith$elm_ui$Element$text(_package)),
								$mdgriffith$elm_ui$Element$text(' at version '),
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$Font$bold]),
								$mdgriffith$elm_ui$Element$text(
									$author$project$PubGrub$Version$toDebugString(version))),
								$mdgriffith$elm_ui$Element$text(':')
							]))),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$padding(20)
						]),
					$elm$core$List$isEmpty(dependencies) ? $mdgriffith$elm_ui$Element$text('No dependencies') : A2(
						$Orasund$elm_ui_widgets$Widget$column,
						$Orasund$elm_ui_widgets$Widget$Style$Material$column,
						A2($elm$core$List$map, $author$project$Main$viewDependency, dependencies)))
				]));
	});
var $author$project$Main$viewProject = F3(
	function (cache, config, project) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$spacing(20),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink)
				]),
			_List_fromArray(
				[
					$author$project$Main$viewTopBar(cache),
					function () {
					if (project.$ === 'Package') {
						var _package = project.a;
						var version = project.b;
						var dependencies = project.c;
						return A3($author$project$Main$viewPackage, _package, version, dependencies);
					} else {
						var dependencies = project.a;
						return $author$project$Main$viewApplication(dependencies);
					}
				}(),
					$author$project$Main$viewConfig(config),
					$author$project$Main$solveButton
				]));
	});
var $author$project$Main$viewVersion = function (_v0) {
	var _package = _v0.a;
	var version = _v0.b;
	return $mdgriffith$elm_ui$Element$text(
		_package + (' ' + $author$project$PubGrub$Version$toDebugString(version)));
};
var $author$project$Main$viewSolution = F2(
	function (cache, solution) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$spacing(20),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink)
				]),
			_List_fromArray(
				[
					$author$project$Main$viewTopBar(cache),
					A2(
					$mdgriffith$elm_ui$Element$column,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$size(20)
								]),
							$mdgriffith$elm_ui$Element$text('Solution:')),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$padding(20)
								]),
							$elm$core$List$isEmpty(solution) ? $mdgriffith$elm_ui$Element$text('No dependencies') : A2(
								$Orasund$elm_ui_widgets$Widget$column,
								$Orasund$elm_ui_widgets$Widget$Style$Material$column,
								A2($elm$core$List$map, $author$project$Main$viewVersion, solution)))
						]))
				]));
	});
var $author$project$PubGrub$effectToString = function (effect) {
	switch (effect.$) {
		case 'NoEffect':
			return 'No effect';
		case 'ListVersions':
			var _v1 = effect.a;
			var _package = _v1.a;
			return 'List existing versions of package ' + _package;
		case 'RetrieveDependencies':
			var _v2 = effect.a;
			var _package = _v2.a;
			var version = _v2.b;
			return 'Retrieve the list of dependencies of package ' + (_package + (' at version ' + $author$project$PubGrub$Version$toDebugString(version)));
		default:
			var result = effect.a;
			if (result.$ === 'Ok') {
				return 'Solving terminated succesfully';
			} else {
				return 'Solving terminated with an error';
			}
	}
};
var $author$project$Main$viewSolving = F2(
	function (cache, solverState) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$spacing(20),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink)
				]),
			_List_fromArray(
				[
					$author$project$Main$viewTopBar(cache),
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(24)
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text('Solving ...')
						])),
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$padding(20)
						]),
					_List_fromArray(
						[
							function () {
							if (solverState.$ === 'Solving') {
								var effect = solverState.c;
								return $mdgriffith$elm_ui$Element$text(
									'Current effect being performed: ' + $author$project$PubGrub$effectToString(effect));
							} else {
								return $mdgriffith$elm_ui$Element$none;
							}
						}()
						]))
				]));
	});
var $author$project$Main$viewElement = function (model) {
	var _v0 = model.state;
	switch (_v0.$) {
		case 'Init':
			var inputText = _v0.a;
			var maybePackage = _v0.b;
			return A3($author$project$Main$viewInit, model.cache, inputText, maybePackage);
		case 'PickedPackage':
			var _package = _v0.a;
			var version = _v0.b;
			var config = _v0.c;
			return A4($author$project$Main$viewPicked, model.cache, config, _package, version);
		case 'LoadedProject':
			var project = _v0.a;
			var config = _v0.b;
			return A3($author$project$Main$viewProject, model.cache, config, project);
		case 'Solving':
			var solverState = _v0.a;
			return A2($author$project$Main$viewSolving, model.cache, solverState);
		case 'Error':
			var error = _v0.a;
			return A2($author$project$Main$viewError, model.cache, error);
		default:
			var solution = _v0.a;
			return A2($author$project$Main$viewSolution, model.cache, solution);
	}
};
var $author$project$Main$view = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$layout,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$padding(20)
			]),
		$author$project$Main$viewElement(model));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		init: $author$project$Main$init,
		subscriptions: $elm$core$Basics$always($elm$core$Platform$Sub$none),
		update: $author$project$Main$update,
		view: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));