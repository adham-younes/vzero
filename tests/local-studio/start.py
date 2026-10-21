"""Start only local test services; no Supabase cloud credentials or CLI link.
Uses real GoTrue/Auth, PostgREST and PostgreSQL, without the CLI's large extension image.
Synthetic secrets and Docker files are written outside the repository.
"""
import base64, hashlib, hmac, json, os, secrets, subprocess, time
from pathlib import Path
ROOT=Path(os.environ.get('AGYNEXA_LOCAL_STACK_DIR','/tmp/agynexa-studio-stack'));ROOT.mkdir(mode=0o700,exist_ok=True)
if (ROOT/'compose.yml').exists(): raise SystemExit('Local stack already configured; use docker compose -f /tmp/agynexa-studio-stack/compose.yml up -d')
secret=secrets.token_hex(32);password=secrets.token_hex(24)
def enc(value):return base64.urlsafe_b64encode(json.dumps(value,separators=(',',':')).encode()).decode().rstrip('=')
def token(role):
 raw=enc({'alg':'HS256','typ':'JWT'})+'.'+enc({'role':role,'iss':'supabase','iat':int(time.time()),'exp':int(time.time())+86400*7})
 return raw+'.'+base64.urlsafe_b64encode(hmac.new(secret.encode(),raw.encode(),hashlib.sha256).digest()).decode().rstrip('=')
status={'API_URL':'http://127.0.0.1:54321','ANON_KEY':token('anon'),'SERVICE_ROLE_KEY':token('service_role')}
p=Path('/tmp/agynexa-local-status.json');p.write_text(json.dumps(status));p.chmod(0o600)
(ROOT/'bootstrap.sql').write_text(f"""
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create role authenticator login noinherit password '{password}';
grant anon,authenticated,service_role to authenticator;
create role supabase_auth_admin login createrole password '{password}';
create schema auth authorization supabase_auth_admin;
grant usage on schema auth to anon,authenticated,service_role;
grant usage on schema public to anon,authenticated,service_role;
grant all on schema public to postgres;
create function auth.uid() returns uuid language sql stable as $$
 select nullif(current_setting('request.jwt.claims',true)::jsonb->>'sub','')::uuid;
$$;
create function auth.jwt() returns jsonb language sql stable as $$
 select nullif(current_setting('request.jwt.claims',true),'')::jsonb;
$$;
alter function auth.uid() owner to supabase_auth_admin;
alter function auth.jwt() owner to supabase_auth_admin;
""")
(ROOT/'kong.yml').write_text('''_format_version: "2.1"
services:
  - name: auth
    url: http://auth:9999/
    routes:
      - name: auth
        paths: ["/auth/v1/"]
        strip_path: true
  - name: rest
    url: http://rest:3000/
    routes:
      - name: rest
        paths: ["/rest/v1/"]
        strip_path: true
''')
(ROOT/'compose.yml').write_text(f'''name: agynexa-studio-local
services:
  db:
    image: postgres@sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24
    environment:
      POSTGRES_PASSWORD: "{password}"
    ports: ["127.0.0.1:54322:5432"]
    volumes:
      - data:/var/lib/postgresql/data
      - ./bootstrap.sql:/docker-entrypoint-initdb.d/00-bootstrap.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 2s
      timeout: 3s
      retries: 30
  auth:
    image: public.ecr.aws/supabase/gotrue@sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b
    depends_on:
      db:
        condition: service_healthy
    environment:
      GOTRUE_API_HOST: 0.0.0.0
      GOTRUE_API_PORT: 9999
      API_EXTERNAL_URL: http://127.0.0.1:54321/auth/v1
      GOTRUE_SITE_URL: http://localhost:3016
      GOTRUE_DB_DRIVER: postgres
      GOTRUE_DB_DATABASE_URL: postgres://supabase_auth_admin:{password}@db:5432/postgres?sslmode=disable&search_path=auth
      GOTRUE_JWT_SECRET: "{secret}"
      GOTRUE_JWT_EXP: 3600
      GOTRUE_JWT_AUD: authenticated
      GOTRUE_JWT_DEFAULT_GROUP_NAME: authenticated
      GOTRUE_JWT_ADMIN_ROLES: service_role
      GOTRUE_EXTERNAL_EMAIL_ENABLED: "true"
      GOTRUE_MAILER_AUTOCONFIRM: "true"
      GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED: "false"
      GOTRUE_SECURITY_MANUAL_LINKING_ENABLED: "false"
      GOTRUE_PASSWORD_MIN_LENGTH: 12
      GOTRUE_SMTP_HOST: ""
  rest:
    image: public.ecr.aws/supabase/postgrest@sha256:d155c6718ed9a9f990d159a2ab7c0a3f16944dbb6d0a0344557421042acfe0df
    depends_on:
      db:
        condition: service_healthy
    environment:
      PGRST_DB_URI: postgres://authenticator:{password}@db:5432/postgres
      PGRST_DB_SCHEMAS: public
      PGRST_DB_ANON_ROLE: anon
      PGRST_JWT_SECRET: "{secret}"
  gateway:
    image: public.ecr.aws/supabase/kong@sha256:1b53405d8680a09d6f44494b7990bf7da2ea43f84a258c59717d4539abf09f6d
    depends_on: [auth,rest]
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /var/lib/kong/kong.yml
      KONG_PROXY_ACCESS_LOG: /dev/null
      KONG_ADMIN_ACCESS_LOG: /dev/null
    volumes: ["./kong.yml:/var/lib/kong/kong.yml:ro"]
    ports: ["127.0.0.1:54321:8000"]
volumes:
  data:
''')
for f in ROOT.iterdir():f.chmod(0o600 if f.name=='compose.yml' else 0o644)
subprocess.run(['docker','compose','-f',str(ROOT/'compose.yml'),'up','-d'],check=True)
print('Local-only stack started; synthetic keys saved outside the repository.')
