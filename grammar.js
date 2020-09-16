module.exports = grammar({
  name: 'ql',

  conflicts: $ => [
    [$.simpleId, $.className],
    [$.simpleId, $.literalId],
  ],

  extras: $ => [
    /[ \t\r\n]/,
    $.line_comment,
    $.block_comment,
  ],

  word: $ => $._lower_id,

  rules: {
    ql: $ => repeat($.moduleMember),

    module: $ => seq(
      'module',
      field("name", $.moduleName),
      choice(
        seq(
          "{",
          repeat($.moduleMember),
          "}"
        ),
        $.moduleAliasBody
      )
    ),

    moduleMember: $ => choice(
      seq(
        repeat($.annotation),
        choice($.importDirective, $.classlessPredicate, $.dataclass, $.datatype, $.select, $.module)
      ),
      $.qldoc
    ),

    importDirective: $ => seq(
      'import',
      $.importModuleExpr,
      optional(seq('as', $.moduleName))
    ),

    moduleAliasBody: $ => seq('=', $.moduleExpr, ";"),
    predicateAliasBody: $ => seq('=', $.predicateExpr, ";"),
    typeAliasBody: $ => seq('=', $.typeExpr, ";"),
    typeUnionBody: $ => seq('=', $.typeExpr, "or", sep($.typeExpr, "or"), ";"),

    classlessPredicate: $ => seq(
      field("returnType", choice($.predicate, $.typeExpr)),
      field("name", $.predicateName),
      choice(
        seq("(", sep($.varDecl, ","), ")", $._optbody),
        $.predicateAliasBody
      )
    ),

    datatype: $ => seq(
      'newtype',
      field("name", $.className),
      '=',
      $.datatypeBranches
    ),

    datatypeBranches: $ => sep1($.datatypeBranch, "or"),

    datatypeBranch: $ => seq(
      optional($.qldoc),
      optional($.annotation),
      field("name", $.className),
      "(",
      sep($.varDecl, ","),
      ")",
      optional($.body)
    ),

    select: $ => seq(
      optional(seq("from", sep($.varDecl, ","))),
      optional(seq("where", $._exprOrTerm)),
      seq('select', $.asExprs, optional($.orderBys))
    ),

    dataclass: $ => seq(
      'class',
      field("name", $.className),
      choice(
        seq('extends', sep1($.typeExpr, ","), "{", repeat($.classMember), "}"),
        $.typeAliasBody,
        $.typeUnionBody
      )
    ),

    classMember: $ => choice(
      seq(
        repeat($.annotation),
        choice($.charpred, $.memberPredicate, $.field)
      ),
      $.qldoc
    ),

    charpred: $ => seq($.className, "(", ")", "{", $._exprOrTerm, "}"),

    memberPredicate: $ => seq(
      field("returnType", choice($.predicate, $.typeExpr)),
      field("name", $.predicateName),
      "(",
      sep($.varDecl, ","),
      ")",
      $._optbody
    ),

    field: $ => seq($.varDecl, ";"),

    _optbody: $ => choice(
      $.empty,
      $.body,
      $.higherOrderTerm
    ),

    empty: $ => ";",

    body: $ => seq("{", $._exprOrTerm, "}"),

    higherOrderTerm: $ => seq(
      '=',
      field("name", $.literalId),
      "(",
      sep($.predicateExpr, ","),
      ")",
      "(",
      sep($._call_arg, ","),
      ")"
    ),

    special_call: $ => seq($.specialId, "(", ")"),
    prefix_cast: $ => prec.dynamic(10, seq("(", $.typeExpr, ")", $._exprOrTerm)),
    unary_expr: $ => seq($.unop, $._exprOrTerm),
    mul_expr: $ => prec.left(9, seq(
      field('left', $._exprOrTerm),
      $.mulop,
      field('right', $._exprOrTerm)
    )),
    add_expr: $ => prec.left(8, seq(
      field('left', $._exprOrTerm),
      $.addop,
      field('right', $._exprOrTerm)
    )),
    in_expr: $ => prec.left(7, seq(
      field('left', $._exprOrTerm),
      'in',
      field('right', $._primary)
    )),
    comp_term: $ => prec.left(6, seq(
      field('left', $._exprOrTerm),
      $.compop,
      field('right', $._exprOrTerm)
    )),
    instance_of: $ => prec.left(5, seq($._exprOrTerm, 'instanceof', $.typeExpr)),
    negation: $ => prec.left(4, seq('not', $._exprOrTerm)),
    if_term: $ => prec.left(3, seq(
      "if", field('cond', $._exprOrTerm),
      "then", field('first', $._exprOrTerm),
      "else", field('second', $._exprOrTerm)
    )),
    conjunction: $ => prec.left(3, seq(
      field('left', $._exprOrTerm),
      "and",
      field('right', $._exprOrTerm)
    )),
    disjunction: $ => prec.left(2, seq(
      field('left', $._exprOrTerm),
      "or",
      field('right', $._exprOrTerm)
    )),
    implication: $ => prec.left(1, seq(
      field('left', $._exprOrTerm),
      "implies",
      field('right', $._exprOrTerm)
    )),

    quantified: $ => seq($.quantifier, "(",
      choice(
        seq(
          sep($.varDecl, ","),
          optional(seq("|", $._exprOrTerm, optional(seq("|", $._exprOrTerm))))
        ),
        $._exprOrTerm
      ),
      ")"),

    specialId: $ => 'none',

    quantifier: $ => choice('exists', 'forall', 'forex'),

    _call_arg: $ => choice(
      $._exprOrTerm,  // ExprArg
      $.underscore  // DontCare
    ),

    underscore: $ => '_',

    qualifiedRhs: $ => choice(
      seq( // QualCall
        field("name", $.predicateName),
        optional($.closure),
        "(",
        sep($._call_arg, ","),
        ")"
      ),
      seq( // QualCast
        "(",
        $.typeExpr,
        ")"
      )
    ),

    call_body:$ => seq("(", sep($._call_arg, ","), ")"),
    unqual_agg_body:$ => seq("(",  sep($.varDecl, ","), "|", optional($._exprOrTerm), optional(seq("|", $.asExprs)), ")"),

    _call_or_unqual_agg_body: $ => choice($.call_body, $.unqual_agg_body),

    call_or_unqual_agg_expr: $ => prec.dynamic(10, seq($.aritylessPredicateExpr, optional($.closure), $._call_or_unqual_agg_body)),
    qualified_expr: $ => seq($._primary, ".", $.qualifiedRhs),
    super_ref: $ => seq(optional(seq($.typeExpr, ".")), $.super),


    // The split here is to ensure that the node is non-empty
    full_aggregate_body: $ => choice(
      seq(sep($.varDecl, ","),
        seq(
          "|",
          optional($._exprOrTerm),
          optional(seq("|", $.asExprs, optional($.orderBys)))
        )
      ),
      sep1($.varDecl, ","),
      ),

    expr_aggregate_body: $ => seq($.asExprs, optional($.orderBys)),

    aggregate: $ => seq($.aggId,                                                                // Agg
      optional(
        seq("[", sep1($._exprOrTerm, ","), "]")
      ),
      "(",
      optional(
        choice($.full_aggregate_body, $.expr_aggregate_body)
      ),
      ")"
    ),
    range: $ => seq(                                                                        // Range
      "[",
      field('lower', $._exprOrTerm), "..", field('upper', $._exprOrTerm),
      "]"
    ),
    set_literal: $ => seq(
      "[",
      sep($._exprOrTerm, ','),
      "]"
    ),

    par_expr: $ => seq("(", $._exprOrTerm, ")"),


    _exprOrTerm: $ => choice(
      $.special_call,
      $.prefix_cast,
      $._primary,
      $.unary_expr,
      $.mul_expr,
      $.add_expr,
      $.in_expr,
      $.comp_term,
      $.instance_of,
      $.negation,
      $.if_term,
      $.conjunction,
      $.disjunction,
      $.implication,
      $.quantified,                         // QuantifiedTerm
    ),

    _primary: $ => choice(
      $.call_or_unqual_agg_expr, //
      $.qualified_expr,                                        // QualifiedExpr
      $.literal,                                                                  // Lit
      $.variable,                                                                 // Var
      $.super_ref,
      $.aggregate,
      $.range,
      $.set_literal,
      $.par_expr                                                 // ParExpr
    ),

    literal: $ => choice(
      $.integer,     // IntLit
      $.float,       // FloatLit
      $.bool,        // BoolLit
      $.string       // StringLit
    ),


    bool: $ => choice($.true, $.false),

    variable: $ => choice($.this, $.result, $.varName),

    compop: $ => choice('=', '!=', '<', '>', '<=', '>='),

    unop: $ => choice('+', '-'),

    mulop: $ => choice('*', '/', '%'),

    addop: $ => choice('+', '-'),

    closure: $ => choice('*', '+'),

    direction: $ => choice('asc', 'desc'),

    varDecl: $ => seq($.typeExpr, $.varName),

    asExprs: $ => sep1($.asExpr, ","),

    asExpr: $ => seq($._exprOrTerm, optional(seq('as', $.varName))),

    orderBys: $ => seq("order", "by", sep1($.orderBy, ",")),

    orderBy: $ => seq($._exprOrTerm, optional($.direction)),

    qldoc: $ => /\/\*\*[^*]*\*+([^/*][^*]*\*+)*\//,

    literalId: $ => choice($._lower_id, $._upper_id),

    annotation: $ => choice(
      field('name', $.annotName), // SimpleAnnotation
      seq( // ArgsAnnotation
        field('name', $.annotName),
        "[",
        field('args', sep1($.annotArg, ",")),
        "]"
      )
    ),

    annotName: $ => $._lower_id,

    annotArg: $ => choice($.simpleId, $.this, $.result),

    moduleName: $ => $.simpleId,

    qualModuleExpr: $ => sep1(field("name", $.simpleId), "."),

    importModuleExpr: $ => seq($.qualModuleExpr, repeat(seq("::", field("name", $.simpleId)))),

    moduleExpr: $ => choice($.simpleId, seq($.moduleExpr, "::", field("name", $.simpleId))),

    primitiveType: $ => choice('boolean', 'date', 'float', 'int', 'string'),

    simpleId: $ => choice($._lower_id, $._upper_id),

    className: $ => $._upper_id,

    dbtype: $ => /@[a-z][A-Za-z0-9_]*/,

    typeExpr: $ => choice(
      seq(optional(seq($.moduleExpr, "::")), field("name", $.className)),
      $.dbtype,
      $.primitiveType
    ),

    predicateName: $ => $._lower_id,

    aritylessPredicateExpr: $ => seq(optional(seq($.moduleExpr, "::")), field("name", $.literalId)),

    predicateExpr: $ => seq($.aritylessPredicateExpr, '/', $.integer),

    varName: $ => $.simpleId,

    aggId: $ => choice('avg', 'concat', 'strictconcat', 'count', 'max', 'min', 'rank', 'strictcount', 'strictsum', 'sum', 'any'),

    _upper_id: $ => /[A-Z][A-Za-z0-9_]*/,
    _lower_id: $ => /[a-z][A-Za-z0-9_]*/,
    integer: $ => /[0-9]+/,
    float: $ => /[0-9]+\.[0-9]+/,
    string: $ => /"([^"\\\r\n\t]|\\["\\nrt])*"/,
    line_comment: $ => /\/\/[^\r\n]*/,
    block_comment: $ => /\/\*([^*]+\*+([^/*][^*]*\*+)*|\*)\//,

    false: $ => 'false',
    predicate: $ => 'predicate',
    result: $ => 'result',
    super: $ => 'super',
    this: $ => 'this',
    true: $ => 'true',
  }
});

function sep(rule, s) {
  return optional(sep1(rule, s))
}

function sep1(rule, s) {
  return seq(rule, repeat(seq(s, rule)))
}
