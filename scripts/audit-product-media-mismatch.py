import json, re
from pathlib import Path

root = Path('/home/ubuntu/jafory-github-audit')
export = json.loads((root/'docs/jafory-public-product-details.json').read_text())
products = []
for item in export.get('products', []):
    product = item.get('product', {})
    category = item.get('category', {})
    product = dict(product)
    product['categorySlug'] = category.get('slug')
    products.append(product)
if not products:
    raise SystemExit('No products in export')
text = (root/'shared/storageImageMap.ts').read_text()
entries = dict(re.findall(r'"([^"]+)":\s*"/manus-storage/([^"]+)"', text))
assets = [p.name for p in (root/'client/public/jafory-media').glob('*') if p.is_file()]

def tokens(value):
    return {x for x in re.split(r'[^a-z0-9]+', value.lower()) if len(x) >= 3 and x not in {'the','and','for','with','new','set','pack','pro','plus'}}

def score(slug, asset):
    st = tokens(slug)
    at = tokens(Path(asset).stem)
    overlap = st & at
    # brand/product tokens are strongest; generic expansion/index tokens are weakest
    meaningful = {x for x in overlap if not x.startswith('expansion') and not x.isdigit()}
    return len(meaningful), len(overlap), sorted(meaningful)

rows=[]
for p in products:
    slug=p.get('slug','')
    mapped=(p.get('imageUrl') or '').replace('/jafory-media/', '').replace('/manus-storage/', '')
    if not mapped:
        mapped=entries.get(slug)
    if not mapped:
        continue
    meaningful, overlap, hits=score(slug, mapped)
    candidates=sorted(((score(slug,a),a) for a in assets), reverse=True)[:5]
    rows.append({
      'category': p.get('categorySlug') or p.get('category',{}).get('slug') or p.get('categoryNameEn'),
      'slug': slug, 'nameEn': p.get('nameEn'), 'mapped': mapped,
      'meaningful_hits': meaningful, 'all_hits': overlap, 'hits': hits,
      'best_candidates': [{'asset':a,'meaningful_hits':s[0],'all_hits':s[1],'hits':s[2]} for s,a in candidates]
    })
rows.sort(key=lambda r:(r['meaningful_hits'], r['all_hits'], r['slug']))
print(json.dumps({'product_count':len(products),'map_count':len(entries),'asset_count':len(assets),'rows':rows}, ensure_ascii=False, indent=2))
