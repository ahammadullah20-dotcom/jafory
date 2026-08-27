import json, re
from pathlib import Path
root=Path('/home/ubuntu/jafory-github-audit')
data=json.loads((root/'docs/jafory-public-product-details.json').read_text())
map_text=(root/'shared/storageImageMap.ts').read_text()
map_entries=dict(re.findall(r'"([^"]+)":\s*"/manus-storage/([^"]+)"',map_text))
rows=[]
for item in data['products']:
 p=item['product']; c=item.get('category',{})
 image=(p.get('imageUrl') or '').replace('/jafory-media/','').replace('/manus-storage/','') or map_entries.get(p['slug'],'')
 rows.append((c.get('slug',''),p['slug'],p.get('nameEn',''),image))
for i,row in enumerate(rows,1): print(f'{i:03d}\t'+'\t'.join(row))
