import io
import json
import uuid
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

def version(value):
    assert isinstance(value, list) and len(value) == 3
    assert all(type(n) is int and n >= 0 for n in value)
    return tuple(value)

def pack(data, label):
    with ZipFile(io.BytesIO(data)) as archive:
        assert archive.testzip() is None, 'Corrupt ZIP member'
        names = archive.namelist()
        assert len(names) == len(set(names)), 'Duplicate archive entries'
        for name in names:
            assert not name.startswith('/') and '\\' not in name and '..' not in PurePosixPath(name).parts, 'Unsafe archive path'
            if name.endswith('.json'):
                json.loads(archive.read(name).decode('utf-8-sig'))
        assert 'manifest.json' in names, 'Missing root manifest.json'
        manifest = json.loads(archive.read('manifest.json').decode('utf-8-sig'))
        assert manifest['format_version'] == 2, 'Unsupported manifest format'
        header = manifest['header']
        uuid.UUID(header['uuid'])
        version(header['version'])
        version(header['min_engine_version'])
        assert header['name'].strip(), 'Empty pack name'
        modules = manifest['modules']
        assert modules, 'No modules'
        identities = {header['uuid'].lower()}
        for module in modules:
            identity = str(uuid.UUID(module['uuid']))
            assert identity not in identities, 'Repeated UUID inside pack'
            identities.add(identity)
            version(module['version'])
            assert module['type'] in ('data', 'resources', 'script', 'world_template'), 'Unknown module type'
        print('PASS', label, len(names), 'entries; structural checks only')
        return manifest

def main():
    paths = sorted(Path('downloads').glob('*.mcpack')) + sorted(Path('downloads').glob('*.mcaddon'))
    assert paths, 'No downloadable packages found'
    failures = []
    for path in paths:
        try:
            if path.suffix == '.mcpack':
                pack(path.read_bytes(), str(path))
            else:
                with ZipFile(path) as addon:
                    assert addon.testzip() is None, 'Corrupt add-on archive'
                    names = addon.namelist()
                    assert len(names) == len(set(names)), 'Duplicate add-on entries'
                    assert all(not n.startswith('/') and '..' not in PurePosixPath(n).parts for n in names), 'Unsafe add-on path'
                    members = [n for n in names if n.endswith('.mcpack')]
                    assert members, 'No bundled .mcpack files'
                    manifests = [pack(addon.read(n), str(path) + ':' + n) for n in members]
                    headers = {str(uuid.UUID(m['header']['uuid'])): version(m['header']['version']) for m in manifests}
                    assert len(headers) == len(manifests), 'Duplicate bundled pack identities'
                    for manifest in manifests:
                        for dependency in manifest.get('dependencies', []):
                            if 'uuid' in dependency:
                                key = str(uuid.UUID(dependency['uuid']))
                                assert headers.get(key) == version(dependency['version']), 'Missing or mismatched bundled dependency'
        except Exception as exc:
            failures.append(str(path) + ': ' + (str(exc) or type(exc).__name__))
    if failures:
        raise SystemExit('\n'.join(failures))
    print('Validated', len(paths), 'archives. Import, gameplay, and target-version compatibility remain unverified.')

if __name__ == '__main__':
    main()
