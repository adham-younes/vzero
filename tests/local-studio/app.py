"""Run the already-built Next app against the isolated stack, without printing keys."""
import json,os
from pathlib import Path
s=json.loads(Path('/tmp/agynexa-local-status.json').read_text())
assert s['API_URL']=='http://127.0.0.1:54321'
os.environ.update(AGYNEXA_DATA_ENV='local',AGYNEXA_LOCAL_SUPABASE_URL=s['API_URL'],AGYNEXA_LOCAL_SUPABASE_PUBLISHABLE_KEY=s['ANON_KEY'],AGYNEXA_LOCAL_SUPABASE_SECRET_KEY=s['SERVICE_ROLE_KEY'],AGYNEXA_STUDIO_ENABLED='true')
os.execvp('node',['node','node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3016'])
