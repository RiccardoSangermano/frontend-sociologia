import React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner'; 


const SearchBar = ({ searchTerm, onSearchChange, suggestions, onSelectSuggestion, loading }) => {
  const navigate = useNavigate();

  const handleSuggestionClick = (suggestion) => {
    onSelectSuggestion(suggestion);
  };

  const showSuggestions = searchTerm?.length > 0 && suggestions && suggestions.length > 0 && !loading;

  return (
    <Form className="d-flex position-relative me-2">
      <InputGroup>
        <FormControl
          type="search"
          placeholder="Cerca teorie, autori..."
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={loading} 
        />
        {loading && ( 
          <InputGroup.Text>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        )}
      </InputGroup>

      {showSuggestions && (
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