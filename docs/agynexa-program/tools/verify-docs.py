#!/usr/bin/env python3
"""Validate maintained documentation without building or contacting the app."""
from pathlib import Path
import hashlib
import json
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[3]
DOCS = ROOT / "docs/agynexa-program"


def require(condition, message):
    if not condition:
        raise SystemExit(message)


def read_json(path):
    return json.loads(path.read_text())


status = read_json(DOCS / "STATUS.json")
require(status["schema_version"] == 2, "Unexpected STATUS schema version")
master_hash = hashlib.sha256((DOCS / "MASTER-PLAN.md").read_bytes()).hexdigest()
require(master_hash == status["master_plan_sha256"], "Original master plan changed")

documents = [ROOT / "README.md", ROOT / "AGENTS.md", ROOT / "DESIGN.md", ROOT / "PRODUCT.md"]
documents += list(DOCS.rglob("*.md"))
link_count = 0
for path in documents:
    text = re.sub(r"```.*?```", "", path.read_text(), flags=re.S)
    for target in re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", text):
        target = target.strip().strip("<>")
        if urlsplit(target).scheme or target.startswith("#"):
            continue
        relative = unquote(target.split("#", 1)[0].split("?", 1)[0])
        if not relative:
            continue
        resolved = (path.parent / relative).resolve()
        require(resolved.is_relative_to(ROOT), f"Non-portable link in {path}: {target}")
        require(resolved.exists(), f"Broken file link in {path}: {target}")
        link_count += 1

json_files = list(DOCS.rglob("*.json"))
for path in json_files:
    read_json(path)

routes = read_json(DOCS / "current-routes.json")
pages = routes["pages"]
canonical = [page[lang] for page in pages for lang in ("en", "ar")]
require(len(canonical) == len(set(canonical)) == routes["canonical_count"] == 64, "Canonical route inventory mismatch")
source = (ROOT / "lib/agynexa.ts").read_text()
headings = re.findall(r"(\w+):\[", source.split("export const headings:")[1].split("export const summary:")[0])
solutions = re.findall(r"slug:'([^']+)'", source.split("export const solutions = [")[1].split("export const headings:")[0])
services = read_json(ROOT / "lib/service-catalog.json")
expected = {"/", *["/" + name for name in headings], *["/solutions/" + slug for slug in solutions], *["/services/" + service["slug"] for service in services]}
require({page["en"] for page in pages} == expected, "Current routes disagree with source; update the inventory")
for page in pages:
    require(page["ar"] == "/ar" + (page["en"] if page["en"] != "/" else ""), "Arabic route mismatch")
require(len(services) == routes["services"] == 10 and len(solutions) == routes["solutions"] == 9, "Catalog count mismatch")

api = read_json(DOCS / "architecture/current-api.openapi.json")
expected_api = set()
route_files = list((ROOT / "app/api").rglob("route.ts"))
for route_file in route_files:
    route = "/" + route_file.parent.relative_to(ROOT / "app").as_posix()
    route = re.sub(r"\[([^\]]+)\]", r"{\1}", route)
    methods = re.findall(r"export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b", route_file.read_text())
    require(methods, f"No recognized HTTP handler in {route_file}; update inventory extraction")
    expected_api.update((method.lower(), route) for method in methods)
require(len(route_files) == status["implemented"]["route_files"], "STATUS route-file count mismatch")
require(len(expected_api) == status["implemented"]["http_operations"], "STATUS HTTP-operation count mismatch")
for page in routes.get("account_pages", []) + routes.get("studio_pages", []):
    for locale in ("en", "ar"):
        require((ROOT / "app" / page[locale].lstrip("/") / "page.tsx").is_file(), "Missing private page")
    require(page["index"] is False, "Private pages must not be indexed")
actual_api = {(method, path) for path, operations in api["paths"].items() for method in operations if method in {"get", "post", "put", "patch", "delete", "head", "options"}}
require(api["openapi"] == "3.1.0" and actual_api == expected_api, "Current API inventory mismatch")


def check_refs(value):
    if isinstance(value, dict):
        if "$ref" in value:
            target = value["$ref"]
            require(target.startswith("#/"), "Current contract has unexpected external schema reference")
            current = api
            for part in target[2:].split("/"):
                part = part.replace("~1", "/").replace("~0", "~")
                require(part in current, f"Unresolved OpenAPI reference: {target}")
                current = current[part]
        for child in value.values():
            check_refs(child)
    elif isinstance(value, list):
        for child in value:
            check_refs(child)


check_refs(api)
manifest = read_json(DOCS / "evidence/stages-4-6/assets-manifest.json")
for asset in manifest["assets"]:
    data = (DOCS / "evidence/stages-4-6" / asset["file"]).read_bytes()
    require(len(data) == asset["bytes"], f"Evidence size mismatch: {asset['file']}")
    require(hashlib.sha256(data).hexdigest() == asset["sha256"], f"Evidence hash mismatch: {asset['file']}")

for relative in [status["documentation_index"], status["consolidated_report"], status["current_documentation_work"]["receipt"], status["current_product_release"]["receipt"], status["implemented"]["api_contract"], status["implemented"]["route_inventory"], status["last_product_checks"]["evidence"], *status["known_limitations"], *status["historical_snapshots"].values()]:
    require((DOCS / relative).is_file(), f"STATUS points to a missing document: {relative}")

print(json.dumps({"result": "PASS", "markdown_files": len(documents), "local_file_links": link_count, "json_files": len(json_files), "canonical_urls": len(canonical), "current_api_operations": len(actual_api), "evidence_hashes": len(manifest["assets"]), "master_plan_unchanged": True, "scope": "Document structure, local file links, JSON, internal contract references, source-derived inventory and evidence integrity; no app/network/runtime/schema-execution tests."}))
