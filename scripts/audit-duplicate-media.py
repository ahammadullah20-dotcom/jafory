import json, re
from collections import defaultdict
from pathlib import Path
root = Path('/home/ubuntu/jafory-github-audit')
export = json.loads((root/'docs/jafory-public-product-details.json').read_text())
products = export.get('products', export if isinstance(export, list) else [])
groups = defaultdict(list)
for row in products:
    p = row.get('product', row)
    slug = p.get('slug') or row.get('slug')
    name = p.get('name_en') or p.get('nameEn') or row.get('name_en') or slug
    category = p.get('category_slug') or p.get('categorySlug') or row.get('category_slug') or ''
    image = p.get('image_url') or p.get('imageUrl') or row.get('image_url') or ''
    groups[image].append({'slug':slug,'name':name,'category':category})
rows=[]
for image, items in groups.items():
    if image and len(items)>1:
        cats=sorted({x['category'] for x in items})
        rows.append({'image':image,'count':len(items),'categories':cats,'items':items})
rows.sort(key=lambda x:(-x['count'], x['image']))
(root/'docs/duplicate-media-ledger.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print('products',len(products),'unique images',len(groups),'duplicate groups',len(rows),'reused products',sum(x['count'] for x in rows))
for g in rows:
    print('\n',g['count'],g['image'])
    for i in g['items']: print(' ',i['category'],i['slug'],'|',i['name'])
