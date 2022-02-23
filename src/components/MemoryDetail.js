import React from "react";
import PropTypes from "prop-types";

function MemoryDetail(props){
  const { memory, onClickingDelete } = props;


return (
    <React.Fragment>
      <h1>Memory Detail</h1>
      <h3>{memory.title}</h3>
      <h4>{memory.description}</h4>
      <button onClick={ props.onClickingEdit }>Update Memory</button>
      <button onClick={() => onClickingDelete(memory.id) }>Delete Memory</button>
    </React.Fragment>
  );
}

MemoryDetail.propTypes = {
  memory: PropTypes.object,
  onClickingDelete: PropTypes.func,
  onClickingEdit: PropTypes.func
};

export default MemoryDetail;