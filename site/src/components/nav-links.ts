export interface NavLink {
  id: string;
  label: string;
  href: string;
  external: boolean;
}

export function buildNavLinks(base: string): NavLink[] {
  const b = base.replace(/\/$/, '');
  return [
    { id: 'sops', label: 'SOPs', href: `${b}/sops/`, external: false },
    { id: 'schema', label: 'Schema', href: `${b}/schema/`, external: false },
    {
      id: 'github',
      label: 'GitHub ↗',
      href: 'https://github.com/soillifeatlas/contribute',
      external: true
    },
    { id: 'atlas', label: 'Atlas ↗', href: 'https://soillifeatlas.org/', external: true },
    { id: 'submit', label: 'Start submission', href: `${b}/submit/`, external: false }
  ];
}
