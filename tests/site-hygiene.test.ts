import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const site = resolve(process.cwd(), 'site');
const read = (path: string): string => readFileSync(resolve(site, path), 'utf8');

describe('community site source checks', () => {
  const html = read('index.html');

  it('ships its stylesheet, script and favicon as first-party static assets', () => {
    expect(read('assets/styles.css').length).toBeGreaterThan(100);
    expect(read('assets/app.js').length).toBeGreaterThan(100);
    expect(read('assets/favicon.svg')).toContain('<svg');
    expect(html).toContain('href="./assets/styles.css"');
    expect(html).toContain('src="./assets/app.js"');
    expect(html).not.toMatch(/<script[^>]+src=["']https?:/i);
    expect(html).not.toMatch(/<link[^>]+href=["']https?:/i);
  });

  it('has no duplicate IDs or broken internal navigation anchors', () => {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const anchors = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const anchor of anchors) {
      expect(ids).toContain(anchor);
    }
  });

  it('clearly identifies the limits of the game integration and simulator', () => {
    expect(html).toContain('no ejecuta directamente el paquete TypeScript');
    expect(html).toContain('no proporcionan por sí mismos autorización');
    expect(html).toContain('No hospedamos ni enlazamos archivos filtrados');
  });

  it('describes inventory only as an in-memory reference and names its limitations', () => {
    expect(html).toContain('Inventario</h3>');
    expect(html).toContain('Contenedores y durabilidad, pendientes.');
    expect(html).toContain('packages/core · no persistente');
    expect(html).toContain('Sin afiliación ni autorización de Rockstar Games');
  });

  it('publishes an accessible local legal notice without requiring repository access', () => {
    const legal = read('legal.html');
    expect(html).toContain('href="./legal.html"');
    expect(legal).toContain('no equivale a un dictamen jurídico');
    expect(legal).toContain('Este sitio no ofrece un cliente, servidor dedicado');
    expect(legal).toContain('La licencia MIT del repositorio');
    expect(legal).toContain('localStorage');
    expect(legal).not.toMatch(/<script[^>]+src=["']https?:/i);
  });

  it('avoids remote font requests and uses no embedded Rockstar media', () => {
    const css = read('assets/styles.css');
    expect(css).not.toContain('fonts.googleapis.com');
    expect(css).not.toContain('fonts.gstatic.com');
    expect(html).not.toMatch(/(?:src|href)=["'][^"']+\.(?:rpf|rpf9|xvc|xex)/i);
  });
});
