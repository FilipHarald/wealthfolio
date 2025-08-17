import { Separator } from '@/components/ui/separator';
import { SettingsHeader } from '../header';
import { EnvironmentVariablesList } from './environment-variables-list';

export default function EnvironmentVariablesPage() {
  return (
    <div className="space-y-6">
      <SettingsHeader
        heading="Environment Variables"
        text="View and monitor environment variables used by the application."
      />
      <Separator />
      <EnvironmentVariablesList />
    </div>
  );
}
