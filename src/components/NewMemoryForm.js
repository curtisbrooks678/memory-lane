import React from "react";
import PropTypes from "prop-types";
import ReusableForm from "./ReusableForm";
import { useFirestore } from 'react-redux-firebase';

function NewMemoryForm(props){

  const firestore = useFirestore();
  function addMemoryToFireStore(event) {
    event.preventDefault();
    props.onNewMemoryCreation();
    return firestore.collection('tickets').add(
      {
        title: event.target.title.value,
        description: event.target.description.value
      }
    );
  }

  return (
    <React.Fragment>
      <ReusableForm 
        formSubmissionHandler={addMemoryToFireStore}
        buttonText="Help!" />
    </React.Fragment>
  );
}

NewMemoryForm.propTypes = {
  onNewMemoryCreation: PropTypes.func
};

export default NewMemoryForm;