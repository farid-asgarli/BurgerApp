import React, { useEffect, useState } from "react";
import Modal from "../../components/UI/Modal/Modal";
import Aux from "../_Aux/_Aux";

const withErrorHandler = (WrapppedComponent, axios) => {
  return (props) => {
    const [error, setError] = useState(null);

    const reqInterceptor = axios.interceptors.request.use((req) => {
      setError(null);
      return req;
    });
    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        setError(error);
      }
    );

    useEffect(() => {
      return () => {
        axios.interceptors.response.eject(resInterceptor);
        axios.interceptors.request.eject(reqInterceptor);
      };
    },[reqInterceptor,resInterceptor]);

    const errorClearHandler = () => {
      this.setState({
        error: null,
      });
    };

    return (
      <Aux>
        <Modal show={error} modalClosed={errorClearHandler}>
          {error != null ? error.message : null}
        </Modal>
        <WrapppedComponent {...props} />
      </Aux>
    );
  };
};

export default withErrorHandler;
