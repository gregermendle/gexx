"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export interface TagInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  renderTag?: (
    tag: string,
    index: number,
    onRemove: () => void
  ) => React.ReactNode;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      value = "",
      onValueChange,
      placeholder = "Enter tags...",
      emptyPlaceholder = "Enter tags (press Enter, comma, or space to add)",
      disabled = false,
      className,
      renderTag,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const tags = React.useMemo(() => {
      if (value) {
        return value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      return [];
    }, [value]);

    const updateValue = (newTags: string[]) => {
      const newValue = newTags.map((tag) => tag).join(", ");
      if (onValueChange) onValueChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const addTag = (tag: string) => {
      const trimmedTag = tag.trim();
      if (trimmedTag) {
        const newTags = [...tags, trimmedTag];
        updateValue(newTags);
      }
      setInputValue("");
    };

    const removeTag = (tagIndex: number) => {
      updateValue(tags.slice(0, tagIndex).concat(tags.slice(tagIndex + 1)));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "," || e.key === " ") {
        e.preventDefault();
        if (inputValue) {
          addTag(inputValue);
        }
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        e.preventDefault();
        removeTag(tags.length - 1);
      }
    };

    const handleBlur = () => {
      if (inputValue) {
        addTag(inputValue);
      }
    };

    const handleContainerClick = (e: React.MouseEvent) => {
      inputRef.current?.focus();
    };

    const defaultRenderTag = (
      tag: string,
      index: number,
      onRemove: () => void
    ) => (
      <Badge
        key={tag + index}
        variant="outline"
        className="flex items-center gap-1 px-3 py-1"
      >
        {tag}
        {!disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="tag-delete h-3 w-3 cursor-pointer hover:text-destructive" />
          </button>
        )}
      </Badge>
    );

    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 p-2 border rounded-md min-h-10 has-[input:focus-within]:ring-2 has-[input:focus-within]:ring-ring has-[input:focus-within]:ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={handleContainerClick}
      >
        {tags.map((tag, index) =>
          renderTag
            ? renderTag(tag, index, () => removeTag(index))
            : defaultRenderTag(tag, index, () => removeTag(index))
        )}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="flex-1 min-w-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7 bg-transparent!"
          placeholder={tags.length > 0 ? placeholder : emptyPlaceholder}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export { TagInput };
