import React from "react";
import PropTypes from "prop-types";

function Memory(props){
  return (
    <React.Fragment>
      <div onClick={() => props.whenMemoryClicked(props.id)}>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
        <p>{props.formattedWaitTime}</p>
      </div>
    </React.Fragment>
  )
}

Memory.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  whenMemoryClicked: PropTypes.func,
  formattedWaitTime: PropTypes.string
}

export default Memory;