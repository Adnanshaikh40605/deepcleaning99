import { useEffect, useId, useRef, useState } from 'react';
import { loadGooglePlaces } from '../utils/googleMaps';

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_MS = 300;

/**
 * Address input with Google Places suggestions (India only).
 * Falls back to a plain input when Maps is unavailable; the value is still
 * submitted through the native form via `name`.
 */
export default function AddressAutocomplete({
  name = 'address',
  placeholder = 'Start typing your address',
  required = false,
  maxLength = 300,
  onSelect,
}) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const serviceRef = useRef(null);
  const tokenRef = useRef(null);
  const timerRef = useRef(null);
  const wrapRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    let alive = true;
    loadGooglePlaces()
      .then((google) => {
        if (alive) serviceRef.current = new google.maps.places.AutocompleteService();
      })
      .catch(() => {});
    return () => {
      alive = false;
      window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    function handleOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function fetchSuggestions(text) {
    const service = serviceRef.current;
    const places = window.google?.maps?.places;
    if (!service || !places || text.trim().length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      return;
    }
    if (!tokenRef.current) tokenRef.current = new places.AutocompleteSessionToken();
    service.getPlacePredictions(
      {
        input: text,
        componentRestrictions: { country: 'in' },
        sessionToken: tokenRef.current,
      },
      (predictions, status) => {
        if (status === places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      },
    );
  }

  function handleChange(event) {
    const next = event.target.value;
    setValue(next);
    setOpen(true);
    setActive(-1);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => fetchSuggestions(next), DEBOUNCE_MS);
  }

  function choose(prediction) {
    setValue(prediction.description);
    setSuggestions([]);
    setOpen(false);
    setActive(-1);
    tokenRef.current = null;
    onSelect?.(prediction.description);
  }

  function handleKeyDown(event) {
    if (!open || !suggestions.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === 'Enter' && active >= 0) {
      event.preventDefault();
      choose(suggestions[active]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const showList = open && suggestions.length > 0;

  return (
    <div className="address-autocomplete" ref={wrapRef}>
      <input
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      />
      {showList ? (
        <ul id={listId} className="address-suggestions" role="listbox">
          {suggestions.map((prediction, index) => (
            <li
              key={prediction.place_id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              className={index === active ? 'active' : undefined}
              onMouseDown={(event) => {
                event.preventDefault();
                choose(prediction);
              }}
              onMouseEnter={() => setActive(index)}
            >
              <strong>
                {prediction.structured_formatting?.main_text || prediction.description}
              </strong>
              {prediction.structured_formatting?.secondary_text ? (
                <span>{prediction.structured_formatting.secondary_text}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
