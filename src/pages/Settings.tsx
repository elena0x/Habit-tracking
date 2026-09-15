import { useState } from 'react';
import { ChevronRight, Download, Upload, Trash2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as storage from '@/lib/storage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Settings = () => {
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    const data = storage.exportBackup();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const handleClearData = () => {
    storage.clearAllData();
    window.location.reload();
  };

  const menuItems = [
    {
      icon: Download,
      label: 'Export data',
      description: 'Download a portable JSON backup',
      onClick: handleExport,
      showSuccess: exportSuccess,
    },
    {
      icon: Upload,
      label: 'Import data',
      description: 'Restore from a HabitFlow backup',
      onClick: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const data = JSON.parse(event.target?.result as string);
                storage.importBackup(data);
                window.location.reload();
              } catch (err) {
                alert('Import failed. Please choose a valid HabitFlow backup.');
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      },
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Menu Items */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                'w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors',
                index !== menuItems.length - 1 && 'border-b border-border'
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              {item.showSuccess ? (
                <span className="text-sm text-emerald-500">Exported ✓</span>
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-rose-500">Clear all data</p>
                <p className="text-sm text-muted-foreground">Delete every habit and check-in</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all HabitFlow data?</AlertDialogTitle>
              <AlertDialogDescription>
                This cannot be undone. Every habit and check-in stored on this device will be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearData} className="bg-rose-500 hover:bg-rose-600">
                Delete everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* About */}
      <div className="bg-card rounded-2xl p-4 shadow-soft">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">HabitFlow</p>
            <p className="text-sm text-muted-foreground">Version 1.0.0 · Local-first</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Small check-ins make meaningful patterns visible.
        </p>
      </div>
    </div>
  );
};

export default Settings;
