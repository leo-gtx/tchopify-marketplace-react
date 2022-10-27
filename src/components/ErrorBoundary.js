import React from 'react';
import PropTypes from 'prop-types';
import Page500 from '../pages/Page500';
import NetworkError from '../pages/NetworkError';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, isOnline: navigator.onLine};
    }


    componentDidMount(){
      window.addEventListener('online', ()=>{
        this.setState({ isOnline: true});
    });
    window.addEventListener('offline', ()=>{
      this.setState({ isOnline: false});
    })
  }
  
    static getDerivedStateFromError() {
      return { hasError: true };
    }

  
    componentDidCatch(error, errorInfo) {
      // log the error to an error reporting service
      console.log({ error, errorInfo });
    }

   

    componentWillUnmount(){
        window.removeEventListener('online',  ()=>{
          this.setState({ isOnline: true});
      });
      window.removeEventListener('offline',  ()=>{
        this.setState({ isOnline: false});
    })
  }
  
  
    render() {
      if(!this.state.isOnline){
        return <NetworkError/>
      }

      if (this.state.hasError) {
        return <Page500/>;
      }
      return this.props.children; 
    }
  }

  ErrorBoundary.propTypes = {
    children: PropTypes.object
  }