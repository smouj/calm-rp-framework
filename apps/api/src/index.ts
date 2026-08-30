export interface PlatformHealth {
  readonly service: 'gta6-rp-api';
  readonly status: 'ok';
  readonly phase: 'pre-platform';
  readonly gta6Adapter: 'reserved';
}

export const health = (): PlatformHealth => ({
  service: 'gta6-rp-api',
  status: 'ok',
  phase: 'pre-platform',
  gta6Adapter: 'reserved',
});
