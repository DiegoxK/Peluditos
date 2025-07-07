import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FeatureInputProps {
  value: string[];
  onChange: (features: string[]) => void;
  placeholder?: string;
}

export function FeatureInput({
  value = [],
  onChange,
  placeholder,
}: FeatureInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleAddFeature = () => {
    if (inputValue.trim() !== "" && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    onChange(value.filter((feature) => feature !== featureToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Add a feature..."}
        />
        <Button type="button" onClick={handleAddFeature}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((feature, index) => (
          <Badge key={index} variant="secondary">
            {feature}
            <button
              type="button"
              className="ring-offset-background focus:ring-ring ml-2 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => handleRemoveFeature(feature)}
            >
              <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
