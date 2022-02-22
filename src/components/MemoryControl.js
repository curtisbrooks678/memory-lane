import React from 'react';
import NewMemoryForm from './NewMemoryForm';
import MemoryList from './MemoryList';
import MemoryDetail from './MemoryControl';
import EditMemoryForm from './EditMemoryForm';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import * as a from './../actions';
import { withFirestore, isLoaded } from 'react-redux-firebase';

class MemoryControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedMemory: null,
      editing: false
    };
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateMemoryElapsedWaitTime(),
    60000
    );
  }

  componentWillUnmount(){
    clearInterval(this.waitTimeUpdateTimer);
  }

  updateMemoryElapsedWaitTime = () => {
    const { dispatch } = this.props;
    Object.values(this.props.mainMemoryList).forEach(memory => {
      const newFormattedWaitTime = memory.timeOpen.fromNow(true);
      const action = a.updateTime(memory.id, newFormattedWaitTime);
      dispatch(action);
    });
  }

  handleClick = () => {
    if (this.state.selectedMemory != null) {
      this.setState({
        selectedMemory: null,
        editing: false
      });
    } else {
      const { dispatch } = this.props;
      const action = a.toggleForm();
      dispatch(action);
    }
  }

  handleAddingNewMemoryToList = (newMemory) => {
    const { dispatch } = this.props;
    const action = a.toggleForm();
    dispatch(action);
  }

  handleChangingSelectedMemory = (id) => {
    this.props.firestore.get({collection: 'memories', doc: id}).then((memory) => {
      const firestoreMemory = {
        title: memory.get("title"),
        description: memory.get("description"),
        id: memory.id
      }
      this.setState({selectedMemory: firestoreMemory });
    });
  }
  
  handleEditClick = () => {
    this.setState({editing: true});
  }

  handleEditingMemoryInList = () => {
    this.setState({
      editing: false,
      selectedMemory: null
    });
  }

  handleDeletingMemory = (id) => {
    this.props.firestore.delete({collection: 'memories', doc: id});
    this.setState({selectedMemory: null});
  }

  render(){
    const auth = this.props.firebase.auth();
    if (!isLoaded(auth)) {
      return (
        <React.Fragment>
          <h1>Loading...</h1>
        </React.Fragment>
      )
    }
    if ((isLoaded(auth)) && (auth.currentUser == null)) {
      return (
        <React.Fragment>
          <h1>You must be signed in to access memory lane.</h1>
        </React.Fragment>
      )
    } 
    if ((isLoaded(auth)) && (auth.currentUser != null)) {
      let currentlyVisibleState = null;
      let buttonText = null;
      if (this.state.editing ) {      
        currentlyVisibleState = <EditMemoryForm memory = {this.state.selectedMemory} onEditMemory = {this.handleEditingMemoryInList} />
        buttonText = "Return to Memory List";
      } else if (this.state.selectedMemory != null) {
        currentlyVisibleState = 
        <MemoryDetail 
          memory = {this.state.selectedMemory} 
          onClickingDelete = {this.handleDeletingMemory} 
          onClickingEdit = {this.handleEditClick} />
        buttonText = "Return to Memory List";
      } else if (this.props.formVisibleOnPage) {
        currentlyVisibleState = <NewMemoryForm onNewMemoryCreation={this.handleAddingNewMemoryToList}  />;
        buttonText = "Return to Memory List";
      } else {
        currentlyVisibleState = <MemoryList memoryList={this.props.mainMemoryList} onMemorySelection={this.handleChangingSelectedMemory} />;
        buttonText = "Add Memory";
      }
      return (
        <React.Fragment>
          {currentlyVisibleState}
          <button onClick={this.handleClick}>{buttonText}</button>
        </React.Fragment>
      );
    }
  } 
}

// MemoryControl.propTypes = {
//   mainMemoryList: PropTypes.object
// };

const mapStateToProps = state => {
  return {
    // mainMemoryList: state.mainMemoryList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

MemoryControl = connect(mapStateToProps)(MemoryControl);

export default withFirestore(MemoryControl);
