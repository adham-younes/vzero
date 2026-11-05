#!/usr/bin/env python3
"""Import verified read-only EML backup to the private archive. Never sends email."""
import argparse,base64,concurrent.futures,hashlib,json,os,time,urllib.request,urllib.error
from pathlib import Path
from email import policy
from email.parser import BytesParser
from email.utils import parsedate_to_datetime,getaddresses
from datetime import datetime,timezone

def digest(b):return hashlib.sha256(b).hexdigest()
def clean(v,n):return str(v or '').replace('\0','')[:n]
def main():
 os.umask(0o077)
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--backup',type=Path,required=True);p.add_argument('--token-file',type=Path,required=True);a=p.parse_args()
 root=a.backup.resolve();token=a.token_file.read_text().strip();url='https://agynexa.si/api/owner-mail/import'
 def call(body=None):
  data=json.dumps(body,ensure_ascii=True).encode() if body is not None else None
  req=urllib.request.Request(url,data=data,headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=90) as r:return json.load(r)
 summary=json.loads((root/'summary.json').read_text());assert summary['complete'] and summary['account']=='adham@agynexa.si'
 expected={};items=[]
 for f in summary['folders']:
  folder=root/f['directory'];manifest=json.loads((folder/'manifest.json').read_text());assert manifest['complete']
  for uid in manifest['expected_uids']:
   item=manifest['messages'][uid];raw=(folder/(uid+'.eml')).read_bytes();assert len(raw)==item['bytes'] and digest(raw)==item['sha256']
   source='mail.spacemail.com|adham@agynexa.si|'+manifest['folder_name_imap']+'|'+manifest['uidvalidity']+'|'+uid
   ident='spacemail:'+digest(source.encode());expected[ident]={'sha256':item['sha256'],'bytes':len(raw)};items.append((raw,source,item,manifest['folder_name_imap'],ident))
 initial=call();already={m['id']:m for m in initial['messages']}
 def upload(task):
  raw,source,meta,folder,ident=task
  if ident in already:
   assert already[ident]['sha256']==meta['sha256'] and already[ident]['byte_count']==len(raw)
   return ident
  mail=BytesParser(policy=policy.default).parsebytes(raw)
  try:date=parsedate_to_datetime(str(mail.get('Date','')))
  except Exception:date=datetime.strptime(meta['internaldate'],'%d-%b-%Y %H:%M:%S %z')
  if date.tzinfo is None:date=date.replace(tzinfo=timezone.utc)
  part=mail.get_body(preferencelist=('plain',));text=''
  if part:
   try:text=part.get_content()
   except Exception:text=(part.get_payload(decode=True) or b'').decode('utf-8','replace')
  attachments=[]
  for part in mail.walk():
   if not part.is_multipart() and (part.get_content_disposition()=='attachment' or part.get_filename()):
    attachments.append({'filename':clean(part.get_filename(),1000),'size':len(part.get_payload(decode=True) or b'')})
  body={'inbox':'adham@agynexa.si','source_id':source,'raw':base64.b64encode(raw).decode(),'sha256':meta['sha256'],'folder':clean(folder,256),'subject':clean(mail.get('Subject'),2000),'sender':clean(mail.get('From'),1024),'recipients':[clean(addr,1024) for _,addr in getaddresses(mail.get_all('To',[]))],'message_at':date.astimezone(timezone.utc).isoformat(),'text_body':clean(text,262144),'attachments':attachments}
  for attempt in range(6):
   try:
    result=call(body);assert result['id']==ident and result['sha256']==meta['sha256'] and result['bytes']==len(raw);return ident
   except urllib.error.HTTPError as e:
    if e.code in (400,403,409):raise RuntimeError('Import rejected: HTTP '+str(e.code)) from None
    if attempt==5:raise RuntimeError('Import unavailable: HTTP '+str(e.code)) from None
   except (TimeoutError,urllib.error.URLError):
    if attempt==5:raise RuntimeError('Import connection unavailable') from None
   time.sleep(min(30,2**attempt))
 receipt=root.parent/'cloud-import-receipt.json';done=0
 print('Importing verified messages into the private archive. No email is sent.',flush=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  for ident in pool.map(upload,items):
   done+=1
   if done%20==0 or done==len(items):
    receipt.write_text(json.dumps({'complete':False,'verified':done,'expected':len(items),'updated_at':datetime.now(timezone.utc).isoformat()}));print('Archived and read-back verified:',done,'/',len(items),flush=True)
 remote={m['id']:m for m in call()['messages']}
 for ident,v in expected.items():assert remote[ident]['sha256']==v['sha256'] and remote[ident]['byte_count']==v['bytes']
 receipt.write_text(json.dumps({'complete':True,'verified':len(expected),'bytes':sum(x['bytes'] for x in expected.values()),'updated_at':datetime.now(timezone.utc).isoformat(),'mail_sent':False,'source_deleted':False},indent=2))
 print('COMPLETE:',len(expected),'messages preserved and verified in the private cloud archive.',flush=True)
if __name__=='__main__':
 try:main()
 except Exception as error:print('INCOMPLETE:',type(error).__name__,str(error)[:150],flush=True);raise SystemExit(1)
