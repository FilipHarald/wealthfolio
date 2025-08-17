import { useQuery } from '@tanstack/react-query';
import { getDatabaseInfo, type DatabaseInfo } from '@/commands/settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Copy, Check, Database, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function EnvironmentVariablesList() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const { data: dbInfo, isLoading, error } = useQuery<DatabaseInfo>({
    queryKey: ['databaseInfo'],
    queryFn: getDatabaseInfo,
  });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(label));
      toast({
        title: 'Copied to clipboard',
        description: `${label} copied successfully`,
      });
      
      // Remove the item from copiedItems after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(label);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load database information: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!dbInfo) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Database Path */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base font-medium">Database Path</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={dbInfo.is_using_env_var ? 'default' : 'secondary'}>
                {dbInfo.is_using_env_var ? 'Environment Variable' : 'Default Path'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(dbInfo.database_path, 'Database path')}
                className="h-8 w-8 p-0"
              >
                {copiedItems.has('Database path') ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <CardDescription className="text-sm">
            {dbInfo.is_using_env_var 
              ? 'Database path set via DATABASE_URL environment variable'
              : 'Using default database path in application data directory'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm font-mono break-all">
              {dbInfo.database_path}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* App Data Directory */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base font-medium">Application Data Directory</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(dbInfo.app_data_dir, 'App data directory')}
              className="h-8 w-8 p-0"
            >
              {copiedItems.has('App data directory') ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <CardDescription className="text-sm">
            Directory where application data is stored, including database backups
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm font-mono break-all">
              {dbInfo.app_data_dir}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
