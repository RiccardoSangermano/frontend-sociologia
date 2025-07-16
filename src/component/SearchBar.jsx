import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner'; 


const SearchBar = ({ onSearchChange, suggestions, onSelectSuggestion, loading }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (event) => {
    const term = event.target.value;
    setInputValue(term);
    onSearchChange(term);
    setShowSuggestions(term.length > 0 && suggestions && suggestions.length > 0 && !loading);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onSearchChange(suggestion); 
    onSelectSuggestion(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {

    setShowSuggestions(inputValue.length > 0 && suggestions && suggestions.length > 0 && !loading);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  return (
    <Form className="d-flex position-relative me-2">
      <InputGroup>
        <FormControl
          type="search"
          placeholder="Cerca teorie, autori..."
          aria-label="Search"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={loading} 
        />
        {loading && ( 
          <InputGroup.Text>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        )}
      </InputGroup>

      {showSuggestions && suggestions && suggestions.length > 0 && (
        <ListGroup
          className="position-absolute"
          style={{
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Form>
  );
};

export default SearchBar;