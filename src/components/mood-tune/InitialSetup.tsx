'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { UserPreferences } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const personalityTags = ['Optimistic', 'Calm', 'Passionate', 'Artistic', 'Spontaneous'];
const genderOptions: { value: UserPreferences['gender']; label: string }[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Do not disclose' },
];

interface InitialSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onFinished: (prefs: UserPreferences) => void;
  currentPrefs: UserPreferences | null;
}

export function InitialSetup({ isOpen, onClose, onFinished, currentPrefs }: InitialSetupProps) {
  const [gender, setGender] = useState<UserPreferences['gender'] | undefined>(currentPrefs?.gender);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>(currentPrefs?.personality || []);

  useEffect(() => {
    if (currentPrefs) {
      setGender(currentPrefs.gender);
      setSelectedPersonalities(currentPrefs.personality);
    }
  }, [currentPrefs, isOpen]);

  const togglePersonality = (tag: string) => {
    setSelectedPersonalities(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (gender && selectedPersonalities.length > 0) {
      onFinished({ gender, personality: selectedPersonalities });
    }
  };

  const isComplete = gender && selectedPersonalities.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-card/90 backdrop-blur-lg border-white/20">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Welcome to MoodTune</DialogTitle>
          <DialogDescription>
            Let&apos;s personalize your experience. Your preferences help us tune the perfect mood for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label className="font-bold text-lg font-headline">Gender</Label>
            <RadioGroup value={gender} onValueChange={(value: UserPreferences['gender']) => setGender(value)}>
              <div className="flex space-x-4">
                {genderOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label className="font-bold text-lg font-headline">Personality</Label>
             <p className="text-sm text-muted-foreground">Select one or more tags that best describe you.</p>
            <div className="flex flex-wrap gap-3">
              {personalityTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => togglePersonality(tag)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    selectedPersonalities.includes(tag)
                      ? "bg-primary text-primary-foreground border-transparent"
                      : "bg-transparent hover:bg-accent"
                  )}
                >
                  {selectedPersonalities.includes(tag) && <Check className="h-4 w-4"/>}
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!isComplete} className="w-full">
            Save and Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
