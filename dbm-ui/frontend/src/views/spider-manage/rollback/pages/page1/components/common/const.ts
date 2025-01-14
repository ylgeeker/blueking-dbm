import { t } from '@locales/index';

export enum BackupSources {
  REMOTE = 'remote',
}
export enum BackupTypes {
  BACKUPID = 'BACKUPID',
  TIME = 'TIME',
}
export const selectList = {
  backupSource: [
    {
      value: BackupSources.REMOTE,
      label: t('远程备份'),
    },
  ],
  mode: [
    {
      value: BackupTypes.BACKUPID,
      label: t('备份记录'),
    },
    {
      value: BackupTypes.TIME,
      label: t('回档到指定时间'),
    },
  ],
};
