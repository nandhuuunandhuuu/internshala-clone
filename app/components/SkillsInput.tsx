"use client";

import { useState } from "react";
import { MASTER_SKILLS } from "../lib/skillsList";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";

type Props = {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[]; // kept for compatibility, no longer required
};

export default function SkillsInput({ value, onChange }: Props) {
  const { language } = useLanguage();
  const t = translations[language];

  const tags = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = MASTER_SKILLS.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      inputValue.length > 0 &&
      !tags.some((t) => t.toLowerCase() === s.toLowerCase())
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    const match = MASTER_SKILLS.find(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );

    if (!match) {
      setInputValue("");
      return;
    }

    if (tags.some((t) => t.toLowerCase() === match.toLowerCase())) {
      setInputValue("");
      return;
    }

    onChange([...tags, match].join(", "));
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag).join(", "));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg bg-white flex flex-wrap gap-2 items-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-xs bg-[#F5A623]/10 text-[#B7791F] px-2 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-[#B7791F] hover:text-red-600 font-bold leading-none"
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={
            tags.length === 0 ? t.skillsSearchPlaceholder : ""
          }
          className="flex-1 min-w-[120px] outline-none text-sm"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-[#0F172A]/15 rounded-lg shadow-md max-h-40 overflow-y-auto">
          {filteredSuggestions.slice(0, 8).map((s) => (
            <button
              type="button"
              key={s}
              onMouseDown={() => addTag(s)}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-[#F5A623]/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}