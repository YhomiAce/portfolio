import type { SkillGroup } from "@/lib/content/types";
import { Section } from "./section";

/** Skills grouped by area. */
export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <Section id="skills" eyebrow="Skills" title="Tools I reach for">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.name} className="reveal-on-scroll rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-semibold tracking-tight">{group.name}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={group.name}>
              {group.skills.map((skill) => (
                <li key={skill} className="rounded-md bg-surface-2 px-2 py-1 text-sm text-muted">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
