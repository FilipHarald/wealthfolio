import { Settings } from '@/lib/types';
import { getRunEnv, RUN_ENV, invokeTauri, logger } from '@/adapters';

export const getSettings = async (): Promise<Settings> => {
  try {
    switch (getRunEnv()) {
      case RUN_ENV.DESKTOP:
        return invokeTauri('get_settings');
      default:
        throw new Error(`Unsupported`);
    }
  } catch (error) {
    logger.error('Error fetching settings.');
    return {} as Settings;
  }
};

export const updateSettings = async (settingsUpdate: Settings): Promise<Settings> => {
  try {
    switch (getRunEnv()) {
      case RUN_ENV.DESKTOP:
        return invokeTauri('update_settings', { settingsUpdate });
      default:
        throw new Error(`Unsupported`);
    }
  } catch (error) {
    logger.error('Error updating settings.');
    throw error;
  }
};

export const backupDatabase = async (): Promise<{ filename: string; data: Uint8Array }> => {
  try {
    switch (getRunEnv()) {
      case RUN_ENV.DESKTOP:
        const result = await invokeTauri<[string, number[]]>('backup_database');
        const [filename, data] = result;
        return { filename, data: new Uint8Array(data) };
      default:
        throw new Error(`Unsupported environment for database backup`);
    }
  } catch (error) {
    logger.error('Error backing up database.');
    throw error;
  }
};

export interface DatabaseInfo {
  database_path: string;
  app_data_dir: string;
  is_using_env_var: boolean;
}

export const getDatabaseInfo = async (): Promise<DatabaseInfo> => {
  try {
    switch (getRunEnv()) {
      case RUN_ENV.DESKTOP:
        return invokeTauri('get_database_info');
      default:
        throw new Error(`Unsupported environment for getting database info`);
    }
  } catch (error) {
    logger.error('Error fetching database info.');
    throw error;
  }
};
