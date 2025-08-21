import { useState } from 'react';
import './InterestsSkills.css';

function InterestsSkills({ items, setItems }) {
  // Allow component to work standalone or controlled by parent
  const [internalItems, setInternalItems] = useState([]);
  const itemsToUse = items ?? internalItems;
  const setItemsToUse = setItems ?? setInternalItems;
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAddClick = () => setShowInput(true);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setItemsToUse([...itemsToUse, inputValue.trim()]);
      setInputValue('');
      setShowInput(false);
    }
  };

  const handleRemove = (idx) => {
    setItemsToUse(itemsToUse.filter((_, i) => i !== idx));
  };

  return (
    <div className="interests-skills-container">
      <h2>Interests and Skills</h2>
      <div className="skills-list">
        {itemsToUse.map((item, idx) => (
          <span className="skill-chip" key={idx}>
            {item}
            <button className="remove-btn" onClick={() => handleRemove(idx)}>&times;</button>
          </span>
        ))}
      </div>
      {showInput ? (
        <div className="input-exit-wrapper">
          <input
            className="skill-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a skill or interest and press Enter"
            autoFocus
          />
          <button
            type="button"
            aria-label="Cancel"
            className="exit-btn"
            onClick={() => { setShowInput(false); setInputValue(''); }}
          >
            &times;
          </button>
        </div>
      ) : (
        <button className="add-btn" onClick={handleAddClick}>Add Interest or Skill</button>
      )}
    </div>
  );
}

export default InterestsSkills;
