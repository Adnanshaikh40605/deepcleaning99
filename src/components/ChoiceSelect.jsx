import { useEffect, useId, useRef, useState } from 'react';

function normalize(options) {
  return options.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item,
  );
}

export default function ChoiceSelect({
  label,
  name,
  value,
  options,
  onChange,
  multiple = false,
}) {
  const items = normalize(options);
  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : [value];
  const selectedItems = items.filter((item) => selectedValues.includes(item.value));
  const single = items.find((item) => item.value === value) || items[0];
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const buttonLabel = multiple
    ? selectedItems.map((item) => item.label).join(', ') || 'Select services'
    : single?.label;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function choose(next) {
    if (!multiple) {
      onChange(next);
      setOpen(false);
      return;
    }
    const current = Array.isArray(value) ? value : [];
    onChange(
      current.includes(next)
        ? current.filter((item) => item !== next)
        : [...current, next],
    );
  }

  return (
    <div className={`choice-select${open ? ' open' : ''}`} ref={rootRef}>
      <span className="field-label" id={`${listId}-label`}>
        {label}
      </span>
      <button
        type="button"
        className="choice-select__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${listId}-label`}
        onClick={() => setOpen((current) => !current)}
      >
        {buttonLabel}
      </button>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={multiple ? selectedValues.join(', ') : single?.value || ''}
        />
      ) : null}
      {open ? (
        <ul
          className="choice-select__menu"
          id={listId}
          role="listbox"
          aria-labelledby={`${listId}-label`}
          aria-multiselectable={multiple || undefined}
        >
          {items.map((item) => {
            const isSelected = multiple
              ? selectedValues.includes(item.value)
              : item.value === single?.value;
            return (
              <li key={item.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={isSelected ? 'selected' : undefined}
                  onClick={() => choose(item.value)}
                >
                  <span className="choice-check" aria-hidden="true">
                    {isSelected ? '✓' : ''}
                  </span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
