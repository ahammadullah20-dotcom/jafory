import { type FormEvent, useState } from "react";
import { ImagePlus, Plus, Upload, Video } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";

type ProductDraft = {
  categoryId: string; slug: string; nameEn: string; nameAr: string; nameBn: string;
  shortDescriptionEn: string; shortDescriptionAr: string; shortDescriptionBn: string;
  descriptionEn: string; descriptionAr: string; descriptionBn: string;
  badgeEn: string; badgeAr: string; badgeBn: string; imageUrl: string;
  isFeatured: string; isActive: string;
};

const blankDraft: ProductDraft = { categoryId: "", slug: "", nameEn: "", nameAr: "", nameBn: "", shortDescriptionEn: "", shortDescriptionAr: "", shortDescriptionBn: "", descriptionEn: "", descriptionAr: "", descriptionBn: "", badgeEn: "", badgeAr: "", badgeBn: "", imageUrl: "", isFeatured: "0", isActive: "1" };

function Field({ label, value, onChange, type = "text", wide = false, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: "text" | "url"; wide?: boolean; placeholder?: string }) {
  return <label className={`admin-field ${wide ? "admin-field--wide" : ""}`}><span>{label}</span>{wide ? <textarea value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} /> : <input type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />}</label>;
}

function MediaControls({ productId, onPrimaryImage }: { productId: string; onPrimaryImage: (url: string) => void }) {
  const utils = trpc.useUtils();
  const media = trpc.admin.media.list.useQuery({ productId });
  const createUpload = trpc.admin.media.createUpload.useMutation();
  const commitUpload = trpc.admin.media.commitUpload.useMutation({ onSuccess: () => utils.admin.media.list.invalidate({ productId }) });
  const remove = trpc.admin.media.remove.useMutation({ onSuccess: () => utils.admin.media.list.invalidate({ productId }) });
  const [status, setStatus] = useState("");
  const upload = async (file: File) => {
    const kind = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null;
    if (!kind) { setStatus("Use JPG, PNG, WebP, MP4 or WebM files."); return; }
    const limit = kind === "image" ? 8_000_000 : 40_000_000;
    if (file.size > limit) { setStatus(kind === "image" ? "Each image must be under 8 MB." : "Video must be under 40 MB."); return; }
    try {
      setStatus(`Uploading ${file.name}…`);
      const prepared = await createUpload.mutateAsync({ productId, fileName: file.name, contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "video/mp4" | "video/webm", size: file.size });
      const uploaded = await supabase.storage.from("jafory-media").uploadToSignedUrl(prepared.path, prepared.token, file, { contentType: file.type });
      if (uploaded.error) throw uploaded.error;
      const hadImages = media.data?.images.length ?? 0;
      await commitUpload.mutateAsync({ productId, url: prepared.publicUrl, kind: prepared.kind });
      if (prepared.kind === "image" && !hadImages) onPrimaryImage(prepared.publicUrl);
      setStatus("Upload saved.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Upload did not finish. Please try again."); }
  };
  return <section className="admin-media-controls"><div><h3>Images and video</h3><p>Upload up to 8 images and one MP4/WebM video. Removing a file removes it from this product without deleting other catalogue data.</p></div><div className="admin-media-controls__actions"><label className="admin-button admin-button--soft"><ImagePlus size={15} /> Upload images<input hidden type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={async event => { for (const file of Array.from(event.target.files ?? []).slice(0, 8)) await upload(file); event.currentTarget.value = ""; }} /></label><label className="admin-button admin-button--soft"><Video size={15} /> Upload video<input hidden type="file" accept="video/mp4,video/webm" onChange={async event => { const file = event.target.files?.[0]; if (file) await upload(file); event.currentTarget.value = ""; }} /></label></div>{status && <p className="admin-media-controls__status">{status}</p>}<div className="admin-media-grid">{media.data?.images.map((url: string) => <figure key={url}><img src={url} alt="Uploaded product" /><button type="button" disabled={remove.isPending} onClick={() => remove.mutate({ productId, url })}>Remove image</button></figure>)}{media.data?.videoUrl && <figure className="admin-media-video"><video src={media.data.videoUrl} controls preload="metadata" /><button type="button" disabled={remove.isPending} onClick={() => remove.mutate({ productId, url: media.data!.videoUrl! })}>Remove video</button></figure>}</div></section>;
}

export default function AdminProductManager() {
  const utils = trpc.useUtils();
  const categories = trpc.admin.categories.list.useQuery();
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<ProductDraft>(blankDraft);
  const [editing, setEditing] = useState<string | undefined>();
  const [editorOpen, setEditorOpen] = useState(false);
  const products = trpc.admin.products.list.useQuery({ categoryId: categoryId || undefined, search: search || undefined });
  const save = trpc.admin.products.save.useMutation({ onSuccess: () => { toast.success("Product saved successfully."); utils.admin.products.list.invalidate(); utils.admin.overview.invalidate(); setEditorOpen(false); setEditing(undefined); setDraft(blankDraft); }, onError: error => { toast.error(error.message || "Product could not be saved."); } });
  const remove = trpc.admin.products.delete.useMutation({ onSuccess: () => { utils.admin.products.list.invalidate(); utils.admin.overview.invalidate(); } });
  const set = (key: keyof ProductDraft, value: string) => setDraft(previous => ({ ...previous, [key]: value }));
  const openEditor = (item?: any) => {
    const product = item?.product;
    setEditing(product?.id);
    setDraft(product ? { categoryId: product.categoryId, slug: product.slug, nameEn: product.nameEn, nameAr: product.nameAr, nameBn: product.nameBn, shortDescriptionEn: product.shortDescriptionEn ?? "", shortDescriptionAr: product.shortDescriptionAr ?? "", shortDescriptionBn: product.shortDescriptionBn ?? "", descriptionEn: product.descriptionEn ?? "", descriptionAr: product.descriptionAr ?? "", descriptionBn: product.descriptionBn ?? "", badgeEn: product.badgeEn ?? "", badgeAr: product.badgeAr ?? "", badgeBn: product.badgeBn ?? "", imageUrl: product.imageUrl ?? "", isFeatured: String(product.isFeatured ?? 0), isActive: String(product.isActive ?? 1) } : { ...blankDraft, categoryId });
    setEditorOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const submit = (event: FormEvent) => { event.preventDefault(); save.mutate({ id: editing, data: { categoryId: draft.categoryId || undefined, slug: draft.slug, nameEn: draft.nameEn, nameAr: draft.nameAr, nameBn: draft.nameBn, shortDescriptionEn: draft.shortDescriptionEn || null, shortDescriptionAr: draft.shortDescriptionAr || null, shortDescriptionBn: draft.shortDescriptionBn || null, descriptionEn: draft.descriptionEn || null, descriptionAr: draft.descriptionAr || null, descriptionBn: draft.descriptionBn || null, imageUrl: draft.imageUrl || null, badgeEn: draft.badgeEn || null, badgeAr: draft.badgeAr || null, badgeBn: draft.badgeBn || null, isFeatured: Number(draft.isFeatured), isActive: Number(draft.isActive) } }); };
  return <><header className="admin-heading"><div><p>Jafory administration</p><h1>Products</h1><span>Find a product first, then open its editor at the top of the page. You never need to scroll below the full catalogue to edit.</span></div></header><div className="admin-product-toolbar"><label className="admin-field"><span>Category filter</span><select value={categoryId} onChange={event => setCategoryId(event.target.value)}><option value="">All categories</option>{categories.data?.map(category => <option key={category.id} value={category.id}>{category.nameEn}</option>)}</select></label><Field label="Search product name" value={search} onChange={setSearch} placeholder="Type to filter" /><button type="button" className="admin-button admin-product-toolbar__add" onClick={() => openEditor()}><Plus size={15} /> Add product</button></div>{editorOpen && <section className="admin-panel admin-product-editor admin-product-editor--immediate"><div className="admin-product-editor__head"><h2>{editing ? "Edit product" : "Add product"}</h2><button type="button" className="admin-button admin-button--soft" onClick={() => { setEditorOpen(false); setEditing(undefined); setDraft(blankDraft); }}>Close editor</button></div><form className="admin-form" onSubmit={submit}><label className="admin-field"><span>Category</span><select value={draft.categoryId} onChange={event => set("categoryId", event.target.value)}><option value="">Use first category if blank</option>{categories.data?.map(category => <option key={category.id} value={category.id}>{category.nameEn}</option>)}</select></label><Field label="URL slug" value={draft.slug} onChange={value => set("slug", value)} placeholder="Optional — generated from English name" /><Field label="English name" value={draft.nameEn} onChange={value => set("nameEn", value)} /><Field label="Arabic name" value={draft.nameAr} onChange={value => set("nameAr", value)} /><Field label="Bengali name" value={draft.nameBn} onChange={value => set("nameBn", value)} /><Field label="Product image URL" type="url" value={draft.imageUrl} onChange={value => set("imageUrl", value)} placeholder="Optional — upload below or use https://" />{editing ? <MediaControls productId={editing} onPrimaryImage={url => set("imageUrl", url)} /> : <p className="admin-media-controls__status">Save the new product once, then use Edit to upload its images and video.</p>}<details className="admin-product-editor__advanced"><summary>Optional descriptions, badges and publication controls</summary><div className="admin-form"><Field label="English badge" value={draft.badgeEn} onChange={value => set("badgeEn", value)} /><Field label="Arabic badge" value={draft.badgeAr} onChange={value => set("badgeAr", value)} /><Field label="Bengali badge" value={draft.badgeBn} onChange={value => set("badgeBn", value)} /><Field label="English summary" wide value={draft.shortDescriptionEn} onChange={value => set("shortDescriptionEn", value)} /><Field label="Arabic summary" wide value={draft.shortDescriptionAr} onChange={value => set("shortDescriptionAr", value)} /><Field label="Bengali summary" wide value={draft.shortDescriptionBn} onChange={value => set("shortDescriptionBn", value)} /><Field label="English detail" wide value={draft.descriptionEn} onChange={value => set("descriptionEn", value)} /><Field label="Arabic detail" wide value={draft.descriptionAr} onChange={value => set("descriptionAr", value)} /><Field label="Bengali detail" wide value={draft.descriptionBn} onChange={value => set("descriptionBn", value)} /><label className="admin-field admin-check"><span>Publication controls</span><span><input type="checkbox" checked={draft.isActive === "1"} onChange={event => set("isActive", event.target.checked ? "1" : "0")} /> Active on storefront</span><span><input type="checkbox" checked={draft.isFeatured === "1"} onChange={event => set("isFeatured", event.target.checked ? "1" : "0")} /> Featured on home</span></label></div></details><div className="admin-form__actions"><button className="admin-button" disabled={save.isPending}>{save.isPending ? "Saving" : "Save product"}</button></div></form></section>}<section className="admin-panel admin-current-products"><h2>Current products</h2>{products.isLoading ? <p className="admin-empty">Loading products…</p> : products.data?.length ? <div className="admin-list admin-list--products">{products.data.map((item: any) => <article key={item.product.id}><div><strong>{item.product.nameEn || "Untitled product"}</strong><span>{item.category?.nameEn ?? "Unassigned"} · /{item.product.slug} · {item.product.isActive ? "Active" : "Inactive"}</span></div><div className="admin-list__actions"><button type="button" onClick={() => openEditor(item)}>Edit</button><button type="button" className="admin-button--danger" disabled={remove.isPending} onClick={() => { if (window.confirm(`Remove ${item.product.nameEn || "this product"}? This permanently removes its affiliate links, specifications, and reviews.`)) remove.mutate({ id: item.product.id }); }}>Remove</button></div></article>)}</div> : <p className="admin-empty">No products match this filter. Choose All categories or clear the search.</p>}</section></>;
}
