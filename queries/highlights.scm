"and" @keyword
"any" @keyword
"as" @keyword
"asc" @keyword
"avg" @keyword
"by" @keyword
"class" @keyword
"concat" @keyword
"count" @keyword
"desc" @keyword
"else" @keyword
"exists" @keyword
"extends" @keyword
"forall" @keyword
"forex" @keyword
"from" @keyword
"if" @keyword
"implies" @keyword
"import" @keyword
"in" @keyword
"instanceof" @keyword
"max" @keyword
"min" @keyword
"module" @keyword
"newtype" @keyword
"not" @keyword
"or" @keyword
"order" @keyword
"rank" @keyword
"select" @keyword
"strictconcat" @keyword
"strictcount" @keyword
"strictsum" @keyword
"sum" @keyword
"then" @keyword
"where" @keyword
(false) @keyword
(predicate) @keyword
(result) @keyword
(specialId) @keyword
(super) @keyword
(this) @keyword
(true) @keyword

"boolean" @type.builtin
"float" @type.builtin
"int" @type.builtin
"date" @type.builtin
"string" @type.builtin

(annotName) @attribute

(lt) @operator
(le) @operator
(eq) @operator
(gt) @operator
(ge) @operator
(minus) @operator
(ne) @operator
(slash) @operator
(star) @operator
(mod) @operator
(plus) @operator
"::" @operator

"(" @punctuation.bracket
")" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket

"," @punctuation.delimiter
"|" @punctuation.delimiter

(typeExpr (className) @type)
(className) @type

(varName) @variable

(integer) @number
(float) @number

(string) @string

(aritylessPredicateExpr (literalId) @function)
(predicateName) @function

(line_comment) @comment
(block_comment) @comment
(qldoc) @comment
