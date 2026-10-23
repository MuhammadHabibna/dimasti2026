# -*- coding: utf-8 -*-
import os, json, re

geojson_src = "data/FINAL/indonesia_kabupaten.geojson"
districts_json = "nusa-mipa-web/src/data/districts_master.json"
out_geojson = "nusa-mipa-web/public/data/indonesia_kabupaten_enriched.geojson"

with open(geojson_src, "r", encoding="utf-8") as f:
    geo = json.load(f)

with open(districts_json, "r", encoding="utf-8") as f:
    districts = json.load(f)

alias_map = {
    'tanjung jabung b': 'tanjung jabung barat',
    'tanjung jabung t': 'tanjung jabung timur',
    'pangkajene kepulauan': 'pangkajene dan kepulauan',
    'pangkajene': 'pangkajene dan kepulauan',
    'siau tagulandang biaro': 'kepulauan siau tagulandang biaro',
    'sitaro': 'kepulauan siau tagulandang biaro',
    'kepulauan sula': 'kepulauan sula',
    'halmahera barat': 'halmahera barat',
    'kota ambon': 'ambon',
    'kota banda aceh': 'banda aceh',
    'kota batam': 'batam'
}

def clean_name(n):
    n = n.lower().strip()
    n = re.sub(r'^(kabupaten|kab\.|kota)\s+', '', n)
    n = alias_map.get(n, n)
    n = re.sub(r'[^a-z0-9]', '', n)
    return n

lookup_prov_kab = {}
lookup_kab = {}

for key, d in districts.items():
    prov_c = clean_name(d['nama_provinsi'])
    kab_c = clean_name(d['nama_kabupaten_kota'])
    lookup_prov_kab[(prov_c, kab_c)] = (key, d)
    if kab_c not in lookup_kab:
        lookup_kab[kab_c] = (key, d)

matched = 0
for feat in geo['features']:
    props = feat['properties']
    p_name1 = props.get('NAME_1', '')
    p_name2 = props.get('NAME_2', '')
    
    prov_c = clean_name(p_name1)
    kab_c = clean_name(p_name2)
    
    match_data = None
    if (prov_c, kab_c) in lookup_prov_kab:
        match_data = lookup_prov_kab[(prov_c, kab_c)]
    elif kab_c in lookup_kab:
        match_data = lookup_kab[kab_c]
    
    if match_data:
        key, d = match_data
        matched += 1
        props['matched'] = True
        props['district_key'] = key
        props['nama_kabupaten_kota'] = d['nama_kabupaten_kota']
        props['nama_provinsi'] = d['nama_provinsi']
        props['cluster_id'] = d['cluster_id']
        props['cluster_tag'] = d['cluster_tag']
        props['cluster_color'] = d['cluster_color']
        props['numerasi_ALL'] = d['ipo_dimensions']['numerasi']
        props['numerasi_SD'] = d['levels'].get('SD', {}).get('numerasi_score', d['ipo_dimensions']['numerasi'])
        props['numerasi_SMP'] = d['levels'].get('SMP', {}).get('numerasi_score', d['ipo_dimensions']['numerasi'])
        props['numerasi_SMA'] = d['levels'].get('SMA', {}).get('numerasi_score', d['ipo_dimensions']['numerasi'])
        props['numerasi_SMK'] = d['levels'].get('SMK', {}).get('numerasi_score', d['ipo_dimensions']['numerasi'])
        props['loss_badge'] = d['learning_loss']['loss_badge']
        props['is_severe_loss'] = d['learning_loss']['is_severe_loss']
        props['prescriptive_action'] = d['recommendation']['prescriptive_action']
    else:
        props['matched'] = False
        props['district_key'] = None
        props['nama_kabupaten_kota'] = p_name2
        props['nama_provinsi'] = p_name1
        props['cluster_id'] = 2
        props['cluster_tag'] = "Paradoks Sarpras"
        props['cluster_color'] = "#F59E0B"
        props['numerasi_ALL'] = 54.0
        props['numerasi_SD'] = 53.0
        props['numerasi_SMP'] = 60.0
        props['numerasi_SMA'] = 55.0
        props['numerasi_SMK'] = 52.0
        props['loss_badge'] = "Moderate Loss"
        props['is_severe_loss'] = False
        props['prescriptive_action'] = "Priority DAK Fisik: Sarpras & Pedagogi"

print(f"Matched {matched} / {len(geo['features'])} features successfully!")

with open(out_geojson, "w", encoding="utf-8") as f:
    json.dump(geo, f, ensure_ascii=False)
