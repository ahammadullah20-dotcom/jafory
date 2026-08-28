import re
from collections import defaultdict
from pathlib import Path

source = Path('/home/ubuntu/jafory-affiliate-hub/shared/storageImageMap.ts').read_text()
pairs = re.findall(r'^\s+"([^"]+)":\s+(null|"[^"]+"),?$', source, re.M)
groups = defaultdict(list)
unverified = []
for slug, raw_value in pairs:
    if raw_value == 'null':
        unverified.append(slug)
    else:
        groups[raw_value.strip('"')].append(slug)

duplicates = {image: slugs for image, slugs in groups.items() if len(slugs) > 1}
print(f'canonical entries={len(pairs)}')
print(f'unverified fallback entries={len(unverified)}')
print(f'non-null assets={len(groups)}')
print(f'duplicate groups={len(duplicates)}')
print(f'reused mapped products={sum(len(slugs) for slugs in duplicates.values())}')
for image, slugs in sorted(duplicates.items(), key=lambda item: (-len(item[1]), item[0])):
    print(f'{len(slugs)}\t{image}\t{",".join(slugs)}')
