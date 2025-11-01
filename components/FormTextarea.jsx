// components/FormTextarea.jsx
"use client";

import React, { useId } from "react";
import { Textarea } from "@/components/ui/textarea";

/**
 * Props:
 *   - label (string, optional)
 *   - maxLength (number, optional) – shows remaining characters
 *   - errorMessage (string, optional)
 *   - ...any native <textarea> attributes (placeholder, value, onChange, rows, etc.)
 */
export const FormTextarea = ({
  label,
  maxLength,
  errorMessage,
  onPasteFromClipboard,
  onClearText,
  ...rest
}) => {
  const id = useId();
  const remaining =
    typeof maxLength === "number"
      ? maxLength - (rest.value?.length ?? 0)
      : null;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Textarea
        id={id}
        {...rest}
        className="w-full min-h-[120px]" // ensures a decent height out‑of‑the‑box
      />

      {/* Character‑count helper */}
      {typeof remaining === "number" && (
        <p className="text-xs text-gray-500">
          {remaining} characters left
        </p>
      )}

      {/* Show a small “Paste” button right under the textarea */}
      {onPasteFromClipboard && (
        <button
          type="button"
          onClick={onPasteFromClipboard}
          className="mt-1 text-sm text-primary underline hover:text-primary/80"
        >
          Paste from clipboard
        </button>
      )}

      {onClearText && (
        <button
          type="button"
          onClick={onClearText}
          className="mt-1 text-sm text-primary underline hover:text-primary/80"
        >
          Clear
        </button>
      )}

      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};