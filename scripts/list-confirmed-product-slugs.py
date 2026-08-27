import json

payload = json.load(open("docs/jafory-public-product-details.json", encoding="utf-8"))
for item in payload["products"]:
    product = item["product"]
    slug = product.get("slug", "")
    if any(key in slug for key in ("nivea", "oral-b", "vaseline", "azure", "fastai", "fast-ai", "nvidia", "openai", "ibm")):
        print(slug, "|", product.get("nameEn", ""))
