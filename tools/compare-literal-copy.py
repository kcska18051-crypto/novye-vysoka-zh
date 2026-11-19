"""Compare Russian and Chinese DOM structure and export aligned text for manual review."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import argparse

ROOT = Path(__file__).resolve().parents[1]
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
STABLE = ('id', 'class', 'name', 'type', 'role', 'aria-controls', 'aria-labelledby')

class Copy(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_body = False
        self.skip = 0
        self.structure = []
        self.texts = []
        self.attributes = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        if tag == 'body':
            self.in_body = True
        if not self.in_body:
            return
        a = dict(attrs)
        self.structure.append((tag, tuple((key, a.get(key)) for key in STABLE)))
        for key in ('alt', 'title', 'aria-label', 'placeholder', 'data-video-title', 'data-video-description'):
            if a.get(key):
                self.attributes.append({'tag': tag, 'id': a.get('id'), 'attribute': key, 'text': a[key]})
        if tag in ('script', 'style'):
            self.skip += 1
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.in_body and tag in ('script', 'style'):
            self.skip -= 1
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        if tag == 'body':
            self.in_body = False

    def handle_data(self, data):
        text = re.sub(r'\s+', ' ', data).strip()
        if self.in_body and not self.skip and text:
            self.texts.append({'tag': self.stack[-1] if self.stack else '', 'text': text})

def parse(path):
    p = Copy()
    p.feed(path.read_text(encoding='utf-8-sig'))
    return p

args = argparse.ArgumentParser(description=__doc__)
args.add_argument('--source', type=Path, default=ROOT / 'tmp/russian-literal-source/index.html')
options = args.parse_args()
if not options.source.is_file():
    args.error('Supply the exact Russian source HTML with --source PATH.')
ru = parse(options.source)
zh = parse(ROOT / 'dist/index.html')
pairs = [{'i': i, 'ru': a['text'], 'zh': b['text'], 'tag': a['tag']} for i, (a, b) in enumerate(zip(ru.texts, zh.texts))]
result = {'structure_identical': ru.structure == zh.structure, 'ru_text_nodes': len(ru.texts), 'zh_text_nodes': len(zh.texts), 'pairs': pairs,
          'attributes': [{'ru': a, 'zh': b} for a, b in zip(ru.attributes, zh.attributes)]}
out = ROOT / 'tmp/literal-copy-comparison.json'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({key: result[key] for key in ('structure_identical', 'ru_text_nodes', 'zh_text_nodes')}, ensure_ascii=False))
if ru.structure != zh.structure:
    for i, (a, b) in enumerate(zip(ru.structure, zh.structure)):
        if a != b:
            print('First structural difference:', i, a, b)
            break
if ru.structure != zh.structure or len(ru.texts) != len(zh.texts):
    raise SystemExit(1)
