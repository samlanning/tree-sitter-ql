============
Basic select
============

import javascript

select
  "hello world" as foo,
  "other",
  "string with escaped \\ backslashes \" quotes \n\r\t whitespace",
  1234,
  1234.4321,
  true,
  false

---

(source_file 
  (ql 
    (moduleBody 
      (import 
        (IMPORT )
        (moduleId 
          (qualId 
            (simpleId 
              (lowerId )))))
      (select 
        (SELECT )
        (as_exprs 
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (string ))))
            (AS )
            (simpleId 
              (lowerId )))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (string )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (string )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (int )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (float )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (TRUE )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (FALSE ))))))))))

============
Select with variables and order by
============

from
  Foo foo,
  some.module::submodule::Bar bar,
  @dbtype bar,
  boolean b,
  date d,
  float f,
  int i,
  string s
select "hello world"
order by foo, bar desc, baz asc

---

(source_file 
  (ql 
    (moduleBody 
      (select 
        (FROM )
        (var_decls 
          (var_decl 
            (type 
              (classname 
                (upperId )))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (moduleId 
                (moduleId 
                  (qualId 
                    (qualId 
                      (simpleId 
                        (lowerId )))
                    (DOT )
                    (simpleId 
                      (lowerId ))))
                (SELECTION )
                (simpleId 
                  (lowerId )))
              (SELECTION )
              (classname 
                (upperId )))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (dbasetype 
                (atlowerId )))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (BOOLEAN ))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (DATE ))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (FLOAT ))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (INT ))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (STRING ))
            (simpleId 
              (lowerId ))))
        (SELECT )
        (as_exprs 
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (string ))))))
        (ORDER )
        (BY )
        (orderbys 
          (orderby 
            (simpleId 
              (lowerId )))
          (COMMA )
          (orderby 
            (simpleId 
              (lowerId ))
            (DESC ))
          (COMMA )
          (orderby 
            (simpleId 
              (lowerId ))
            (ASC )))))))