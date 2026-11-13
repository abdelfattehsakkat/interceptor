import { describe, expect, it } from 'vitest';
import { analyze } from './engine';
import { CASES } from '../data/cases';

describe('cas de référence', () => {
  for (const c of CASES) {
    it(`${c.id} — ${c.title}`, () => {
      const res = analyze(c.input);
      expect(res.mode).toBe(c.expectMode);
      for (const [id, status] of Object.entries(c.expect)) {
        const v = res.verdicts.find((x) => x.applianceId === id);
        expect(v, `verdict ${id}`).toBeDefined();
        expect(v!.status, `${c.id} ${id}: ${v!.reasons.map((x) => x.ruleId + ':' + x.weight).join(',')}`).toBe(status);
      }
      if (c.expectDoubt) expect(res.doubts.map((d) => d.label)).toContain(c.expectDoubt);
    });
  }

  it('toute raison non « NS » avec niveau A ou B cite au moins une source, sauf règle générique', () => {
    for (const c of CASES) {
      const res = analyze(c.input);
      for (const v of res.verdicts) {
        for (const r of v.reasons) {
          if (r.level === 'A') expect(r.sources.length, `${c.id}/${v.applianceId}/${r.ruleId}`).toBeGreaterThan(0);
          if (r.level === 'NS') expect(r.sources.length).toBe(0);
        }
      }
    }
  });
});
