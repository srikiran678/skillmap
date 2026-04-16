import React, { useState, useRef, useEffect } from 'react';
import { searchSkills } from '../data/skillSuggestions';
import SkillTag from './SkillTag';
import './SkillInput.css';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function SkillInput({ skills = [], onChange }) {
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    setSuggestions(searchSkills(query));
    setShowSuggestions(query.length > 0);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addSkill = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exists = skills.find(s => s.skillName.toLowerCase() === trimmed.toLowerCase());
    if (exists) return;
    onChange([...skills, { skillName: trimmed, level: selectedLevel }]);
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skillName) => {
    onChange(skills.filter(s => s.skillName !== skillName));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(query); }
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  return (
    <div className="skill-input" ref={wrapRef}>
      {/* Tags */}
      {skills.length > 0 && (
        <div className="skill-input__tags">
          {skills.map(s => (
            <SkillTag
              key={s.skillName}
              skillName={s.skillName}
              level={s.level}
              onRemove={() => removeSkill(s.skillName)}
            />
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="skill-input__row">
        <div className="skill-input__autocomplete" style={{ flex: 1, position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            className="form-input"
            placeholder="Type a skill… (e.g. React, Python)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 0 && setShowSuggestions(true)}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="skill-input__dropdown">
              {suggestions.map(s => (
                <li
                  key={s}
                  className="skill-input__option"
                  onMouseDown={(e) => { e.preventDefault(); addSkill(s); }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          className="form-select"
          value={selectedLevel}
          onChange={e => setSelectedLevel(e.target.value)}
          style={{ width: 160, flexShrink: 0 }}
        >
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addSkill(query)}
          disabled={!query.trim()}
          style={{ flexShrink: 0 }}
        >
          + Add
        </button>
      </div>
    </div>
  );
}
