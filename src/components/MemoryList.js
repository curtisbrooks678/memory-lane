import React from "react";
import PropTypes from "prop-types";
import Memory from "./Memory";
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'


function MemoryList(props){

  useFirestoreConnect([
    { collection: 'memory'}
  ]);

  const memory = useSelector(state => state.firestore.ordered.memory);

  if (isLoaded(memory)) {
    return (
      <React.Fragment>
        {memory.map((memory) => {
          return <Memory
            whenMemoryClicked = { props.onMemorySelection }
            title = { memory.title }
            description = { memory.description }
            formattedWaitTime = { memory.formattedWaitTime }
            id={memory.id}
            key={memory.id}/>
        })}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <h3>Loading...</h3>
      </React.Fragment>
    )
  }
}

MemoryList.propTypes = {
  onMemorySelection: PropTypes.func
};

export default MemoryList;

