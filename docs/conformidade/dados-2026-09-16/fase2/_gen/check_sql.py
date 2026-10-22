import sys
from pglast import parse_sql
for path in sys.argv[1:]:
    src=open(path,encoding="utf-8").read()
    try:
        stmts=parse_sql(src)
        print(f"OK  {path.split('/')[-1]}: {len(stmts)} statements -> " + ", ".join(type(s.stmt).__name__ for s in stmts))
    except Exception as e:
        print(f"ERRO {path}: {e}")
